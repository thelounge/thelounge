import _ from "lodash";
import log from "../log";
import fs from "fs";
import path from "path";
import Config from "../config";
import Client from "../client";
import * as os from "os";

// TODO: use a static import once thelounge migrates to ESM
// import { generateVAPIDKeys, sendNotification, type PushSubscription, type VapidDetails } from "web-push-neo";
import type {PushSubscription, VapidDetails} from "web-push-neo";

type WebPushNeo = typeof import("web-push-neo");

// Prevent TypeScript from transforming import() into require() for ESM-only packages
// eslint-disable-next-line @typescript-eslint/no-implied-eval
const importEsm = new Function("specifier", "return import(specifier)") as <T>(
	specifier: string
) => Promise<T>;

class WebPush {
	vapidKeys?: {
		publicKey: string;
		privateKey: string;
	};
	private vapidDetails?: VapidDetails;
	private webPushModule?: WebPushNeo;

	private async loadWebPush(): Promise<WebPushNeo> {
		if (!this.webPushModule) {
			// TODO: use a static import once thelounge migrates to ESM
			this.webPushModule = await importEsm<WebPushNeo>("web-push-neo");
		}

		return this.webPushModule;
	}

	async init() {
		const vapidPath = path.join(Config.getHomePath(), "vapid.json");

		let vapidStat: fs.Stats | undefined = undefined;

		try {
			vapidStat = fs.statSync(vapidPath);
		} catch {
			// ignored on purpose, node v14.17.0 will give us {throwIfNoEntry: false}
		}

		if (vapidStat) {
			const isWorldReadable = (vapidStat.mode & 0o004) !== 0;

			if (isWorldReadable) {
				log.warn(
					vapidPath,
					"is world readable.",
					"The file contains secrets. Please fix the permissions."
				);

				if (os.platform() !== "win32") {
					log.warn(`run \`chmod o= "${vapidPath}"\` to correct it.`);
				}
			}

			const data = fs.readFileSync(vapidPath, "utf-8");
			const parsedData = JSON.parse(data);

			if (
				typeof parsedData.publicKey === "string" &&
				typeof parsedData.privateKey === "string"
			) {
				this.vapidKeys = {
					publicKey: parsedData.publicKey,
					privateKey: parsedData.privateKey,
				};
			}
		}

		if (!this.vapidKeys) {
			const webPush = await this.loadWebPush();
			this.vapidKeys = await webPush.generateVAPIDKeys();

			fs.writeFileSync(vapidPath, JSON.stringify(this.vapidKeys, null, "\t"), {
				mode: 0o600,
			});

			log.info("New VAPID key pair has been generated for use with push subscription.");
		}

		this.vapidDetails = {
			subject: "https://github.com/thelounge/thelounge",
			publicKey: this.vapidKeys!.publicKey,
			privateKey: this.vapidKeys!.privateKey,
		};
	}

	push(client: Client, payload: any, onlyToOffline: boolean) {
		_.forOwn(client.config.sessions, ({pushSubscription}, token) => {
			if (pushSubscription) {
				if (onlyToOffline && _.find(client.attachedClients, {token}) !== undefined) {
					return;
				}

				this.pushSingle(client, pushSubscription, payload);
			}
		});
	}

	async pushSingle(client: Client, subscription: PushSubscription, payload: any) {
		try {
			const webPush = await this.loadWebPush();
			await webPush.sendNotification(subscription, JSON.stringify(payload), {
				vapidDetails: this.vapidDetails,
			});
		} catch (error: any) {
			if (error.statusCode >= 400 && error.statusCode < 500) {
				log.warn(
					`WebPush subscription for ${client.name} returned an error (${String(
						error.statusCode
					)}), removing subscription`
				);

				_.forOwn(client.config.sessions, ({pushSubscription}, token) => {
					if (pushSubscription && pushSubscription.endpoint === subscription.endpoint) {
						client.unregisterPushSubscription(token);
					}
				});

				return;
			}

			log.error(`WebPush Error (${String(error)})`);
		}
	}
}

export default WebPush;

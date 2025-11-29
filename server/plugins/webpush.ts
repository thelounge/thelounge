import _ from "lodash";
import log from "../log.js";
import fs from "fs";
import path from "path";
import WebPushAPI from "web-push";
import Config from "../config.js";
import Client from "../client.js";
import * as os from "os";

export interface WebPushPayload {
	type: "notification";
	chanId?: number;
	timestamp: number;
	title: string;
	body: string;
}
class WebPush {
	vapidKeys?: {
		publicKey: string;
		privateKey: string;
	};

	constructor() {
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
			this.vapidKeys = WebPushAPI.generateVAPIDKeys();

			fs.writeFileSync(vapidPath, JSON.stringify(this.vapidKeys, null, "\t"), {
				mode: 0o600,
			});

			log.info("New VAPID key pair has been generated for use with push subscription.");
		}

		WebPushAPI.setVapidDetails(
			"https://github.com/thelounge/thelounge",
			this.vapidKeys.publicKey,
			this.vapidKeys.privateKey
		);
	}

	push(client: Client, payload: WebPushPayload, onlyToOffline: boolean) {
		_.forOwn(client.config.sessions, ({pushSubscription}, token) => {
			if (pushSubscription) {
				if (onlyToOffline && _.find(client.attachedClients, {token}) !== undefined) {
					return;
				}

				this.pushSingle(client, pushSubscription, payload);
			}
		});
	}

	pushSingle(client: Client, subscription: WebPushAPI.PushSubscription, payload: WebPushPayload) {
		WebPushAPI.sendNotification(subscription, JSON.stringify(payload)).catch((error) => {
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
		});
	}
}

export default WebPush;

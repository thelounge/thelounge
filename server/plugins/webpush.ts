import _ from "lodash";
import log from "../log";
import fs from "fs";
import path from "path";
import WebPushAPI from "web-push";
import Config from "../config";
import Client from "../client";
import * as os from "os";
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

	push(client: Client, payload: any, onlyToOffline: boolean) {
		// Check if the user has enabled the setting to skip mobile push when desktop is active
		const skipMobilePushWhenDesktopActive = client.config.clientSettings?.skipMobilePushWhenDesktopActive !== false;
		
		// Check if there are any active desktop sessions
		const hasActiveDesktopSession = this.hasActiveDesktopSession(client);
		
		_.forOwn(client.config.sessions, ({pushSubscription, agent}, token) => {
			if (pushSubscription) {
				if (onlyToOffline && _.find(client.attachedClients, {token}) !== undefined) {
					return;
				}

				// Skip mobile push notifications only if:
				// 1. The setting is enabled (default: false) AND
				// 2. There's an active desktop session  AND
				// 3. This mobile session is not currently active (closed)
				if (skipMobilePushWhenDesktopActive && hasActiveDesktopSession && this.isMobileDevice(agent)) {
					const isThisMobileSessionActive = _.find(client.attachedClients, {token}) !== undefined;
					if (!isThisMobileSessionActive) {
						return;
					}
				}

				this.pushSingle(client, pushSubscription, payload);
			}
		});
	}

	pushSingle(client: Client, subscription: WebPushAPI.PushSubscription, payload: any) {
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

	/**
	 * Check if a user agent string represents a mobile device
	 */
	private isMobileDevice(agent: string): boolean {
		if (!agent) {
			return false;
		}

		const mobileKeywords = [
			'Android',
			'iPhone',
			'iPad',
			'iPod',
			'iOS',
			'iPadOS',
			'Mobile',
			'BlackBerry',
			'Windows Phone',
			'webOS',
			'Palm',
			'Symbian'
		];

		return mobileKeywords.some(keyword => 
			agent.toLowerCase().includes(keyword.toLowerCase())
		);
	}

	/**
	 * Check if there are any active desktop sessions for this client
	 */
	private hasActiveDesktopSession(client: Client): boolean {
		return _.some(client.attachedClients, (attachedClient, socketId) => {
			const sessionToken = attachedClient.token;
			const session = client.config.sessions[sessionToken];
			
			if (!session || !session.agent) {
				return false;
			}

			// If the session is active (attached) and not mobile, it's a desktop session
			return !this.isMobileDevice(session.agent);
		});
	}
}

export default WebPush;

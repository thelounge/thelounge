"use strict";

const _ = require("lodash");
const log = require("../log");
const fs = require("fs");
const path = require("path");
const WebPushAPI = require("web-push");
const Helper = require("../helper");

class WebPush {
	constructor() {
		const vapidPath = path.join(Helper.getHomePath(), "vapid.json");

		if (fs.existsSync(vapidPath)) {
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

			fs.writeFileSync(vapidPath, JSON.stringify(this.vapidKeys, null, "\t"));

			log.info("New VAPID key pair has been generated for use with push subscription.");
		}

		WebPushAPI.setVapidDetails(
			"https://github.com/thelounge/thelounge",
			this.vapidKeys.publicKey,
			this.vapidKeys.privateKey
		);
	}

	push(client, payload, onlyToOffline) {
		_.forOwn(client.config.sessions, ({pushSubscription}, token) => {
			if (pushSubscription) {
				if (onlyToOffline && _.find(client.attachedClients, {token}) !== undefined) {
					return;
				}

				this.pushSingle(client, pushSubscription, payload);
			}
		});
	}

	pushSingle(client, subscription, payload) {
		WebPushAPI.sendNotification(subscription, JSON.stringify(payload)).catch((error) => {
			if (error.statusCode >= 400 && error.statusCode < 500) {
				log.warn(
					`WebPush subscription for ${client.name} returned an error (${error.statusCode}), removing subscription`
				);

				_.forOwn(client.config.sessions, ({pushSubscription}, token) => {
					if (pushSubscription && pushSubscription.endpoint === subscription.endpoint) {
						client.unregisterPushSubscription(token);
					}
				});

				return;
			}

			log.error(`WebPush Error (${error})`);
		});
	}
}

module.exports = WebPush;

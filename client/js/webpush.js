"use strict";

const storage = require("./localStorage");
const socket = require("./socket");
const vueApp = require("./vue");
const store = require("./store").default;

let clientSubscribed = null;
let applicationServerKey;

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.addEventListener("message", (event) => {
		if (event.data && event.data.type === "open") {
			const id = event.data.channel.substr(5); // remove "chan-" prefix
			const channelTarget = store.getters.findChannel(id);

			if (channelTarget) {
				vueApp.switchToChannel(channelTarget);
			}
		}
	});
}

module.exports.hasServiceWorker = false;

module.exports.configurePushNotifications = (subscribedOnServer, key) => {
	applicationServerKey = key;

	// If client has push registration but the server knows nothing about it,
	// this subscription is broken and client has to register again
	if (clientSubscribed === true && subscribedOnServer === false) {
		store.commit("pushNotificationState", "loading");

		navigator.serviceWorker.ready
			.then((registration) => registration.pushManager.getSubscription())
			.then((subscription) => subscription && subscription.unsubscribe())
			.then((successful) => {
				store.commit("pushNotificationState", successful ? "supported" : "unsupported");
			});
	}
};

module.exports.initialize = () => {
	if (!isAllowedServiceWorkersHost()) {
		store.commit("pushNotificationState", "nohttps");
		return;
	}

	if ("serviceWorker" in navigator) {
		navigator.serviceWorker
			.register("service-worker.js")
			.then((registration) => {
				module.exports.hasServiceWorker = true;

				if (!registration.pushManager) {
					return;
				}

				return registration.pushManager.getSubscription().then((subscription) => {
					clientSubscribed = !!subscription;

					store.commit(
						"pushNotificationState",
						clientSubscribed ? "subscribed" : "supported"
					);
				});
			})
			.catch(() => {
				store.commit("pushNotificationState", "unsupported");
			});
	}
};

module.exports.onPushButton = () => {
	store.commit("pushNotificationState", "loading");

	navigator.serviceWorker.ready
		.then((registration) =>
			registration.pushManager.getSubscription().then((existingSubscription) => {
				if (existingSubscription) {
					socket.emit("push:unregister");

					return existingSubscription.unsubscribe().then(() => {
						store.commit("pushNotificationState", "supported");
					});
				}

				return registration.pushManager
					.subscribe({
						applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
						userVisibleOnly: true,
					})
					.then((subscription) => {
						const rawKey = subscription.getKey ? subscription.getKey("p256dh") : "";
						const key = rawKey
							? window.btoa(String.fromCharCode(...new Uint8Array(rawKey)))
							: "";
						const rawAuthSecret = subscription.getKey
							? subscription.getKey("auth")
							: "";
						const authSecret = rawAuthSecret
							? window.btoa(String.fromCharCode(...new Uint8Array(rawAuthSecret)))
							: "";

						socket.emit("push:register", {
							token: storage.get("token"),
							endpoint: subscription.endpoint,
							keys: {
								p256dh: key,
								auth: authSecret,
							},
						});

						store.commit("pushNotificationState", "subscribed");
					});
			})
		)
		.catch(() => {
			store.commit("pushNotificationState", "unsupported");
		});

	return false;
};

function urlBase64ToUint8Array(base64String) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}

	return outputArray;
}

function isAllowedServiceWorkersHost() {
	return (
		location.protocol === "https:" ||
		location.hostname === "localhost" ||
		location.hostname === "127.0.0.1"
	);
}

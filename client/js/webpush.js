"use strict";

const $ = require("jquery");
const storage = require("./localStorage");
const socket = require("./socket");
const {vueApp} = require("./vue");

let pushNotificationsButton;
let clientSubscribed = null;
let applicationServerKey;

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.addEventListener("message", (event) => {
		if (event.data && event.data.type === "open") {
			$("#sidebar")
				.find(`.chan[data-target="#${event.data.channel}"]`)
				.trigger("click");
		}
	});
}

module.exports.hasServiceWorker = false;

module.exports.configurePushNotifications = (subscribedOnServer, key) => {
	applicationServerKey = key;

	// If client has push registration but the server knows nothing about it,
	// this subscription is broken and client has to register again
	if (clientSubscribed === true && subscribedOnServer === false) {
		pushNotificationsButton.prop("disabled", true);

		navigator.serviceWorker.ready
			.then((registration) => registration.pushManager.getSubscription())
			.then((subscription) => subscription && subscription.unsubscribe())
			.then((successful) => {
				if (successful) {
					alternatePushButton().prop("disabled", false);
				}
			});
	}
};

module.exports.initialize = () => {
	pushNotificationsButton = $("#pushNotifications");

	if (!isAllowedServiceWorkersHost()) {
		vueApp.pushNotificationState = "nohttps";
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
					vueApp.pushNotificationState = "supported";

					clientSubscribed = !!subscription;

					if (clientSubscribed) {
						alternatePushButton();
					}
				});
			})
			.catch(() => {
				vueApp.pushNotificationState = "unsupported";
			});
	}
};

module.exports.onPushButton = () => {
	// TODO: move dom logic to Settings.vue
	pushNotificationsButton = $("#pushNotifications");
	pushNotificationsButton.prop("disabled", true);

	navigator.serviceWorker.ready
		.then((registration) =>
			registration.pushManager
				.getSubscription()
				.then((existingSubscription) => {
					if (existingSubscription) {
						socket.emit("push:unregister");

						return existingSubscription.unsubscribe();
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

							return true;
						});
				})
				.then((successful) => {
					if (successful) {
						alternatePushButton().prop("disabled", false);
					}
				})
		)
		.catch((err) => {
			vueApp.pushNotificationState = "unsupported";
		});

	return false;
};

function alternatePushButton() {
	const text = pushNotificationsButton.text();

	return pushNotificationsButton
		.text(pushNotificationsButton.data("text-alternate"))
		.data("text-alternate", text);
}

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

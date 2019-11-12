"use strict";

const socket = require("./socket");
const store = require("./store").default;
const {switchToChannel} = require("./router");

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.addEventListener("message", (event) => {
		if (event.data && event.data.type === "open") {
			const id = event.data.channel.substr(5); // remove "chan-" prefix
			const channelTarget = store.getters.findChannel(id);

			if (channelTarget) {
				switchToChannel(channelTarget);
			}
		}
	});
}

module.exports.hasServiceWorker = false;

socket.once("push:issubscribed", function(hasSubscriptionOnServer) {
	if (!isAllowedServiceWorkersHost()) {
		store.commit("pushNotificationState", "nohttps");
		return;
	}

	if (!("serviceWorker" in navigator)) {
		return;
	}

	navigator.serviceWorker
		.register("service-worker.js")
		.then((registration) => {
			module.exports.hasServiceWorker = true;

			if (!registration.pushManager) {
				return;
			}

			return registration.pushManager.getSubscription().then((subscription) => {
				// If client has push registration but the server knows nothing about it,
				// this subscription is broken and client has to register again
				if (subscription && hasSubscriptionOnServer === false) {
					subscription.unsubscribe().then((successful) => {
						store.commit(
							"pushNotificationState",
							successful ? "supported" : "unsupported"
						);
					});
				} else {
					store.commit(
						"pushNotificationState",
						subscription ? "subscribed" : "supported"
					);
				}
			});
		})
		.catch((err) => {
			store.commit("pushNotificationState", "unsupported");
			console.error(err); // eslint-disable-line no-console
		});
});

module.exports.togglePushSubscription = () => {
	store.commit("pushNotificationState", "loading");

	navigator.serviceWorker.ready
		.then((registration) =>
			registration.pushManager.getSubscription().then((existingSubscription) => {
				if (existingSubscription) {
					socket.emit("push:unregister");

					return existingSubscription.unsubscribe().then((successful) => {
						store.commit(
							"pushNotificationState",
							successful ? "supported" : "unsupported"
						);
					});
				}

				return registration.pushManager
					.subscribe({
						applicationServerKey: store.state.serverConfiguration.applicationServerKey,
						userVisibleOnly: true,
					})
					.then((subscription) => {
						socket.emit("push:register", subscription.toJSON());
						store.commit("pushNotificationState", "subscribed");
					});
			})
		)
		.catch((err) => {
			store.commit("pushNotificationState", "unsupported");
			console.error(err); // eslint-disable-line no-console
		});
};

function isAllowedServiceWorkersHost() {
	return (
		location.protocol === "https:" ||
		location.hostname === "localhost" ||
		location.hostname === "127.0.0.1"
	);
}

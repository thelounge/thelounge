// The Lounge - https://github.com/thelounge/lounge
/* global clients */
"use strict";

self.addEventListener("message", function(event) {
	showNotification(event, event.data);
});

self.addEventListener("push", function(event) {
	if (!event.data) {
		return;
	}

	showNotification(event, event.data.json());
});

function showNotification(event, payload) {
	if (payload.type !== "notification") {
		return;
	}

	// get current notification, close it, and draw new
	event.waitUntil(
		self.registration
			.getNotifications({
				tag: `chan-${payload.chanId}`,
			})
			.then((notifications) => {
				for (const notification of notifications) {
					notification.close();
				}

				return self.registration.showNotification(payload.title, {
					tag: `chan-${payload.chanId}`,
					badge: "img/logo-64.png",
					icon: "img/touch-icon-192x192.png",
					body: payload.body,
					timestamp: payload.timestamp,
				});
			})
	);
}

self.addEventListener("notificationclick", function(event) {
	event.notification.close();

	event.waitUntil(clients.matchAll({
		type: "window",
	}).then(function(clientList) {
		for (var i = 0; i < clientList.length; i++) {
			var client = clientList[i];
			if ("focus" in client) {
				return client.focus();
			}
		}

		if (clients.openWindow) {
			return clients.openWindow(".");
		}
	}));
});

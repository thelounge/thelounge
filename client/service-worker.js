// The Lounge - https://github.com/thelounge/lounge
/* global clients */
"use strict";

self.addEventListener("push", function(event) {
	if (!event.data) {
		return;
	}

	const payload = event.data.json();

	if (payload.type === "notification") {
		event.waitUntil(
			self.registration.showNotification(payload.title, {
				badge: "img/logo-64.png",
				icon: "img/touch-icon-192x192.png",
				body: payload.body,
				timestamp: payload.timestamp,
			})
		);
	}
});

self.addEventListener("notificationclick", function(event) {
	event.notification.close();

	event.waitUntil(clients.matchAll({
		type: "window"
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

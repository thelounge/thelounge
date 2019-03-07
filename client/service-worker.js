// The Lounge - https://github.com/thelounge/thelounge
/* global clients */
"use strict";

const cacheName = "thelounge";
const excludedPathsFromCache = /^(?:socket\.io|storage|uploads|cdn-cgi)\//;

self.addEventListener("install", function() {
	self.skipWaiting();
});

self.addEventListener("activate", function(event) {
	event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function(event) {
	if (event.request.method !== "GET") {
		return;
	}

	const url = event.request.url;
	const scope = self.registration.scope;

	// Skip cross-origin requests
	if (!url.startsWith(scope)) {
		return;
	}

	const path = url.substring(scope.length);

	// Skip ignored paths
	if (excludedPathsFromCache.test(path)) {
		return;
	}

	const uri = new URL(url);
	uri.hash = "";
	uri.search = "";

	event.respondWith(networkOrCache(event, uri));
});

async function putInCache(uri, response) {
	const cache = await caches.open(cacheName);
	await cache.put(uri, response);
}

async function networkOrCache(event, uri) {
	try {
		const response = await fetch(uri, {cache: "no-cache"});

		if (response.ok) {
			event.waitUntil(putInCache(uri, response));
			return response.clone();
		}

		throw new Error(`Request failed with HTTP ${response.status}`);
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(e.message, uri.href);

		const cache = await caches.open(cacheName);
		const matching = await cache.match(uri);

		return matching || Promise.reject("request-not-in-cache");
	}
}

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
					badge: "img/icon-alerted-black-transparent-bg-72x72px.png",
					icon: "img/icon-alerted-grey-bg-192x192px.png",
					body: payload.body,
					timestamp: payload.timestamp,
				});
			})
	);
}

self.addEventListener("notificationclick", function(event) {
	event.notification.close();

	event.waitUntil(clients.matchAll({
		includeUncontrolled: true,
		type: "window",
	}).then((clientList) => {
		if (clientList.length === 0) {
			if (clients.openWindow) {
				return clients.openWindow(`.#${event.notification.tag}`);
			}

			return;
		}

		const client = findSuitableClient(clientList);

		client.postMessage({
			type: "open",
			channel: event.notification.tag,
		});

		if ("focus" in client) {
			client.focus();
		}
	}));
});

function findSuitableClient(clientList) {
	for (let i = 0; i < clientList.length; i++) {
		const client = clientList[i];

		if (client.focused || client.visibilityState === "visible") {
			return client;
		}
	}

	return clientList[0];
}

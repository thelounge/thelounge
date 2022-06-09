// The Lounge - https://github.com/thelounge/thelounge
/* global clients */

// eslint-disable-next-line spaced-comment
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;
export {};

const cacheName = "__HASH__";

const excludedPathsFromCache = /^(?:socket\.io|storage|uploads|cdn-cgi)\//;

self.addEventListener("install", function () {
	self.skipWaiting().catch((reason: any) => {
		// eslint-disable-next-line no-console
		console.error("Could not install new service worker", reason);
	});
});

self.addEventListener("activate", function (event) {
	event.waitUntil(
		caches
			.keys()
			.then((names) =>
				Promise.all(
					names.filter((name) => name !== cacheName).map((name) => caches.delete(name))
				)
			)
	);

	event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
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

	event.respondWith(networkOrCache(event));
});

async function putInCache(request: Request, response: Response) {
	const cache = await caches.open(cacheName);
	await cache.put(request, response);
}

async function cleanRedirect(response: Response) {
	// Not all browsers support the Response.body stream, so fall back
	// to reading the entire body into memory as a blob.
	const bodyPromise = "body" in response ? Promise.resolve(response.body) : response.blob();

	const body = await bodyPromise;

	// new Response() is happy when passed either a stream or a Blob.
	return new Response(body, {
		headers: response.headers,
		status: response.status,
		statusText: response.statusText,
	});
}

async function networkOrCache(event: FetchEvent) {
	try {
		let response = await fetch(event.request, {
			cache: "no-cache",
			redirect: "follow",
		});

		if (response.redirected) {
			response = await cleanRedirect(response.clone());
		}

		if (response.ok) {
			// __HASH__ is replaced by webpack when the client is built
			// @ts-expect-error
			if (cacheName !== "dev") {
				event.waitUntil(putInCache(event.request, response));
			}

			return response.clone();
		}

		throw new Error(`Request failed with HTTP ${response.status}`);
	} catch (e: any) {
		// eslint-disable-next-line no-console
		console.error(e.message, event.request.url);

		if (event.clientId) {
			const client = await self.clients.get(event.clientId);

			if (client) {
				client.postMessage({
					type: "fetch-error",
					message: e.message,
				});
			}
		}

		const cache = await caches.open(cacheName);
		const matching = await cache.match(event.request);

		return matching || Promise.reject("request-not-in-cache");
	}
}

self.addEventListener("message", function (event) {
	showNotification(event, event.data);
});

self.addEventListener("push", function (event) {
	if (!event.data) {
		return;
	}

	showNotification(event, event.data.json());
});

function showNotification(
	event: FetchEvent | PushEvent,
	payload: {
		chanId: number;
		type: string;
		title: string;
		timestamp?: number;
		body?: string;
	}
) {
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

self.addEventListener("notificationclick", function (event) {
	event.notification.close();

	event.waitUntil(async function () {
		const clients = await self.clients.matchAll({
			includeUncontrolled: true,
			type: "window",
		});

		if (clients.length === 0) {
			if (self.clients.openWindow) {
				return self.clients.openWindow(`.#/${event.notification.tag}`);
			}

			return;
		}

		const client = findSuitableClient(clients);

		client.postMessage({
			type: "open",
			channel: event.notification.tag,
		});

		if ("focus" in client) {
			await client.focus();
		}
	});
});

function findSuitableClient(clientList: readonly WindowClient[]) {
	for (let i = 0; i < clientList.length; i++) {
		const client = clientList[i];

		if (client.focused || client.visibilityState === "visible") {
			return client;
		}
	}

	return clientList[0];
}

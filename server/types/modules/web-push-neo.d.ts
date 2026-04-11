// TODO: remove once thelounge migrates to ESM (moduleResolution: "node" can't resolve .d.mts)
declare module "web-push-neo" {
	export interface PushSubscription {
		endpoint: string;
		keys: {
			p256dh: string;
			auth: string;
		};
	}

	export interface VapidDetails {
		subject: string;
		publicKey: string;
		privateKey: string;
	}

	export interface SendNotificationOptions {
		vapidDetails?: VapidDetails;
		TTL?: number;
		headers?: Record<string, string>;
		urgency?: "very-low" | "low" | "normal" | "high";
		topic?: string;
		signal?: AbortSignal;
	}

	export interface SendResult {
		statusCode: number;
		headers: Headers;
		body: string;
	}

	export interface RequestDetails {
		endpoint: string;
		method: "POST";
		headers: Record<string, string>;
		body: Uint8Array | null;
	}

	export class WebPushError extends Error {
		statusCode: number;
		headers: Headers;
		body: string;
	}

	export function generateVAPIDKeys(): Promise<{
		publicKey: string;
		privateKey: string;
	}>;

	export function sendNotification(
		pushSubscription: PushSubscription,
		payload?: string | Uint8Array | null,
		options?: SendNotificationOptions
	): Promise<SendResult>;

	export function generateRequestDetails(
		pushSubscription: PushSubscription,
		payload?: string | Uint8Array | null,
		options?: SendNotificationOptions
	): Promise<RequestDetails>;
}

import {MessageType, UserInMessage} from "./models/message";

type ClientConfig = {
	log: boolean;
	password: string;
	sessions: {
		[token: string]: {
			lastUse: number;
			ip: string;
			agent: string;
			pushSubscription?: PushSubscription;
		};
	};
	clientSettings: {
		[key: string]: any;
	};
	browser?: {
		language?: string;
		ip?: string;
		hostname?: string;
		isSecure?: boolean;
	};
};

type PushSubscription = {
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
};

type Mention = {
	chanId: number;
	msgId: number;
	type: MessageType;
	time: number;
	text: string;
	from: UserInMessage;
};

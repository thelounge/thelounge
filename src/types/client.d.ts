type ClientConfig = {
	log: boolean;
	password: string;
	sessions: {
		[token: string]: {
			lastUse: number;
			ip: string;
			agent: string;
			pushSubscription?: ClientPushSubscription;
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

type ClientPushSubscription = {
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

import {MessageType, UserInMessage} from "./msg";

export type SharedMention = {
	chanId: number;
	msgId: number;
	type: MessageType;
	time: Date;
	text: string;
	from: UserInMessage;
};

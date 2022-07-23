import _ from "lodash";

export enum ClientTagKey {
	// https://ircv3.net/specs/client-tags/reply
	DRAFT_REPLY = "draft/reply",
	// https://ircv3.net/specs/client-tags/react
	DRAFT_REACT = "draft/react",
	// https://ircv3.net/specs/client-tags/channel-context
	DRAFT_CHANNEL_CONTEXT = "draft/channel-context",

	// https://ircv3.net/specs/client-tags/typing.html
	TYPING = "typing",
}

export enum TypingStatus {
	ACTIVE = "active",
	PAUSED = "paused",
	DONE = "done",
}

export class ClientTags {
	reaction?: string;
	repliedTo?: string;
	channelContext?: string;
	rawTags: Record<string, string>;

	public constructor(rawClientTags: Record<string, string>) {
		this.rawTags = rawClientTags;

		this.reaction = this.get(ClientTagKey.DRAFT_REACT);
		this.repliedTo = this.get(ClientTagKey.DRAFT_REPLY);
		this.channelContext = this.get(ClientTagKey.DRAFT_CHANNEL_CONTEXT);
	}

	public get(key: string): string | undefined {
		return this.rawTags[`+${key}`];
	}

	public has(key: string): boolean {
		return Object.prototype.hasOwnProperty.call(this.rawTags, `+${key}`);
	}
}

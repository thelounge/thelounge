import _ from "lodash";
import Prefix from "./prefix";
import {TypingStatus} from "./client-tags";

const ELAPSED_SINCE_LAST_ACTIVE_TYPING = 6 * 1000; // 6 seconds
const ELAPSED_SINCE_LAST_PAUSED_TYPING = 30 * 1000; // 30 seconds

export class User {
	modes!: string[];
	// Users in the channel have only one mode assigned
	mode!: string;
	away!: string;
	nick!: string;
	lastMessage!: number;
	lastActiveTyping!: number;
	lastPausedTyping!: number;

	// Client-side
	isTyping!: boolean;

	_waitForPausedNotificationHandle?: ReturnType<typeof setTimeout>;
	_waitForActiveNotificationHandle?: ReturnType<typeof setTimeout>;

	constructor(attr: Partial<User>) {
		_.defaults(this, attr, {
			modes: [],
			away: "",
			nick: "",
			lastMessage: 0,
			lastActiveTyping: 0,
			lastPausedTyping: 0,
			isTyping: false,
		});

		Object.defineProperty(this, "mode", {
			get() {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return this.modes[0] || "";
			},
		});
	}

	static withPrefixLookup(attr: Partial<User>, prefix: Prefix): User {
		const user = new User(attr);
		user.setModesForServer(attr.modes || [], prefix);
		return user;
	}

	_clearTypingTimers() {
		if (this._waitForActiveNotificationHandle) {
			clearTimeout(this._waitForActiveNotificationHandle);
			this._waitForActiveNotificationHandle = undefined;
		}

		if (this._waitForPausedNotificationHandle) {
			clearTimeout(this._waitForPausedNotificationHandle);
			this._waitForPausedNotificationHandle = undefined;
		}
	}

	stopTyping() {
		this.isTyping = false;

		this._clearTypingTimers();
	}

	startTyping(status: TypingStatus) {
		this.isTyping = true;

		if (status === TypingStatus.ACTIVE) {
			this._clearTypingTimers();
			this._waitForActiveNotificationHandle = setTimeout(() => {
				if (Date.now() - this.lastActiveTyping > ELAPSED_SINCE_LAST_ACTIVE_TYPING) {
					this.stopTyping();
				}
			}, ELAPSED_SINCE_LAST_ACTIVE_TYPING);
		}

		if (status === TypingStatus.PAUSED) {
			this._clearTypingTimers();
			this._waitForActiveNotificationHandle = setTimeout(() => {
				if (Date.now() - this.lastPausedTyping > ELAPSED_SINCE_LAST_PAUSED_TYPING) {
					this.stopTyping();
				}
			}, ELAPSED_SINCE_LAST_PAUSED_TYPING);
		}
	}

	setModesForServer(modes: string[], prefix: Prefix) {
		// irc-framework sets character mode, but The Lounge works with symbols
		this.modes = modes.map((mode) => prefix.modeToSymbol[mode]);
	}

	toJSON() {
		return {
			nick: this.nick,
			modes: this.modes,
			lastMessage: this.lastMessage,
			lastActiveTyping: this.lastActiveTyping,
			lastPausedTyping: this.lastPausedTyping,
		};
	}
}

export default User;

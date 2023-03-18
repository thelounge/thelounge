import Prefix from "./prefix";

class User {
	modes: string[];
	// Users in the channel have only one mode assigned
	away: string;
	nick: string;
	lastMessage: number;

	constructor(attr: Partial<User>, prefix?: Prefix) {
		this.modes = [];
		this.away = "";
		this.nick = "";
		this.lastMessage = 0;

		if (attr) {
			Object.assign(this, attr);
		}

		this.setModes(this.modes, prefix || new Prefix([]));
	}

	get mode() {
		return this.modes[0] || "";
	}

	setModes(modes: string[], prefix: Prefix) {
		// irc-framework sets character mode, but The Lounge works with symbols
		this.modes = modes.map((mode) => prefix.modeToSymbol[mode]);
	}

	toJSON() {
		return {
			nick: this.nick,
			modes: this.modes,
			lastMessage: this.lastMessage,
		};
	}
}

export default User;

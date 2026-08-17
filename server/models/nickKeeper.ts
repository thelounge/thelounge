export type NickKeeperOptions = {
	// Public mode has no persisted identity, so there is no nick worth keeping
	enabled: boolean;
};

// Owns the nick the user asked for and the nick we ended up with. Consumers push
// in what happened, the only thing coming back out is a nick change.
export default class NickKeeper {
	private desired: string;
	private current: string;
	private readonly enabled: boolean;

	constructor(
		nick: string,
		private readonly requestNick: (nick: string) => void,
		options: NickKeeperOptions
	) {
		this.desired = nick;
		this.current = nick;
		this.enabled = options.enabled;
	}

	// Persisted, and shown in the network edit form
	get desiredNick() {
		return this.desired;
	}

	// Mirrored by Network#nick
	get currentNick() {
		return this.current;
	}

	// Set from the config, the edit form or /nick
	wantNick(nick: string) {
		this.desired = nick;
	}

	// The server confirmed we are known by this nick
	nickConfirmed(nick: string) {
		this.current = nick;
	}

	// The server refused the nick we asked for
	nickRefused() {
		this.desired = this.current;
	}

	// Somebody quit or renamed away from a nick
	nickReleased(nick: string) {
		if (this.enabled && nick === this.desired && this.current !== this.desired) {
			this.requestNick(nick);
		}
	}
}

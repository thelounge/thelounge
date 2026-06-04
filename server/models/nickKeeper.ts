export type NickInUseContext = {
	registered: boolean;
	isPublic: boolean;
};

export type RegisteredCallbacks = {
	setPreferredNick(nick: string): void;
	setCurrentNick(nick: string): void;
};

export default class NickKeeper {
	private desiredNick: string;
	private currentNick: string;
	private pendingNick: string | null = null;

	constructor(nick: string) {
		this.desiredNick = nick;
		this.currentNick = nick;
	}

	setDesiredNick(nick: string) {
		this.desiredNick = nick;
		this.currentNick = nick;
		this.cancelPendingNick();
	}

	cancelPendingNick() {
		this.pendingNick = null;
	}

	onNickInUse(context: NickInUseContext) {
		if (!context.registered && !context.isPublic) {
			this.pendingNick = this.desiredNick;
		}
	}

	onRegistered(registeredNick: string, callbacks: RegisteredCallbacks) {
		this.currentNick = registeredNick;

		if (registeredNick === this.desiredNick) {
			this.cancelPendingNick();
			callbacks.setPreferredNick(registeredNick);
		} else {
			callbacks.setCurrentNick(registeredNick);
		}
	}

	onNickChanged(
		oldNick: string,
		newNick: string,
		isSelf: boolean,
		changeNick: (nick: string) => void
	) {
		if (isSelf) {
			this.currentNick = newNick;
			this.desiredNick = newNick;
			this.cancelPendingNick();

			return;
		}

		if (this.pendingNick === oldNick) {
			this.cancelPendingNick();
			changeNick(oldNick);
		}
	}

	onQuit(quitNick: string, changeNick: (nick: string) => void) {
		if (this.pendingNick === quitNick) {
			this.cancelPendingNick();
			changeNick(quitNick);
		}
	}

	onSocketClose(restoreLocalNick: (nick: string) => void) {
		if (this.pendingNick) {
			const nick = this.pendingNick;
			this.cancelPendingNick();
			this.currentNick = nick;
			this.desiredNick = nick;
			restoreLocalNick(nick);
		}
	}
}

export type NickInUseContext = {
	registered: boolean;
	isPublic: boolean;
};

export type RegisteredResult = {
	shouldUpdatePreferred: boolean;
};

export type NickKeeperOwner = {
	getKeepNick(): string | null;
	setKeepNick(nick: string): void;
	clearKeepNick(): void;
};

export default class NickKeeper {
	private owner: NickKeeperOwner;

	constructor(owner: NickKeeperOwner) {
		this.owner = owner;
	}

	onNickInUse(preferredNick: string, context: NickInUseContext) {
		if (!context.registered && !context.isPublic) {
			this.owner.setKeepNick(preferredNick);
		}
	}

	onRegistered(registeredNick: string, preferredNick: string): RegisteredResult {
		if (registeredNick === preferredNick) {
			if (this.owner.getKeepNick() === registeredNick) {
				this.owner.clearKeepNick();
			}

			return {shouldUpdatePreferred: true};
		}

		return {shouldUpdatePreferred: false};
	}

	onQuit(quitNick: string) {
		if (this.owner.getKeepNick() === quitNick) {
			this.owner.clearKeepNick();
			return true;
		}

		return false;
	}

	onSocketClose() {
		const keepNick = this.owner.getKeepNick();

		if (!keepNick) {
			return null;
		}

		this.owner.clearKeepNick();
		return keepNick;
	}
}

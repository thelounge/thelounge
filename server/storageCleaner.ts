import SqliteMessageStorage from "./plugins/messageStorage/sqlite";
import Config from "./config";
import {DeletionRequest} from "./plugins/messageStorage/types";
import log from "./log";
import {MessageType} from "../shared/types/msg";

const status_types = [
	MessageType.AWAY,
	MessageType.BACK,
	MessageType.INVITE,
	MessageType.JOIN,
	MessageType.KICK,
	MessageType.MODE,
	MessageType.MODE_CHANNEL,
	MessageType.MODE_USER,
	MessageType.NICK,
	MessageType.PART,
	MessageType.QUIT,
	MessageType.CTCP, // not technically a status, but generally those are only of interest temporarily
	MessageType.CTCP_REQUEST,
	MessageType.CHGHOST,
	MessageType.TOPIC,
	MessageType.TOPIC_SET_BY,
];

export class StorageCleaner {
	db: SqliteMessageStorage;
	olderThanDays: number;
	messageTypes: MessageType[] | null;
	limit: number;
	ticker?: ReturnType<typeof setTimeout>;
	errCount: number;
	isStopped: boolean;

	constructor(db: SqliteMessageStorage) {
		this.errCount = 0;
		this.isStopped = true;
		this.db = db;
		this.limit = 200;
		const policy = Config.values.storagePolicy;
		this.olderThanDays = policy.maxAgeDays;

		switch (policy.deletionPolicy) {
			case "statusOnly":
				this.messageTypes = status_types;
				break;
			case "everything":
				this.messageTypes = null;
				break;
			default:
				// exhaustive switch guard, blows up when user specifies a invalid policy enum
				this.messageTypes = assertNoBadPolicy(policy.deletionPolicy);
		}
	}

	private genDeletionRequest(): DeletionRequest {
		return {
			limit: this.limit,
			messageTypes: this.messageTypes,
			olderThanDays: this.olderThanDays,
		};
	}

	async runDeletesNoLimit(): Promise<number> {
		if (!Config.values.storagePolicy.enabled) {
			// this is meant to be used by cli tools, so we guard against this
			throw new Error("storage policy is disabled");
		}

		const req = this.genDeletionRequest();
		req.limit = -1; // unlimited
		const num_deleted = await this.db.deleteMessages(req);
		return num_deleted;
	}

	private async runDeletes() {
		if (this.isStopped) {
			return;
		}

		if (!this.db.isEnabled) {
			// TODO: remove this once the server is intelligent enough to wait for init
			this.schedule(30 * 1000);
			return;
		}

		const req = this.genDeletionRequest();

		let num_deleted = 0;

		try {
			num_deleted = await this.db.deleteMessages(req);
			this.errCount = 0; // reset when it works
		} catch (err: any) {
			this.errCount++;
			log.error("can't clean messages", err.message);

			if (this.errCount === 2) {
				log.error("Cleaning failed too many times, will not retry");
				this.stop();
				return;
			}
		}

		// need to recheck here as the field may have changed since the await
		if (this.isStopped) {
			return;
		}

		if (num_deleted < req.limit) {
			this.schedule(5 * 60 * 1000);
		} else {
			this.schedule(5000); // give others a chance to execute queries
		}
	}

	private schedule(ms: number) {
		const self = this;

		this.ticker = setTimeout(() => {
			self.runDeletes().catch((err) => {
				log.error("storageCleaner: unexpected failure");
				throw err;
			});
		}, ms);
	}

	start() {
		this.isStopped = false;
		this.schedule(0);
	}

	stop() {
		this.isStopped = true;

		if (!this.ticker) {
			return;
		}

		clearTimeout(this.ticker);
	}
}

function assertNoBadPolicy(_: never): never {
	throw new Error(
		`Invalid deletion policy "${Config.values.storagePolicy.deletionPolicy}" in the \`storagePolicy\` object, fix your config.`
	);
}

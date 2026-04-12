import log from "../log";
import {Command} from "commander";
import ClientManager from "../clientManager";
import Utils from "./utils";
import SqliteMessageStorage from "../plugins/messageStorage/sqlite";
import {StorageCleaner} from "../storageCleaner";

const program = new Command("storage").description(
	"various utilities related to the message storage"
);

program
	.command("migrate")
	.argument("[username]", "migrate a specific user only, all if not provided")
	.description("Migrate message storage where needed")
	.on("--help", Utils.extraHelp)
	.action(function (user) {
		try {
			runMigrations(user);
		} catch (err: any) {
			log.error(err.toString());
			process.exit(1);
		}
	});

program
	.command("clean")
	.argument("[user]", "clean messages for a specific user only, all if not provided")
	.description("Delete messages from the DB based on the storage policy")
	.on("--help", Utils.extraHelp)
	.action(function (user) {
		try {
			runCleaning(user);
		} catch (err: any) {
			log.error(err.toString());
			process.exit(1);
		}
	});

function runMigrations(user?: string) {
	const manager = new ClientManager();
	const users = manager.getUsers();

	if (user) {
		if (!users.includes(user)) {
			throw new Error(`invalid user ${user}`);
		}

		return migrateUser(manager, user);
	}

	for (const name of users) {
		migrateUser(manager, name);
		// if any migration fails we blow up,
		// chances are the rest won't complete either
	}
}

// runs sqlite migrations for a user, which must exist
function migrateUser(manager: ClientManager, user: string) {
	log.info("handling user", user);

	if (!isUserLogEnabled(manager, user)) {
		log.info("logging disabled for user", user, ". Skipping");
		return;
	}

	const sqlite = new SqliteMessageStorage(user);
	sqlite.enable();
	sqlite.close();
	log.info("user", user, "migrated successfully");
}

function isUserLogEnabled(manager: ClientManager, user: string): boolean {
	const conf = manager.readUserConfig(user);

	if (!conf) {
		log.error("Could not open user configuration of", user);
		return false;
	}

	return conf.log;
}

function runCleaning(user: string) {
	const manager = new ClientManager();
	const users = manager.getUsers();

	if (user) {
		if (!users.includes(user)) {
			throw new Error(`invalid user ${user}`);
		}

		return cleanUser(manager, user);
	}

	for (const name of users) {
		cleanUser(manager, name);
		// if any migration fails we blow up,
		// chances are the rest won't complete either
	}
}

function cleanUser(manager: ClientManager, user: string) {
	log.info("handling user", user);

	if (!isUserLogEnabled(manager, user)) {
		log.info("logging disabled for user", user, ". Skipping");
		return;
	}

	const sqlite = new SqliteMessageStorage(user);
	sqlite.enable();
	const cleaner = new StorageCleaner(sqlite);
	const num_deleted = cleaner.runDeletesNoLimit();
	log.info(`deleted ${num_deleted} messages`);
	log.info("running a vacuum now, this might take a while");

	if (num_deleted > 0) {
		sqlite.vacuum();
	}

	sqlite.close();
	log.info(`cleaning messages for ${user} has been successful`);
}

export default program;

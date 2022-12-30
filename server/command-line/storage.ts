import log from "../log";
import {Command} from "commander";
import ClientManager from "../clientManager";
import Utils from "./utils";
import SqliteMessageStorage from "../plugins/messageStorage/sqlite";

const program = new Command("storage").description(
	"various utilities related to the message storage"
);

program
	.command("migrate")
	.argument("[user]", "migrate a specific user only, all if not provided")
	.description("Migrate message storage where needed")
	.on("--help", Utils.extraHelp)
	.action(function (user) {
		runMigrations(user).catch((err) => {
			log.error(err.toString());
			process.exit(1);
		});
	});

async function runMigrations(user: string) {
	const manager = new ClientManager();
	const users = manager.getUsers();

	if (user) {
		if (!users.includes(user)) {
			throw new Error(`invalid user ${user}`);
		}

		return migrateUser(user);
	}

	for (const name of users) {
		await migrateUser(name);
		// if any migration fails we blow up,
		// chances are the rest won't complete either
	}
}

// runs sqlite migrations for a user, which must exist
async function migrateUser(user: string) {
	log.info("handling user", user);
	const sqlite = new SqliteMessageStorage(user);
	await sqlite.enable(); // enable runs migrations
	await sqlite.close();
	log.info("user", user, "migrated successfully");
}

export default program;

import {join as joinPath} from "path";
import {Sequelize, QueryInterface} from "sequelize";
import Utils from "../command-line/utils";
import Helper from "../helper";
import Config, {ConfigType} from "../config";
import log from "../log";

import * as migration001 from "../migrations/001-create-session-table";
import {initSession, Session} from "./models/Session";

type Migration = {
	name: string;
	up: (
		queryInterface: QueryInterface,
		sequelize: typeof Sequelize,
		transaction?: any
	) => Promise<void>;
	down: (
		queryInterface: QueryInterface,
		sequelize: typeof Sequelize,
		transaction?: any
	) => Promise<void>;
};

// List of migrations in order (add new migrations here)
const migrations = [migration001];

export class Persistence {
	database: Sequelize;

	constructor(config: ConfigType) {
		this.database = new Sequelize({
			dialect: "sqlite",
			storage: Config.getSqliteDbPath(),
			logging: false,
		});

		initSession(this.database);
	}

	private async isMigrationExecuted(migrationName: string): Promise<boolean> {
		const [results] = (await this.database.query(
			"SELECT name FROM SequelizeMeta WHERE name = ?",
			{replacements: [migrationName]}
		)) as [Array<{name: string}>, unknown];

		return Array.isArray(results) && results.length > 0;
	}

	private async runMigration(migration: Migration): Promise<void> {
		await this.database.transaction(async (transaction) => {
			const queryInterface = this.database.getQueryInterface();

			await migration.up(queryInterface, Sequelize, transaction);
			await this.database.query("INSERT OR IGNORE INTO SequelizeMeta (name) VALUES (?)", {
				replacements: [migration.name],
				transaction,
			});
		});
	}

	async runMigrations(): Promise<void> {
		await this.database
			.getQueryInterface()
			.sequelize.query(
				"CREATE TABLE IF NOT EXISTS SequelizeMeta (name VARCHAR(255) NOT NULL PRIMARY KEY)"
			);

		for (const migration of migrations) {
			const isExecuted = await this.isMigrationExecuted(migration.name);

			if (!isExecuted) {
				log.info(`Running migration: ${migration.name}`);

				try {
					await this.runMigration(migration);
					log.info(`Migration ${migration.name} completed successfully`);
				} catch (error) {
					const err = Helper.catch_to_error(`Migration ${migration.name} failed`, error);
					log.error(`Migration failed: ${err.message}`);
					throw err;
				}
			}
		}
	}

	updateSession(
		sessionId: string,
		lastIp: string,
		lastSeen: Date,
		username: string,
		lastUserAgent: string
	): Promise<void> {
		return new Promise((resolve, reject) => {
			Session.findByPk(sessionId)
				.then((session: any) => {
					if (!session) {
						reject(new Error("Session not found"));
						return;
					}

					session.lastSeen = lastSeen;
					session.lastIp = lastIp;

					if (username) {
						session.username = username;
					}

					if (lastUserAgent !== undefined) {
						session.lastUserAgent = lastUserAgent;
					}

					session
						.save()
						.then((result: any) => resolve(result))
						.catch((err: Error) => reject(err));
				})
				.catch((e: Error) => {
					reject(e);
				});
		});
	}

	getSession(sessionId: string): Promise<Session> {
		return new Promise((resolve, reject) => {
			Session.findByPk(sessionId)
				.then((session: Session | null) => {
					if (!session) {
						reject(new Error("Session not found"));
					}

					resolve(session!);
				})
				.catch((e: Error) => {
					reject(e);
				});
		});
	}

	getSessionByExternalId(externalId: string): Promise<Session> {
		return new Promise((resolve, reject) => {
			Session.findOne({
				where: {externalId: externalId},
			})
				.then((session: Session | null) => {
					if (!session) {
						reject(new Error("Session not found"));
						return;
					}

					resolve(session);
				})
				.catch((e: Error) => {
					reject(e);
				});
		});
	}

	getAllSessions(username: string): Promise<Session[]> {
		return new Promise((resolve, reject) => {
			Session.findAll({
				where: {
					username: username,
				},
				order: [["externalId", "ASC"]],
			})
				.then((sessions: Session[]) => {
					resolve(sessions);
				})
				.catch((e: Error) => {
					reject(e);
				});
		});
	}
}

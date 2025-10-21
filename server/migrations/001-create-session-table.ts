import {DataTypes} from "sequelize";

export const name = "000-create-session-table";

export async function up(queryInterface, sequelize, transaction) {
	await queryInterface.createTable(
		"Sessions",
		{
			sid: {
				type: DataTypes.STRING,
				primaryKey: true,
			},
			expires: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			data: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			externalId: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			lastIp: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			lastSeen: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			lastUserAgent: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{transaction}
	);

	await queryInterface.addIndex("Sessions", ["expires"], {
		name: "sessions_expires",
		transaction,
	});

	await queryInterface.addIndex("Sessions", ["username"], {
		name: "sessions_username",
		unique: false,
		transaction,
	});
}

export async function down(queryInterface, sequelize, transaction) {
	await queryInterface.dropTable("Sessions", {transaction});
}

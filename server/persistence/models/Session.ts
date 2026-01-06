import {DataTypes, InferCreationAttributes, Model, Sequelize} from "sequelize";
import {randomUUID} from "node:crypto";

// eslint-disable-next-line no-use-before-define
export class Session extends Model<InferCreationAttributes<Session>> {
	declare sid: string;
	declare expires: Date;
	declare data: string;
	declare username: string | null;
	declare externalId: string | null;
	declare lastIp: string | null;
	declare lastSeen: Date | null;
	declare lastUserAgent: string | null;
}

export function initSession(sequelize: Sequelize) {
	Session.init(
		{
			sid: {
				type: DataTypes.STRING,
				primaryKey: true,
			},
			expires: DataTypes.DATE,
			data: DataTypes.TEXT,
			username: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			externalId: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: () => randomUUID(),
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
		{
			sequelize: sequelize,
			modelName: "Session",
			tableName: "Sessions",
		}
	);
}

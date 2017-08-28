"use strict";

const path = require("path");
const fs = require("fs");
const moment = require("moment");
const Promise = require("bluebird");
const Sqlite = require("sqlite3");
const fsextra = require("fs-extra");
const Helper = require("./helper");
const LineByLineReader = require("line-by-line");
const msgTypeRe = /^\* (.*) (unhandled|away|action|back|error|invite|join|kick|mode|motd|nick|notice|part|quit|ctcp|topic_set_by|topic|whois|ban_list|channel_list_loading|channel_list)(.*)$/;

module.exports = {
	indexAll: indexAll,
	index: index,
	query: query,
	getNetworksChannels: getNetworksChannels
};

try {
	fsextra.ensureDirSync(Helper.getLogsPath());
} catch (e) {
	log.error("Unable to create log directory", e);
	return;
}

const format = Helper.config.logs.format || "YYYY-MM-DD HH:mm:ss";

const schema = [
	"CREATE TABLE IF NOT EXISTS logs (user TEXT, network TEXT, chan TEXT, time INTEGER, type TEXT, nick TEXT, text TEXT)",
	"CREATE VIRTUAL TABLE IF NOT EXISTS texts USING fts4(content=\"logs\", nick, text)",
	"CREATE TRIGGER IF NOT EXISTS logs_bu BEFORE UPDATE ON logs BEGIN DELETE FROM texts WHERE docid=old.rowid; END",
	"CREATE TRIGGER IF NOT EXISTS logs_bd BEFORE DELETE ON logs BEGIN DELETE FROM texts WHERE docid=old.rowid; END",
	"CREATE TRIGGER IF NOT EXISTS logs_au AFTER UPDATE ON logs BEGIN INSERT INTO texts(docid, nick, text) VALUES(new.rowid, new.nick, new.text); END",
	"CREATE TRIGGER IF NOT EXISTS logs_ai AFTER INSERT ON logs BEGIN INSERT INTO texts(docid, nick, text) VALUES(new.rowid, new.nick, new.text); END"
];

const database = new Sqlite.Database(path.join(Helper.getLogsPath(), "search.db"));
database.serialize(() => schema.forEach((line) => database.run(line)));

function indexAll() {
	database.serialize(() => {
		const ClientManager = require("./clientManager");
		const manager = new ClientManager();

		const files = [];
		manager.getUsers().forEach((user) => {
			user = manager.readUserConfig(user);
			user.networks.forEach(function(network) {
				const root = Helper.getUserLogsPath(user.user, network.host);
				fs.readdirSync(root).forEach((filename) => {
					if (path.extname(filename) === ".log") {
						files.push({
							user: user.user,
							network: network.host,
							chan: path.basename(filename, ".log"),
							path: path.join(root, filename)
						});
					}
				});
			});
		});
		Promise.each(files, indexFile);
	});
}

function indexFile(file) {
	return new Promise((resolve, reject) => {
		const lr = new LineByLineReader(file.path);
		log.info("Indexing", file.path);

		lr.on("line", (line) => {
			lr.pause();
			const endOfTime = line.indexOf("]");
			const time = moment(line.substr(1, endOfTime - 1), format);
			if (line[endOfTime + 2] === "<") {
				const endOfNick = line.indexOf("> ", endOfTime + 2);
				index(file.user, file.network, file.chan, time.unix(),
					"message",
					line.substr(endOfTime + 3, endOfNick - endOfTime - 3),
					line.substr(endOfNick + 2)).then(() => lr.resume());
			} else {
				const matches = line.substr(endOfTime + 2).match(msgTypeRe);
				// TODO: extract (hostmask) from nickname
				index(file.user, file.network, file.chan, time.unix(), matches[2], matches[1], matches[3].trim())
					.then(() => lr.resume());
			}
		});

		lr.on("error", (err) => reject(err));
		lr.on("end", () => resolve());
	});
}

function index(user, network, chan, time, type, nick, text) {
	return new Promise((resolve, reject) => {
		database.run("INSERT INTO logs(user, network, chan, time, type, nick, text) VALUES(?, ?, ?, ?, ?, ?, ?)",
			user, network, chan, time, type, nick, text, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
	});
}

// TODO: this may require indexes with a big database
function getNetworksChannels(user) {
	return new Promise((resolve, reject) => {
		database.all("SELECT DISTINCT network, chan FROM logs WHERE user = ?", user, (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}

function _duration(text) {
	text = (text || "").toString().trim().toLowerCase();
	if (text === "now") {
		return moment().unix();
	}

	const matches = text.match(/(\d+)\s+(\w+)/);
	if (matches) {
		const quantity = parseInt(matches[1], 10);
		if (quantity !== 0) {
			return moment().subtract(quantity, matches[2]).unix();
		}
	} else {
		return false;
	}
}

function _msgProperties(msg) {
	msg.time = moment.unix(msg.time);
	// To match the msg template
	msg.from = msg.nick;
	delete(msg.nick);
	return msg;
}

function _queryText(extras, params) {
	return new Promise((resolve, reject) => {
		database.all("SELECT logs.rowid AS id, logs.* FROM logs WHERE id IN (SELECT docid FROM texts WHERE text MATCH ?) " +
			extras.join(" ") + " ORDER BY logs.time DESC LIMIT 20 OFFSET ?", params, (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}

function _queryBefore(match) {
	return new Promise((resolve, reject) => {
		database.all("SELECT rowid AS id, * FROM logs WHERE id < ? AND user = ? AND network = ? AND chan = ? AND time > ? ORDER BY id DESC LIMIT ?",
			match.id, match.user, match.network, match.chan, match.time - 3600, 4,
			(err, rows) => {
				if (err) {
					reject(err);
				} else {
					rows.map(_msgProperties);
					match.before = rows.reverse();
					resolve(match);
				}
			});
	});
}

function _queryAfter(match) {
	return new Promise((resolve, reject) => {
		database.all("SELECT rowid AS id, * FROM logs WHERE id > ? AND user = ? AND network = ? AND chan = ? AND time < ? ORDER BY id ASC LIMIT ?",
			match.id, match.user, match.network, match.chan, match.time + 3600, 4,
			(err, rows) => {
				if (err) {
					reject(err);
				} else {
					rows.map(_msgProperties);
					match.after = rows;
					resolve(match);
				}
			});
	});
}

function query(conditions) {
	if (!conditions.text || conditions.text === "") {
		return Promise.resolve(false);
	}
	const params = [conditions.text];
	const extras = [];

	extras.push("AND logs.time >= ?");
	const from = _duration(conditions.from);
	if (from) {
		params.push(from);
	} else {
		conditions.from = "7 days";
		params.push(moment().subtract(7, "days").unix());
	}

	extras.push("AND logs.time <= ?");
	const to = 	_duration(conditions.to);
	if (to) {
		params.push(to);
	} else {
		conditions.to = "now";
		params.push(moment().unix());
	}

	if (conditions.user) {
		extras.push("AND logs.user = ?");
		params.push(conditions.user);
	}
	if (conditions.network && conditions.network !== "*") {
		extras.push("AND logs.network = ?");
		params.push(conditions.network);
	}
	if (conditions.chan && conditions.chan !== "*") {
		extras.push("AND logs.chan = ?");
		params.push(conditions.chan);
	}
	if (conditions.nick) {
		extras.push("AND id IN (SELECT docid FROM texts WHERE nick MATCH ?)");
		params.push(conditions.nick);
	}

	params.push(conditions.offset || 0);

	return new Promise((resolve, reject) => {
		database.serialize(() => {
			_queryText(extras, params)
				.map((row) => _queryBefore(row))
				.map((row) => _queryAfter(row))
				.each((row) => {
					_msgProperties(row);
					row.highlight = true;
				})
				.then((rows) => resolve(rows))
				.catch((e) => reject(e));
		});
	});
}

var mysql = require("mysql");
var Helper = require("./helper");

var pool = mysql.createPool({
	host: Helper.config.dbhost,
	user: Helper.config.dbuser,
	password: Helper.config.dbpass,
	database: Helper.config.database,
	connectionLimit: 10,
	supportBigNumbers: true
});

exports.getChannelLogs = function(channel, callback) {
	var sql = "SELECT * FROM logs WHERE channel=?";
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err); callback(true);
			return;
		}
		connection.query(sql, [channel], function(err, results) {
			connection.release();
			if (err) {
				console.log(err); callback(true);
				return;
			}
			callback(false, results);
		});
	});
};

exports.log = function(name, host, chan, msg) {
	var message = {name: name, host: host, channel: chan, message: msg};
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err);
		}
		connection.query("INSERT INTO logs SET ?", message, function(err) {
			connection.release();
			if (err) {
				console.log(err);
			}
		});
	});
};

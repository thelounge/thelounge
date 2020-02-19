"use strict";

const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;

	irc.on("cap ls", (data) => {
		handleSTS(data);
	});

	irc.on("cap new", (data) => {
		handleSTS(data);
	});

	function handleSTS(data) {
		if (!Object.prototype.hasOwnProperty.call(data.capabilities, "sts")) {
			return;
		}

		const isSecure = irc.connection.transport.socket.encrypted;
		const values = {};

		data.capabilities.sts.split(",").map((value) => {
			value = value.split("=", 2);
			values[value[0]] = value[1];
		});

		if (isSecure) {
			// TODO: store and update duration
		} else {
			const port = parseInt(values.port, 10);

			if (isNaN(port)) {
				return;
			}

			network.channels[0].pushMessage(
				client,
				new Msg({
					text: `Server sent a strict transport security policy, reconnecting to port ${port}…`,
				}),
				true
			);

			// Forcefully end the connection
			irc.connection.end();

			// Update the port
			network.port = port;
			irc.options.port = port;

			// Enable TLS
			network.tls = true;
			network.rejectUnauthorized = true;
			irc.options.tls = true;
			irc.options.rejectUnauthorized = true;

			// Start a new connection
			irc.connect();

			client.save();
		}
	}
};

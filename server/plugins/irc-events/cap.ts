import {IrcEventHandler} from "../../client.js";
import log from "../../log.js";

import Msg from "../../models/msg.js";
import STSPolicies from "../sts.js";

export default <IrcEventHandler>function (irc, network) {
	const handleSTS = (data, shouldReconnect: boolean) => {
		if (!Object.prototype.hasOwnProperty.call(data.capabilities, "sts")) {
			return;
		}

		const isSecure = irc.connection.transport.socket.encrypted;
		const values: {duration?: string; port?: string; [key: string]: string | undefined} = {};

		data.capabilities.sts.split(",").map((value) => {
			value = value.split("=", 2);
			values[value[0]] = value[1];
		});

		if (isSecure) {
			const duration = parseInt(values.duration ?? "", 10);

			if (isNaN(duration)) {
				return;
			}

			STSPolicies.update(network.host, network.port, duration);
		} else {
			const port = parseInt(values.port ?? "", 10);

			if (isNaN(port)) {
				return;
			}

			network.getLobby().pushMessage(
				this,
				new Msg({
					text: `Server sent a strict transport security policy, reconnecting to ${network.host}:${port}…`,
				}),
				true
			);

			// Forcefully end the connection if STS is seen in CAP LS
			// We will update the port and tls setting if we see CAP NEW,
			// but will not force a reconnection
			if (shouldReconnect) {
				irc.connection.end();
			}

			// Update the port
			network.port = port;
			irc.options.port = port;

			// Enable TLS
			network.tls = true;
			network.rejectUnauthorized = true;
			irc.options.tls = true;
			irc.options.rejectUnauthorized = true;

			if (shouldReconnect) {
				// Start a new connection
				irc.connect();
			}

			this.save();
		}
	};

	irc.on("cap ls", (data) => {
		log.debug("[CAP LS] Server capabilities:", Object.keys(data.capabilities).join(", "));
		handleSTS(data, true);
	});

	irc.on("cap ack", (data) => {
		log.debug("[CAP ACK] Server acknowledged:", Object.keys(data.capabilities).join(", "));
	});

	irc.on("cap nak", (data) => {
		log.debug("[CAP NAK] Server rejected:", Object.keys(data.capabilities).join(", "));
	});

	irc.on("cap new", (data) => {
		log.debug("[CAP NEW] New capabilities:", Object.keys(data.capabilities).join(", "));
		handleSTS(data, false);
	});
};

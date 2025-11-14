import _ from "lodash";
import {IrcEventHandler} from "../../client.js";

import log from "../../log.js";
import Msg from "../../models/msg.js";
import Helper from "../../helper.js";
import Config from "../../config.js";
import {MessageType} from "../../../shared/types/msg.js";
import {ChanType, ChanState} from "../../../shared/types/chan.js";

export default <IrcEventHandler>function (irc, network) {
	const sendStatus = () => {
		const status = network.getNetworkStatus();
		const toSend = {
			...status,
			network: network.uuid,
		};

		this.emit("network:status", toSend);
	};

	network.getLobby().pushMessage(
		this,
		new Msg({
			text: "Network created, connecting to " + network.host + ":" + network.port + "...",
		}),
		true
	);

	irc.on("registered", () => {
		if (network.irc.network.cap.enabled.length > 0) {
			network.getLobby().pushMessage(
				this,
				new Msg({
					text: "Enabled capabilities: " + network.irc.network.cap.enabled.join(", "),
				}),
				true
			);
		}

		// Always restore away message for this network
		if (network.awayMessage) {
			irc.raw("AWAY", network.awayMessage);
			// Only set generic away message if there are no clients attached
		} else if (this.awayMessage && _.size(this.attachedClients) === 0) {
			irc.raw("AWAY", this.awayMessage);
		}

		let delay = 1000;

		if (Array.isArray(network.commands)) {
			network.commands.forEach((cmd) => {
				setTimeout(() => {
					this.input({
						target: network.getLobby().id,
						text: cmd,
					});
				}, delay);
				delay += 1000;
			});
		}

		network.channels.forEach((chan) => {
			if (chan.type !== ChanType.CHANNEL) {
				return;
			}

			setTimeout(() => {
				network.irc.join(chan.name, chan.key);
			}, delay);
			delay += 1000;
		});
	});

	irc.on("socket connected", () => {
		if (irc.network.options.PREFIX) {
			network.serverOptions.PREFIX.update(irc.network.options.PREFIX);
		}

		network.getLobby().pushMessage(
			this,
			new Msg({
				text: "Connected to the network.",
			}),
			true
		);

		sendStatus();
	});

	irc.on("close", () => {
		network.getLobby().pushMessage(
			this,
			new Msg({
				text: "Disconnected from the network, and will not reconnect. Use /connect to reconnect again.",
			}),
			true
		);
	});

	let identSocketId;

	irc.on("raw socket connected", (socket) => {
		let ident = this.name || network.username;

		if (Config.values.useHexIp) {
			ident = Helper.ip2hex(this.config.browser!.ip!);
		}

		identSocketId = this.manager.identHandler.addSocket(socket, ident);
	});

	irc.on("socket close", (error) => {
		if (identSocketId > 0) {
			this.manager.identHandler.removeSocket(identSocketId);
			identSocketId = 0;
		}

		network.channels.forEach((chan) => {
			chan.users = new Map();
			chan.state = ChanState.PARTED;
		});

		if (error) {
			network.getLobby().pushMessage(
				this,
				new Msg({
					type: MessageType.ERROR,
					text: `Connection closed unexpectedly: ${
			error instanceof Error ? error.message : typeof error === "string" ? error : "Unknown error"
		}`,
				}),
				true
			);
		}

		if (network.keepNick) {
			// We disconnected without getting our original nick back yet, just set it back locally
			irc.options.nick = irc.user.nick = network.keepNick;

			network.setNick(network.keepNick);
			network.keepNick = null;

			this.emit("nick", {
				network: network.uuid,
				nick: network.nick,
			});
		}

		sendStatus();
	});

	if (Config.values.debug.ircFramework) {
		irc.on("debug", (message) => {
			log.debug(
				`[${this.name} (${this.id}) on ${network.name} (${network.uuid}]`,
				message
			);
		});
	}

	if (Config.values.debug.raw) {
		irc.on("raw", (message) => {
			network.getLobby().pushMessage(
				this,
				new Msg({
					self: !message.from_server,
					type: MessageType.RAW,
					text: message.line,
				}),
				true
			);
		});
	}

	irc.on("socket error", (err) => {
		network.getLobby().pushMessage(
			this,
			new Msg({
				type: MessageType.ERROR,
				text: "Socket error: " + err,
			}),
			true
		);
	});

	irc.on("reconnecting", (data) => {
		network.getLobby().pushMessage(
			this,
			new Msg({
				text: `Disconnected from the network. Reconnecting in ${Math.round(
					data.wait / 1000
				)} seconds… (Attempt ${Number(data.attempt)})`,
			}),
			true
		);
	});

	irc.on("ping timeout", () => {
		network.getLobby().pushMessage(
			this,
			new Msg({
				text: "Ping timeout, disconnecting…",
			}),
			true
		);
	});

	irc.on("server options", (data) => {
		network.serverOptions.PREFIX.update(data.options.PREFIX);

		if (data.options.CHANTYPES) {
			network.serverOptions.CHANTYPES = data.options.CHANTYPES;
		}

		network.serverOptions.NETWORK = data.options.NETWORK;

		this.emit("network:options", {
			network: network.uuid,
			serverOptions: network.serverOptions,
		});
	});
};

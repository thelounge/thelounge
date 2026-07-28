import {PluginInputHandler} from "./index";
import Msg from "../../models/msg";
import Chan from "../../models/chan";
import {MessageType} from "../../../shared/types/msg";
import {ChanType} from "../../../shared/types/chan";

const commands = ["query", "msg", "say"];

function getTarget(cmd: string, args: string[], chan: Chan) {
	switch (cmd) {
		case "msg":
		case "query":
			return args.shift();
		default:
			return chan.name;
	}
}

// irc-framework rejects a batch that is over the network's advertised
// draft/multiline limits before anything is written to the socket
function isMultilineLimitError(error: unknown) {
	const code = (error as {code?: string} | undefined)?.code;
	return code === "MULTILINE_MAX_BYTES" || code === "MULTILINE_MAX_LINES";
}

const input: PluginInputHandler = function (network, chan, cmd, args, extras) {
	const targetName = getTarget(cmd, args, chan);

	if (cmd === "query") {
		if (!targetName) {
			chan.pushMessage(
				this,
				new Msg({
					type: MessageType.ERROR,
					text: "You cannot open a query window without an argument.",
				})
			);
			return;
		}

		const target = network.getChannel(targetName);

		if (typeof target === "undefined") {
			const char = targetName[0];

			if (
				network.irc.network.options.CHANTYPES &&
				network.irc.network.options.CHANTYPES.includes(char)
			) {
				chan.pushMessage(
					this,
					new Msg({
						type: MessageType.ERROR,
						text: "You can not open query windows for channels, use /join instead.",
					})
				);
				return;
			}

			for (let i = 0; i < network.irc.network.options.PREFIX.length; i++) {
				if (network.irc.network.options.PREFIX[i].symbol === char) {
					chan.pushMessage(
						this,
						new Msg({
							type: MessageType.ERROR,
							text: "You can not open query windows for names starting with a user prefix.",
						})
					);
					return;
				}
			}

			const newChan = this.createChannel({
				type: ChanType.QUERY,
				name: targetName,
			});

			this.emit("join", {
				network: network.uuid,
				chan: newChan.getFilteredClone(true),
				shouldOpen: true,
				index: network.addChannel(newChan),
			});
			this.save();
			newChan.loadMessages(this, network);
		}
	}

	if (args.length === 0) {
		return true;
	}

	if (!targetName) {
		return true;
	}

	const msg = args.join(" ");

	if (msg.length === 0) {
		return true;
	}

	const replyTo = extras?.replyTo;
	const replyTags =
		replyTo && network.serverOptions.supportsReply ? {"+reply": replyTo} : undefined;

	const lines = msg.split(/\r?\n/);

	// Networks supporting draft/multiline take the whole message as a single batch.
	// multilineLimits() is null when the cap is missing or advertises no limits, in
	// which case the framework sends line by line anyway.
	let batched = lines.length > 1 && network.irc.network.multilineLimits() !== null;

	if (batched) {
		try {
			network.irc.sayMultiline(targetName, lines, replyTags);
		} catch (error) {
			if (!isMultilineLimitError(error)) {
				throw error;
			}

			// Over the network's max-bytes / max-lines, deliver as separate messages.
			batched = false;
		}
	}

	// Blank lines carry no text, the IRCd would reject them (ERR_NOTEXTTOSEND)
	const sentLines = lines.filter((line) => line.length > 0);

	if (!batched) {
		sentLines.forEach((line) => network.irc.say(targetName, line, replyTags));
	}

	if (network.irc.network.cap.isEnabled("echo-message")) {
		return true;
	}

	const parsedTarget = network.irc.network.extractTargetGroup(targetName);
	const echoTarget = parsedTarget ? parsedTarget.target : targetName;
	const targetGroup = parsedTarget ? parsedTarget.target_group : undefined;

	if (typeof network.getChannel(echoTarget) === "undefined") {
		return true;
	}

	const echoBase = {
		nick: network.irc.user.nick,
		ident: network.irc.user.username,
		hostname: network.irc.user.host,
		target: echoTarget,
		group: targetGroup,
		tags: replyTo ? {"+reply": replyTo} : undefined,
	};

	if (batched) {
		network.irc.emit("privmsg", {...echoBase, message: lines.join("\n"), multiline: true});
	} else {
		sentLines.forEach((line) => network.irc.emit("privmsg", {...echoBase, message: line}));
	}

	return true;
};

export default {
	commands,
	input,
};

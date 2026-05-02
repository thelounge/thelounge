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

const input: PluginInputHandler = function (network, chan, cmd, args) {
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

	const replyTo = this._pendingReplyTo;
	const replyTags =
		replyTo && network.serverOptions.supportsReply ? {"+reply": replyTo} : undefined;

	const lines = msg.includes("\n") ? msg.split(/\r?\n/) : [msg];
	const isMultiline = lines.length > 1;
	const useMultilineBatch = isMultiline && network.irc.network.cap.isEnabled("draft/multiline");

	if (useMultilineBatch) {
		try {
			network.irc.sayMultiline(targetName, lines, replyTags);
		} catch {
			// max-bytes / max-lines exceeded; deliver as separate messages.
			lines.forEach((line) => network.irc.say(targetName, line, replyTags));
		}
	} else if (isMultiline) {
		lines.forEach((line) => network.irc.say(targetName, line, replyTags));
	} else {
		network.irc.say(targetName, msg, replyTags);
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

	if (useMultilineBatch) {
		network.irc.emit("privmsg", {...echoBase, message: msg, multiline: true});
	} else {
		lines.forEach((line) => network.irc.emit("privmsg", {...echoBase, message: line}));
	}

	return true;
};

export default {
	commands,
	input,
};

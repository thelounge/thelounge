import Msg, {MessageType} from "../../models/msg";
import {PluginInputHandler} from "./index";

const commands = ["whois"];

type DataError = {
	error: string;
};

type DataToSend = {
	whowas: string;
	idleTime: number;
	logonTime: number;
	logon: number;
	idle: number;
};

const isDataError = (data: any): data is DataError => {
	return data.error !== undefined;
};

const isDataToSend = (data: any): data is DataToSend => {
	return !isDataError(data);
};

const input: PluginInputHandler = function ({irc}, chan, cmd, args) {
	const client = this;
	const target = args[0];
	const targetNick = args[1] ? args[1] : target;

	const sendToClient = (data: DataError | DataToSend) => {
		if (!isDataToSend(data)) {
			chan.pushMessage(
				client,
				new Msg({
					type: MessageType.ERROR,
					error: data.error,
					nick: targetNick,
				})
			);
		} else {
			// Absolute datetime in milliseconds since nick is idle
			data.idleTime = Date.now() - data.idle * 1000;
			// Absolute datetime in milliseconds when nick logged on.
			data.logonTime = data.logon * 1000;
			chan.pushMessage(
				client,
				new Msg({
					type: MessageType.WHOIS,
					whois: data,
				})
			);
		}
	};

	if (!target) {
		sendToClient({
			error: `/${cmd} needs a target nick`,
		});
		return;
	}

	switch (cmd) {
		case "whois":
			// @ts-ignore
			irc.whois(target, targetNick, sendToClient);
			break;
		case "whowas":
			irc.whowas(target, (data: any) => {
				data.whowas = true;
				sendToClient(data);
			});
			break;
	}
};

export default {
	commands,
	input,
};

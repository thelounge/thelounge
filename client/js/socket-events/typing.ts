import socket from "../socket";
import {store} from "../store";

const ACTIVE_TIMEOUT_MS = 6000;
const PAUSED_TIMEOUT_MS = 30000;

const typingTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

socket.on("typing", function (data) {
	if (store.state.settings.typing === "off") {
		return;
	}

	const receivingChannel = store.getters.findChannel(data.chan);

	if (!receivingChannel) {
		return;
	}

	const channel = receivingChannel.channel;
	const nick = data.nick;
	const timeoutKey = `${data.chan}-${nick}`;

	const existing = typingTimeouts.get(timeoutKey);

	if (existing) {
		clearTimeout(existing);
		typingTimeouts.delete(timeoutKey);
	}

	if (data.status === "done") {
		removeTypingNick(channel, nick);
		return;
	}

	if (!channel.typingNicks.includes(nick)) {
		channel.typingNicks.push(nick);
	}

	const timeout = data.status === "active" ? ACTIVE_TIMEOUT_MS : PAUSED_TIMEOUT_MS;

	typingTimeouts.set(
		timeoutKey,
		setTimeout(() => {
			typingTimeouts.delete(timeoutKey);
			removeTypingNick(channel, nick);
		}, timeout)
	);
});

socket.on("msg", function (data) {
	if (typingTimeouts.size === 0) {
		return;
	}

	const receivingChannel = store.getters.findChannel(data.chan);

	if (!receivingChannel) {
		return;
	}

	const nick = data.msg.from?.nick;

	if (nick) {
		const timeoutKey = `${data.chan}-${nick}`;
		const timeout = typingTimeouts.get(timeoutKey);

		if (timeout) {
			clearTimeout(timeout);
			typingTimeouts.delete(timeoutKey);
		}

		removeTypingNick(receivingChannel.channel, nick);
	}
});

function removeTypingNick(channel: {typingNicks: string[]}, nick: string) {
	const index = channel.typingNicks.indexOf(nick);

	if (index !== -1) {
		channel.typingNicks.splice(index, 1);
	}
}

"use strict";

const Chan = require("../../models/chan");
const Msg = require("../../models/msg");
const Helper = require("../../helper");

exports.commands = ["ignore", "unignore", "ignorelist"];

const IGNORELIST_CHAN_NAME = "Ignored users";

exports.input = function (network, chan, cmd, args) {
	const client = this;
	let target;
	let hostmask;

	function emitError(msg) {
		chan.pushMessage(
			client,
			new Msg({
				type: Msg.Type.ERROR,
				text: msg,
			})
		);
	}

	if (cmd !== "ignorelist" && (args.length === 0 || args[0].trim().length === 0)) {
		emitError(`Usage: /${cmd} <nick>[!ident][@host]`);
		return;
	}

	if (cmd !== "ignorelist") {
		// Trim to remove any spaces from the hostmask
		target = args[0].trim();
		hostmask = Helper.parseHostmask(target);
	}

	switch (cmd) {
		case "ignore": {
			// IRC nicks are case insensitive
			if (hostmask.nick.toLowerCase() === network.nick.toLowerCase()) {
				emitError("You can't ignore yourself");
				return;
			}

			if (hostmaskInList(network.ignoreList, hostmask)) {
				emitError("The specified user/hostmask is already ignored");
				return;
			}

			hostmask.when = Date.now();
			network.ignoreList.push(hostmask);
			client.save();
			// TODO: This should not be an error, that's the happy path for gods sake...
			emitError(
				`\u0002${hostmask.nick}!${hostmask.ident}@${hostmask.hostname}\u000f added to ignorelist`
			);
			updateIgnoreList(client, network);
			return;
		}

		case "unignore": {
			const idx = network.ignoreList.findIndex(function (entry) {
				return Helper.compareHostmask(entry, hostmask);
			});

			if (idx === -1) {
				emitError("The specified user/hostmask is not ignored");
				return;
			}

			network.ignoreList.splice(idx, 1);
			client.save();
			// TODO: This should not be an error, that's the happy path for gods sake...
			emitError(
				`Successfully removed \u0002${hostmask.nick}!${hostmask.ident}@${hostmask.hostname}\u000f from ignorelist`
			);
			updateIgnoreList(client, network);
			return;
		}

		case "ignorelist":
			if (network.ignoreList.length === 0) {
				emitError("Ignorelist is empty");
				return;
			}

			createOrUpdateIgnoreList(client, network, false);
			break;
	}
};

function updateIgnoreList(client, network, focus) {
	const channel = network.getChannel(IGNORELIST_CHAN_NAME);

	if (typeof channel === "undefined") {
		// nothing to do, there is no open ignorelist
		return;
	}

	const shouldFocus = focus === undefined ? false : focus; // default to no focus
	client.emit("msg:special", {
		chan: channel.id,
		data: chanDataFromList(network.ignoreList),
		focus: shouldFocus,
	});
}

function createOrUpdateIgnoreList(client, network) {
	const channel = network.getChannel(IGNORELIST_CHAN_NAME);

	if (typeof channel !== "undefined") {
		// already have an existing window, so update and focus
		return updateIgnoreList(client, network, true);
	}

	const newChan = client.createChannel({
		type: Chan.Type.SPECIAL,
		special: Chan.SpecialType.IGNORELIST,
		name: IGNORELIST_CHAN_NAME,
		data: chanDataFromList(network.ignoreList),
	});
	client.emit("join", {
		network: network.uuid,
		chan: newChan.getFilteredClone(true),
		index: network.addChannel(newChan),
	});
}

function hostmaskInList(list, hostmask) {
	return list.some(function (entry) {
		return Helper.compareHostmask(entry, hostmask);
	});
}

function chanDataFromList(list) {
	return list.map((data) => ({
		hostmask: `${data.nick}!${data.ident}@${data.hostname}`,
		when: data.when,
	}));
}

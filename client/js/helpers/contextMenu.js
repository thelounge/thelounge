"use strict";
import socket from "../socket";

export function generateChannelContextMenu($root, channel, network) {
	const typeMap = {
		lobby: "network",
		channel: "chan",
		query: "query",
		special: "chan",
	};

	const closeMap = {
		lobby: "Remove",
		channel: "Leave",
		query: "Close",
		special: "Close",
	};

	let items = [
		{
			label: channel.name,
			type: "item",
			class: typeMap[channel.type],
			link: `/chan-${channel.id}`,
		},
		{
			type: "divider",
		},
	];

	// Add menu items for lobbies
	if (channel.type === "lobby") {
		items = [
			...items,
			{
				label: "Edit this network…",
				type: "item",
				class: "edit",
				link: `/edit-network/${network.uuid}`,
			},
			{
				label: "Join a channel…",
				type: "item",
				class: "join",
				action: () => (network.isJoinChannelShown = true),
			},
			{
				label: "List all channels",
				type: "item",
				class: "list",
				action: () =>
					socket.emit("input", {
						target: channel.id,
						text: "/list",
					}),
			},
			{
				label: "List ignored users",
				type: "item",
				class: "list",
				action: () =>
					socket.emit("input", {
						target: channel.id,
						text: "/ignorelist",
					}),
			},
			network.status.connected
				? {
						label: "Disconnect",
						type: "item",
						class: "disconnect",
						action: () =>
							socket.emit("input", {
								target: channel.id,
								text: "/disconnect",
							}),
				  }
				: {
						label: "Connect",
						type: "item",
						class: "connect",
						action: () =>
							socket.emit("input", {
								target: channel.id,
								text: "/connect",
							}),
				  },
		];
	}

	// Add menu items for channels
	if (channel.type === "channel") {
		items = [
			...items,
			{
				label: "Edit topic",
				type: "item",
				class: "edit",
				action() {
					channel.editTopic = true;
					$root.switchToChannel(channel);

					$root.$nextTick(() =>
						document.querySelector(`#chan-${channel.id} .topic-input`).focus()
					);
				},
			},
			{
				label: "List banned users",
				type: "item",
				class: "list",
				action() {
					socket.emit("input", {
						target: channel.id,
						text: "/banlist",
					});
				},
			},
		];
	}

	// Add menu items for queries
	if (channel.type === "query") {
		items = [
			...items,
			{
				label: "User information",
				type: "item",
				class: "action-whois",
				action() {
					$root.switchToChannel(channel);
					socket.emit("input", {
						target: $root.$store.state.activeChannel.channel.id,
						text: "/whois " + channel.name,
					});
				},
			},
		];
	}

	// Add close menu item
	items.push({
		label: closeMap[channel.type],
		type: "item",
		class: "close",
		action() {
			const close = document.querySelector(
				`.networks .chan[data-target="#chan-${channel.id}"] .close`
			);

			if (close) {
				close.click();
			}
		},
	});

	return items;
}

export function generateUserContextMenu($root, channel, network, user) {
	const currentChannelUser = channel.users.filter((u) => u.nick === network.nick)[0];

	const whois = () => {
		const chan = $root.$store.getters.findChannelOnCurrentNetwork(user.nick);

		if (chan) {
			$root.switchToChannel(chan);
		}

		socket.emit("input", {
			target: channel.id,
			text: "/whois " + user.nick,
		});
	};

	const items = [
		{
			label: user.nick,
			type: "item",
			class: "user",
			action: whois,
		},
		{
			type: "divider",
		},
		{
			label: "User information",
			type: "item",
			class: "action-whois",
			action: whois,
		},
		{
			label: "Direct messages",
			type: "item",
			class: "action-query",
			action() {
				const chan = $root.$store.getters.findChannelOnCurrentNetwork(user.nick);

				if (chan) {
					$root.switchToChannel(chan);
				}

				socket.emit("input", {
					target: channel.id,
					text: "/query " + user.nick,
				});
			},
		},
	];

	if (currentChannelUser.mode === "@") {
		items.push({
			label: "Kick",
			type: "item",
			class: "action-kick",
			action() {
				socket.emit("input", {
					target: channel.id,
					text: "/kick " + user.nick,
				});
			},
		});

		if (user.mode === "@") {
			items.push({
				label: "Revoke operator (-o)",
				type: "item",
				class: "action-op",
				action() {
					socket.emit("input", {
						target: channel.id,
						text: "/deop " + user.nick,
					});
				},
			});
		} else {
			items.push({
				label: "Give operator (+o)",
				type: "item",
				class: "action-op",
				action() {
					socket.emit("input", {
						target: channel.id,
						text: "/op " + user.nick,
					});
				},
			});
		}

		if (user.mode === "+") {
			items.push({
				label: "Revoke voice (-v)",
				type: "item",
				class: "action-voice",
				action() {
					socket.emit("input", {
						target: channel.id,
						text: "/devoice " + user.nick,
					});
				},
			});
		} else {
			items.push({
				label: "Give voice (+v)",
				type: "item",
				class: "action-voice",
				action() {
					socket.emit("input", {
						target: channel.id,
						text: "/voice " + user.nick,
					});
				},
			});
		}
	}

	return items;
}

import {IrcEventHandler} from "../../client.js";
import log from "../../log.js";

export default <IrcEventHandler>function (irc, network) {
	// Handle SPJOIN command from seedpool/enhanced capable servers
	// Format: :SeedServ SPJOIN #channel nickname :GroupName
	irc.on("unknown command", (command) => {
		if (command.command !== "SPJOIN") {
			return;
		}

		const channelName = command.params[0];
		const nickname = command.params[1];
		const groupName = command.params[2];

		if (!channelName || !nickname || !groupName) {
			log.warn("SPJOIN: Missing channel, nickname, or group");
			return;
		}

		const chan = network.getChannel(channelName);

		if (!chan) {
			log.warn(`SPJOIN: Channel ${channelName} not found`);
			return;
		}

		if (!chan.groups) {
			chan.groups = [];
		}

		// Remove user from any existing group (in case of group change)
		for (const group of chan.groups) {
			const lowerUsers = group.users.map(u => u.toLowerCase());
			const userIndex = lowerUsers.indexOf(nickname.toLowerCase());

			if (userIndex !== -1) {
				group.users.splice(userIndex, 1);
			}
		}

		// Find the target group or create it
		let targetGroup = chan.groups.find(g => g.name === groupName);

		if (!targetGroup) {
			// Add new group at the end (lowest priority)
			targetGroup = {name: groupName, users: []};
			chan.groups.push(targetGroup);
		}

		// Add user to the group
		if (!targetGroup.users.map(u => u.toLowerCase()).includes(nickname.toLowerCase())) {
			targetGroup.users.push(nickname);
		}

		// Emit updated groups to client
		this.emit("channel:groups", {
			chan: chan.id,
			groups: chan.groups,
		});

		log.debug(`SPJOIN: ${nickname} joined ${channelName} in group ${groupName}`);
	});
};

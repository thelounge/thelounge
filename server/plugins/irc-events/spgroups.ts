import {IrcEventHandler} from "../../client.js";
import log from "../../log.js";
import {UserGroup} from "../../../shared/types/chan.js";

export default <IrcEventHandler>function (irc, network) {
	// Handle SPGROUPS command from seedpool/enhanced capable servers
	// Format: :SeedServ SPGROUPS #channel :{"groups":[{"name":"Sysop","users":["admin1"]}, ...]}
	irc.on("unknown command", (command) => {
		if (command.command !== "SPGROUPS") {
			return;
		}

		const channelName = command.params[0];
		const jsonPayload = command.params[1];

		if (!channelName || !jsonPayload) {
			log.warn("SPGROUPS: Missing channel or payload");
			return;
		}

		const chan = network.getChannel(channelName);

		if (!chan) {
			log.warn(`SPGROUPS: Channel ${channelName} not found`);
			return;
		}

		try {
			const data = JSON.parse(jsonPayload) as {groups: UserGroup[]};

			if (!data.groups || !Array.isArray(data.groups)) {
				log.warn("SPGROUPS: Invalid payload format, expected {groups: [...]}");
				return;
			}

			// Store groups on the channel
			chan.groups = data.groups;

			// Emit to client
			this.emit("channel:groups", {
				chan: chan.id,
				groups: chan.groups,
			});

			log.debug(`[SPGROUPS] Received ${data.groups.length} groups for ${channelName}`);
		} catch (err) {
			log.error(`SPGROUPS: Failed to parse JSON payload: ${String(err)}`);
		}
	});
};

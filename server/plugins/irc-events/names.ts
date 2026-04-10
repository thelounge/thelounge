import {IrcEventHandler} from "../../client";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("userlist", function (data) {
		const chan = network.getChannel(data.channel);

		if (typeof chan === "undefined") {
			return;
		}

		const newUsers = new Map();

		data.users.forEach((user) => {
			const newUser = chan.getUser(user.nick);
			newUser.setModes(user.modes, network.serverOptions.PREFIX);

			newUsers.set(user.nick.toLowerCase(), newUser);
		});

		chan.users = newUsers;

		client.emit("users", {
			chan: chan.id,
		});
	});

	irc.on("wholist", function (data) {
		const chan = network.getChannel(data.target);

		if (typeof chan === "undefined") {
			return;
		}

		let changed = false;

		data.users.forEach((whoUser: {nick: string; away: boolean}) => {
			const user = chan.findUser(whoUser.nick);

			if (!user) {
				return;
			}

			const awayState = whoUser.away ? "away" : "";

			if (Boolean(user.away) !== whoUser.away) {
				user.away = awayState;
				changed = true;
			}
		});

		if (changed) {
			client.emit("users", {
				chan: chan.id,
			});
		}
	});
};

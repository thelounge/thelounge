"use strict";

import store from "../store";

export default (network, channel) => {
	if (
		!network.isCollapsed ||
		channel.highlight ||
		channel.type === "lobby" ||
		(channel.favorite === true && store.state.favoritesOpen)
	) {
		return false;
	}

	if (store.state.activeChannel && channel === store.state.activeChannel.channel) {
		return false;
	}

	return true;
};

"use strict";

import storage from "../localStorage";

export default (network, isCollapsed) => {
	const networks = new Set(JSON.parse(storage.get("thelounge.networks.collapsed")));
	network.isCollapsed = isCollapsed;

	if (isCollapsed) {
		networks.add(network.uuid);
	} else {
		networks.delete(network.uuid);
	}

	storage.set("thelounge.networks.collapsed", JSON.stringify([...networks]));
};

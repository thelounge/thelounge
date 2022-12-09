import storage from "../localStorage";

export default (network, isCollapsed) => {
	const stored = storage.get("thelounge.networks.collapsed");
	const networks = stored ? new Set(JSON.parse(stored)) : new Set();

	network.isCollapsed = isCollapsed;

	if (isCollapsed) {
		networks.add(network.uuid);
	} else {
		networks.delete(network.uuid);
	}

	storage.set("thelounge.networks.collapsed", JSON.stringify([...networks]));
};

import Client from "@src/client";

declare global {
	type PluginInputHandler = (
		this: Client,
		network: NetworkWithIrcFramework,
		chan: Channel,
		cmd: string,
		args: string[]
	) => void;
}

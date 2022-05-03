import Client from "client";

declare global {
	type IrcEventHandler = (
		this: Client,
		irc: NetworkWithIrcFramework["irc"],
		network: NetworkWithIrcFramework
	) => void;
}

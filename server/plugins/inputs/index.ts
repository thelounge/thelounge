import Client from "../../client";
import log from "../../log";
import Chan, {Channel} from "../../models/chan";
import Network, {NetworkWithIrcFramework} from "../../models/network";
import {PackageInfo} from "../packages";
import PublicClient from "../packages/publicClient";

export type PluginInputHandler = (
	this: Client,
	network: NetworkWithIrcFramework,
	chan: Channel,
	cmd: string,
	args: string[]
) => void;

type Plugin = {
	commands: string[];
	input: (network: Network, chan: Chan, cmd: string, args: string[]) => void;
	allowDisconnected?: boolean;
};

type ExternalPluginCommand = {
	packageInfo: PackageInfo;
	input: (
		pub: PublicClient,
		netChan: {network: Network; chan: Chan},
		cmd: string,
		args: string[]
	) => void;
	allowDisconnected?: boolean;
};

const clientSideCommands = ["/collapse", "/expand", "/search"];

const passThroughCommands = [
	"/as",
	"/bs",
	"/cs",
	"/ho",
	"/hs",
	"/join",
	"/ms",
	"/ns",
	"/os",
	"/rs",
];

const userInputs = new Map<string, Plugin>();
const builtInInputs = [
	"action",
	"away",
	"ban",
	"connect",
	"ctcp",
	"disconnect",
	"ignore",
	"invite",
	"kick",
	"kill",
	"list",
	"mode",
	"msg",
	"nick",
	"notice",
	"part",
	"quit",
	"raw",
	"rejoin",
	"topic",
	"whois",
	"mute",
];

for (const input of builtInInputs) {
	import(`./${input}`)
		.then(
			(plugin: {
				default: {
					commands: string[];
					input: (network: Network, chan: Chan, cmd: string, args: string[]) => void;
					allowDisconnected?: boolean;
				};
			}) => {
				plugin.default.commands.forEach((command: string) =>
					userInputs.set(command, plugin.default)
				);
			}
		)
		.catch((err) => {
			log.error(err);
		});
}

const pluginCommands = new Map<string, ExternalPluginCommand>();

const getCommands = () =>
	Array.from(userInputs.keys())
		.concat(Array.from(pluginCommands.keys()))
		.map((command) => `/${command}`)
		.concat(clientSideCommands)
		.concat(passThroughCommands)
		.sort();

const addPluginCommand = (packageInfo: PackageInfo, command: any, obj: any) => {
	if (typeof command !== "string") {
		log.error(`plugin {packageInfo.packageName} tried to register a bad command`);
		return;
	} else if (!obj || typeof obj.input !== "function") {
		log.error(
			`plugin ${packageInfo.packageName} tried to register command "${command} without a callback"`
		);
		return;
	}

	pluginCommands.set(command, {
		packageInfo: packageInfo,
		input: obj.input,
		allowDisconnected: obj.allowDisconnected,
	});
};

export default {
	addPluginCommand,
	getCommands,
	pluginCommands,
	userInputs,
};

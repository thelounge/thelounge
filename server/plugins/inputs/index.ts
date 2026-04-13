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
	"ignorelist",
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
			`plugin ${packageInfo.packageName} tried to register command "${command}" without a callback`
		);
		return;
	}

	pluginCommands.set(command, {
		packageInfo: packageInfo,
		input: obj.input,
		allowDisconnected: obj.allowDisconnected,
	});
};

/**
 * Build +reply tags from the pending reply state on the client.
 * Returns `undefined` for outgoing tags if the server doesn't support +reply
 * or there's no pending reply. The `echo` tags are always populated for the
 * echo-message fallback (which is local-only and doesn't need server support).
 */
export function buildReplyTags(
	pendingReplyTo: string | undefined,
	supportsReply: boolean
): {outgoing: Record<string, string> | undefined; echo: Record<string, string>} {
	return {
		outgoing:
			pendingReplyTo && supportsReply ? {"+reply": pendingReplyTo} : undefined,
		echo: pendingReplyTo ? {"+reply": pendingReplyTo} : {},
	};
}

export default {
	addPluginCommand,
	getCommands,
	pluginCommands,
	userInputs,
};

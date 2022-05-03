import Chan from "@src/models/chan";
import Network from "@src/models/network";

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

const userInputs = [
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
].reduce(function (plugins, name) {
	const plugin = import(`./${name}`).then(
		(plugin: {
			default: {
				commands: string[];
				input: (network: Network, chan: Chan, cmd: string, args: string[]) => void;
				allowDisconnected?: boolean;
			};
		}) => {
			plugin.default.commands.forEach((command: string) => plugins.set(command, plugin));
		}
	);
	return plugins;
}, new Map());

const pluginCommands = new Map();

const getCommands = () =>
	Array.from(userInputs.keys())
		.concat(Array.from(pluginCommands.keys()))
		.map((command) => `/${command}`)
		.concat(clientSideCommands)
		.concat(passThroughCommands)
		.sort();

const addPluginCommand = (packageInfo, command, func) => {
	func.packageInfo = packageInfo;
	pluginCommands.set(command, func);
};

export default {
	addPluginCommand,
	getCommands,
	pluginCommands,
	userInputs,
};

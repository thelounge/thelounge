const clientSideCommands = ["/collapse", "/expand"];

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
].reduce(function(plugins, name) {
	const plugin = require(`./${name}`);
	plugin.commands.forEach((command) => (plugins[command] = plugin));
	return plugins;
}, {});

const getCommands = () =>
	Object.keys(userInputs)
		.map((command) => `/${command}`)
		.concat(clientSideCommands)
		.concat(passThroughCommands)
		.sort();

module.exports = {
	getCommands,
	userInputs,
};

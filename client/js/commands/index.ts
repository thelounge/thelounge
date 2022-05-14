// Taken from views/index.js

// This creates a version of `require()` in the context of the current
// directory, so we iterate over its content, which is a map statically built by
// Webpack.
// Second argument says it's recursive, third makes sure we only load javascript.
const commands = require.context("./", true, /\.ts$/);

export default commands.keys().reduce<Record<string, unknown>>((acc, path) => {
	const command = path.substring(2, path.length - 3);

	if (command === "index") {
		return acc;
	}

	acc[command] = commands(path).default;

	return acc;
}, {});

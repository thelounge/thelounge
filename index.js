#!/usr/bin/env node

const fs = require("fs");

if (fs.existsSync("./src/dist/src/index.js")) {
	require("./src/dist/src/index.js");
} else {
	// eslint-disable-next-line no-console
	console.error(
		"Files in ./src/dist/src/ not found. Please run `yarn build` before trying to run `node index.js`."
	);

	process.exit(1);
}

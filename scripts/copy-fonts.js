"use strict";

const fs = require("fs");
const path = require("path");

const src = path.join("node_modules", "@fortawesome", "fontawesome-free", "webfonts");
const dest = path.join("client", "public", "fonts");

fs.mkdirSync(dest, {recursive: true});

for (const file of fs.readdirSync(src)) {
	if (file.startsWith("fa-solid-900.woff")) {
		fs.copyFileSync(path.join(src, file), path.join(dest, file));
	}
}

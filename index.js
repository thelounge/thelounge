#!/usr/bin/env node

import {existsSync} from "node:fs";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
import semver from "semver";
import pkg from "./package.json" assert {type: "json"};

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");

process.chdir(__dirname);

const requiredNodeVersion = pkg.engines?.node ?? "";

if (!semver.satisfies(process.version, requiredNodeVersion)) {
    /* eslint-disable no-console */
    console.error(
        "The Lounge requires Node.js " +
            requiredNodeVersion +
            " (current version: " +
            process.version +
            ")"
    );
    console.error("Please upgrade Node.js in order to use The Lounge");
    console.error("See https://thelounge.chat/docs/install-and-upgrade");
    console.error();

    process.exit(1);
}

const distEntry = resolve(__dirname, "./dist/server/index.js");

if (existsSync(distEntry)) {
    await import("./dist/server/index.js");
} else {
    console.error(
        "Files in ./dist/server/ not found. Please run `yarn build` before trying to run `node index.js`."
    );

    process.exit(1);
}

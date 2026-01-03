import * as path from "path";
import {fileURLToPath} from "url";
import config from "../../server/config.js";
import log from "../../server/log.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const home = path.join(__dirname, ".thelounge");

config.setHome(home).catch((err) => {
	log.error("Failed to set home directory:", err);
	process.exit(1);
});

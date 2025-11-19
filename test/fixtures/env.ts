import * as path from "path";
import {fileURLToPath} from "url";
import config from "../../server/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const home = path.join(__dirname, ".thelounge");

config.setHome(home).catch((err) => {
	console.error("Failed to set home directory:", err);
	process.exit(1);
});

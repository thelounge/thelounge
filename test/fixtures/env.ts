import * as path from "path";
const home = path.join(__dirname, ".thelounge");

import config from "../../src/config";
config.setHome(home);

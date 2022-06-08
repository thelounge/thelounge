import * as path from "path";
const home = path.join(__dirname, ".thelounge");

import config from "../../server/config";
config.setHome(home);

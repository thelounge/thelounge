import * as path from "path";
const home = path.join(process.cwd(), "test", "fixtures", ".thelounge");

import config from "../../server/config";
config.setHome(home);

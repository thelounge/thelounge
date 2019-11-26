"use strict";

import dayjs from "dayjs";

export default (time) => dayjs(time).format("D MMMM YYYY, HH:mm:ss");

"use strict";

import dayjs from "dayjs";

export const localetime = function(time) {
	return dayjs(time).format("D MMMM YYYY, HH:mm:ss");
};

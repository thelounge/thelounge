"use strict";

import socket from "../socket";
import store from "../store";

socket.on("mentions:list", function (data) {
	store.commit("mentions", data);
});

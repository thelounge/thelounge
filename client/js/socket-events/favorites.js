"use strict";

import socket from "../socket";
import store from "../store";

socket.on("favorites", function (data) {
	console.log("favorites", data);

	store.commit("favoriteChannels", data.favoriteChannels);
});

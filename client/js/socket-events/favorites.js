"use strict";

import socket from "../socket";
import store from "../store";

socket.on("favorites", function (data) {
	store.commit("favoriteChannels", data.favoriteChannels);
});

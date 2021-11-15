"use strict";

import store from "../store";
import {router} from "../router";

function input(args) {
	if (!store.state.settings.searchEnabled) {
		return false;
	}

	router.push({
		name: "SearchResults",
		params: {
			id: store.state.activeChannel.channel.id,
		},
		query: {
			q: args.join(" "),
		},
	});

	return true;
}

export default {input};

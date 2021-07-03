"use strict";

import store from "../store";
import {router} from "../router";

function input(args) {
	if (!store.state.settings.searchEnabled) {
		store.commit("currentUserVisibleError", "Search is currently not enabled.");
	} else {
		router.push({
			name: "SearchResults",
			params: {
				id: store.state.activeChannel.channel.id,
			},
			query: {
				q: args.join(" "),
			},
		});
	}

	return true;
}

export default {input};

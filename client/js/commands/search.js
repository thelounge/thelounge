"use strict";

import store from "../store";
import {router} from "../router";

function input(args) {
	if (!store.state.settings.searchEnabled) {
		const disabled = "Search is currently not enabled.";
		store.commit("currentUserVisibleError", disabled);
		setTimeout(
			() =>
				store.state.currentUserVisibleError === disabled &&
				store.commit("currentUserVisibleError", null),
			5000
		);
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

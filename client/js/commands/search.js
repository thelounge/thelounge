"use strict";

import store from "../store";
import {router} from "../router";

function input(args) {
	if (!store.state.settings.searchEnabled) {
		return true;
	}

	const {channel} = store.state.activeChannel;
	router.push({
		name: "SearchResults",
		params: {
			id: channel.id,
		},
		query: {
			q: args.join(" "),
		},
	});

	return true;
}

export default {input};

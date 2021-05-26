"use strict";

import store from "../store";
import {router} from "../router";

function input(args) {
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

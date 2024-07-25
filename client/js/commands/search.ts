import {store} from "../store";
import {router} from "../router";

export function input(args: string[]): boolean {
	if (!store.state.settings.searchEnabled) {
		return false;
	}

	router
		.push({
			name: "SearchResults",
			params: {
				id: store.state.activeChannel?.channel.id,
			},
			query: {
				q: args.join(" "),
			},
		})
		.catch((e: Error) => {
			// eslint-disable-next-line no-console
			console.error(`Failed to push SearchResults route: ${e.message}`);
		});

	return true;
}

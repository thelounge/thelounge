import {combineReducers} from "redux";

import * as actions from "./actions";
import {updateId, updateIn, setIn} from "./immutableUtils";

import networks from "./reducers/networks";
import channels from "./reducers/channels";
import activeChannelId from "./reducers/activeChannelId";
import unreadTracking from "./reducers/unreadTracking";
import messagePruning from "./reducers/messagePruning";

function activeWindowId(state = "loading", action) {
	switch (action.type) {
	case actions.CHANGE_ACTIVE_WINDOW:
		return action.windowId;
	default:
		return state;
	}
}

function reduceReducers(...reducers) {
	return (state, action) =>
		reducers.reduce(
			(s, r) => r(s, action),
			state
		);
}

const app =
	reduceReducers(
		unreadTracking,
		messagePruning,
		combineReducers({
			activeChannelId,
			activeWindowId,
			networks,
			channels,
		})
	);

export default app;

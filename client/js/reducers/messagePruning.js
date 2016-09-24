import * as actions from "../actions";
import {updateIn} from "../immutableUtils";

function pruneChannelHistory(channel) {
	return {
		...channel,
		messages: channel.messages.slice(-100),
		hasMore: channel.messages.length > 100
	};
}

export default function messagePruning(state, action) {
	switch (action.type) {
	case actions.MESSAGE_RECEIVED: {
		let {channelId} = action;
		if (channelId !== state.activeChannelId) {
			return updateIn(state, ["channels", channelId], pruneChannelHistory);
		} else {
			return state;
		}
	}

	case actions.CHANGE_ACTIVE_CHANNEL: {
		let {channelId} = action;
		if (state.activeChannelId in state.channels && channelId !== state.activeChannelId) {
			return updateIn(state, ["channels", state.activeChannelId], pruneChannelHistory);
		} else {
			return state;
		}
	}

	default:
		return state;
	}
}

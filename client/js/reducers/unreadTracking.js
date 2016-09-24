import * as actions from "../actions";
import {updateIn, setIn} from "../immutableUtils";

const unreadCountIncreasingTypes = new Set([
	"message",
	"notice",
	"action",
]);
export default function unreadTracking(state, action) {
	switch (action.type) {
	case actions.MESSAGE_RECEIVED: {
		let {channelId, message} = action;
		if (message.self) {
			// TODO: should this also reset highlight and unread count?
			return setIn(state, ["channels", channelId, "firstUnread"], 0);
		} else if (channelId !== state.activeChannelId) {
			let channel = state.channels[channelId];
			let newChannel = {
				...channel,
				unread: channel.unread + (unreadCountIncreasingTypes.has(message.type) ? 1 : 0),
				highlight: channel.highlight || message.highlight,
				firstUnread: channel.firstUnread === 0 ? message.id : channel.firstUnread
			};
			return setIn(state, ["channels", channelId], newChannel);
		} else {
			return state;
		}
	}

	case actions.CHANGE_ACTIVE_CHANNEL: {
		let {channelId} = action;
		if (state.activeChannelId in state.channels && channelId !== state.activeChannelId) {
			return updateIn(
				state,
				["channels", state.activeChannelId],
				chan => ({...chan, firstUnread: 0, unread: 0, highlight: false})
			);
		} else {
			return state;
		}
	}

	default:
		return state;
	}
}

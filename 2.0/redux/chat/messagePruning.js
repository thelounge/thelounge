import {
	MESSAGE_RECEIVED,
	CHANGE_ACTIVE_CHANNEL
} from './actions';


export const pruneChannelHistory = (channel) => {
	return {
		...channel,
		messages: channel.messages.slice(-100),
		hasMore: channel.messages.length > 100
	};
};


// FIXME: no default state
export default function (state, action) {
	switch (action.type) {
	case MESSAGE_RECEIVED: {
		let {channelId} = action;
		if (channelId !== state.activeChannelId) {
			return updateIn(state, ['channels', channelId], pruneChannelHistory);
		} else {
			return state;
		}
	}

	case CHANGE_ACTIVE_CHANNEL: {
		let {channelId} = action;
		if (state.activeChannelId in state.channels && channelId !== state.activeChannelId) {
			return updateIn(state, ['channels', state.activeChannelId], pruneChannelHistory);
		} else {
			return state;
		}
	}

	default:
		return state;
	}
}

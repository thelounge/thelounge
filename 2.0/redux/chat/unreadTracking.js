import {
	MESSAGE_RECEIVED,
	CHANGE_ACTIVE_CHANNEL
} from './actions';


// FIXME: no default state
export default function (state, action) {
	switch (action.type) {
	case MESSAGE_RECEIVED: {
		let {channelId, message} = action;
		let channel = state.channels[channelId];
		let firstUnread = channel.firstUnread;
		if (channelId !== state.activeChannelId && channel.firstUnread === 0) {
			firstUnread = message.id;
		}
		if (message.self) {
			firstUnread = 0;
		}
		return setIn(state, ['channels', channelId, 'firstUnread'], firstUnread);
	}

	case CHANGE_ACTIVE_CHANNEL: {
		let {channelId} = action;
		if (state.activeChannelId in state.channels && channelId !== state.activeChannelId) {
			return setIn(state, ['channels', state.activeChannelId, 'firstUnread'], 0);
		} else {
			return state;
		}
	}

	default:
		return state;
	}
}

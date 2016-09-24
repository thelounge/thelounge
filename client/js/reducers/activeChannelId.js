import * as actions from "../actions";

export default function activeChannelId(state = null, action) {
	switch (action.type) {
	case actions.INITIAL_DATA_RECEIVED:
		return action.data.active;  // TODO: what if active is undefined / not in the channel list?
	case actions.CHANGE_ACTIVE_CHANNEL:
		return action.channelId;
	case actions.JOINED_NETWORK: {
		let {networkInitialData: {channels}} = action;
		return channels[channels.length - 1].id;
	}
	case actions.JOINED_CHANNEL: {
		let {networkId, channelInitialData} = action;
		if (channelInitialData.type !== "query" || channelInitialData.shouldOpen) {
			return channelInitialData.id;
		} else {
			return state;
		}
	}

	default:
		return state;
	}
}

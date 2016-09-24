import * as actions from "../actions";
import {updateIn} from "../immutableUtils";

function channel(state, action) {
	switch(action.type) {
	case actions.RECEIVED_CHANNEL_USERS:
		return {
			...state,
			users: action.users,
			needsNamesRefresh: false
		};

	case actions.CHANNEL_USERS_INVALIDATED:
		return {...state, needsNamesRefresh: true};

	case actions.TOPIC_CHANGED:
		return {...state, topic: action.topic};

	case actions.MESSAGE_RECEIVED:
		return {...state, messages: state.messages.concat([action.message])};

	case actions.RECEIVED_MORE: {
		let {messages} = action;
		let existingIds = new Set(state.messages.map(m => m.id));
		let newMsgs = messages.filter(m => !existingIds.has(m.id));
		let hasMore = messages.length === 100;
		return {...state, messages: newMsgs.concat(state.messages), hasMore};
	}

	case actions.CLEAR_CHANNEL:
		return {...state, messages: [], hasMore: true};

	default:
		return state;
	}
}

export default function channels(state = {}, action) {
	switch (action.type) {
	case actions.INITIAL_DATA_RECEIVED: {
		let channels = {};
		for (let network of action.data.networks) {
			for (let channel of network.channels) {
				channels[channel.id] = {...channel, networkId: network.id};
			}
		}
		return channels;
	}

	case actions.JOINED_NETWORK: {
		let {networkInitialData: {channels, id: networkId}} = action;
		let newChannels = {...state};
		for (let chan of channels) {
			newChannels[chan.id] = {...chan, networkId};
		}
		return newChannels;
	}

	case actions.LEFT_NETWORK: {
		let {networkId} = action;
		let newChannels = {};
		for (let channelId in state) {
			let channel = state[channelId];
			if (channel.networkId !== networkId) {
				newChannels[channelId] = channel;
			}
		}
		return newChannels;
	}

	case actions.JOINED_CHANNEL: {
		let {channelInitialData, networkId} = action;
		return {
			...state,
			[channelInitialData.id]: {...channelInitialData, networkId}
		};
	}

	case actions.LEFT_CHANNEL: {
		let {channelId} = action;
		let newChannels = {...state};
		delete newChannels[channelId];
		return newChannels;
	}

	default:
		if (action.channelId != null) {
			return {
				...state,
				[action.channelId]: channel(state[action.channelId], action)
			};
		}
		return state;
	}
}

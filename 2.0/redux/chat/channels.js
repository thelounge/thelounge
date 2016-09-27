import { getState } from 'clientUI/redux/store';
import {
	INITIAL_DATA_RECEIVED,
	JOINED_NETWORK,
	LEFT_NETWORK,
	JOINED_CHANNEL,
	LEFT_CHANNEL,
	RECEIVED_CHANNEL_USERS,
	CHANNEL_USERS_INVALIDATED,
	TOPIC_CHANGED,
	RECEIVED_MORE,
	CLEAR_CHANNEL,
	MESSAGE_RECEIVED
} from './actions';


export const getChannel = (channelId) => {
	return getState().chat.channels[channelId];
};


// Reducers
const DEFAULT_STATE = {};

export default function (state = DEFAULT_STATE, action) {
	switch (action.type) {
	case INITIAL_DATA_RECEIVED: {
		let channels = {};
		for (let network of action.data.networks) {
			for (let channel of network.channels) {
				channels[channel.id] = {...channel, networkId: network.id};
			}
		}
		return channels;
	}

	case JOINED_NETWORK: {
		let {networkInitialData: {channels, id: networkId}} = action;
		let newChannels = {...state};
		for (let chan of channels) {
			newChannels[chan.id] = {...chan, networkId};
		}
		return newChannels;
	}

	case LEFT_NETWORK: {
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

	case JOINED_CHANNEL: {
		let {channelInitialData, networkId} = action;
		return {
			...state,
			[channelInitialData.id]: {...channelInitialData, networkId}
		};
	}

	case LEFT_CHANNEL: {
		let {channelId} = action;
		let newChannels = {...state};
		delete newChannels[channelId];
		return newChannels;
	}

	case RECEIVED_CHANNEL_USERS: {
		let {channelId, users} = action;
		state[channelId] = {
			...state[channelId],
			users,
			needsNamesRefresh: false
		};
		return state;
	}

	case CHANNEL_USERS_INVALIDATED: {
		let {channelId} = action;
		state[channelId] = {
			...state[channelId],
			needsNamesRefresh: true
		};
		return state;
	}

	case TOPIC_CHANGED: {
		let {channelId, topic} = action;
		state[channelId] = {
			...state[channelId],
			topic
		};
		return state;
	}

	case MESSAGE_RECEIVED: {
		let {channelId, message} = action;
		const channel = state[channelId];
		channel.messages = channel.messages.concat([message]);
		return state;
	}

	case RECEIVED_MORE: {
		let {channelId, messages} = action;
		let channel = state[channelId];
		let existingIds = new Set(channel.messages.map(m => m.id));
		let newMsgs = messages.filter(m => !existingIds.has(m.id));
		let hasMore = messages.length === 100;
		channel = {...channel, messages: newMsgs.concat(channel.messages), hasMore};
		return {...state, [channelId]: channel};
	}

	case CLEAR_CHANNEL: {
		let {channelId} = action;
		state[channelId] = {
			...state[channelId],
			messages: [],
			hasMore: true
		};
		return state;
	}

	default:
		return state;
	}
}

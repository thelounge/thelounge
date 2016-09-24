import { combineReducers } from 'redux';

import unreadTracking from './unreadTracking';
import messagePruning from './messagePruning';

import {
	INITIAL_DATA_RECEIVED,
	JOINED_NETWORK,
	LEFT_NETWORK,
	JOINED_CHANNEL,
	LEFT_CHANNEL,
	RECEIVED_CHANNEL_USERS,
	REQUEST_NAMES,
	CHANNEL_USERS_INVALIDATED,
	TOPIC_CHANGED,
	MESSAGE_RECEIVED,
	CHANGE_ACTIVE_CHANNEL,
	REQUEST_MORE,
	RECEIVED_MORE,
	CLEAR_CHANNEL
} from './actions';


// Action generators
export function initialDataReceived(data) {
	return {type: INITIAL_DATA_RECEIVED, data};
}

export function joinedNetwork(networkInitialData) {
	return {type: JOINED_NETWORK, networkInitialData};
}

export function leftNetwork(networkId) {
	return {type: LEFT_NETWORK, networkId};
}

export function joinedChannel(networkId, channelInitialData) {
	return {type: JOINED_CHANNEL, networkId, channelInitialData};
}

export function leftChannel(channelId) {
	return {type: LEFT_CHANNEL, channelId};
}

export function receivedChannelUsers(channelId, users) {
	return {type: RECEIVED_CHANNEL_USERS, channelId, users};
}

export function refreshNames(channelId) {
	return {
		type: REQUEST_NAMES,
		channelId,
		meta: {
			socket: {
				channel: 'names',
				data: {
					target: channelId
				}
			}
		}
	};
}

export function channelOpened(channelId) {
	return (dispatch, getState) => {
		let channel = getState().channels[channelId];
		if (channel.needsNamesRefresh) {
			dispatch(refreshNames(channelId));
		}
	};
}

export function channelUsersChanged(channelId) {
	return (dispatch, getState) => {
		if (channelId === getState().activeChannelId) {
			dispatch(refreshNames(channelId));
		} else {
			dispatch({type: CHANNEL_USERS_INVALIDATED, channelId});
		}
	};
}

export function topicChanged(channelId, topic) {
	return {type: TOPIC_CHANGED, channelId, topic};
}

export function messageReceived(channelId, message) {
	return {type: MESSAGE_RECEIVED, channelId, message};
}

export function changeActiveChannel(channelId = null) {
	return {type: CHANGE_ACTIVE_CHANNEL, channelId};
}

export function requestMore(channelId) {
	return (dispatch, getState) => {
		dispatch({
			type: REQUEST_MORE,
			channelId,
			meta: {
				socket: {
					channel: 'more',
					data: {
						target: channelId,
						count: getState().channels[channelId].messages.length
					}
				}
			}
		});
	};
}

export function receivedMore(channelId, messages) {
	return {type: RECEIVED_MORE, channelId, messages};
}

export function clearChannel(channelId) {
	return {type: CLEAR_CHANNEL, channelId};
}


// Update `list` by replacing the element `el` with `el.id == targetId` by `f(el)`.
function updateId(list, targetId, f) {
	return list.map(el => el.id === targetId ? f(el) : el);
}

function setIn(obj, selectors, value) {
	return updateIn(obj, selectors, () => value);
}

function updateIn(obj, [selector, ...rest], fn) {
	return {
		...obj,
		[selector]:
			rest.length
				? updateIn(obj[selector], rest, fn)
				: fn(obj[selector])
	};
}

function normalizeNetwork(network) {
	return updateIn(network, ['channels'], cs => cs.map(c => c.id));
}

// Reducers
// FIXME: no default state
function networks(state = [], action) {
	switch (action.type) {
	case INITIAL_DATA_RECEIVED: {
		return action.data.networks.map(normalizeNetwork);
	}

	case JOINED_NETWORK: {
		let {networkInitialData} = action;
		return state.concat([normalizeNetwork(networkInitialData)]);
	}

	case LEFT_NETWORK: {
		let {networkId} = action;
		return state.filter(n => n.id !== networkId);
	}

	case JOINED_CHANNEL: {
		let {channelInitialData: {id: channelId}, networkId} = action;
		return updateId(state, networkId, n =>
				({...n, channels: n.channels.concat([channelId])})
			);
	}

	case LEFT_CHANNEL: {
		let {channelId} = action;
		return state.map(n =>
				({...n, channels: n.channels.filter(c => c.id !== channelId)})
			);
	}

	default:
		return state;
	}
}

// FIXME: no default state
function channels(state = {}, action) {
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
		return updateIn(state, [channelId], chan => ({...chan, users, needsNamesRefresh: false}));
	}

	case CHANNEL_USERS_INVALIDATED: {
		let {channelId} = action;
		return setIn(state, [channelId, 'needsNamesRefresh'], true);
	}

	case TOPIC_CHANGED: {
		let {channelId, topic} = action;
		return setIn(state, [channelId, 'topic'], topic);
	}

	case MESSAGE_RECEIVED: {
		let {channelId, message} = action;
		return updateIn(state, [channelId, 'messages'], ms => ms.concat([message]));
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
		return updateIn(state, [channelId], channel => ({...channel, messages: [], hasMore: true}));
	}

	default:
		return state;
	}
}

// FIXME: no default state
function activeChannelId(state = null, action) {
	switch (action.type) {
	case CHANGE_ACTIVE_CHANNEL:
		return action.channelId;

	default:
		return state;
	}
}


const reducers = combineReducers({
	unreadTracking,
	messagePruning,
	activeChannelId,
	networks,
	channels,
});


export default reducers;

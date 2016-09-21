import {combineReducers} from "redux";

import * as actions from "./actions";

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
	return updateIn(network, ["channels"], cs => cs.map(c => c.id));
}

function networks(state = [], action) {
	switch (action.type) {
	case actions.INITIAL_DATA_RECEIVED: {
		return action.data.networks.map(normalizeNetwork);
	}

	case actions.JOINED_NETWORK: {
		let {networkInitialData} = action;
		return state.concat([normalizeNetwork(networkInitialData)]);
	}

	case actions.LEFT_NETWORK: {
		let {networkId} = action;
		return state.filter(n => n.id !== networkId);
	}

	case actions.JOINED_CHANNEL: {
		let {channelInitialData: {id: channelId}, networkId} = action;
		return updateId(state, networkId, n =>
				({...n, channels: n.channels.concat([channelId])})
			);
	}

	case actions.LEFT_CHANNEL: {
		let {channelId} = action;
		return state.map(n =>
				({...n, channels: n.channels.filter(c => c.id !== channelId)})
			);
	}

	default:
		return state;
	}
}

function channels(state = {}, action) {
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

	case actions.RECEIVED_CHANNEL_USERS: {
		let {channelId, users} = action;
		return setIn(state, [channelId, "users"], users);
	}

	case actions.REQUESTED_NAMES: {
		let {channelId} = action;
		return setIn(state, [channelId, "needsNamesRefresh"], false);
	}

	case actions.CHANNEL_USERS_INVALIDATED: {
		let {channelId} = action;
		return setIn(state, [channelId, "needsNamesRefresh"], true);
	}

	case actions.TOPIC_CHANGED: {
		let {channelId, topic} = action;
		return setIn(state, [channelId, "topic"], topic);
	}

	case actions.MESSAGE_RECEIVED: {
		let {channelId, message} = action;
		return updateIn(state, [channelId, "messages"], ms => ms.concat([message]));
	}

	case actions.RECEIVED_MORE: {
		let {channelId, messages} = action;
		let channel = state[channelId];
		let existingIds = new Set(channel.messages.map(m => m.id));
		let newMsgs = messages.filter(m => !existingIds.has(m.id));
		let hasMore = messages.length === 100;
		channel = {...channel, messages: newMsgs.concat(channel.messages), hasMore};
		return {...state, [channelId]: channel};
	}

	case actions.CLEAR_CHANNEL: {
		let {channelId} = action;
		return updateIn(state, [channelId], channel => ({...channel, messages: [], hasMore: true}));
	}

	default:
		return state;
	}
}

function activeChannelId(state = undefined, action) {
	switch (action.type) {
	case actions.CHANGE_ACTIVE_CHANNEL:
		return action.channelId;

	default:
		return state;
	}
}

function unreadTracking(state, action) {
	switch (action.type) {
	case actions.MESSAGE_RECEIVED: {
		let {channelId, message} = action;
		let channel = state.channels[channelId];
		let firstUnread = channel.firstUnread;
		if (channelId !== state.activeChannelId && channel.firstUnread === 0) {
			firstUnread = message.id;
		}
		if (message.self) {
			firstUnread = 0;
		}
		return setIn(state, ["channels", channelId, "firstUnread"], firstUnread);
	}

	case actions.CHANGE_ACTIVE_CHANNEL: {
		let {channelId} = action;
		if (state.activeChannelId in state.channels && channelId !== state.activeChannelId) {
			return setIn(state, ["channels", state.activeChannelId, "firstUnread"], 0);
		} else {
			return state;
		}
	}

	default:
		return state;
	}
}

function pruneChannelHistory(channel) {
	updateIn(channel, ["messages"], ms => ms.slice(ms.length - 100));
}

function messagePruning(state, action) {
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
			networks,
			channels,
		})
	);

export default app;

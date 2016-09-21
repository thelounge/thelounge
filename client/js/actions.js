export const INITIAL_DATA_RECEIVED = "INITIAL_DATA_RECEIVED";
export const JOINED_NETWORK = "JOINED_NETWORK";
export const LEFT_NETWORK = "LEFT_NETWORK";
export const JOINED_CHANNEL = "JOINED_CHANNEL";
export const LEFT_CHANNEL = "LEFT_CHANNEL";
export const RECEIVED_CHANNEL_USERS = "RECEIVED_CHANNEL_USERS";
export const RECEIVED_MORE = "RECEIVED_MORE";
export const CHANGE_ACTIVE_CHANNEL = "CHANGE_ACTIVE_CHANNEL";
export const MESSAGE_RECEIVED = "MESSAGE_RECEIVED";
export const TOPIC_CHANGED = "TOPIC_CHANGED";
export const CHANNEL_USERS_INVALIDATED = "CHANNEL_USERS_INVALIDATED";
export const REQUESTED_NAMES = "REQUESTED_NAMES";
export const CLEAR_CHANNEL = "CLEAR_CHANNEL";
export const EMIT = "EMIT";

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

export function emit(name, payload) {
	return {type: EMIT, name, payload};
}

export function requestedNames(channelId) {
	return {type: REQUESTED_NAMES, channelId};
}

export function refreshNames(channelId) {
	return emit("names", {target: channelId});
}

export function channelOpened(channelId) {
	return (dispatch, getState) => {
		let channel = getState().channels[channelId];
		if (channel.needsNamesRefresh) {
			dispatch(requestedNames(channelId));
			dispatch(refreshNames(channelId));
		}
	};
}

export function channelUsersChanged(channelId) {
	return (dispatch, getState) => {
		if (channelId === getState().activeChannelId) {
			return dispatch(refreshNames(channelId));
		} else {
			return dispatch({type: CHANNEL_USERS_INVALIDATED, channelId});
		}
	};
}

export function topicChanged(channelId, topic) {
	return {type: TOPIC_CHANGED, channelId, topic};
}

export function messageReceived(channelId, message) {
	return {type: MESSAGE_RECEIVED, channelId, message};
}

export function changeActiveChannel(channelId) {
	return {type: CHANGE_ACTIVE_CHANNEL, channelId};
}

export function requestMore(channelId) {
	return function(dispatch, getState) {
		dispatch(emit("more", {
			target: channelId,
			count: getState().channels[channelId].messages.length
		}));
	};
}

export function receivedMore(channelId, messages) {
	return {type: RECEIVED_MORE, channelId, messages};
}

export function clearChannel(channelId) {
	return {type: CLEAR_CHANNEL, channelId};
}

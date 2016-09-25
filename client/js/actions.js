export const INITIAL_DATA_RECEIVED = "INITIAL_DATA_RECEIVED";
export const JOINED_NETWORK = "JOINED_NETWORK";
export const LEFT_NETWORK = "LEFT_NETWORK";
export const JOINED_CHANNEL = "JOINED_CHANNEL";
export const LEFT_CHANNEL = "LEFT_CHANNEL";
export const LEAVE_CHANNEL = "LEAVE_CHANNEL";
export const LEAVE_NETWORK = "LEAVE_NETWORK";
export const RECEIVED_CHANNEL_USERS = "RECEIVED_CHANNEL_USERS";
export const REQUEST_MORE = "REQUEST_MORE";
export const RECEIVED_MORE = "RECEIVED_MORE";
export const CHANGE_ACTIVE_CHANNEL = "CHANGE_ACTIVE_CHANNEL";
export const MESSAGE_RECEIVED = "MESSAGE_RECEIVED";
export const TOPIC_CHANGED = "TOPIC_CHANGED";
export const CHANNEL_USERS_INVALIDATED = "CHANNEL_USERS_INVALIDATED";
export const REQUEST_NAMES = "REQUEST_NAMES";
export const CLEAR_CHANNEL = "CLEAR_CHANNEL";
export const NICK_CHANGED = "NICK_CHANGED";
export const CHANGE_ACTIVE_WINDOW = "CHANGE_ACTIVE_WINDOW";

export function initialDataReceived(data) {
	return {type: INITIAL_DATA_RECEIVED, data};
}

export function joinedNetwork(networkInitialData) {
	return (dispatch) => {
		dispatch(changeActiveWindow("chat-container"));
		dispatch({type: JOINED_NETWORK, networkInitialData});
	};
}

export function leftNetwork(networkId) {
	return (dispatch, getState) => {
		let currentChannel = getState().channels[getState().activeChannelId];
		if (currentChannel && currentChannel.networkId === networkId) {
			let currentNetworkIdx = getState().networks.indexOf(getState().networks.find(n => n.id === networkId));
			let nextNetworkIdx = Math.max(0, currentNetworkIdx - 1);
			let nextNetwork = getState().networks.filter(n => n.id !== networkId)[nextNetworkIdx];
			if (nextNetwork) {
				dispatch(changeActiveChannel(nextNetwork.channels[0]));
			} else {
				// TODO: ???
			}
		}
		dispatch({type: LEFT_NETWORK, networkId});
	};
}

export function joinedChannel(networkId, channelInitialData) {
	return {type: JOINED_CHANNEL, networkId, channelInitialData};
}

export function leftChannel(channelId) {
	return (dispatch, getState) => {
		if (channelId === getState().activeChannelId) {
			let networkId = getState().channels[channelId].networkId;
			let nextChannelId = getState().networks.find(n => n.id === networkId).channels[0];
			dispatch(changeActiveChannel(nextChannelId));
		}
		dispatch({type: LEFT_CHANNEL, channelId});
	};
}

export function receivedChannelUsers(channelId, users) {
	return {type: RECEIVED_CHANNEL_USERS, channelId, users};
}

export function refreshNames(channelId) {
	return {type: REQUEST_NAMES, channelId, meta: {socket: {channel: "names", data: {target: channelId}}}};
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
	return (dispatch, getState) => {
		if (getState().activeWindowId !== "chat-container") {
			dispatch(changeActiveWindow("chat-container"));
		}
		let channel = getState().channels[channelId];
		if (channel.needsNamesRefresh) {
			dispatch(refreshNames(channelId));
		}
		dispatch({
			type: CHANGE_ACTIVE_CHANNEL,
			channelId,
			meta: {socket: {channel: "open", data: channelId}}
		});
	};
}

export function requestMore(channelId) {
	return (dispatch, getState) => {
		dispatch({
			type: REQUEST_MORE,
			channelId,
			meta: {
				socket: {
					channel: "more",
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

export function leaveNetwork(lobbyChannelId) {
	return {
		type: LEAVE_NETWORK,
		meta: {
			socket: {
				channel: "input",
				data: {
					target: lobbyChannelId,
					text: "/quit"
				}
			}
		}
	};
}
export function leaveChannel(channelId) {
	return {
		type: LEAVE_CHANNEL,
		meta: {
			socket: {
				channel: "input",
				data: {
					target: channelId,
					text: "/close"
				}
			}
		}
	};
}

export function surfChannel(delta) {
	return (dispatch, getState) => {
		let {activeChannelId, networks} = getState();
		let allChannelIds = networks.reduce(((cs, n) => cs.concat(n.channels)), []);
		let activeChannelIdx = allChannelIds.indexOf(activeChannelId);
		let nextChannelIdx = activeChannelIdx + delta;
		while (nextChannelIdx >= allChannelIds.length) {
			nextChannelIdx -= allChannelIds.length;
		}
		while (nextChannelIdx < 0) {
			nextChannelIdx += allChannelIds.length;
		}
		let nextChannelId = allChannelIds[nextChannelIdx];
		dispatch(changeActiveChannel(nextChannelId));
	};
}

export function nickChanged(networkId, nick) {
	return {type: NICK_CHANGED, networkId, nick};
}

export function changeActiveWindow(windowId) {
	return {type: CHANGE_ACTIVE_WINDOW, windowId};
}

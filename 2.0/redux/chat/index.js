import { combineReducers } from 'redux';

import * as unreadTracking from './unreadTracking';
import * as messagePruning from './messagePruning';

import networks from './networks';
import channels from './channels';

import {
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

export const changeActiveChannel = (channelId = null) => (
	{ type: CHANGE_ACTIVE_CHANNEL, channelId }
);

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


// Reducer!
const DEAFULT_STATE = {
	activeChannelId: -1,
	activeWindowId: ''
};

const reducer = (state = DEAFULT_STATE, action) => {
	switch (action.type) {
	case CHANGE_ACTIVE_CHANNEL: {
		const newState = {
			...state,
			activeChannelId: action.channelId
		};
		// TODO: move these in to proper reducers again
		unreadTracking.onChangeActiveChannel(newState, action);
		messagePruning.onChangeActiveChannel(newState, action);
		return newState;
	}

	// case MESSAGE_RECEIVED: {
	// 	const newState = Object.assign({}, state);
	// 	let {channelId, message} = action;
	// 	// TODO: each channel should have a reducer
	// 	const channel = state.channels[channelId];
	// 	channel.messages = channel.messages.map(ms => ms.concat([message]));
	// 	unreadTracking.onMessageReceived(newState, action);
	// 	messagePruning.onMessageReceived(newState, action);
	// 	return newState;
	// }

	default:
		return state;
	}
};


const childReducers = combineReducers({
	networks,
	channels,
});


export default function (state, action) {
	let newState = reducer(state, action);
	newState = childReducers(newState, action);
	return newState;
}

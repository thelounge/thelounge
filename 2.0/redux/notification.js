import { getState } from 'clientUI/redux/store';
import { playPop } from 'clientUI/Audio';


// Actions
export const ADD = 'notification/ADD';


// Aciton Generators
export const add = (notification) => (
	{ type: ADD, value: notification }
);

export const notify = (chan, msg) => {
	const state = getState();

	if (state.options.notification) {
		playPop();
	}

	let channel = state.chat.channels[chan];
	// toggleNotificationMarkers(true);

	if (
		state.options.desktopNotifications &&
		state.notification.permission === PERMISSIONS.GRANTED
	) {
		let title;
		let body;

		if (msg.type === 'invite') {
			title = 'New channel invite:';
			body = msg.from + ' invited you to ' + msg.channel;
		} else {
			title = msg.from;
			if (channel.type !== 'query') {
				title += ' (' + channel.name.trim() + ')';
			}
			title += ' says:';
			body = msg.text.replace(/\x02|\x1D|\x1F|\x16|\x0F|\x03(?:[0-9]{1,2}(?:,[0-9]{1,2})?)?/g, '').trim();
		}

		add({
			title: title,
			body: body,
			icon: require('clientUI/img/logo-64.png')
			// tag: target
		});
	}
};

export const maybeNotify = (chan, msg) => {
	const state = getState();

	let isImportantMessage = (
		!msg.self &&
		(
			msg.highlight || (
				state.options.notifyAllMessages &&
				msg.type === 'message'
			)
		)
	);
	let { activeChannelId, activeWindowId } = state.chat;
	let chanHasFocus = (
		document.hasFocus() &&
		activeWindowId === 'chat-container' &&
		chan === activeChannelId
	);

	if (isImportantMessage && !chanHasFocus) {
		notify(chan, msg);
	}
};

const PERMISSIONS = {
	NONE: 'none',
	GRANTED: 'granted',
	DENIED: 'denied',
	DEFAULT: 'default'
};

// Reducer
const DEFAULT_STATE = {
	queue: [],
	permission: PERMISSIONS.NONE
};

export default function (state = DEFAULT_STATE, action) {
	switch (action.type) {
	case ADD: {
		return {
			...state,
			queue: state.queue.concat([action.value])
		};
	}
	default:
		return state;
	}
}

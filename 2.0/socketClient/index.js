import EventEmitter from 'events';
import url from 'url';
import debug from 'debug';

import io from 'socket.io-client';

import {
	joinedChannel,
	initialDataReceived,
	joinedNetwork,
	nickChanged,
	leftChannel,
	leftNetwork
} from 'clientUI/redux/chat/networks';
import {
	topicChanged,
	changeActiveWindow,
	messageReceived,
	receivedMore,
	channelUsersChanged,
	receivedChannelUsers
} from 'clientUI/redux/chat';
import {
	setLoginEnabled,
	setLoginState,
	setLoginToken,
	getLoginToken,
	getRememberToken,
	setChangePasswordResult,
	setChangePasswordState,
	setLoginError,
	CHANGE_PASSWORD_STATES,
	LOGIN_STATES
} from 'clientUI/redux/auth';
import {
	maybeNotify
} from 'clientUI/redux/notification';
import {
	setLoadingState,
	LOADER_STATES
} from 'clientUI/redux/loader';


class SocketClient extends EventEmitter {
	constructor () {
		super();
		this.logger = debug('lounge:socketClient');
		this.socket = null;
	}

	refresh () {
		window.onbeforeunload = null;
		location.reload();
	}

	getConnectURL () {
		const parsed = url.parse(location.href, true);
		const urlParam = parsed.query && parsed.query.wsURL;
		let host;
		if (urlParam) {
			host = urlParam;
		} else {
			// Fallback to whatever the window pathname is
			host = window.location.pathname + 'socket.io/';
		}
		const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
		return protocol + host;
	}

	connect (socketUrl) {
		if (!socketUrl) {
			socketUrl = this.getConnectURL();
		}
		this.logger('Connecting to:', socketUrl);
		this.socket = io(socketUrl);

		this.socket.on('error', (e) => {
			console.error('Socket error', e);
		});

		this.socket.on('connect_error', () => {
			console.warn('TODO: connect_error');
			// this.refresh();
		});
		this.socket.on('disconnect', () => {
			console.warn('TODO: connect_error');
			// this.refresh();
		});

		this.socket.on('auth', (data) => {
			setLoginEnabled(true);

			if (!data.success) {
				setLoginToken(null);
				setLoginError(null);
			} else {
				const token = getLoginToken();
				if (token) {
					setLoginState(LOGIN_STATES.IN_PROGRESS);
					this.socket.emit('auth', { token: token });
				} else {
					throw new Error('No token to login with');
				}
			}
		});

		this.socket.on('change-password', (data) => {
			if (data.success) {
				setChangePasswordState(CHANGE_PASSWORD_STATES.SUCCESS);
				setChangePasswordResult(data.success);
			} else if (data.error) {
				setChangePasswordState(CHANGE_PASSWORD_STATES.ERROR);
				setChangePasswordResult(data.error);
			}

			if (data.token) {
				setLoginToken(data.token);
			}
		});

		this.socket.on('init', (data) => {
			setLoadingState(LOADER_STATES.DONE);

			if (data.networks.length === 0) {
				changeActiveWindow('connect');
			} else {
				initialDataReceived(data);
				// renderNetworks(data);
			}

			if (data.token && getRememberToken()) {
				setLoginToken(data.token);
			} else {
				setLoginToken(null);
			}
		});

		this.socket.on('join', (data) => {
			joinedChannel(data.network, data.chan);
		});

		const matchesSomeHighlight = (msg) => { // eslint-disable-line
			// TODO: move highlights in to a service
			// return highlights.some(h =>
			// 	msg.text.toLocaleLowerCase().indexOf(h.toLocaleLowerCase()) > -1
			// );
			return false;
		};
		const shouldHighlight = (msg) => {
			return (
				!msg.self &&
				['message', 'notice', 'action'].indexOf(msg.type) >= 0 &&
				matchesSomeHighlight(msg)
			);
		};
		this.socket.on('msg', (data) => {
			data.msg.highlight = data.msg.highlight || shouldHighlight(data.msg);

			messageReceived(data.chan, data.msg);

			maybeNotify(data.chan, data.msg);
		});

		this.socket.on('more', ({chan, messages}) => {
			receivedMore(chan, messages);
		});

		this.socket.on('network', (data) => {
			joinedNetwork(data.network);
		});

		this.socket.on('network_changed', (data) => {
			// sidebar.find('#network-' + data.network).data('options', data.serverOptions);
			// TODO: ^ seems unused?
			console.warn('TODO: unhandled network_changed', data);
		});

		this.socket.on('nick', ({network, nick}) => {
			nickChanged(network, nick);
		});

		this.socket.on('part', ({chan}) => {
			leftChannel(chan);
		});
		this.socket.on('quit', ({network}) => {
			leftNetwork(network);
		});

		this.socket.on('toggle', (data) => {
			// TODO: re-emit?  the old functionality was directly hooked in to the UI
			console.warn('TODO: unhandled toggle', data);
		});

		this.socket.on('topic', ({chan, topic}) => {
			topicChanged(chan, topic);
		});
		this.socket.on('users', ({chan}) => {
			channelUsersChanged(chan);
		});
		this.socket.on('names', ({id, users}) => {
			receivedChannelUsers(id, users);
		});
	}
}


export default new SocketClient();

import * as actions from "../actions";
import {updateIn} from "../immutableUtils";

// Update `list` by replacing the element `el` with `el.id == targetId` by `f(el)`.
export function updateId(list, targetId, f) {
	return list.map(el => el.id === targetId ? f(el) : el);
}

function normalizeNetwork(network) {
	return updateIn(network, ["channels"], cs => cs.map(c => c.id));
}

export default function networks(state = [], action) {
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
			({...n, channels: n.channels.filter(c => c !== channelId)})
		);
	}

	case actions.NICK_CHANGED: {
		let {networkId, nick} = action;
		return updateId(state, networkId, n => ({...n, nick}))
	}

	default:
		return state;
	}
}

import {
	INITIAL_DATA_RECEIVED,
	JOINED_NETWORK,
	LEFT_NETWORK,
	JOINED_CHANNEL,
	LEFT_CHANNEL
} from './actions';

// Action Generators
export function initialDataReceived (data) {
	return {type: INITIAL_DATA_RECEIVED, data};
}

export function joinedNetwork (networkInitialData) {
	return {type: JOINED_NETWORK, networkInitialData};
}

export function leftNetwork (networkId) {
	return {type: LEFT_NETWORK, networkId};
}

export function joinedChannel (networkId, channelInitialData) {
	return {type: JOINED_CHANNEL, networkId, channelInitialData};
}

export function leftChannel (channelId) {
	return {type: LEFT_CHANNEL, channelId};
}


const normalizeNetwork = (state) => {
	// TODO: what is this supposed to do?  re-map channel IDs?
	// const newState = {};
	// _.forEach(state, (network, networkId) => {
	// 	newState[networkId] = network;
	// 	network.channels =
	// });
	// return newState;
	// return updateIn(network, ['channels'], cs => cs.map(c => c.id));
	return state;
};

// Reducers
const DEFAULT_STATE = {};

export default function (state = DEFAULT_STATE, action) {
	switch (action.type) {
	case INITIAL_DATA_RECEIVED: {
		return normalizeNetwork(state);
	}

	case JOINED_NETWORK: {
		let {networkInitialData} = action;
		if (state[networkInitialData.id]) {
			console.error(networkInitialData);
			throw new Error('Already have network data for: ' + networkInitialData.id);
		}
		return {
			...state,
			[networkInitialData.id]: networkInitialData
		};
	}

	case LEFT_NETWORK: {
		let {networkId} = action;
		return state.filter(n => n.id !== networkId);
	}

	case JOINED_CHANNEL: {
		let {channelInitialData: {id: channelId}, networkId} = action;
		const network = state[networkId];
		network.channels = network.channels.concat([channelId]);
		return state;
	}

	case LEFT_CHANNEL: {
		let {channelId} = action;
		return state.map(n => ({
			...n,
			channels: n.channels.filter(c => c.id !== channelId)
		}));
	}

	default:
		return state;
	}
}

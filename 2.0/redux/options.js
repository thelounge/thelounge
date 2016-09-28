// Actions
export const SET_OPTION = 'options/SET_OPTION';


// Action Generators
export const setOption = (key, value) => (
	{ type: SET_OPTION, key, value }
);


// Reducer
const DEFAULT_STATE = {
	coloredNicks: true,
	desktopNotifications: false,
	join: true,
	links: true,
	mode: true,
	motd: false,
	nick: true,
	notification: true,
	notifyAllMessages: false,
	part: true,
	quit: true,
	theme: 'example',
	thumbnails: true,
	userStyles: '' // TODO
};

export default function (state = DEFAULT_STATE, action) {
	switch (action.type) {
	case SET_OPTION: {
		if (state[action.key] === undefined) {
			throw new Error('Invalid option key: ' + action.key);
		}
		if (action.value === undefined) {
			throw new Error('Invalid option value: ' + action.value);
		}
		return { ...state, [action.key]: action.value };
	}
	default:
		return state;
	}
}

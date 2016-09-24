// Action Types
export const SET_SOMETHING = 'chat/SET_SOMETHING';

// Action generators
export const setSomething = (v) => {
	return { type: SET_SOMETHING, value: v };
};

// Reducers
const DEFAULT_STATE = {
	something: 3
};

export default function (state = DEFAULT_STATE, action) {
	switch (action.type) {
	case SET_SOMETHING:
		return Object.assign({}, state, {
			something: action.value
		});
	default:
		return state;
	}
}

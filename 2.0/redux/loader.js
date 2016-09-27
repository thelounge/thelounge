// Actions
export const SET_LOADER_STATE = 'loader/SET_LOADER_STATE';


// Aciton Generators
export const setLoaderState = (value) => (
	{ type: SET_LOADER_STATE, value }
);


export const LOADER_STATES = {
	LOADING: 'loading',
	DONE: 'done',
	ERROR: 'error'
};


// Reducers
const DEFAULT_STATE = {
	state: LOADER_STATES.LOADING
};


export default function (state = DEFAULT_STATE, action) {
	switch (action.type) {
	case SET_LOADER_STATE:
		return { ...state, state: action.value };
	default:
		return state;
	}
}

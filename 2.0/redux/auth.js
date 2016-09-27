import { getState } from 'clientUI/redux/store';


// Actions
export const SET_LOGIN_ENABLED = 'auth/SET_LOGIN_ENABLED';
export const SET_LOGIN_ERROR = 'auth/SET_LOGIN_ERROR';
export const SET_LOGIN_STATE = 'auth/SET_LOGIN_STATE';
export const SET_LOGIN_TOKEN = 'auth/SET_LOGIN_TOKEN';
export const SET_CHANGE_PASSWORD_RESULT = 'auth/SET_CHANGE_PASSWORD_RESULT';
export const SET_CHANGE_PASSWORD_STATE = 'auth/SET_CHANGE_PASSWORD_STATE';
export const SET_USERNAME = 'auth/SET_USERNAME';


// Aciton Generators
export const setLoginEnabled = (value) => (
	{ type: SET_LOGIN_ENABLED, value }
);

export const setLoginError = (value) => (
	{ type: SET_LOGIN_ERROR, value }
);

export const setLoginState = (value) => (
	{ type: SET_LOGIN_STATE, value }
);

export const LOGIN_STATES = {
	NONE: 'none',
	IN_PROGRESS: 'inProgress',
	SUCCESS: 'success',
	ERROR: 'error'
};

export const setUsername = (username) => (
	{ type: SET_USERNAME, value: username }
);

export const getUsername = () => {
	const state = getState().auth;
	return state.username || window.localStorage.getItem('user') || '';
};

export const setLoginToken = (value) => (
	{ type: SET_LOGIN_TOKEN, value }
);

export const getLoginToken = () => {
	const state = getState().auth;
	return state.token || window.localStorage.getItem('token') || null;
};

export const getRememberToken = () => {
	const state = getState().auth;
	return state.rememberToken;
};

export const CHANGE_PASSWORD_STATES = {
	NONE: 'none',
	IN_PROGRESS: 'inProgress',
	SUCCESS: 'success',
	ERROR: 'error'
};

export const setChangePasswordState = (value) => (
	{ type: SET_CHANGE_PASSWORD_STATE, value }
);


export const setChangePasswordResult = (value) => (
	{ type: SET_CHANGE_PASSWORD_RESULT, value }
);


// Reducers
const DEFAULT_STATE = {
	loginEnabled: false,
	loginError: null,
	state: LOGIN_STATES.NONE,
	username: null,
	token: null,
	rememberToken: true,
	changePasswordState: CHANGE_PASSWORD_STATES.NONE,
	changePasswordResult: null
};


export default function (state = DEFAULT_STATE, action) {
	switch (action.type) {
	case SET_LOGIN_ENABLED:
		return { ...state, loginEnabled: action.value };
	case SET_LOGIN_ERROR:
		return { ...state, loginError: action.value };
	case SET_LOGIN_STATE:
		return { ...state, state: action.value };
	case SET_LOGIN_TOKEN: {
		const token = action.value;
		if (token && window.localStorage.getItem('token') !== null) {
			window.localStorage.setItem('token', token);
		}
		if (!token) {
			window.localStorage.removeItem('token');
		}
		return { ...state, token };
	}
	case SET_CHANGE_PASSWORD_STATE:
		return { ...state, changePasswordState: action.value };
	case SET_CHANGE_PASSWORD_RESULT:
		return { ...state, changePasswordResult: action.value };
	case SET_USERNAME: {
		if (!action.value) {
			window.localStorage.removeItem('user');
		}
		return { ...state, username: action.value };
	}
	default:
		return state;
	}
}

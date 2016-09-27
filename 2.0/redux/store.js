import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

let storeInstance;

export const initStore = reducers => {
	if (storeInstance) {
		throw new Error('Store already initialized');
	}

	if (process.env.NODE_ENV === 'production') {
		storeInstance = createStore(reducers);
	} else {
		storeInstance = createStore(
			reducers,
			applyMiddleware(
				createLogger(),
				thunkMiddleware
			)
		);
	}

	return storeInstance;
};

export const getStore = () => {
	return storeInstance;
};

export const getState = () => {
	return getStore().getState();
};

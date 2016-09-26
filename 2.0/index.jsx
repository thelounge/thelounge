import React from 'react';
import ReactDOM from 'react-dom';
import url from 'url';
import debug from 'debug';

import App from './components/App';

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import createLogger from 'redux-logger';
import { set as setGlobal } from './globals';
import reducers from './redux/reducers';
import socketClient from './socketClient';


// Initialize debug
const parsed = url.parse(location.href, true);
const debugQuery = parsed.query && parsed.query.debug;
if (debugQuery) {
	debug.enable(debugQuery);
	debug.disable(null);
} else {
	debug.enable(null);
	debug.disable('*');
}


// Initialize the redux store
let store;
if (process.env.NODE_ENV === 'production') {
	store = createStore(reducers);
} else {
	store = createStore(reducers, applyMiddleware(createLogger()));
}
setGlobal('store', store);


// Start up the socket client
socketClient.connect();


ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('main')
);

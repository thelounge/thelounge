import React from 'react';
import ReactDOM from 'react-dom';
import url from 'url';
import debug from 'debug';
import { Provider } from 'react-redux';

import { initStore, getStore } from 'clientUI/redux/store';
import reducers from './redux/reducers';
import socketClient from './socketClient';

import App from './components/App';


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
initStore(reducers);


// Start up the socket client
socketClient.connect();


ReactDOM.render(
	<Provider store={getStore()}>
		<App />
	</Provider>,
	document.getElementById('main')
);

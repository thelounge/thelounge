import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import createLogger from 'redux-logger';
import { set as setGlobal } from './globals';
import reducers from './redux/reducers';
import socketClient from './socketClient';


let store;
if (process.env.NODE_ENV === 'production') {
	store = createStore(reducers);
} else {
	store = createStore(reducers, applyMiddleware(createLogger()));
}
setGlobal('store', store);


socketClient.connect(window.location.pathname + 'socket.io/');


ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('main')
);

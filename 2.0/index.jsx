import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import createLogger from 'redux-logger';
import reducers from './redux/reducers';


let store;
if (process.env.NODE_ENV === 'production') {
	store = createStore(reducers);
} else {
	store = createStore(reducers, applyMiddleware(createLogger()));
}


ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('main')
);

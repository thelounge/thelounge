import { combineReducers } from 'redux';
import chat from './chat';
import auth from './auth';
import notification from './notification';
import options from './options';
import loader from './loader';


const reducers = combineReducers({
	chat,
	auth,
	notification,
	options,
	loader
});


export default reducers;

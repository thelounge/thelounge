import { combineReducers } from 'redux';
import chat from './chat';
import auth from './auth';
import notification from './notification';
import options from './options';


const reducers = combineReducers({
	chat,
	auth,
	notification,
	options
});


export default reducers;

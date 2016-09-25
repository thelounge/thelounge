import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { setSomething } from 'clientUI/redux/chat';

import 'expose?$!expose?jQuery!jquery';

import 'font-awesome-webpack';
import 'bootstrap-webpack';
import './App.styl';

import Footer from './Footer';

import LoadingWindow from './windows/LoadingWindow';
import ChatContainerWindow from './windows/ChatContainerWindow';
import SignInWindow from './windows/SignInWindow';
import ConnectWindow from './windows/ConnectWindow';
import SettingsWindow from './windows/SettingsWindow';

import ContextMenuContainer from './ContextMenuContainer';


class App extends React.Component {
	render () {
		return (
			<div className='app-cmpt'>
				<div id='wrap'>
					<div id="viewport">
						<aside id="sidebar">
							<div className="networks"></div>
							<div className="empty">
								You're not connected to any networks yet. asdf
							</div>
						</aside>
						{/* TODO: handle button presses */}
						<Footer />
						<div className="main">
							<div className="windows">
								<LoadingWindow />
								<ChatContainerWindow />
								<SignInWindow />
								<ConnectWindow />
								<SettingsWindow />
							</div>
						</div>
					</div>
				</div>

				<ContextMenuContainer />
			</div>
		);
	}
}

App.propTypes = {
	something: PropTypes.number
};

const mapStateToProps = state => {
	return {
		something: state.chat.something
	};
};

const mapDispatchToProps = dispatch => {
	return { };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

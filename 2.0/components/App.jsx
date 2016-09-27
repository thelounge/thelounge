import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

// import { setSomething } from 'clientUI/redux/chat';

import 'expose?$!expose?jQuery!jquery';

import 'font-awesome-webpack';
import 'bootstrap-webpack';
import './App.styl';

import { LOADER_STATES } from 'clientUI/redux/loader';
import { LOGIN_STATES } from 'clientUI/redux/auth';

import Footer from './Footer';

import LoadingWindow from './windows/LoadingWindow';
import ChatContainerWindow from './windows/ChatContainerWindow';
import SignInWindow from './windows/SignInWindow';
import ConnectWindow from './windows/ConnectWindow';
import SettingsWindow from './windows/SettingsWindow';

import ContextMenuContainer from './ContextMenuContainer';
import Sidebar from './sidebar/Sidebar';


class App extends React.Component {
	render () {
		const { authState, loaderState } = this.props;

		return (
			<div
				className={classNames('app-cmpt', {
					'signed-out': authState !== LOGIN_STATES.SUCCESS
				})}
			>
				<div id='wrap'>
					<div id="viewport">
						<Sidebar />
						{/* TODO: handle button presses */}
						<Footer />
						<div className="main">
							<div className="windows">
								{loaderState !== LOADER_STATES.DONE &&
									<LoadingWindow />
								}
								<ChatContainerWindow />
								{loaderState !== LOADER_STATES.DONE &&
									<SignInWindow />
								}
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
	authState: PropTypes.string.isRequired,
	loaderState: PropTypes.string.isRequired
};


const mapStateToProps = state => ({
	authState: state.auth.state,
	loaderState: state.loader.state
});
const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(App);

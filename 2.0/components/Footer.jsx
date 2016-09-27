import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { getStore } from 'clientUI/redux/store';
import { setLoginToken } from 'clientUI/redux/auth';
import { changeActiveWindow, WINDOW_TYPES } from 'clientUI/redux/chat';


class Footer extends React.Component {
	handleSignOut () {
		getStore().dispatch(setLoginToken(null));
		setTimeout(() => location.reload());
	}

	render () {
		return (
			<footer id="footer" className='footer-cmpt'>
				<span className="tooltipped tooltipped-n" aria-label="Sign in">
					<button
						className="icon sign-in"
						onClick={() => this.props.changeActiveWindow(WINDOW_TYPES.SIGN_IN)}
						aria-label="Sign in"
					/>
				</span>
				<span className="tooltipped tooltipped-n" aria-label="Connect to network">
					<button
						className="icon connect"
						onClick={() => this.props.changeActiveWindow(WINDOW_TYPES.CONNECT)}
						aria-label="Connect to network"
					/>
				</span>
				<span className="tooltipped tooltipped-n" aria-label="Client settings">
					<button
						className="icon settings"
						onClick={() => this.props.changeActiveWindow(WINDOW_TYPES.SETTINGS)}
						aria-label="Client settings"
					/>
				</span>
				<span className="tooltipped tooltipped-n" aria-label="Sign out">
					<button
						className="icon sign-out"
						onClick={this.handleSignOut.bind(this)}
						aria-label="Sign out"
					/>
				</span>
			</footer>
		);
	}
}


Footer.propTypes = {
	changeActiveWindow: PropTypes.func.isRequired
};


const mapStateToProps = state => ({}); // eslint-disable-line
const mapDispatchToProps = dispatch => ({
	changeActiveWindow: (windowId) => dispatch(changeActiveWindow(windowId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);

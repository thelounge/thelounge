import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { LOGIN_STATES } from 'clientUI/redux/auth';


class LoadingWindow extends React.Component {
	render () {
		const loadingSlow = false; // TODO

		const { loginState } = this.props;
		let status;
		if (loginState === LOGIN_STATES.IN_PROGRESS) {
			status = <p>Authorizing...</p>;
		} else if (!loadingSlow) {
			status = (
				<p>
					Loading the app...
					{' '}
					<a href="http://enable-javascript.com/" target="_blank">
						Make sure to have JavaScript enabled.
					</a>
				</p>
			);
		} else {
			status = (
				<p>
					This is taking longer than it should, there might be connectivity issues.
				</p>
			);
		}

		return (
			<div className="window active cmpt-loading-window">
				<div className="container">
					<div className="row">
						<div className="col-xs-12">
							<h1 className="title">The Lounge is loading...</h1>
						</div>
						<div className="col-xs-12">
							{status}
						</div>
					</div>
				</div>
			</div>
		);
	}
}


LoadingWindow.propTypes = {
	loginState: PropTypes.string.isRequired
};


const mapStateToProps = state => ({
	loginState: state.auth.state
});
const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(LoadingWindow);


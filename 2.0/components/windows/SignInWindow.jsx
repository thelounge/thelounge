import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import socketClient from 'clientUI/socketClient';
import { useState } from 'clientUI/utils/forms';
import { getUsername, setUsername } from 'clientUI/redux/auth';


class SignInWindow extends React.Component {
	constructor () {
		super();
		this.state = {
			submitting: false,
			formData: {
				user: getUsername(),
				password: '',
				remember: true
			}
		};
	}

	handleSubmit (evt) {
		evt.preventDefault();
		this.setState({ submitting: true });
		// TODO: username?  this should dispatch
		const username = this.state.formData.user;
		if (username) {
			this.props.setUsername(username);
		}
		socketClient.emit('auth', this.state.formValues);
	}

	render () {
		return (
			<div id="sign-in" className="window">
				<form className="container">
					<div className="row">
						<div className="col-xs-12">
							<h1 className="title">Sign in to The Lounge</h1>
						</div>
						<div className="col-xs-12">
							<label>
								Username
								<input
									className="input"
									{...useState(this, 'formData.user')}
								/>
							</label>
						</div>
						<div className="col-xs-12">
							<label className="port">
								Password
								<input
									className="input"
									type="password"
									name="password"
									{...useState(this, 'formData.password')}
								/>
							</label>
						</div>
						<div className="col-xs-12">
							<label className="remember">
								<input
									type="checkbox"
									name="remember"
									id="sign-in-remember"
									{...useState(this, 'formData.remember', 'checked')}
								/>
								Stay signed in
							</label>
						</div>
						<div className="col-xs-12 error" style={{ display: 'none' }}>
							Authentication failed.
						</div>
						<div className="col-xs-12">
							<button
								type="button"
								className="btn"
								onClick={this.handleSubmit.bind(this)}
								disabled={this.state.submitting}
							>
								Sign in
							</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}


SignInWindow.propTypes = {
	setUsername: PropTypes.func.isRequired
};


const mapStateToProps = state => ({}); // eslint-disable-line
const mapDispatchToProps = dispatch => ({
	setUsername: (username) => dispatch(setUsername(username))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInWindow);

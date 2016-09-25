import React, { PropTypes } from 'react';

export default class SignInWindow extends React.Component {
	render () {
		return (
			<div id="sign-in" className="window">
				<form className="container" method="post" action="">
					<div className="row">
						<div className="col-xs-12">
							<h1 className="title">Sign in to The Lounge</h1>
						</div>
						<div className="col-xs-12">
							<label>
								Username
								<input className="input" name="user" />
							</label>
						</div>
						<div className="col-xs-12">
							<label className="port">
								Password
								<input className="input" type="password" name="password" />
							</label>
						</div>
						<div className="col-xs-12">
							<label className="remember">
								{/* attr: checked */}
								<input type="checkbox" name="remember" id="sign-in-remember" />
								Stay signed in
							</label>
						</div>
						<div className="col-xs-12 error" style={{ display: 'none' }}>
							Authentication failed.
						</div>
						<div className="col-xs-12">
							<button type="submit" className="btn">
								Sign in
							</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

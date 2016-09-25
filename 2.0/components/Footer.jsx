import React, { PropTypes } from 'react';

export default class Footer extends React.Component {
	render () {
		return (
			<footer id="footer" className='footer-cmpt'>
				<span className="tooltipped tooltipped-n" aria-label="Sign in">
					<button
						className="icon sign-in"
						onClick={this.props.handleSignIn}
						aria-label="Sign in"
					/>
				</span>
				<span className="tooltipped tooltipped-n" aria-label="Connect to network">
					<button
						className="icon connect"
						onClick={this.props.handleConnect}
						aria-label="Connect to network"
					/>
				</span>
				<span className="tooltipped tooltipped-n" aria-label="Client settings">
					<button
						className="icon settings"
						onClick={this.props.handleSettings}
						aria-label="Client settings"
					/>
				</span>
				<span className="tooltipped tooltipped-n" aria-label="Sign out">
					<button
						className="icon sign-out"
						onClick={this.props.handleSignOut}
						aria-label="Sign out"
					/>
				</span>
			</footer>
		);
	}
}

Footer.propTypes = {
	handleSignIn: PropTypes.func.isRequired,
	handleSignOut: PropTypes.func.isRequired,
	handleConnect: PropTypes.func.isRequired,
	handleSettings: PropTypes.func.isRequired
};

import React, { PropTypes } from 'react';

export default class LoadingWindow extends React.Component {


	render () {
		let status;
		if (!this.props.loadingSlow) {
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
	loadingSlow: PropTypes.boolean
};

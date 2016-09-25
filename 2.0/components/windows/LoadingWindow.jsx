import React from 'react';

export default class LoadingWindow extends React.Component {
	render () {
		return (
			<div id="loading" className="window active cmpt-loading-window">
				<div className="container">
					<div className="row">
						<div className="col-xs-12">
							<h1 className="title">The Lounge is loading…</h1>
						</div>
						<div className="col-xs-12">
							<p id="loading-page-message">Loading the app… <a href="http://enable-javascript.com/" target="_blank">Make sure to have JavaScript enabled.</a></p>
							<p id="loading-slow">This is taking longer than it should, there might be connectivity issues.</p>
							<script async src="js/loading-slow-alert.js"></script>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

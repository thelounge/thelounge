import React from 'react';

export default class ChatContainerWindow extends React.Component {
	render () {
		return (
			<div id="chat-container" className="window cmpt-chat-container-window">
				<div id="chat"></div>
				<form id="form" method="post" action="">
					<div className="input">
						{/* for="input" */}
						<label id="nick"></label>
						<textarea id="input" className="mousetrap"></textarea>
						<span className="tooltipped tooltipped-w" aria-label="Send message">
							<button id="submit" type="submit" aria-label="Send message"></button>
						</span>
					</div>
				</form>
			</div>
		);
	}
}

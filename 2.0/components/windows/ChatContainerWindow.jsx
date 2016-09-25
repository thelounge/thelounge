import React from 'react';

import Chat from '../chat/Chat';


export default class ChatContainerWindow extends React.Component {
	handleSubmit () {
		console.warn('TODO');
	}

	render () {
		return (
			<div className="window cmpt-chat-container-window">
				<Chat />
				<form className="chat-form" method="post" action="">
					<div className="input">
						{/* for="input" */}
						<label className="nick"></label>
						<textarea className="mousetrap input" />
						<span className="tooltipped tooltipped-w" aria-label="Send message">
							<button
								className="submit"
								type="submit"
								aria-label="Send message"
								onClick={this.handleSubmit.bind(this)}
							/>
						</span>
					</div>
				</form>
			</div>
		);
	}
}

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { getChannel } from 'clientUI/redux/chat/channels';

import Chat from 'clientUI/components/chat/Chat';


class ChatContainerWindow extends React.Component {
	handleSubmit () {
		console.warn('TODO');
	}

	render () {
		const chatChannel = getChannel(this.props.activeChannelId);

		return (
			<div className="window cmpt-chat-container-window">
				{chatChannel
					? <Chat channel={chatChannel} />
					: null
				}
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


ChatContainerWindow.propTypes = {
	activeChannelId: PropTypes.number
};


const mapStateToProps = state => ({
	activeChannelId: state.activeChannelId
});
const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainerWindow);

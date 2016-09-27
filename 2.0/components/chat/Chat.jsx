import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { requestMore } from 'clientUI/redux/chat';

import Message from './Message';
import UserList from './UserList';


class Chat extends React.Component {
	componentWillUpdate() {
		if (this.getIsActive()) {
			let node = this.refs.chat;
			this.prevScrollTop = node.scrollTop;
		}
	}

	componentDidUpdate(prevProps) {
		if (this.getIsActive()) {
			let node = this.refs.chat;
			let isFetchMore = (
				prevProps.channel.messages.length && this.props.channel.messages.length &&
				prevProps.channel.messages[0].id > this.props.channel.messages[0].id
			);
			if (!isFetchMore && node.scrollTop + node.offsetHeight !== node.scrollHeight) {
				node.scrollTop = this.prevScrollTop;
			}
		}
	}

	shouldComponentUpdate(nextProps) {
		return (
			nextProps.isActive !== this.getIsActive() ||
			nextProps.channel.messages.length !== this.props.channel.messages.length ||
			nextProps.channel.users !== this.props.channel.users
		);
	}

	getIsActive () {
		return this.props.channel.id === this.props.activeChannelId;
	}

	renderUnreadMarker (key) {
		return (
			<div className="unread-marker" key={key}>
				<span className="unread-marker-text"></span>
			</div>
		);
	}

	render () {
		const channel = this.props.channel;
		const isActive = this.getIsActive();

		const messages = channel.messages.map(message => {
			if (channel.firstUnread !== 0 && message.id === channel.firstUnread) {
				return this.renderUnreadMarker('unread');
			}
			return <Message key={message.id} message={message} />;
		});
		messages.reverse();

		return (
			<div
				className={classNames('chat-cmpt', channel.type, { active: isActive })}
			>
				<div className="header">
					<button className="lt" aria-label="Toggle channel list" />
					{channel.type === 'channel' ?
						<span className="rt-tooltip tooltipped tooltipped-w" aria-label="Toggle user list">
							<button className="rt" aria-label="Toggle user list" />
						</span>
						: null}
					<button className="menu" aria-label="Open the context menu" />
					<span className="title">{channel.name}</span>
					<span title={channel.topic} className="topic">{channel.topic}</span>
				</div>

				<div className={classNames('chat', {active: isActive})}>
					<div className="messages" ref="chat">
						{messages}
						<div className={classNames('show-more', {show: channel.hasMore})}>
							<button
								className="show-more-button"
								onClick={() => this.props.requestMore(channel.id)}
							>
								Show older messages
							</button>
						</div>
					</div>
				</div>

				<aside className="sidebar">
					<UserList users={channel.users} />
				</aside>
			</div>
		);
	}
}


Chat.propTypes = {
	channel: PropTypes.object.isRequired,
	activeChannelId: PropTypes.number.isRequired
};


const mapStateToProps = state => ({
	activeChannelId: state.activeChannelId
});
const mapDispatchToProps = dispatch => ({
	requestMore: (channelId) => dispatch(requestMore(channelId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

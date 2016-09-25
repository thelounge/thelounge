import React from "react";
import classNames from "classnames";

import Message from "./Message";
import UserList from "./UserList";

const UnreadMarker = () =>
	<div className="unread-marker">
		<span className="unread-marker-text"></span>
	</div>;

export default class Chat extends React.Component {
	componentDidMount() {
		// jQuery interop. Temporary.
		$(this.refs.root).data("id", this.props.channel.id);
	}
	componentWillUpdate() {
		if (this.props.isActive) {
			let node = this.refs.chat;
			this.prevScrollTop = node.scrollTop;
		}
	}
	componentDidUpdate(prevProps) {
		if (this.props.isActive) {
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
			nextProps.isActive !== this.props.isActive ||
			nextProps.channel.messages.length !== this.props.channel.messages.length ||
			nextProps.channel.users !== this.props.channel.users
		);
	}
	render() {
		const {channel, isActive, actions} = this.props;
		let messages = [];
		for (let message of channel.messages) {
			if (channel.firstUnread !== 0 && message.id === channel.firstUnread) {
				messages.push(<UnreadMarker key="unread" />);
			}
			messages.push(<Message key={message.id} message={message} />);
		}
		messages.reverse();
		return (
			<div
				className={classNames("chan", channel.type, {active: isActive})}
				id={`chan-${channel.id}`}
				ref="root"
			>
				<div className="header">
					<button className="lt" aria-label="Toggle channel list"></button>
					{channel.type === "channel" ?
						<span className="rt-tooltip tooltipped tooltipped-w" aria-label="Toggle user list">
							<button className="rt" aria-label="Toggle user list"></button>
						</span>
						: null}
					<button className="menu" aria-label="Open the context menu"></button>
					<span className="title">{channel.name}</span>
					<span title={channel.topic} className="topic">{channel.topic}</span>
				</div>
				<div className={classNames("chat", {active: isActive})}>
					<div className="messages" ref="chat">
						{messages}
						<div className={classNames("show-more", {show: channel.hasMore})}>
							<button
								className="show-more-button"
								data-id={channel.id}
								onClick={() => actions.requestMore(channel.id)}
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

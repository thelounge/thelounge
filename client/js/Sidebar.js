import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as actions from "./actions";
import classNames from "classnames";

function roundBadgeNumber(count) {
	if (count < 1000) {
		return count;
	}

	return (count / 1000).toFixed(2).slice(0, -1) + "k";
}

const Channel = ({id, name, type, highlight, unread, isActive, onClickChannel, onLeaveChannel}) =>
	<div
		data-id={id}
		data-target={`#chan-${id}`}
		data-title={name}
		className={classNames("chan", type, {active: isActive})}
		onClick={() => onClickChannel(id)}
	>
		<span className={classNames("badge", {highlight})}>
			{unread ? roundBadgeNumber(unread) : null}
		</span>
		<button className="close" aria-label="Close" onClick={() => {
			if (type === "lobby") {
				if (!confirm(`Disconnect from ${name}?`)) return;
				onLeaveLobbyChannel(id); // TODO
			} else {
				onLeaveChannel(id);
			}
		}}></button>
		<span className="name" title={name}>{name}</span>
	</div>;

const Network = ({id, nick, channels, activeChannelId, onClickChannel, onLeaveChannel}) =>
	<section
		id={`network-${id}`}
		className="network"
		data-id={id}
		data-nick={nick}
	>
		{channels.map(chan =>
			<Channel
				{...chan}
				key={chan.id}
				isActive={chan.id === activeChannelId}
				onClickChannel={onClickChannel}
				onLeaveChannel={onLeaveChannel}
			/>
		)}
	</section>;

class Sidebar extends React.Component {
	render() {
		let {networks, channels, activeChannelId, activeWindowId, actions} = this.props;
		networks = networks.map(n => ({...n, channels: n.channels.map(cId => channels[cId])}));
		return (
			<aside id="sidebar">
				<div className="networks">
					{networks.map(n =>
						<Network
							{...n}
							key={n.id}
							activeChannelId={activeWindowId === "chat-container" && activeChannelId}
							onClickChannel={actions.changeActiveChannel}
							onLeaveChannel={actions.leaveChannel}
						/>
					)}
				</div>
				<div className={classNames("empty", {hidden: networks.length > 0})}>
					You're not connected to any networks yet.
				</div>
			</aside>
		);
	}
}

const mapStateToProps = state => ({...state});
const mapDispatchToProps = dispatch =>
	({actions: bindActionCreators(actions, dispatch)});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

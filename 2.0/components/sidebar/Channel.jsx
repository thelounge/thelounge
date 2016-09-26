import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
	changeActiveChannel
} from 'clientUI/redux/chat';


const roundBadgeNumber = (count) => {
	if (count < 1000) {
		return count;
	}
	return (count / 1000).toFixed(2).slice(0, -1) + 'k';
};


class Channel extends React.Component {
	handleClose () {
		// TODO: this logic probably belongs somewhere else
		// if (type === 'lobby') {
		// 	if (!confirm(`Disconnect from ${name}?`)) {
		// 		return;
		// 	}
		// 	onLeaveLobbyChannel(channelId); // TODO
		// } else {
		// 	onLeaveChannel(channelId);
		// }
		console.error('TODO: implement');
	}

	render () {
		const {
			channel,
			changeActiveChannel
		} = this.props;

		return (
			<div
				className={classNames(
					'chan',
					'chan-' + channel.id,
					channel.type,
					{
						active: channel.isActive
					}
				)}
				onClick={() => changeActiveChannel(channel.id)}
			>
				<span
					className={classNames('badge', { highlight: channel.highlight })}
				>
					{channel.unread > 0 ? roundBadgeNumber(channel.unread) : null}
				</span>
				<button
					className="close"
					aria-label="Close"
					onClick={this.handleClose.bind(this)}
				/>
				<span className="name" title={channel.name}>{channel.name}</span>
			</div>
		);
	}
}


Channel.propTypes = {
	channel: PropTypes.object.isRequired,
	changeActiveChannel: PropTypes.func.isRequired
};


const mapStateToProps = state => ({}); // eslint-disable-line
const mapDispatchToProps = dispatch => ({
	changeActiveChannel: (channelId) => dispatch(changeActiveChannel(channelId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Channel);

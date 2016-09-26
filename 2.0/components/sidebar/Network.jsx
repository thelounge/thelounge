import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
	getChannel
} from 'clientUI/redux/chat/channels';

import Channel from './Channel';


class Network extends React.Component {
	render () {
		const network = this.props.network;
		return (
			<section
				className={classNames('network', 'network-' + network.id)}
			>
				{network.channels.map(channelId =>
					<Channel
						channel={getChannel(channelId)}
						key={channelId}
					/>
				)}
			</section>
		);
	}
}


Network.propTypes = {
	network: PropTypes.object.isRequired
};


const mapStateToProps = state => ({}); // eslint-disable-line
const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(Network);

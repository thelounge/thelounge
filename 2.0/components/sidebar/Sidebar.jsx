import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Network from './Network';


class Sidebar extends React.Component {
	render() {
		let {
			networks
		} = this.props;

		return (
			<aside id="sidebar">
				<div className="networks">
					{networks.length && networks.map(network =>
						<Network
							network={network}
							key={network.id}
						/>
					)}
				</div>
				<div className={classNames('empty', { hidden: networks.length > 0 })}>
					You're not connected to any networks yet.
				</div>
			</aside>
		);
	}
}


Sidebar.propTypes = {
	networks: PropTypes.array.isRequired
};


const mapStateToProps = state => ({
	networks: state.chat.networks
});
const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

import React, { PropTypes } from 'react';

export default class ContextMenuContainer extends React.Component {
	render () {
		return (
			<div id="context-menu-container" className="cmpt-context-menu-container">
				<ul id="context-menu"></ul>
			</div>
		);
	}
}

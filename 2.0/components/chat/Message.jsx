import React, { PropTypes } from 'react';
import classNames from 'classnames';


class Message extends React.Component {
	render() {
		let {message} = this.props;
		let type = message.type;
		let template = 'msg';
		if ([
			'invite',
			'join',
			'mode',
			'kick',
			'nick',
			'part',
			'quit',
			'topic',
			'topic_set_by',
			'action',
			'whois',
			'ctcp',
		].indexOf(type) !== -1) {
			message.template = 'actions/' + type;
			template = 'msg_action';
		} else if (type === 'unhandled') {
			template = 'msg_unhandled';
		}

		let html = Handlebars.templates[template](message);

		return (
			<div
				className={
					classNames(
						'msg',
						message.type,
						{self: message.self, highlight: message.highlight}
					)
				}
				id={`msg-${message.id}`}
				dangerouslySetInnerHTML={{__html: html}}
			>
			</div>
		);
	}
}


Message.propTypes = {
	message: PropTypes.object.isRequired
};


export default Message;

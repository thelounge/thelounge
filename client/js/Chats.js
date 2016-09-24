import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as actions from "./actions";

import Chat from "./Chat";

const Chats = ({channels, activeChannelId, activeWindowId, actions}) => {
	return (
		<div>
			{Object.keys(channels).map(channelId =>
				<Chat
					key={channelId}
					channel={channels[channelId]}
					isActive={activeWindowId === "chat-container" && Number(channelId) === activeChannelId}
					actions={actions}
				/>
			)}
		</div>
	);
};

const mapStateToProps = state =>
	({channels: state.channels, activeChannelId: state.activeChannelId, activeWindowId: state.activeWindowId});
const mapDispatchToProps = dispatch =>
	({actions: bindActionCreators(actions, dispatch)});

export default connect(mapStateToProps, mapDispatchToProps)(Chats);

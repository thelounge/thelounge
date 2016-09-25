// MESSAGE_RECEIVED
export const onMessageReceived = (state, action) => {
	let {channelId, message} = action;
	let channel = state.channels[channelId];
	let firstUnread = channel.firstUnread;
	if (channelId !== state.activeChannelId && channel.firstUnread === 0) {
		firstUnread = message.id;
	}
	if (message.self) {
		firstUnread = 0;
	}
	state.channels[channelId].firstUnread = firstUnread;
};

// CHANGE_ACTIVE_CHANNEL
export const onChangeActiveChannel = (state, action) => {
	const { channelId } = action;
	if (state.activeChannelId in state.channels && channelId !== state.activeChannelId) {
		const activeChannel = state.channels[state.activeChannelId];
		if (activeChannel) {
			activeChannel.firstUnread = 0;
		}
	}
};

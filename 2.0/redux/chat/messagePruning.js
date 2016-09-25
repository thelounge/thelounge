export const pruneChannelHistory = (channel) => {
	channel.messages = channel.messages.slice(-100);
	channel.hasMore = channel.messages.length > 100;
};


// MESSAGE_RECEIVED
export const onMessageReceived = (state, action) => {
	let {channelId} = action;
	if (channelId !== state.activeChannelId) {
		const channel = state.channels[channelId];
		pruneChannelHistory(channel);
	}
};

// CHANGE_ACTIVE_CHANNEL
export const onChangeActiveChannel = (state, action) => {
	let {channelId} = action;
	if (state.activeChannelId in state.channels && channelId !== state.activeChannelId) {
		const channel = state.channels[state.activeChannelId];
		pruneChannelHistory(channel);
	}
};

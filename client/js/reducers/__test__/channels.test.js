import channels from "../channels";
import * as actions from "../../actions";

it("initializes", () => {
	expect(channels(undefined, {})).toEqual({});
});

it("receives initial data", () => {
	let action = {
		type: actions.INITIAL_DATA_RECEIVED,
		data: {
			networks: [{
				id: 5,
				channels: [
					{id: 1, type: "lobby"},
					{id: 2, type: "channel"}
				]
			}]
		}
	};
	expect(channels({}, action)).toEqual({
		1: {id: 1, type: "lobby", networkId: 5},
		2: {id: 2, type: "channel", networkId: 5}
	});
});

it("receives initial channels after JOINED_NETWORK", () => {
	let action = {
		type: actions.JOINED_NETWORK,
		networkInitialData: {
			id: 5,
			channels: [
				{id: 1, type: "lobby"},
				{id: 2, type: "channel"}
			]
		}
	};
	expect(channels({}, action)).toEqual({
		1: {id: 1, type: "lobby", networkId: 5},
		2: {id: 2, type: "channel", networkId: 5}
	});
});

it("drops channels from a network after LEFT_NETWORK", () => {
	let initial = {
		42: {
			id: 42,
			type: "lobby",
			name: "seeya",
			networkId: 5
		},
		31: {
			id: 32,
			type: "lobby",
			name: "keepme",
			networkId: 21
		}
	};
	let action = {
		type: actions.LEFT_NETWORK,
		networkId: 5
	};
	expect(channels(initial, action)).toEqual({31: initial[31]});
});

it("includes a new channel after JOINED_CHANNEL", () => {
	let channelInitialData = {
		id: 42,
		name: "#hi"
	};
	let action = {
		type: actions.JOINED_CHANNEL,
		networkId: 5,
		channelInitialData
	};
	expect(channels({}, action)).toEqual({42: {...channelInitialData, networkId: 5}});
});

it("drops a channel after LEFT_CHANNEL", () => {
	let initial = {
		42: {id: 42, type: "lobby"},
		31: {id: 31, type: "lobby"}
	};
	let action = {
		type: actions.LEFT_CHANNEL,
		channelId: 42
	};
	expect(channels(initial, action)).toEqual({31: initial[31]});
});

it("updates user list", () => {
	let initial = {
		42: {
			id: 42,
			name: "#thelounge",
			users: []
		}
	};
	let action = {
		type: actions.RECEIVED_CHANNEL_USERS,
		channelId: 42,
		users: [{name: "nornagon"}]
	};
	expect(channels(initial, action)[42].users).toEqual(action.users);
});

it("sets needsNamesRefresh", () => {
	let initial = {
		42: {
			id: 42,
			name: "#thelounge",
			users: [],
			needsNamesRefresh: false
		}
	};
	let action = {
		type: actions.CHANNEL_USERS_INVALIDATED,
		channelId: 42
	};
	expect(channels(initial, action)[42].needsNamesRefresh).toBe(true);
});

it("unsets needsNamesRefresh", () => {
	let initial = {
		42: {
			id: 42,
			name: "#thelounge",
			users: [],
			needsNamesRefresh: true
		}
	};
	let action = {
		type: actions.RECEIVED_CHANNEL_USERS,
		channelId: 42,
		users: [{name: "nornagon"}]
	};
	expect(channels(initial, action)[42].needsNamesRefresh).toBe(false);
});

it("changes the topic", () => {
	let initial = {
		42: {
			id: 42,
			name: "#thelounge",
			topic: "old topic"
		}
	};
	let action = {
		type: actions.TOPIC_CHANGED,
		channelId: 42,
		topic: "new topic"
	};
	expect(channels(initial, action)[42].topic).toBe("new topic");
});

it("appends new messages", () => {
	let initial = {
		42: {
			id: 42,
			name: "#thelounge",
			messages: [{type: "message", from: "nornagon", text: "hi"}]
		}
	};
	let action = {
		type: actions.MESSAGE_RECEIVED,
		channelId: 42,
		message: {type: "message", from: "astorije", text: "yo"}
	};
	expect(channels(initial, action)[42].messages.length).toBe(2);
	expect(channels(initial, action)[42].messages[0]).toBe(initial[42].messages[0]);
	expect(channels(initial, action)[42].messages[1]).toBe(action.message);
});

it("clears a channel", () => {
	let initial = {
		42: {
			id: 42,
			name: "#thelounge",
			messages: [{type: "message", from: "nornagon", text: "hi"}]
		}
	};
	let action = {
		type: actions.CLEAR_CHANNEL,
		channelId: 42
	};
	expect(channels(initial, action)[42].messages).toEqual([]);
	expect(channels(initial, action)[42].hasMore).toEqual(true);
});

it("receives history", () => {
	let initial = {
		42: {
			id: 42,
			name: "#thelounge",
			messages: [{id: 2, type: "message", from: "nornagon", text: "hi"}]
		}
	};
	let action = {
		type: actions.RECEIVED_MORE,
		channelId: 42,
		messages: [{id: 1, type: "message", from: "nornagon", text: "moo"}]
	};
	expect(channels(initial, action)[42].messages).toEqual([
		{id: 1, type: "message", from: "nornagon", text: "moo"},
		{id: 2, type: "message", from: "nornagon", text: "hi"}
	]);
});

it("doesn't receive duplicate history", () => {
	let initial = {
		42: {
			id: 42,
			name: "#thelounge",
			messages: [{id: 2, type: "message", from: "nornagon", text: "hi"}]
		}
	};
	let action = {
		type: actions.RECEIVED_MORE,
		channelId: 42,
		messages: [{id: 1, type: "message", from: "nornagon", text: "moo"}]
	};
	expect(channels(channels(initial, action), action)[42].messages).toEqual([
		{id: 1, type: "message", from: "nornagon", text: "moo"},
		{id: 2, type: "message", from: "nornagon", text: "hi"}
	]);
});

it("sets hasMore to false if it received a short history", () => {
	let initial = {
		42: {
			id: 42,
			name: "#thelounge",
			messages: [{id: 2, type: "message", from: "nornagon", text: "hi"}],
			hasMore: true
		}
	};
	let action = {
		type: actions.RECEIVED_MORE,
		channelId: 42,
		messages: [{id: 1, type: "message", from: "nornagon", text: "moo"}]
	};
	expect(channels(initial, action)[42].hasMore).toBe(false);
});

it("has a default case for unhandled channel-specific actions", () => {
	// TODO: maybe this should actually throw?
	let action = {channelId: 42};
	let initial = {42: {}};
	expect(channels(initial, action)[42]).toBe(initial[42]);
});

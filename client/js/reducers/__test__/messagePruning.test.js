import messagePruning from "../messagePruning";
import * as actions from "../../actions";

const times = (n, v) => {
	let result = [];
	for (let i = 0; i < n; i++) {
		result.push(v);
	}
	return result;
};

let state = {
	channels: {
		1: {
			id: 1,
			messages: times(105, {type: "message"})
		},
		2: {
			id: 2,
			messages: times(110, {type: "message"})
		}
	},
	activeChannelId: 2
};

it("has a default case", () => {
	expect(messagePruning(state, {})).toBe(state);
});

it("drops messages past the 100th in non-active channels", () => {
	let action = {
		type: actions.MESSAGE_RECEIVED,
		channelId: 1,
		message: {}
	};
	expect(messagePruning(state, action).channels[1].messages.length).toBe(100);
});

it("doesn't drop messages in the active channel", () => {
	let action = {
		type: actions.MESSAGE_RECEIVED,
		channelId: 2,
		message: {}
	};
	expect(messagePruning(state, action).channels[2].messages.length).toBe(110);
});

it("drops old messages when switching away", () => {
	let action = {
		type: actions.CHANGE_ACTIVE_CHANNEL,
		channelId: 1
	};
	expect(messagePruning(state, action).channels[2].messages.length).toBe(100);
});

it("doesn't drop old messages when CHANGE_ACTIVE_CHANNEL doesn't switch", () => {
	let action = {
		type: actions.CHANGE_ACTIVE_CHANNEL,
		channelId: state.activeChannelId
	};
	expect(messagePruning(state, action).channels[2].messages.length).toBe(110);
});

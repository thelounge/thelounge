import unreadTracking from "../unreadTracking";
import * as actions from "../../actions";
import {setIn} from "../../immutableUtils";

let initial = {
	channels: {
		1: {
			id: 1,
			firstUnread: 0,
			highlight: false,
			unread: 0
		},
		2: {
			id: 2,
			firstUnread: 0,
			highlight: false,
			unread: 0
		}
	},
	activeChannelId: 1
};

it("has a default case", () => {
	expect(unreadTracking(initial, {})).toBe(initial);
});

describe("firstUnread", () => {
	it("sets firstUnread when receiving a message in the background", () => {
		let action = {type: actions.MESSAGE_RECEIVED, channelId: 2, message: {id: 42}};
		expect(unreadTracking(initial, action).channels[2].firstUnread).toBe(42);
	});

	it("doesn't reset firstUnread when receiving further messages in the background", () => {
		let action1 = {type: actions.MESSAGE_RECEIVED, channelId: 2, message: {id: 42}};
		let action2 = {type: actions.MESSAGE_RECEIVED, channelId: 2, message: {id: 43}};
		let state1 = unreadTracking(initial, action1);
		let state2 = unreadTracking(state1, action2);
		expect(state2.channels[2].firstUnread).toBe(42);
	});

	it("doesn't set firstUnread when receiving messages in the active channel", () => {
		let action = {type: actions.MESSAGE_RECEIVED, channelId: 1, message: {id: 42}};
		expect(unreadTracking(initial, action).channels[1].firstUnread).toBe(0);
	});

	it("resets firstUnread to 0 when receiving a self message", () => {
		let initialWithFirstUnread = setIn(initial, ["channels", 2, "firstUnread"], 5)
		let action = {type: actions.MESSAGE_RECEIVED, channelId: 2, message: {id: 42, self: true}};
		expect(unreadTracking(initialWithFirstUnread, action).channels[2].firstUnread).toBe(0);
	});
});

describe("unread count", () => {
	it("increments unread when receiving a messages in the background", () => {
		let action = {type: actions.MESSAGE_RECEIVED, channelId: 2, message: {id: 42, type: "message"}};
		expect(unreadTracking(initial, action).channels[2].unread).toBe(1);
	});

	it("doesn't increment unread when receiving non-messages in the background", () => {
		let action = {type: actions.MESSAGE_RECEIVED, channelId: 2, message: {id: 42, type: "join"}};
		expect(unreadTracking(initial, action).channels[2].unread).toBe(0);
	});

	it("doesn't increment unread when receiving messages in the active channel", () => {
		let action = {type: actions.MESSAGE_RECEIVED, channelId: 1, message: {id: 42, type: "message"}};
		expect(unreadTracking(initial, action).channels[1].unread).toBe(0);
	});
});

describe("highlight", () => {
	it("sets highlight when receiving highlight messages in the background", () => {
		let action = {type: actions.MESSAGE_RECEIVED, channelId: 2, message: {id: 42, highlight: true}};
		expect(unreadTracking(initial, action).channels[2].highlight).toBe(true);
	});

	it("doesn't set highlight when receiving non-highlight messages in the background", () => {
		let action = {type: actions.MESSAGE_RECEIVED, channelId: 2, message: {id: 42, highlight: false}};
		expect(unreadTracking(initial, action).channels[2].highlight).toBe(false);
	});

	it("doesn't unset highlight when receiving non-highlight messages in the background", () => {
		let initialWithHighlight = setIn(initial, ["channels", 2, "highlight"], true)
		let action = {type: actions.MESSAGE_RECEIVED, channelId: 2, message: {id: 42, highlight: false}};
		expect(unreadTracking(initialWithHighlight, action).channels[2].highlight).toBe(true);
	});

	it("doesn't set highlight when receiving highlight messages in the active channel", () => {
		let action = {type: actions.MESSAGE_RECEIVED, channelId: 1, message: {id: 42, highlight: true}};
		expect(unreadTracking(initial, action).channels[1].highlight).toBe(false);
	});
});

describe("channel switching", () => {
	it("resets the unread count to 0 when switching away from a channel", () => {
		let initialWithUnread = setIn(initial, ["channels", 1, "unread"], 4);
		let action = {type: actions.CHANGE_ACTIVE_CHANNEL, channelId: 2};
		expect(unreadTracking(initialWithUnread, action).channels[1].unread).toBe(0);
	});

	it("resets the highlight flag when switching away from a channel", () => {
		let initialWithHighlight = setIn(initial, ["channels", 1, "highlight"], true)
		let action = {type: actions.CHANGE_ACTIVE_CHANNEL, channelId: 2};
		expect(unreadTracking(initialWithHighlight, action).channels[1].highlight).toBe(false);
	});

	it("doesn't reset firstUnread switching to a channel", () => {
		let initialWithFirstUnread = setIn(initial, ["channels", 2, "firstUnread"], 43)
		let action = {type: actions.CHANGE_ACTIVE_CHANNEL, channelId: 2};
		expect(unreadTracking(initialWithFirstUnread, action).channels[2].firstUnread).toBe(43);
	});

	it("resets firstUnread when switching away from a channel", () => {
		let initialWithFirstUnread = setIn(initial, ["channels", 1, "firstUnread"], 43)
		let action = {type: actions.CHANGE_ACTIVE_CHANNEL, channelId: 2};
		expect(unreadTracking(initialWithFirstUnread, action).channels[1].firstUnread).toBe(0);
	});

	it("leaves things alone when receiving a redundant channel change", () => {
		let initialWithFirstUnread = setIn(initial, ["channels", 1, "firstUnread"], 43)
		let action = {type: actions.CHANGE_ACTIVE_CHANNEL, channelId: 1};
		expect(unreadTracking(initialWithFirstUnread, action).channels[1].firstUnread).toBe(43);
	});
});

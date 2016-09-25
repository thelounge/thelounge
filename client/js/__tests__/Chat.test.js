import React from "react";
import {shallow} from "enzyme";

import Chat from "../Chat";

const makeChannel = (extras) =>
	({
		id: 1,
		type: "channel",
		name: "#test",
		topic: "test",
		hasMore: false,
		messages: [],
		users: [],
		...extras
	});

const makeMessage = (extras) =>
	({
		id: 0,
		type: "text",
		time: 0,
		from: "test-user",
		mode: "+",
		text: "test message",
		...extras
	});


describe("Basic functionality", () => {
	it("renders a channel", () => {
		const channel = makeChannel();
		const wrapper = shallow(<Chat channel={channel} />);
		expect(wrapper.contains(channel.name)).toBe(true);
		expect(wrapper.contains(<span title={channel.topic} className="topic">{channel.topic}</span>)).toBe(true);
		expect(wrapper.find(".messages").length).toBe(1);
		expect(wrapper.find(".messages *").length).toBe(0);
		expect(wrapper.find("UserList").length).toBe(1);
	});

	it("renders messages in a channel", () => {
		const channel = makeChannel({
			messages: [
				makeMessage({id: 0}),
				makeMessage({id: 1})
			],
		});
		const wrapper = shallow(<Chat channel={channel} />);
		expect(wrapper.find("Message").length).toBe(2);
	});

	it("doesn't show a user list on lobby channels", () => {
		const channel = makeChannel({type: "lobby"});
		const wrapper = shallow(<Chat channel={channel} />);
		expect(wrapper.find(".rt").length).toBe(0);
	});
});

describe("Show more messages", () => {
	it("renders a 'show more messages' button if hasMore", () => {
		const channel = makeChannel({hasMore: true});
		const wrapper = shallow(<Chat channel={channel} />);
		expect(wrapper.find(".show-more.show").length).toBe(1);
	});
});

describe("Unread marker presence", () => {
	it("renders an unread marker", () => {
		const channel = makeChannel({
			firstUnread: 1,
			messages: [
				makeMessage({id: 0}),
				makeMessage({id: 1})
			],
		});
		const wrapper = shallow(<Chat channel={channel} />);
		expect(wrapper.find("UnreadMarker").length).toBe(1);
		expect(wrapper.find(".messages").children().length).toBe(3);
		// Unread marker should be immediately before the message with the id == firstUnread
		expect(wrapper.find(".messages").childAt(1).name()).toBe("UnreadMarker");
	});

	it("doesn't render an unread marker if the firstUnread id is not present in the message list", () => {
		const channel = makeChannel({
			hasMore: true,
			firstUnread: 123,
			messages: [
				makeMessage({id: 0}),
				makeMessage({id: 1}),
			],
		});
		const wrapper = shallow(<Chat channel={channel} />);
		expect(wrapper.find("UnreadMarker").length).toBe(0);
		expect(wrapper.find(".messages").children().length).toBe(2);
	});
});

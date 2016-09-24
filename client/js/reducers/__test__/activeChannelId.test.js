import activeChannelId from "../activeChannelId";
import * as actions from "../../actions";

it("initializes", () => {
	expect(activeChannelId(undefined, {})).toBe(null);
});

it("receives initial data", () => {
	let action = {type: actions.INITIAL_DATA_RECEIVED, data: {active: 3}};
	expect(activeChannelId(null, action)).toBe(3);
});

it("changes when asked", () => {
	let action = {type: actions.CHANGE_ACTIVE_CHANNEL, channelId: 3};
	expect(activeChannelId(null, action)).toBe(3);
});

it("switches to a new channel when /join happens", () => {
	let action = {type: actions.JOINED_CHANNEL, networkId: 1, channelInitialData: {id: 3}};
	expect(activeChannelId(null, action)).toBe(3);
});

it("switches to a network's lobby when /connect happens", () => {
	let action = {type: actions.JOINED_NETWORK, networkInitialData: {channels: [{id: 3}]}};
	expect(activeChannelId(null, action)).toBe(3);
});

it("doesn't automatically switch to a query", () => {
	let action = {type: actions.JOINED_CHANNEL, networkId: 1, channelInitialData: {id: 3, type: "query"}};
	expect(activeChannelId(42, action)).toBe(42);
});

it("automatically switches to a query if shouldOpen", () => {
	let action = {type: actions.JOINED_CHANNEL, networkId: 1, channelInitialData: {id: 3, type: "query", shouldOpen: true}};
	expect(activeChannelId(42, action)).toBe(3);
});

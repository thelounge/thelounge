import networks from "../networks";
import * as actions from "../../actions";

it("initializes", () => {
	expect(networks(undefined, {})).toEqual([]);
});

it("receives initial data", () => {
	let action = {
		type: actions.INITIAL_DATA_RECEIVED,
		data: {
			networks: [
	{
		id: 5,
		channels: [
			{ id: 42 },
			{ id: 43 }
		]
	}
			]
		}
	};
	expect(networks([], action)).toEqual([
		{
			id: 5,
			channels: [42, 43]
		}
	]);
});

it("adds a network", () => {
	let action = {
		type: actions.JOINED_NETWORK,
		networkInitialData: {
			id: 5,
			channels: [
				{ id: 42 },
				{ id: 43 }
			]
		}
	};
	expect(networks([], action)).toEqual(
		[{id: 5, channels: [42, 43]}]
	);
	expect(networks([{id: 4, channels: []}], action)).toEqual(
		[{id: 4, channels: []}, {id: 5, channels: [42, 43]}]
	);
});

it("drops a network", () => {
	let action = {
		type: actions.LEFT_NETWORK,
		networkId: 5
	};
	let initial = [
		{id: 4},
		{id: 5},
		{id: 6}
	];
	expect(networks(initial, action).length).toBe(initial.length - 1);
	expect(networks(initial, action).find(n => n.id === action.networkId)).toBeUndefined();
});

it("joins a channel", () => {
	let action = {
		type: actions.JOINED_CHANNEL,
		networkId: 5,
		channelInitialData: {id: 42}
	};
	let initial = [
		{id: 5, channels: [41]}
	];
	expect(networks(initial, action)[0].channels).toEqual([41, 42]);
});

it("leaves a channel", () => {
	let action = {
		type: actions.LEFT_CHANNEL,
		channelId: 42
	};
	let initial = [
		{id: 5, channels: [41, 42, 43]}
	];
	expect(networks(initial, action)[0].channels).toEqual([41, 43]);
});

it("changes a nick", () => {
	let action = {
		type: actions.NICK_CHANGED,
		networkId: 5,
		nick: "nornagon-new"
	};
	let initial = [
		{id: 5, nick: "nornagon-old"},
		{id: 6, nick: "dont-touch-me"}
	];
	expect(networks(initial, action)[0].nick).toBe("nornagon-new");
	expect(networks(initial, action)[1].nick).toBe("dont-touch-me");
});

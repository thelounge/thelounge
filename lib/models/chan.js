var _ = require("lodash");

module.exports = Chan;

Chan.Type = {
	CHANNEL: "channel",
	LOBBY: "lobby",
	QUERY: "query"
};

function Chan(attr) {
	_.merge(this, _.extend({
		id: global.id = ++global.id || 1,
		type: Chan.Type.CHANNEL,
		name: "",
		messages: [],
		users: []
	}));
}

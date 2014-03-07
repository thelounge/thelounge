var _ = require("lodash");
var moment = require("moment");

var models = exports;
var id = 1;

models.Network = function(attr) {
	attr = attr || {};
	_.extend(this, _.defaults(attr, {
		id: id++,
		address: "",
		nick: "",
		channels: []
	}));
};

models.Network.prototype.toJSON = function() {
	return _.omit(this, "client");
};

models.Channel = function(attr) {
	attr = attr || {};
	_.extend(this, _.defaults(attr, {
		id: id++,
		name: "",
		type: "channel",
		topic: "",
		users: [],
		messages: []
	}));
};

models.User = function(attr) {
	attr = attr || {};
	_.extend(this, _.defaults(attr, {
		id: id++,
		name: ""
	}));
};

models.Message = function(attr) {
	attr = attr || {};
	_.extend(this, _.defaults(attr, {
		time: moment().format("HH:mm"),
		user: "",
		text: ""
	}));
};

models.Event = function(attr) {
	attr = attr || {};
	_.extend(this, _.defaults(attr, {
		action: "",
		data: "",
		target: "",
		type: ""
	}));
};

models.Target = function(attr) {
	attr = attr || {};
	_.extend(this, _.defaults(attr, {
		network: "",
		channel: ""
	}));
};

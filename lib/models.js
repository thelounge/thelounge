var _        = require("lodash");
var Backbone = require("backbone");

var id = 1;
var models =
	module.exports =
		{};

models.User = Backbone.Model.extend({
	defaults: {
		mode: "",
		name: "",
	}
});

models.Users = Backbone.Collection.extend({
	model: models.User,
	sort: function() {
		this.models = _.sortBy(
			this.models,
			function(user) {
				return user.get("name").toLowerCase();
			}
		);
		this.trigger("sort", {}, this);
	}
});

models.Message = Backbone.Model.extend({
	defaults: {
		type:    "",
		time:    "",
		from:    "-!-",
		message: "",
	},
	initialize: function() {
		this.set("time", require("moment")().format("HH:mm"));
	}
});

models.Messages = Backbone.Collection.extend({
	model: models.Message
});

models.Channel = Backbone.Model.extend({
	defaults: {
		type: "channel",
		name: "",
	},
	initialize: function() {
		var users = new models.Users;
		users.on("all", function(action, data) {
			this.trigger("user", {
				action: action,
				target: this.get("id"),
				data:   users,
			});
		}, this);
		
		var messages = new models.Messages;
		messages.on("all", function(action, data) {
			this.trigger("message", {
				action: action,
				target: this.get("id"),
				data:   data,
			});
		}, this);
		
		this.set({
			id:       id++,
			users:    users,
			messages: messages,
		});
	}
});

models.Channels = Backbone.Collection.extend({
	model: models.Channel
});

models.Network = Backbone.Model.extend({
	defaults: {
		host:   "",
		client: null,
	},
	initialize: function() {
		this.set({
			id:       id++,
			channels: new models.Channels,
		});
		
		this.get("channels").on("all", function(action, data) {
			if (action == "message"
				|| action == "user") {
				return this.trigger(action, data);
			}
			this.trigger("channel", {
				action: action,
				target: this.get("id"),
				data:   data,
			});
		}, this);
		
		this.get("channels").add({
			type: "network",
			name: this.get("host")
		});
	},
	toJSON: function() {
		return _.omit(this.attributes, "client");
	}
});

models.Networks = Backbone.Collection.extend({
	model: models.Network,
	initialize: function() {
		this.add({host: "Status"});
	},
	find: function(id) {
		var i = this.models.length;
		while (i--) {
			var find = this.models[i].get("channels").findWhere({id: id});
			if (find) {
				return {
					network: this.models[i],
					channel: find
				};
			}
		}
	}
});

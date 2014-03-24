var _ = require("lodash");
var Backbone = require("backbone");
var moment   = require("moment");

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
	sort: function(options) {
		this.models = _.sortBy(
			this.models,
			function(user) {
				return user.get("name").toLowerCase();
			}
		);

		// Iterate all the modes and move users with these
		// modes to the top of the collection.
		var modes = ["+", "@"];
		for (var i in modes) {
			this.models = _.remove(this.models, function(user) {
				if (user.get("mode") == modes[i]) {
					return true;
				}
			}).concat(this.models);
		}
	}
});

models.Message = Backbone.Model.extend({
	defaults: {
		type: "",
		time: "",
		from: "",
		message: "",
	},
	initialize: function() {
		this.set("time", moment().format("HH:mm"));
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
	addUser: function(models) {
		this.get("users").add(models);
	},
	addMessage: function(models) {
		this.get("messages").add(models);
	},
	initialize: function() {
		this.set({
			id:       id++,
			messages: new models.Messages,
			users:    new models.Users,
		});

		this.get("messages").on("all", function(action, data) {
			this.trigger("message", {
				target: this.get("id"),
				type:   "message",
				data:   data,
				action: action,
			});
		}, this);

		this.get("users").on("all", function(action, data) {
			this.trigger("user", {
				target: this.get("id"),
				type:   "user",
				data:   data,
				action: action,
			});
		}, this);
	}
});

models.Channels = Backbone.Collection.extend({
	model: models.Channel
});

models.Network = Backbone.Model.extend({
	defaults: {
		host: ""
	},
	addChannel: function(models) {
		this.get("channels").add(models);
	},
	initialize: function() {
		this.set({
			id:       id++,
			channels: new models.Channels,
		});

		this.get("channels").on("message user", function() { this.trigger(action, data); }, this);
		this.get("channels").on("all", function(action, data) {
			this.trigger("channel", {
				target: this.get("id"),
				type:   "channel",
				data:   data,
				action: action,
			});
		}, this);

		this.addChannel({
			type: "network",
			name: this.get("host")
		});
	}
});

models.Networks = Backbone.Collection.extend({
	model: models.Network,
	initialize: function() {
		this.add({host: "Status"});
	},
	find: function(id) {
		var networks = this.models;
		for (var i = 0; i < networks.length; i++) {
			var find = networks[i].get("channels").findWhere({id: id});
			if (find) {
				return {
					network: networks[i],
					channel: find
				};
			}
		}
	}
});

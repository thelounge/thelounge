var irc = require("irc");
var _ = require("lodash");
var Backbone = require("backbone");
var moment = require("moment");

var models =
	module.exports =
		{};

var id = 1;

models.User = Backbone.Model.extend({
	defaults: {
		mode: "",
		name: ""
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
		time: "",
		user: "",
		text: "",
		type: ""
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
		name: ""
	},
	initialize: function() {
		this.set({
			id: id++
		});

		this.set("messages", new models.Messages());
		this.get("messages").on("all", function(action, data) {
			this.trigger("MESSAGES", {
				target: this.get("id"),
				type: "message",
				data: data,
				action: action
			});
		}, this);

		this.set("users", new models.Users());
		this.get("users").on("all", function(action) {
			this.trigger("USERS", {
				target: this.get("id"),
				type: "user",
				data: this.get("users"),
				action: action
			});
		}, this);
	}
});

models.Channels = Backbone.Collection.extend({
	model: models.Channel
});

models.Network = Backbone.Model.extend({
	defaults: {
		host: "",
		nick: "nick"
	},
	initialize: function() {
		this.set({
			id: id++
		});

		this.set("channels", new models.Channels());
		this.get("channels").on("all", function(action, data) {
			if (action == "USERS" || action == "MESSAGES") {
				this.trigger(action, data);
			} else {
				this.trigger("CHANNELS", {
					target: this.get("id"),
					type: "channel",
					data: data,
					action: action
				});
			}
		}, this);

		this.get("channels").add(new models.Channel({
			type: "network",
			name: this.get("host")
		}));
	}
});

models.Networks = Backbone.Collection.extend({
	model: models.Network,
	initialize: function() {
		this.add(new models.Network({
			host: "Lobby",
			connect: false
		}));
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

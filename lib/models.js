var irc = require("irc");
var Backbone = require("backbone");
var moment = require("moment");

// Local library
var config = require("./../config.js");

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

models.UserCollection = Backbone.Collection.extend({
	model: models.User,
	comparator: function(user) {
		// Keep the collection sorted in alphabetical order
		return user.get("name");
	}
});

models.Message = Backbone.Model.extend({
	defaults: {
		time: "",
		user: "",
		text: "",
		type: "normal"
	},
	initialize: function() {
		this.set("time", moment().format("HH:mm"));
	}
});

models.MessageCollection = Backbone.Collection.extend({
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

		this.set("users", new models.UserCollection());
		this.get("users").on("all", function() {
			this.trigger("users", {
				target: this.get("id"),
				data: this.get("users")
			});
		}, this);

		this.set("messages", new models.MessageCollection());
		this.get("messages").on("all", function() {
			this.trigger("messages", {
				target: this.get("id"),
				data: this.get("messages").last()
			});
		}, this);
	}
});

models.ChannelCollection = Backbone.Collection.extend({
	model: models.Channel
});

models.Network = Backbone.Model.extend({
	defaults: {
		host: "",
		nick: config.nick,
		connect: true
	},
	initialize: function() {
		this.set({
			id: id++
		});

		this.set("channels", new models.ChannelCollection());
		this.get("channels").on("all", function(type, data) {
			if (type == "users" || type == "messages") {
				this.trigger(type, data);
			} else {
				this.trigger("channels");
			}
		}, this);
		this.get("channels").add(new models.Channel({
			type: "network",
			name: this.get("host")
		}));

		if (this.get("connect")) {
			this.irc = new irc.Client(
				this.get("host"),
				this.get("nick"), {
					channels: config.channels
				}
			);
			this.irc.addListener(
				"error", function() {
					// ..
				}
			);
		}

		this.on("remove", function() {
			if (typeof this.irc !== "undefined") {
				this.irc.disconnect();
			}
		});
	}
});

models.NetworkCollection = Backbone.Collection.extend({
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

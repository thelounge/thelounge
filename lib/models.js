var _ = require("lodash");
var backbone = require("backbone");
var moment   = require("moment");

var id = 1;
var models =
	module.exports =
		{};

models.User = backbone.Model.extend({
	defaults: {
		mode: "",
		name: "",
	}
});

models.Users = backbone.Collection.extend({
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

models.Message = backbone.Model.extend({
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

models.Messages = backbone.Collection.extend({
	model: models.Message
});

models.Channel = backbone.Model.extend({
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
			this.trigger("message", {
				target: this.get("id"),
				type: "message",
				data: data,
				action: action
			});
		}, this);

		this.set("users", new models.Users());
		this.get("users").on("all", function(action) {
			this.trigger("user", {
				target: this.get("id"),
				type: "user",
				data: this.get("users"),
				action: action
			});
		}, this);
	}
});

models.Channels = backbone.Collection.extend({
	model: models.Channel
});

models.Network = backbone.Model.extend({
	defaults: {
		host: ""
	},
	initialize: function() {
		this.set({
			id: id++
		});

		this.set("channels", new models.Channels());
		this.get("channels").on("all", function(action, data) {
			if (action == "user" || action == "message") {
				this.trigger(action, data);
			} else {
				this.trigger("channel", {
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

models.Networks = backbone.Collection.extend({
	model: models.Network,
	initialize: function() {
		this.add(new models.Network({
			host: "Status"
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

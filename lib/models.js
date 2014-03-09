var irc = require("irc");
var Backbone = require("backbone");
var moment = require("moment");

var models =
	module.exports =
		{};

var id = 1;

models.User = Backbone.Model.extend({
	defaults: {
		mode: "",
		name: "user"
	}
});

models.UserCollection = Backbone.Collection.extend({
	model: models.User
});

models.Message = Backbone.Model.extend({
	defaults: {
		time: moment().format("HH:mm"),
		user: "",
		text: ""
	}
});

models.MessageCollection = Backbone.Collection.extend({
	model: models.Message
});

models.Channel = Backbone.Model.extend({
	defaults: {
		type: "channel",
		name: "",
		topic: ""
	},
	initialize: function() {
		this.set({
			id: id++,
			users: new models.UserCollection(),
			messages: new models.MessageCollection()
		});
	}
});

models.ChannelCollection = Backbone.Collection.extend({
	model: models.Channel
});

models.Network = Backbone.Model.extend({
	defaults: {
		host: "",
		nick: "default_username",
		connect: false
	},
	initialize: function() {
		this.set({
			id: id++,
			channels: new models.ChannelCollection()
		});
		if (this.get("connect")) {
			this.conn = new irc.Client(
				this.get("host"),
				this.get("nick"), {
					channels: ["#testchan"]
				}
			);
		}
		this.get("channels").add(new models.Channel({
			type: "network",
			name: this.get("host")
		}));
	}
});

models.NetworkCollection = Backbone.Collection.extend({
	model: models.Network,
	initialize: function() {
		this.add(new models.Network({
			host: "Lobby"
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

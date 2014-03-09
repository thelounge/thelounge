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

models.Message = Backbone.Model.extend({
	defaults: {
		time: moment().format("HH:mm"),
		user: "user",
		text: "text"
	}
});

models.Channel = Backbone.Model.extend({
	defaults: {
		type: "channel",
		name: "",
		topic: "",
		users: [],
		messages: []
	},
	initialize: function() {
		this.set({
			id: id++
		});
	}
});

models.ChannelCollection = Backbone.Collection.extend({
	model: models.Channel
});

models.Network = Backbone.Model.extend({
	defaults: {
		host: "",
	},
	initialize: function() {
		this.set({
			id: id++,
			channels: new models.ChannelCollection()
		});
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
	getChannel: function(id) {
		var networks = this.models;
		for (var i = 0; i < networks.length; i++) {
			var find = networks[i].get("channels").findWhere({id: id});
			if (find) {
				return find;
			}
		}
	}
});

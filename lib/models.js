var models = exports;
var id = 0;

models.Network = function() {
	this.id = id++;
	this.address = "";
	this.nick = "";
	this.channels = [];
};

models.Channel = function() {
	this.id = id++;
	this.name = "";
	this.type = "channel";
	this.topic = "";
	this.users = [];
	this.messages = [];
};

models.User = function() {
	this.id = id++;
	this.name = "";
};

models.Message = function() {
	this.text = "";
	this.time = "";
	this.user = "";
};

models.Event = function() {
	this.action = "";
	this.data = "";
	this.target = "";
	this.type = "";
};

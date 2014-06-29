$(function() {
	new Shout();
});

function Shout() {
	var client = this;
	var socket = io();
	var events = [
		"auth",
		"init",
		"join",
		"msg",
		"network",
		"nick",
		"part",
		"quit",
		"users"
	].forEach(function(e) {
		client[e].call(client, socket);
	});
}

Shout.prototype.auth = function(socket) {
	socket.on("auth", function(data) {
		console.log(data);
	});
};

Shout.prototype.init = function(socket) {
	socket.on("init", function(data) {
		console.log(data);
	});
};

Shout.prototype.join = function(socket) {
	socket.on("join", function(data) {
		console.log(data);
	});
};

Shout.prototype.msg = function(socket) {
	socket.on("msg", function(data) {
		console.log(data);
	});
};

Shout.prototype.network = function(socket) {
	socket.on("network", function(data) {
		console.log(data);
	});
};

Shout.prototype.nick = function(socket) {
	socket.on("nick", function(data) {
		console.log(data);
	});
};

Shout.prototype.part = function(socket) {
	socket.on("part", function(data) {
		console.log(data);
	});
};

Shout.prototype.quit = function(socket) {
	socket.on("quit", function(data) {
		console.log(data);
	});
};

Shout.prototype.users = function(socket) {
	socket.on("users", function(data) {
		console.log(data);
	});
};

var tpl = [];
function render(name, data) {
	tpl[name] = tpl[name] || Handlebars.compile($("#templates ." + name).html());
	return tpl[name](data);
}

function escape(text) {
	var e = {
		"<": "&lt;",
		">": "&gt;"
	};
	return text.replace(/[<>]/g, function (c) {
		return e[c];
	});
}

Handlebars.registerHelper(
	"partial", function(id) {
		return new Handlebars.SafeString(render(id, this));
	}
);

Handlebars.registerHelper(
	"uri", function(text) {
		var urls = [];
		text = URI.withinString(text, function(url) {
			urls.push(url);
			return "$(" + (urls.length - 1) + ")";	
		});
		text = escape(text);
		for (var i in urls) {
			var url = escape(urls[i]);
			text = text.replace(
				"$(" + i + ")",
				"<a href='" + url.replace(/^www/, "//www") + "' target='_blank'>" + url + "</a>"
			);
		}
		return text;
	}
);

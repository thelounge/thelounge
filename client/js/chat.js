$(function() {
	var socket = io();
	var commands = [
		"/ame",
		"/amsg",
		"/close",
		"/connect",
		"/deop",
		"/devoice",
		"/disconnect",
		"/invite",
		"/join",
		"/kick",
		"/leave",
		"/mode",
		"/msg",
		"/nick",
		"/notice",
		"/op",
		"/part",
		"/partall",
		"/query",
		"/quit",
		"/raw",
		"/say",
		"/send",
		"/server",
		"/slap",
		"/topic",
		"/voice",
		"/whoami",
		"/whois"
	];
	
	var chat = $("#chat");
	var networks = $("#networks");
	
	var channels = [];
	var activeChannel = null;
	
	var tpl = [];
	function render(name, data) {
		tpl[name] = tpl[name] || Handlebars.compile($("#templates ." + name).html());
		return tpl[name](data);
	}

	socket.on("auth", function(data) {
		console.log(data);
	});
	
	socket.on("init", function(data) {
		console.log("INIT");
		networks.empty();
		channels = $.map(data.networks, function(n) {
			return n.channels;
		});
		networks.append(
			render("networks", {
				networks: data.networks
			})
		);
		networks.find(".chan")
			.eq(0)
			.trigger("click");
	});
	
	socket.on("join", function(data) {
		channels.push(data.chan);
		var network = networks
			.find(".network[data-id='" + data.network + "']")
			.eq(0);
		network.append(
			render("channels", {
				channels: [data.chan]
			})
		);
		network.find(".chan")
			.last()
			.trigger("click");
	});
	
	socket.on("msg", function(data) {
		var chan = find(data.chan);
		if (typeof chan !== "undefined") {
			chan.messages.push(data.msg);
			if (isActive(chan)) {
				chat.find("#messages").append(
					render("messages", {
						messages: [data.msg]
					})
				);
			}
		}
	});
	
	socket.on("network", function(data) {
		networks.append(
			render("networks", {
				networks: [data.network]
			})
		);
	});
	
	socket.on("nick", function(data) {
		console.log(data);
	});
	
	socket.on("part", function(data) {
		networks.find(".chan[data-id='" + data.chan + "']")
			.remove()
			.end()
			.find(".chan")
			.eq(0)
			.trigger("click");
	});
	
	socket.on("quit", function(data) {
		networks.find(".network[data-id='" + data.network + "']")
			.remove()
			.end()
			.find(".chan")
			.eq(0)
			.trigger("click");
	});
	
	socket.on("users", function(data) {
		var chan = find(data.chan);
		if (typeof chan !== "undefined") {
			chan.users = data.users;
			if (isActive(chan)) {
				chat.find(".sidebar")
					.html(render("users", chan));
			}
		}
	});
	
	var input = $("#input").tab(complete, {
		hint: false
	});
	
	var form = $("#form").on("submit", function(e) {
		e.preventDefault();
		var value = input.val();
		input.val("");
		socket.emit("input", {
			target: chat.data("target"),
			text: value
		});
	});
	
	networks.on("click", ".chan", function() {
		var self = $(this);
		var id = self.data("id");
		
		networks.find(".active").removeClass("active");
		self.addClass("active");
		
		chat.data("target", id);
		
		var chan = find(id);
		if (typeof chan !== "undefined") {
			activeChannel = chan;
			chat.html(render("chat", chan));
			chat.find(".window")
				.sticky()
				.scrollBottom();
		}
	});
	
	chat.on("input", "#search", function() {
		var val = $(this).val();
		$("#users").find("button").each(function() {
			var btn = $(this);
			if (btn.text().toLowerCase().indexOf(val) === 0) {
				btn.show();
			} else {
				btn.hide();
			}
		});
	});
	
	function isActive(chan) {
		return activeChannel !== null && chan == activeChannel;
	}
	
	function find(id) {
		return $.grep(channels, function(c) {
			return c.id == id;
		})[0];
	}
	
	function complete(word) {
		return $.grep(
			commands,
			function(w) {
				return !w.toLowerCase().indexOf(word.toLowerCase());
			}
		);
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
});

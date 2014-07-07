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
		"/whois"
	];
	
	var sidebar = $("#sidebar");
	var chat = $("#chat");
	
	var networks = $("#networks");
	var channels = [];
	var active = null;
	
	var tpl = [];
	function render(name, data) {
		tpl[name] = tpl[name] || Handlebars.compile($("#templates ." + name).html());
		return tpl[name](data);
	}

	socket.on("auth", function(data) {
		console.log(data);
	});
	
	socket.on("init", function(data) {
		networks.empty();
		channels = $.map(data.networks, function(n) {
			return n.channels;
		});
		networks.append(
			render("networks", {
				networks: data.networks
			})
		).fadeIn();
		var active = $($.cookie("active"));
		if (active.length === 0) {
			active = networks.find(".chan").eq(0);
		}
		active.trigger("click");
	});
	
	socket.on("join", function(data) {
		channels.push(data.chan);
		var id = data.network;
		var network = networks
			.find("#network-" + id)
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
					render("messages", {messages: [data.msg]})
				);
			}
		}
	});
	
	socket.on("network", function(data) {
		var lobby = data.network.channels[0];
		channels.push(lobby);
		networks.append(
			render("networks", {
				networks: [data.network]
			})
		);
		networks.find(".chan")
			.last()
			.trigger("click");
	});
	
	socket.on("nick", function(data) {
		console.log(data);
	});
	
	socket.on("part", function(data) {
		var id = data.chan;
		networks.find("#chan-" + id)
			.remove()
			.end()
			.find(".chan")
			.eq(0)
			.trigger("click");
	});
	
	socket.on("quit", function(data) {
		var id = data.network;
		networks.find("#network-" + id)
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
				chat.find(".sidebar").html(render("users", chan));
			}
		}
	});
	
	var input = $("#input")
		.history()
		.tab(complete, {hint: false});
	
	var form = $("#form").on("submit", function(e) {
		e.preventDefault();
		var value = input.val();
		input.val("");
		socket.emit("input", {
			target: active.id || -1,
			text: value
		});
	});
	
	sidebar.on("click", "button:not(.active)", function() {
		var btn = $(this);
		var id = "#" + btn.attr("id");
		
		$.cookie("active", id);
		
		sidebar.find(".active").removeClass("active");
		btn.addClass("active");
		
		active = null;
		if (btn.hasClass("chan")) {
			var chan = find(id.replace("#chan-", ""));
			if (typeof chan !== "undefined") {
				active = chan;
				chat.fadeIn();
				chat.siblings().hide();
				chat.html(render("chat", chan));
				chat.find(".window")
					.sticky()
					.scrollBottom();
			}
		} else {
			chat.empty();
			var target = $(btn.data("target"));
			if (target.length !== 0) {
				target.fadeIn();
				target.siblings().hide();
			}
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
	
	chat.on("click", ".user", function() {
		var user = $(this).text();
		if (user.indexOf("#") !== -1) {
			return;
		}
		socket.emit("input", {
			target: active.id || -1,
			text: "/whois " + user
		});
	});
	
	function isActive(chan) {
		return active !== null && chan == active;
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

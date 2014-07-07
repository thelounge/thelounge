$(function() {
	var socket = io();
	var commands = [
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
	
	var pop = new Audio();
	pop.src = "/audio/pop.ogg";
	
	var favico = new Favico({
		animation: "none"
	});
	
	var tpl = [];
	function render(name, data) {
		tpl[name] = tpl[name] || Handlebars.compile($("#templates ." + name).html());
		return tpl[name](data);
	}
	
	Handlebars.registerHelper(
		"partial", function(id) {
			return new Handlebars.SafeString(render(id, this));
		}
	);

	socket.on("auth", function(data) {
		console.log(data);
	});
	
	socket.on("init", function(data) {
		var channels = $.map(data.networks, function(n) {
			return n.channels;
		});
		sidebar.find(".networks").html(
			render("networks", {
				networks: data.networks
			})
		);
		chat.html(
			render("chat", {
				channels: channels
			})
		);
		var id = $.cookie("target");
		var target = sidebar.find("[data-target=" + id + "]");
		if (target.length !== 0) {
			target.trigger("click");
		} else {
			sidebar.find(".chan")
				.eq(0)
				.trigger("click");
		}
	});
	
	socket.on("join", function(data) {
		var id = data.network;
		var network = sidebar.find("#network-" + id);
		network.append(
			render("channels", {
				channels: [data.chan]
			})
		);
		chat.append(
			render("chat", {
				channels: [data.chan]
			})
		);
		sidebar.find(".chan")
			.last()
			.trigger("click");
	});
	
	socket.on("msg", function(data) {
		var target = "#chan-" + data.chan;
		chat.find(target)
			.find(".messages")
			.append(render("messages", {messages: [data.msg]}))
			.trigger("msg", [
				target,
				data.msg
			]);
	});
	
	socket.on("network", function(data) {
		sidebar.find(".networks").append(
			render("networks", {
				networks: [data.network]
			})
		);
		sidebar.find(".chan")
			.last()
			.trigger("click");
	});
	
	socket.on("nick", function(data) {
		console.log(data);
	});
	
	socket.on("part", function(data) {
		var id = data.chan;
		sidebar.find("[data-target=#chan-" + id + "]")
			.remove()
			.end()
			.find(".chan")
			.eq(0)
			.trigger("click");
	});
	
	socket.on("quit", function(data) {
		var id = data.network;
		sidebar.find("#network-" + id)
			.remove()
			.end()
			.find(".chan")
			.eq(0)
			.trigger("click");
	});
	
	socket.on("users", function(data) {
		chat.find("#chan-" + data.chan)
			.find(".users")
			.html(render("users", data));
	});
	
	var viewport = $("#viewport");
	$("#rt, #lt").on("click", function(e) {
		var self = $(this);
		viewport.toggleClass(self.attr("id"));
		if (viewport.is(".lt, .rt")) {
			e.stopPropagation();
			chat.find(".chat").one("click", function() {
				viewport.removeClass("lt rt");
			});
		}
	});
	
	var input = $("#input")
		.history()
		.tab(complete, {hint: false});
	
	var form = $("#form").on("submit", function(e) {
		e.preventDefault();
		var text = input.val();
		input.val("");
		socket.emit("input", {
			target: chat.data("id"),
			text: text
		});
	});
	
	var top = 1;
	sidebar.on("click", "button:not(.active)", function() {
		var self = $(this);
		var target = self.data("target");
		if (!target) {
			return;
		}
		
		$.cookie("target", target);
		chat.data(
			"id",
			self.data("id")
		);
		
		sidebar.find(".active").removeClass("active");
		self.addClass("active")
			.find(".badge")
			.removeClass("highlight")
			.empty();
		
		if (sidebar.find(".highlight").length == 0) {
			favico.badge("");
		}
		
		$("#rt").toggle(self.hasClass("chan"));
		$("#header").find("h1").html(self.data("title"));
		viewport.removeClass();
		
		$("#windows .active").removeClass("active");
		var chan = $(target)
			.css("z-index", top++)
			.addClass("active")
			.find(".chat")
			.sticky();
	});
	
	chat.on("input", ".search", function() {
		var value = $(this).val();
		var names = $(this).closest(".users").find(".names");
		names.find("button").each(function() {
			var btn = $(this);
			if (btn.text().toLowerCase().indexOf(value) === 0) {
				btn.show();
			} else {
				btn.hide();
			}
		});
	});
	
	chat.on("click", ".user", function() {
		var user = $(this).html().trim().replace(/[+%@~]/, "");
		if (user.indexOf("#") !== -1) {
			return;
		}
		var text = "/whois " + user;
		socket.emit("input", {
			target: chat.data("id"),
			text: text
		});
	});
	
	chat.on("msg", ".messages", function(e, target, msg) {
		var type = msg.type;
		var highlight = type.contains("highlight");
		if (highlight) {
			pop.play();
			if (document.hidden || !$(target).hasClass("active")) {
				favico.badge("!");
			}
		}
		
		var btn = sidebar.find(".chan[data-target=" + target + "]:not(.active)");
		if (btn.length === 0) {
			return;
		}
		
		var ignore = [
			"join",
			"part",
			"quit",
			"nick"
		];
		if ($.inArray(type, ignore) !== -1){
			return;
		}
		
		var badge = btn.find(".badge");
		if (badge.length !== 0) {
			var i = (parseInt(badge.html()) || 0) + 1;
			badge.html(i);
			if (highlight) {
				badge.addClass("highlight");
			}
		}
	});
	
	function isActive(chan) {
		return active !== null && chan == active;
	}
	
	function complete(word) {
		return $.grep(
			commands,
			function(w) {
				return !w.toLowerCase().indexOf(word.toLowerCase());
			}
		);
	}
	
	document.addEventListener(
		"visibilitychange",
		function() {
			if (sidebar.find(".highlight").length == 0) {
				favico.badge("");
			}
		}
	);
});

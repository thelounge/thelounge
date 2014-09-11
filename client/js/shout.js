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

	try {
		var pop = new Audio();
		pop.src = "/audio/pop.ogg";
	} catch(e) {
		var pop = {
			play: $.noop
		};
	}

	$("#play").on("click", function() { pop.play(); });
	$("#footer .icon").tooltip();

	var favico = new Favico({
		animation: "none"
	});

	function render(name, data) {
		return Handlebars.templates[name](data);
	}

	Handlebars.registerHelper(
		"partial", function(id) {
			return new Handlebars.SafeString(render(id, this));
		}
	);

	socket.on("error", function(e) {
		console.log(e);
	});

	socket.on("connect_error", function(e) {
		location.reload();
	});

	socket.on("auth", function(data) {
		var body = $("body");
		var login = $("#sign-in");
		if (!login.length) {
			location.reload();
			return;
		}
		if (body.hasClass("signed-out")) {
			var error = login.find(".error");
			error.show().closest("form").one("submit", function() {
				error.hide();
			});
		}
		body.addClass("signed-out");
		var input = login.find("input[name='user']");
		if (input.val() === "") {
			input.val($.cookie("user") || "");
		}
		sidebar.find(".sign-in")
			.click()
			.end()
			.find(".networks")
			.html("")
			.next()
			.show();
	});

	socket.on("init", function(data) {
		if (data.networks.length === 0) {
			$("#footer").find(".connect").trigger("click");
			return;
		}

		sidebar.find(".networks").html(
			render("network", {
				networks: data.networks
			})
		);

		var channels = $.map(data.networks, function(n) {
			return n.channels;
		});
		chat.html(
			render("chat", {
				channels: channels
			})
		);

		sidebar.find(".empty").hide();
		$("body").removeClass("signed-out");
		$("#sign-in").detach();

		var id = $.cookie("target");
		var target = sidebar.find("[data-target='" + id + "']").trigger("click");
		if (target.length === 0) {
			var first = sidebar.find(".chan")
				.eq(0)
				.trigger("click");
			if (first.length === 0) {
				$("#footer").find(".connect").trigger("click");
			}
		}
	});

	socket.on("join", function(data) {
		var id = data.network;
		var network = sidebar.find("#network-" + id);
		network.append(
			render("chan", {
				channels: [data.chan]
			})
		);
		chat.append(
			render("chat", {
				channels: [data.chan]
			})
		);

		sidebar.find(".chan")
			.sort(function(a, b) { return $(a).data("id") - $(b).data("id") })
			.last()
			.trigger("click");
	});

	socket.on("msg", function(data) {
		var target = data.chan;
		if (data.msg.type == "error") {
			target = chat.find(".active").data("id");
		}
		target = "#chan-" + target;
		chat.find(target)
			.find(".messages")
			.append(render("msg", {messages: [data.msg]}))
			.trigger("msg", [
				target,
				data.msg
			]);
	});

	socket.on("more", function(data) {
		var target = data.chan;
		var chan = chat
			.find("#chan-" + target)
			.find(".messages")
			.prepend(render("msg", {messages: data.messages}))
			.end();
		if (data.messages.length != 100) {
			var more = chan
				.find(".show-more")
				.remove();
		}
	});

	socket.on("network", function(data) {
		sidebar.find(".empty").hide();
		sidebar.find(".networks").append(
			render("network", {
				networks: [data.network]
			})
		);
		chat.append(
			render("chat", {
				channels: data.network.channels
			})
		);
		sidebar.find(".chan")
			.last()
			.trigger("click");
		$("#connect")
			.find(".btn")
			.prop("disabled", false)
			.end()
			.find("input")
			.each(function() {
				var self = $(this);
				self.val(self.data("default"));
			});
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
			.end();
		var chan = sidebar.find(".chan")
			.eq(0)
			.trigger("click");
		if (chan.length === 0) {
			sidebar.find(".empty").show();
		}
	});

	socket.on("users", function(data) {
		chat.find("#chan-" + data.chan)
			.find(".users")
			.html(render("user", data));
	});

	$("#connect")
		.find("input")
		.each(function() {
			var self = $(this);
			self.data("default", self.val());
		});

	$.cookie.json = true;

	var settings = $("#settings");
	var options = $.extend({
		join: true,
		mode: true,
		motd: false,
		nick: true,
		notification: true,
		part: true,
		quit: true,
	}, $.cookie("settings"));

	for (var i in options) {
		if (options[i]) {
			settings.find("input[name=" + i + "]").prop("checked", true);
		}
	}

	settings.on("change", "input", function() {
		var self = $(this);
		var name = self.attr("name");
		options[name] = self.prop("checked");
		$.cookie("settings", options);
		if ([
			"join",
			"mode",
			"motd",
			"nick",
			"part",
			"quit",
		].indexOf(name) !== -1) {
			chat.toggleClass("hide-" + name, !self.prop("checked"));
		}
	}).find("input")
		.trigger("change");

	var viewport = $("#viewport");

	viewport.on("click", ".lt, .rt", function(e) {
		var self = $(this);
		viewport.toggleClass(self.attr("class"));
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
	sidebar.on("click", "button", function() {
		var self = $(this);
		var target = self.data("target");
		if (!target) {
			return;
		}

		if (self.hasClass("chan")) {
			$.cookie("target", target);
		}
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

		viewport.removeClass();
		$("#windows .active").removeClass("active");

		var chan = $(target)
			.addClass("active")
			.trigger("show")
			.css("z-index", top++)
			.find(".chat")
			.sticky()
			.end();

		if (screen.width > 768 && chan.hasClass("chan")) {
			input.focus();
		}
	});

	sidebar.on("click", "#sign-out", function() {
		location.reload();
	});

	sidebar.on("click", ".close", function() {
		var cmd = "/close";
		var chan = $(this).closest(".chan");
		if (chan.hasClass("lobby")) {
			cmd = "/quit";
			var server = chan
				.clone()
				.remove("span")
				.text()
				.trim();
			if (!confirm("Disconnect from " + server + "?")) {
				return false;
			}
		}
		socket.emit("input", {
			target: chan.data("id"),
			text: cmd
		});
		chan.css({
			transition: "none",
			opacity: .4
		});
		return false;
	});

	chat.on("input", ".search", function() {
		var value = $(this).val().toLowerCase();
		var names = $(this).closest(".users").find(".names");
		names.find("button").each(function() {
			var btn = $(this);
			var name = btn.text().toLowerCase().replace(/[+%@~]/, "");
			if (name.indexOf(value) === 0) {
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
		var btn = sidebar.find(".chan[data-target=" + target + "]:not(.active)");
		var query = btn.hasClass("query");
		var type = msg.type;
		var highlight = type.contains("highlight");
		if (highlight || query) {
			pop.play();
			if (document.hidden || !$(target).hasClass("active")) {
				favico.badge("!");
			}
		}

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
			if (highlight || query) {
				badge.addClass("highlight");
			}
		}
	});

	chat.on("click", ".show-more", function() {
		var self = $(this);
		var id = self.data("id");
		var count = self.next(".messages").children().length;
		socket.emit("more", {
			target: id,
			count: count
		});
	});

	var windows = $("#windows");
	var forms = $("#sign-in, #connect");

	windows.on("show", "#sign-in", function() {
		var self = $(this);
		var inputs = self.find("input");
		inputs.each(function() {
			var self = $(this);
			if (self.val() === "") {
				self.focus();
				return false;
			}
		})
	});

	windows.on("click", ".input", function() {
		$(this).select();
	});

	forms.on("submit", "form", function(e) {
		e.preventDefault()
		var event = "auth";
		var form = $(this);
		if (form.closest(".window").attr("id") == "connect") {
			event = "conn";
			form.find(".btn")
				.attr("disabled", true)
				.end();
		}
		var values = {};
		$.each(form.serializeArray(), function(i, obj) {
			if (obj.value !== "") {
				values[obj.name] = obj.value;
			}
		});
		if (values.user) {
			$.cookie("user", values.user);
		}
		socket.emit(
			event, values
		);
	});

	Mousetrap.bind([
		"command+up",
		"command+down",
		"ctrl+up",
		"ctrl+down"
	], function(e, keys) {
		var channels = sidebar.find(".chan");
		var index = channels.index(channels.filter(".active"));

		var direction = keys.split("+").pop();
		switch (direction) {
		case "up":
			var i = Math.max(0, index - 1);
			channels.eq(i).click();
			break;

		case "down":
			var i = Math.min(channels.length, index + 1);
			channels.eq(i).click();
			break;
		}
	});

	function complete(word) {
		var words = commands.slice();
		var users = chat.find(".active")
			.find(".names")
			.children()
			.each(function() {
				words.push($(this).text().replace(/[+%@~]/, ""));
			});
		var channels = sidebar.find(".channel")
			.each(function() {
				var chan = $(this).clone().remove("span").text().trim();
				words.push(chan);
			});
		return $.grep(
			words,
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

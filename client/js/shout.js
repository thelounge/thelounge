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

	var sidebar = $("#sidebar, #footer");
	var chat = $("#chat");

	if (navigator.standalone) {
		$("html").addClass("web-app-mode");
	}

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

	$(".tse-scrollable").TrackpadScrollEmulator();

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

	$.each(["connect_error", "disconnect"], function(i, e) {
		socket.on(e, function() {
			refresh();
		});
	});

	socket.on("auth", function(data) {
		var body = $("body");
		var login = $("#sign-in");
		if (!login.length) {
			refresh();
			return;
		}
		login.find(".btn").prop("disabled", false);
		var token = $.cookie("token");
		if (token) {
			$.removeCookie("token");
			socket.emit("auth", {token: token});
		}
		if (body.hasClass("signed-out")) {
			var error = login.find(".error");
			error.show().closest("form").one("submit", function() {
				error.hide();
			});
		}
		if (!token) {
			body.addClass("signed-out");
		}
		var input = login.find("input[name='user']");
		if (input.val() === "") {
			input.val($.cookie("user") || "");
		}
		if (token) {
			return;
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
		} else {
			sidebar.find(".empty").hide();
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
			confirmExit();
		}

		if (data.token) {
			$.cookie(
				"token",
				data.token, {
					expires: expire(30)
				}
			);
		}

		$("body").removeClass("signed-out");
		$("#sign-in").detach();

		var id = data.active;
		var target = sidebar.find("[data-id='" + id + "']").trigger("click");
		if (target.length === 0) {
			var first = sidebar.find(".chan")
				.eq(0)
				.trigger("click");
			if (first.length === 0) {
				$("#footer").find(".connect").trigger("click");
			}
		}

		sortable();
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
		var chan = sidebar.find(".chan")
			.sort(function(a, b) { return $(a).data("id") - $(b).data("id"); })
			.last();
		if (!whois) {
			chan = chan.filter(":not(.query)");
		}
		whois = false;
		chan.click();
	});

	socket.on("msg", function(data) {
		var target = "#chan-" + data.chan;
		if (data.msg.type == "error") {
			target = "#chan-" + chat.find(".active").data("id");
		}

		var chan = chat.find(target);
		var from = data.msg.from;

		chan.find(".messages")
			.append(render("msg", {messages: [data.msg]}))
			.trigger("msg", [
				target,
				data.msg
			]);

		if (!chan.hasClass("channel")) {
			return;
		}

		var type = data.msg.type;
		if (type == "message" || type == "action") {
			var nicks = chan.find(".users").data("nicks");
			if (nicks) {
				var find = nicks.indexOf(from);
				if (find !== -1 && typeof move === "function") {
					move(nicks, find, 0);
				}
			}
		}
	});

	socket.on("more", function(data) {
		var target = data.chan;
		var chan = chat
			.find("#chan-" + target)
			.find(".messages")
			.prepend(render("msg", {messages: data.messages}))
			.end();
		if (data.messages.length != 100) {
			chan.find(".show-more").removeClass("show");
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
			.end();
		confirmExit();
		sortable();
	});

	socket.on("nick", function(data) {
		var id = data.network;
		var nick = data.nick;
		var network = sidebar.find("#network-" + id).data("nick", nick);
		if (network.find(".active").length) {
			setNick(nick);
		}
	});

	socket.on("part", function(data) {
		var id = data.chan;
		sidebar.find(".chan[data-id='" + id + "']").remove();
		$("#chan-" + id).remove();

		var next = null;
		var highest = -1;
		chat.find(".chan").each(function() {
			var self = $(this);
			var z = parseInt(self.css("z-index"));
			if (z > highest) {
				highest = z;
				next = self;
			}
		});

		if (next !== null) {
			var id = next.data("id");
			sidebar.find("[data-id=" + id + "]").click();
		} else {
			sidebar.find(".chan")
				.eq(0)
				.click();
		}
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

	socket.on("toggle", function(data) {
		var toggle = $("#toggle-" + data.id);
		toggle.parent().after(render("toggle", {toggle: data}));
		switch (data.type) {
		case "link":
			if (options.links) {
				toggle.click();
			}
			break;

		case "image":
			if (options.thumbnails) {
				toggle.click();
			}
			break;
		}
	});

	socket.on("topic", function(data) {
		// .text() escapes HTML but not quotes. That only matters with text inside attributes.
		var topic = $("#chan-" + data.chan).find(".header .topic");
		topic.text(data.topic);
		// .attr() is safe escape-wise but consider the capabilities of the attribute
		topic.attr("title", data.topic);
	});

	socket.on("users", function(data) {
		var users = chat.find("#chan-" + data.chan).find(".users").html(render("user", data));
		var nicks = [];
		for (var i in data.users) {
			nicks.push(data.users[i].name);
		}
		users.data("nicks", nicks);
	});

	$.cookie.json = true;

	var settings = $("#settings");
	var options = $.extend({
		badge: false,
		colors: false,
		join: true,
		links: true,
		mode: true,
		motd: false,
		nick: true,
		notification: true,
		part: true,
		thumbnails: true,
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
		$.cookie(
			"settings",
			options, {
				expires: expire(365)
			}
		);
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
		if (name == "colors") {
			chat.toggleClass("no-colors", !self.prop("checked"));
		}
	}).find("input")
		.trigger("change");

	$("#badge").on("change", function() {
		var self = $(this);
		if (self.prop("checked")) {
			if (Notification.permission != "granted") {
				Notification.requestPermission();
			}
		}
	});

	var viewport = $("#viewport");

	viewport.on("click", ".lt, .rt", function(e) {
		var self = $(this);
		viewport.toggleClass(self.attr("class"));
		if (viewport.is(".lt, .rt")) {
			e.stopPropagation();
			chat.find(".chat").one("click", function() {
				viewport.removeClass("lt");
			});
		}
	});

	var input = $("#input")
		.history()
		.tab(complete, {hint: false});

	var form = $("#form");
	var submit = $("#submit");

	form.on("submit", function(e) {
		e.preventDefault();
		var text = input.val();
		input.val("");
		if (text.indexOf("/clear") === 0) {
			clear();
			return;
		}
		socket.emit("input", {
			target: chat.data("id"),
			text: text
		});
	});

	chat.on("click", ".messages", function() {
		setTimeout(function() {
			var text = "";
			if (window.getSelection) {
				text = window.getSelection().toString();
			} else if (document.selection && document.selection.type != "Control") {
				text = document.selection.createRange().text;
			}
			if (!text) {
				focus();
			}
		}, 2);
	});

	$(window).on("focus", focus);

	function focus() {
		var chan = chat.find(".active");
		if (screen.width > 768 && chan.hasClass("chan")) {
			input.focus();
		}
	}

	var top = 1;
	sidebar.on("click", ".chan, button", function() {
		var self = $(this);
		var target = self.data("target");
		if (!target) {
			return;
		}

		chat.data(
			"id",
			self.data("id")
		);
		socket.emit(
			"open",
			self.data("id")
		);

		sidebar.find(".active").removeClass("active");
		self.addClass("active")
			.find(".badge")
			.removeClass("highlight")
			.data("count", "")
			.empty();

		if (sidebar.find(".highlight").length === 0) {
			favico.badge("");
		}

		viewport.removeClass("lt");
		$("#windows .active").removeClass("active");

		var chan = $(target)
			.addClass("active")
			.trigger("show")
			.css("z-index", top++)
			.find(".chat")
			.sticky()
			.end();

		var title = "Shout";
		if (chan.data("title")) {
			title = chan.data("title") + " — " + title;
		}
		document.title = title;

		if (self.hasClass("chan")) {
			var nick = self
				.closest(".network")
				.data("nick");
			if (nick) {
				setNick(nick);
			}
		}

		if (screen.width > 768 && chan.hasClass("chan")) {
			input.focus();
		}
	});

	sidebar.on("click", "#sign-out", function() {
		$.removeCookie("token");
		location.reload();
	});

	sidebar.on("click", ".close", function() {
		var cmd = "/close";
		var chan = $(this).closest(".chan");
		if (chan.hasClass("lobby")) {
			cmd = "/quit";
			var server = chan.find(".name").html();
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
			opacity: 0.4
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

	var whois = false;
	chat.on("click", ".user", function() {
		var user = $(this).text().trim().replace(/[+%@~&]/, "");
		if (user.indexOf("#") !== -1) {
			return;
		}
		whois = true;
		var text = "/whois " + user;
		socket.emit("input", {
			target: chat.data("id"),
			text: text
		});
	});

	chat.on("click", ".close", function() {
		var id = $(this)
			.closest(".chan")
			.data("id");
		sidebar.find(".chan[data-id='" + id + "']")
			.find(".close")
			.click();
	});

	chat.on("msg", ".messages", function(e, target, msg) {
		var button = sidebar.find(".chan[data-target=" + target + "]");
		var isQuery = button.hasClass("query");
		var type = msg.type;
		var highlight = type.contains("highlight");
		if (highlight || isQuery) {
			if (!document.hasFocus() || !$(target).hasClass("active")) {
				var settings = $.cookie("settings") || {};
				if (settings.notification) {
					pop.play();
				}
				favico.badge("!");
				if (settings.badge && Notification.permission == "granted") {
					var notify = new Notification(msg.from + " says:", {
						body: msg.text.trim(),
						icon: "/img/logo-64.png"
					});
					notify.onclick = function() {
						window.focus();
						button.click();
						this.close();
					};
					window.setTimeout(function() {
						notify.close();
					}, 5 * 1000);
				}
			}
		}

		button = button.filter(":not(.active)");
		if (button.length === 0) {
			return;
		}

		var ignore = [
			"join",
			"part",
			"quit",
			"nick",
			"mode",
		];
		if ($.inArray(type, ignore) !== -1){
			return;
		}

		var badge = button.find(".badge");
		if (badge.length !== 0) {
			var i = (badge.data("count") || 0) + 1;
			badge.data("count", i);
			badge.html(i > 999 ? (i / 1000).toFixed(1) + "k" : i);
			if (highlight || isQuery) {
				badge.addClass("highlight");
			}
		}
	});

	chat.on("click", ".show-more-button", function() {
		var self = $(this);
		var count = self.parent().next(".messages").children().length;
		socket.emit("more", {
			target: self.data("id"),
			count: count
		});
	});

	chat.on("click", ".toggle-button", function() {
		var self = $(this);
		var chat = self.closest(".chat");
		var bottom = chat.isScrollBottom();
		var content = self.parent().next(".toggle-content");
		if (bottom && !content.hasClass("show")) {
			var img = content.find("img");
			if (img.length != 0 && !img.width()) {
				img.on("load", function() {
					chat.scrollBottom();
				});
			}
		}
		content.toggleClass("show");
		if (bottom) {
			chat.scrollBottom();
		}
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
		});
	});

	windows.on("click", ".input", function() {
		$(this).select();
	});

	forms.on("submit", "form", function(e) {
		e.preventDefault();
		var event = "auth";
		var form = $(this);
		form.find(".btn")
			.attr("disabled", true)
			.end();
		if (form.closest(".window").attr("id") == "connect") {
			event = "conn";
		}
		var values = {};
		$.each(form.serializeArray(), function(i, obj) {
			if (obj.value !== "") {
				values[obj.name] = obj.value;
			}
		});
		if (values.user) {
			$.cookie(
				"user",
				values.user, {
					expires: expire(30)
				}
			);
		}
		socket.emit(
			event, values
		);
	});

	forms.on("input", ".nick", function() {
		var nick = $(this).val();
		forms.find(".username").val(nick);
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
			// Loop
			var upTarget = (channels.length + (index - 1 + channels.length)) % channels.length;
			channels.eq(upTarget).click();
			break;

		case "down":
			// Loop
			var downTarget = (channels.length + (index + 1 + channels.length)) % channels.length;
			channels.eq(downTarget).click();
			break;
		}
	});

	Mousetrap.bind([
		"command+k",
		"ctrl+l",
		"ctrl+shift+l"
	], function (e) {
		if(e.target === input[0]) {
			clear();
		}
	});

	setInterval(function() {
		chat.find(".chan:not(.active)").each(function() {
			var chan = $(this);
			if (chan.find(".messages").children().slice(0, -100).remove().length) {
				chan.find(".show-more").addClass("show");
			}
		});
	}, 1000 * 10);

	function clear() {
		chat.find(".active .messages").empty();
		chat.find(".active .show-more").addClass("show");
	}

	function complete(word) {
		var words = commands.slice();
		var users = chat.find(".active").find(".users");
		var nicks = users.data("nicks");

		if (!nicks) {
			nicks = [];
			users.find(".user").each(function() {
				var nick = $(this).text().replace(/[~&@%+]/, "");
				nicks.push(nick);
			});
			users.data("nicks", nicks);
		}

		for (var i in nicks) {
			words.push(nicks[i]);
		}

		var channels = sidebar.find(".chan")
			.each(function() {
				var self = $(this);
				if (!self.hasClass("lobby")) {
					words.push(self.data("title"));
				}
			});

		return $.grep(
			words,
			function(w) {
				return !w.toLowerCase().indexOf(word.toLowerCase());
			}
		);
	}

	function confirmExit() {
		if ($("body").hasClass("public")) {
			window.onbeforeunload = function() {
				return "Are you sure you want to navigate away from this page?";
			};
		}
	}

	function refresh() {
		window.onbeforeunload = null;
		location.reload();
	}

	function expire(days) {
		var date = new Date();
		date.setTime(date.getTime() + ((3600 * 1000 * 24) * days));
		return date;
	}

	function sortable() {
		sidebar.sortable({
			axis: "y",
			containment: "parent",
			cursor: "grabbing",
			distance: 12,
			items: ".network",
			handle: ".lobby",
			placeholder: "network-placeholder",
			forcePlaceholderSize: true,
			update: function() {
				var order = [];
				sidebar.find(".network").each(function() {
					var id = $(this).data("id");
					order.push(id);
				});
				socket.emit(
					"sort", {
						type: "networks",
						order: order
					}
				);
			}
		});
		sidebar.find(".network").sortable({
			axis: "y",
			containment: "parent",
			cursor: "grabbing",
			distance: 12,
			items: ".chan:not(.lobby)",
			placeholder: "chan-placeholder",
			forcePlaceholderSize: true,
			update: function(e, ui) {
				var order = [];
				var network = ui.item.parent();
				network.find(".chan").each(function() {
					var id = $(this).data("id");
					order.push(id);
				});
				socket.emit(
					"sort", {
						type: "channels",
						target: network.data("id"),
						order: order
					}
				);
			}
		});
	}

	function setNick(nick) {
		var width = $("#nick")
			.html(nick + ":")
			.width();
		if (width) {
			width += 31;
			input.css("padding-left", width);
		}
	}

	function move(array, old_index, new_index) {
		if (new_index >= array.length) {
			var k = new_index - array.length;
			while ((k--) + 1) {
				this.push(undefined);
			}
		}
		array.splice(new_index, 0, array.splice(old_index, 1)[0]);
		return array;
	};

	document.addEventListener(
		"visibilitychange",
		function() {
			if (sidebar.find(".highlight").length === 0) {
				favico.badge("");
			}
		}
	);
});

$(function() {
	var path = window.location.pathname + "socket.io/";
	var socket = io({path:path});
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

	var pop;
	try {
		pop = new Audio();
		pop.src = "audio/pop.ogg";
	} catch (e) {
		pop = {
			play: $.noop
		};
	}

	$("#play").on("click", function() { pop.play(); });

	$(".tse-scrollable").TrackpadScrollEmulator();

	var favicon = $("#favicon");

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

	socket.on("auth", function(/* data */) {
		var body = $("body");
		var login = $("#sign-in");
		if (!login.length) {
			refresh();
			return;
		}
		login.find(".btn").prop("disabled", false);
		var token = window.localStorage.getItem("token");
		if (token) {
			window.localStorage.removeItem("token");
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
			input.val(window.localStorage.getItem("user") || "");
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

	socket.on("change-password", function(data) {
		var passwordForm = $("#change-password");
		if (data.error || data.success) {
			var message = data.success ? data.success : data.error;
			var feedback = passwordForm.find(".feedback");

			if (data.success) {
				feedback.addClass("success").removeClass("error");
			} else {
				feedback.addClass("error").removeClass("success");
			}

			feedback.text(message).show();
			feedback.closest("form").one("submit", function() {
				feedback.hide();
			});
		}
		passwordForm
			.find("input")
			.val("")
			.end()
			.find(".btn")
			.prop("disabled", false);
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
			channels.forEach(renderChannelMessages);
			confirmExit();
		}

		if (data.token) {
			window.localStorage.setItem("token", data.token);
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
		renderChannelMessages(data.chan);
		var chan = sidebar.find(".chan")
			.sort(function(a, b) { return $(a).data("id") - $(b).data("id"); })
			.last();
		if (!whois) {
			chan = chan.filter(":not(.query)");
		}
		whois = false;
		chan.click();
	});

	function buildChatMessage(data) {
		var type = data.msg.type;
		var target = "#chan-" + data.chan;
		if (type === "error") {
			target = "#chan-" + chat.find(".active").data("id");
		}

		var chan = chat.find(target);
		var msg;

		if ([
			"invite",
			"join",
			"mode",
			"kick",
			"nick",
			"part",
			"quit",
			"topic",
			"action",
			"whois",
		].indexOf(type) !== -1) {
			data.msg.template = "actions/" + type;
			msg = $(render("msg_action", data.msg));
		} else {
			msg = $(render("msg", data.msg));
		}

		var text = msg.find(".text");
		if (text.find("i").size() === 1) {
			text = text.find("i");
		}

		if ((type === "message" || type === "action") && chan.hasClass("channel")) {
			var nicks = chan.find(".users").data("nicks");
			if (nicks) {
				var find = nicks.indexOf(data.msg.from);
				if (find !== -1 && typeof move === "function") {
					move(nicks, find, 0);
				}
			}
		}

		return msg;
	}

	function buildChannelMessages(channel, messages) {
		return messages.reduce(function(docFragment, message) {
			docFragment.append(buildChatMessage({
				chan: channel,
				msg: message
			}));
			return docFragment;
		}, $(document.createDocumentFragment()));
	}

	function renderChannelMessages(data) {
		var documentFragment = buildChannelMessages(data.id, data.messages);
		chat.find("#chan-" + data.id + " .messages").append(documentFragment);
	}

	socket.on("msg", function(data) {
		var msg = buildChatMessage(data);
		var target = "#chan-" + data.chan;
		chat.find(target + " .messages")
			.append(msg)
			.trigger("msg", [
				target,
				data.msg
			]);
	});

	socket.on("more", function(data) {
		var documentFragment = buildChannelMessages(data.chan, data.messages);
		var chan = chat
			.find("#chan-" + data.chan)
			.find(".messages")
			.prepend(documentFragment)
			.end();
		if (data.messages.length !== 100) {
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
			id = next.data("id");
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
		var topic = $("#chan-" + data.chan).find(".header .topic");
		topic.html(Handlebars.helpers.parse(data.topic));
		// .attr() is safe escape-wise but consider the capabilities of the attribute
		topic.attr("title", data.topic);
	});

	socket.on("users", function(data) {
		var chan = chat.find("#chan-" + data.chan);

		if (chan.hasClass("active")) {
			socket.emit("names", {
				target: data.chan
			});
		}
		else {
			chan.data("needsNamesRefresh", true);
		}
	});

	socket.on("names", function(data) {
		var users = chat.find("#chan-" + data.chan).find(".users").html(render("user", data));
		var nicks = [];
		for (var i in data.users) {
			nicks.push(data.users[i].name);
		}
		users.data("nicks", nicks);
	});

	var userStyles = $("#user-specified-css");
	var settings = $("#settings");
	var options = $.extend({
		desktopNotifications: false,
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
		notifyAllMessages: false,
		userStyles: userStyles.text(),
	}, JSON.parse(window.localStorage.getItem("settings")));

	for (var i in options) {
		if (i === "userStyles") {
			if (!/[\?&]nocss/.test(window.location.search)) {
				$(document.head).find("#user-specified-css").html(options[i]);
			}
			settings.find("#user-specified-css-input").val(options[i]);
			continue;
		}
		if (options[i]) {
			settings.find("input[name=" + i + "]").prop("checked", true);
		}
	}

	settings.on("change", "input, textarea", function() {
		var self = $(this);
		var name = self.attr("name");

		if (self.attr("type") === "checkbox") {
			options[name] = self.prop("checked");
		} else {
			options[name] = self.val();
		}

		window.localStorage.setItem("settings", JSON.stringify(options));

		if ([
			"join",
			"mode",
			"motd",
			"nick",
			"part",
			"quit",
			"notifyAllMessages",
		].indexOf(name) !== -1) {
			chat.toggleClass("hide-" + name, !self.prop("checked"));
		}
		if (name === "colors") {
			chat.toggleClass("no-colors", !self.prop("checked"));
		}
		if (name === "userStyles") {
			$(document.head).find("#user-specified-css").html(options[name]);
		}
	}).find("input")
		.trigger("change");

	$("#desktopNotifications").on("change", function() {
		var self = $(this);
		if (self.prop("checked")) {
			if (Notification.permission !== "granted") {
				Notification.requestPermission(updateDesktopNotificationStatus);
			}
		}
	});

	var viewport = $("#viewport");
	var contextMenuContainer = $("#context-menu-container");
	var contextMenu = $("#context-menu");

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

	function positionContextMenu(that, e) {
		var offset;
		var menuWidth = contextMenu.outerWidth();
		var menuHeight = contextMenu.outerHeight();

		if (that.hasClass("menu")) {
			offset = that.offset();
			offset.left -= menuWidth - that.outerWidth();
			offset.top += that.outerHeight();
			return offset;
		}

		offset = {left: e.pageX, top: e.pageY};

		if ((window.innerWidth - offset.left) < menuWidth) {
			offset.left = window.innerWidth - menuWidth;
		}

		if ((window.innerHeight - offset.top) < menuHeight) {
			offset.top = window.innerHeight - menuHeight;
		}

		return offset;
	}

	function showContextMenu(that, e) {
		var target = $(e.currentTarget);
		var output = "";

		if (target.hasClass("user")) {
			output = render("contextmenu_item", {
				class: "user",
				text: target.text(),
				data: target.data("name")
			});
		}
		else if (target.hasClass("chan")) {
			output = render("contextmenu_item", {
				class: "chan",
				text: target.data("title"),
				data: target.data("target")
			});
			output += render("contextmenu_divider");
			output += render("contextmenu_item", {
				class: "close",
				text: target.hasClass("lobby") ? "Disconnect" : target.hasClass("query") ? "Close" : "Leave",
				data: target.data("target")
			});
		}

		contextMenuContainer.show();
		contextMenu
			.html(output)
			.css(positionContextMenu($(that), e));

		return false;
	}

	viewport.on("contextmenu", ".user, .network .chan", function(e) {
		return showContextMenu(this, e);
	});

	viewport.on("click", "#chat .menu", function(e) {
		e.currentTarget = $(e.currentTarget).closest(".chan")[0];
		return showContextMenu(this, e);
	});

	contextMenuContainer.on("click contextmenu", function() {
		contextMenuContainer.hide();
		return false;
	});

	var input = $("#input")
		.history()
		.tab(complete, {hint: false});

	var form = $("#form");

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

	chat.on("click", ".inline-channel", function() {
		var chan = $(".network")
			.find(".chan.active")
			.parent(".network")
			.find(".chan[data-title='" + $(this).data("chan") + "']");
		if (chan.size() === 1) {
			chan.click();
		} else {
			socket.emit("input", {
				target: chat.data("id"),
				text: "/join " + $(this).data("chan")
			});
		}
	});

	chat.on("click", ".messages", function() {
		setTimeout(function() {
			var text = "";
			if (window.getSelection) {
				text = window.getSelection().toString();
			} else if (document.selection && document.selection.type !==  "Control") {
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
			toggleFaviconNotification(false);
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

		var title = "The Lounge";
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

		if (chan.data("needsNamesRefresh") === true) {
			chan.data("needsNamesRefresh", false);
			socket.emit("names", {target: self.data("id")});
		}

		if (screen.width > 768 && chan.hasClass("chan")) {
			input.focus();
		}
	});

	sidebar.on("click", "#sign-out", function() {
		window.localStorage.removeItem("token");
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

	contextMenu.on("click", ".context-menu-item", function() {
		switch ($(this).data("action")) {
		case "close":
			$(".networks .chan[data-target=" + $(this).data("data") + "] .close").click();
			break;
		case "chan":
			$(".networks .chan[data-target=" + $(this).data("data") + "]").click();
			break;
		case "user":
			$(".channel.active .users .user[data-name=" + $(this).data("data") + "]").click();
			break;
		}
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

	chat.on("msg", ".messages", function(e, target, msg) {
		var button = sidebar.find(".chan[data-target='" + target + "']");
		var isQuery = button.hasClass("query");
		if (msg.type === "invite" || msg.highlight || isQuery || (options.notifyAllMessages && msg.type === "message")) {
			if (!document.hasFocus() || !$(target).hasClass("active")) {
				if (options.notification) {
					pop.play();
				}
				toggleFaviconNotification(true);

				if (options.desktopNotifications && Notification.permission === "granted") {
					var title;
					var body;

					if (msg.type === "invite") {
						title = "New channel invite:";
						body = msg.from + " invited you to " + msg.text;
					} else {
						title = msg.from;
						if (!isQuery) {
							title += " (" + button.data("title").trim() + ")";
						}
						title += " says:";
						body = msg.text.replace(/\x02|\x1D|\x1F|\x16|\x0F|\x03(?:[0-9]{1,2}(?:,[0-9]{1,2})?)?/g, "").trim();
					}

					var notify = new Notification(title, {
						body: body,
						icon: "img/logo-64.png",
						tag: target
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
		if ($.inArray(msg.type, ignore) !== -1) {
			return;
		}

		var badge = button.find(".badge");
		if (badge.length !== 0) {
			var i = (badge.data("count") || 0) + 1;
			badge.data("count", i);
			badge.html(i > 999 ? (i / 1000).toFixed(1) + "k" : i);
			if (msg.highlight || isQuery) {
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
			if (img.length !== 0 && !img.width()) {
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
	var forms = $("#sign-in, #connect, #change-password");

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

	windows.on("show", "#settings", updateDesktopNotificationStatus);

	forms.on("submit", "form", function(e) {
		e.preventDefault();
		var event = "auth";
		var form = $(this);
		form.find(".btn")
			.attr("disabled", true)
			.end();
		if (form.closest(".window").attr("id") === "connect") {
			event = "conn";
		} else if (form.closest("div").attr("id") === "change-password") {
			event = "change-password";
		}
		var values = {};
		$.each(form.serializeArray(), function(i, obj) {
			if (obj.value !== "") {
				values[obj.name] = obj.value;
			}
		});
		if (values.user) {
			window.localStorage.setItem("user", values.user);
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
		"ctrl+shift+l"
	], function(e) {
		if (e.target === input[0]) {
			clear();
			e.preventDefault();
		}
	});

	Mousetrap.bind([
		"escape"
	], function() {
		contextMenuContainer.hide();
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

		sidebar.find(".chan")
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

	function updateDesktopNotificationStatus() {
		var checkbox = $("#desktopNotifications");
		var warning = $("#warnDisabledDesktopNotifications");

		if (Notification.permission === "denied") {
			checkbox.attr("disabled", true);
			checkbox.attr("checked", false);
			warning.show();
		} else {
			if (Notification.permission === "default" && checkbox.prop("checked")) {
				checkbox.attr("checked", false);
			}
			checkbox.attr("disabled", false);
			warning.hide();
		}
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
	}

	function toggleFaviconNotification(newState) {
		if (favicon.data("toggled") !== newState) {
			var old = favicon.attr("href");
			favicon.attr("href", favicon.data("other"));
			favicon.data("other", old);
			favicon.data("toggled", newState);
		}
	}

	document.addEventListener(
		"visibilitychange",
		function() {
			if (sidebar.find(".highlight").length === 0) {
				toggleFaviconNotification(false);
			}
		}
	);
});

import React from "react";
import ReactDOM from "react-dom";
import {createStore, applyMiddleware, bindActionCreators} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";

import Chats from "./Chats";

import app from "./reducers";
import * as actionCreators from "./actions";

$(function() {
	$("#loading-page-message").text("Connecting…");

	var path = window.location.pathname + "socket.io/";
	var socket = io({path: path});

	let createEmitMiddleware = socket => () => next => action => {
		if (action.type === "EMIT") {
			socket.emit(action.name, action.payload);
		}
		return next(action);
	};

	let store = createStore(
		app,
		applyMiddleware(
			thunk,
			createEmitMiddleware(socket)
		)
	);

	let actions = bindActionCreators(actionCreators, store.dispatch);

	function getChannel(channelId) {
		return store.getState().channels[channelId];
	}

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

	ReactDOM.render(
		<Provider store={store}>
			<Chats />
		</Provider>,
		chat[0]
	);

	var pop;
	try {
		pop = new Audio();
		pop.src = "audio/pop.ogg";
	} catch (e) {
		pop = {
			play: $.noop
		};
	}

	$("#play").on("click", function() {
		pop.play();
	});

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

	socket.on("auth", function(data) {
		var login = $("#sign-in");

		login.find(".btn").prop("disabled", false);

		if (!data.success) {
			window.localStorage.removeItem("token");

			var error = login.find(".error");
			error.show().closest("form").one("submit", function() {
				error.hide();
			});
		} else {
			var token = window.localStorage.getItem("token");
			if (token) {
				$("#loading-page-message").text("Authorizing…");
				socket.emit("auth", {token: token});
			}
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

		if (data.token && window.localStorage.getItem("token") !== null) {
			window.localStorage.setItem("token", data.token);
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
			actions.initialDataReceived(data);
			renderNetworks(data);
		}

		if (data.token && $("#sign-in-remember").is(":checked")) {
			window.localStorage.setItem("token", data.token);
		} else {
			window.localStorage.removeItem("token");
		}

		$("body").removeClass("signed-out");
		$("#loading").remove();
		$("#sign-in").remove();

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
	});

	socket.on("join", function(data) {
		var id = data.network;
		var network = sidebar.find("#network-" + id);
		network.append(
			render("chan", {
				channels: [data.chan]
			})
		);
		actions.joinedChannel(data.network, data.chan);

		// Queries do not automatically focus, unless the user did a whois
		if (data.chan.type === "query" && !data.shouldOpen) {
			return;
		}

		sidebar.find(".chan")
			.sort(function(a, b) {
				return $(a).data("id") - $(b).data("id");
			})
			.last()
			.click();
	});

	function renderNetworks(data) {
		sidebar.find(".empty").hide();
		sidebar.find(".networks").append(
			render("network", {
				networks: data.networks
			})
		);

		confirmExit();
		sortable();

		if (sidebar.find(".highlight").length) {
			toggleNotificationMarkers(true);
		}
	}

	function matchesSomeHighlight(msg) {
		return highlights.some(h =>
			msg.text.toLocaleLowerCase().indexOf(h.toLocaleLowerCase()) > -1
		);
	}
	function shouldHighlight(msg) {
		return (
			!msg.self &&
			["message", "notice", "action"].indexOf(msg.type) >= 0 &&
			matchesSomeHighlight(msg)
		);
	}
	socket.on("msg", function(data) {
		data.msg.highlight = data.msg.highlight || shouldHighlight(data.msg);

		actions.messageReceived(data.chan, data.msg);

		updateSidebar(data.chan, data.msg);
	});

	socket.on("more", function(data) {
		actions.receivedMore(data.chan, data.messages);
	});

	socket.on("network", function(data) {
		renderNetworks(data);
		actions.joinedNetwork(data.networks);

		sidebar.find(".chan")
			.last()
			.trigger("click");

		$("#connect")
			.find(".btn")
			.prop("disabled", false)
			.end();
	});

	socket.on("network_changed", function(data) {
		sidebar.find("#network-" + data.network).data("options", data.serverOptions);
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
		var chanMenuItem = sidebar.find(".chan[data-id='" + data.chan + "']");

		// When parting from the active channel/query, jump to the network's lobby
		if (chanMenuItem.hasClass("active")) {
			chanMenuItem.parent(".network").find(".lobby").click();
		}

		chanMenuItem.remove();

		actions.leftChannel(data.chan);
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
		actions.leftNetwork(id);
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

	socket.on("topic", ({chan, topic}) => actions.topicChanged(chan, topic));
	socket.on("users", ({chan}) => actions.channelUsersChanged(chan));
	socket.on("names", ({id, users}) => actions.receivedChannelUsers(id, users));

	var userStyles = $("#user-specified-css");
	var settings = $("#settings");
	var options = $.extend({
		coloredNicks: true,
		desktopNotifications: false,
		join: true,
		links: true,
		mode: true,
		motd: false,
		nick: true,
		notification: true,
		notifyAllMessages: false,
		part: true,
		quit: true,
		theme: $("#theme").attr("href").replace(/^themes\/(.*).css$/, "$1"), // Extracts default theme name, set on the server configuration
		thumbnails: true,
		userStyles: userStyles.text(),
	}, JSON.parse(window.localStorage.getItem("settings")));

	for (var i in options) {
		if (i === "userStyles") {
			if (!/[\?&]nocss/.test(window.location.search)) {
				$(document.head).find("#user-specified-css").html(options[i]);
			}
			settings.find("#user-specified-css-input").val(options[i]);
		} else if (i === "highlights") {
			settings.find("input[name=" + i + "]").val(options[i]);
		} else if (i === "theme") {
			$("#theme").attr("href", "themes/" + options[i] + ".css");
			settings.find("select[name=" + i + "]").val(options[i]);
		} else if (options[i]) {
			settings.find("input[name=" + i + "]").prop("checked", true);
		}
	}

	var highlights = [];

	settings.on("change", "input, select, textarea", function() {
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
		} else if (name === "coloredNicks") {
			chat.toggleClass("colored-nicks", self.prop("checked"));
		} else if (name === "theme") {
			$("#theme").attr("href", "themes/" + options[name] + ".css");
		} else if (name === "userStyles") {
			$(document.head).find("#user-specified-css").html(options[name]);
		} else if (name === "highlights") {
			var highlightString = options[name];
			highlights = highlightString.split(",").map(function(h) {
				return h.trim();
			}).filter(function(h) {
				// Ensure we don't have empty string in the list of highlights
				// otherwise, users get notifications for everything
				return h !== "";
			});
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
			chat.find(".chat").one("click", function(e) {
				e.stopPropagation();
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
		} else if (target.hasClass("chan")) {
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

	function resetInputHeight(input) {
		input.style.height = input.style.minHeight;
	}

	var input = $("#input")
		.history()
		.on("input keyup", function() {
			var style = window.getComputedStyle(this);

			// Start by resetting height before computing as scrollHeight does not
			// decrease when deleting characters
			resetInputHeight(this);

			this.style.height = Math.min(
				Math.round(window.innerHeight - 100), // prevent overflow
				this.scrollHeight
				+ Math.round(parseFloat(style.borderTopWidth) || 0)
				+ Math.round(parseFloat(style.borderBottomWidth) || 0)
			) + "px";
		})
		.tab(complete, {hint: false});

	var form = $("#form");

	form.on("submit", function(e) {
		e.preventDefault();
		var text = input.val();

		if (text.length === 0) {
			return;
		}

		input.val("");
		resetInputHeight(input.get(0));

		if (text.indexOf("/clear") === 0) {
			clear();
			return;
		}

		socket.emit("input", {
			target: chat.data("id"),
			text: text
		});
	});

	function findCurrentNetworkChan(name) {
		name = name.toLowerCase();

		return $(".network .chan.active")
			.parent(".network")
			.find(".chan")
			.filter(function() {
				return $(this).data("title").toLowerCase() === name;
			})
			.first();
	}

	chat.on("click", ".inline-channel", function() {
		var name = $(this).data("chan");
		var chan = findCurrentNetworkChan(name);

		if (chan.length) {
			chan.click();
		} else {
			socket.emit("input", {
				target: chat.data("id"),
				text: "/join " + name
			});
		}
	});

	chat.on("click", ".user", function() {
		var name = $(this).data("name");
		var chan = findCurrentNetworkChan(name);

		if (chan.length) {
			chan.click();
		}

		socket.emit("input", {
			target: chat.data("id"),
			text: "/whois " + name
		});
	});

	chat.on("click", ".chat", function() {
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
			.data("count", 0)
			.empty();

		if (sidebar.find(".highlight").length === 0) {
			toggleNotificationMarkers(false);
		}

		viewport.removeClass("lt");
		var lastActive = $("#windows > .active");

		lastActive
			.removeClass("active");

		var chan = $(target)
			.addClass("active")
			.trigger("show");

		var title = "The Lounge";
		if (chan.data("title")) {
			title = chan.data("title") + " — " + title;
		}
		document.title = title;

		if (self.hasClass("chan")) {
			$("#chat-container").addClass("active");
			setNick(self.closest(".network").data("nick"));
		}

		if (self.data("id")) {
			actions.channelOpened(self.data("id"));
		}
		actions.changeActiveChannel(self.data("id"));

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

	function updateSidebar(chan, msg) {
		if (msg.self) {
			return;
		}
		var target = "#chan-" + chan;

		var button = sidebar.find(".chan[data-target='" + target + "']");
		if (msg.highlight || (options.notifyAllMessages && msg.type === "message")) {
			if (!document.hasFocus() || !$(target).hasClass("active")) {
				if (options.notification) {
					pop.play();
				}
				toggleNotificationMarkers(true);

				if (options.desktopNotifications && Notification.permission === "granted") {
					var title;
					var body;

					if (msg.type === "invite") {
						title = "New channel invite:";
						body = msg.from + " invited you to " + msg.channel;
					} else {
						title = msg.from;
						if (!button.hasClass("query")) {
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

		if (button.hasClass("active")) {
			return;
		}

		var whitelistedActions = [
			"message",
			"notice",
			"action",
		];
		if (whitelistedActions.indexOf(msg.type) === -1) {
			return;
		}

		var badge = button.find(".badge");
		if (badge.length !== 0) {
			var i = (badge.data("count") || 0) + 1;
			badge.data("count", i);
			badge.html(Handlebars.helpers.roundBadgeNumber(i));
			if (msg.highlight) {
				badge.addClass("highlight");
			}
		}
	}

	chat.on("click", ".toggle-button", function() {
		$(this)
			.parent()
			.next(".toggle-content")
			.toggleClass("show");
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

	function clear() {
		actions.clearChannel(chat.data("id"));
	}

	function complete(partialWord) {
		let chan = getChannel(chat.data("id"));
		let recentSpeakers =
			chan.messages
				.filter(m => (m.type === "message" || m.type === "action") && !m.self)
				.map(m => m.from)
				.reverse();
		let recentSpeakerSet = new Set(recentSpeakers);
		let nicks = chan.users.map(u => u.name).filter(n => !recentSpeakerSet.has(n));
		let chans = [];
		for (let channelId in store.getState().channels) {
			let channel = store.getState().channels[channelId];
			if (channel.type !== "lobby") {
				chans.push(channel.name);
			}
		}

		let words = commands.concat(recentSpeakers).concat(nicks).concat(chans);

		return words.filter(w => w.toLowerCase().indexOf(partialWord.toLowerCase()) === 0);
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
		$("#nick").text(nick);
	}

	function toggleNotificationMarkers(newState) {
		// Toggles the favicon to red when there are unread notifications
		if (favicon.data("toggled") !== newState) {
			var old = favicon.attr("href");
			favicon.attr("href", favicon.data("other"));
			favicon.data("other", old);
			favicon.data("toggled", newState);
		}

		// Toggles a dot on the menu icon when there are unread notifications
		$("#viewport .lt").toggleClass("notified", newState);
	}

	document.addEventListener(
		"visibilitychange",
		function() {
			if (sidebar.find(".highlight").length === 0) {
				toggleNotificationMarkers(false);
			}
		}
	);
});

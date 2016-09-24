import React from "react";
import ReactDOM from "react-dom";
import {createStore, applyMiddleware, bindActionCreators} from "redux";
import {Provider, connect} from "react-redux";
import thunk from "redux-thunk";
import createLogger from "redux-logger";

import Chats from "./Chats";
import Sidebar from "./Sidebar";

import complete from './completion';

import app from "./reducers";
import * as actionCreators from "./actions";

function observeStore(store, select, onChange) {
  let currentState;

  function handleChange() {
    let nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

$(function() {
	$("#loading-page-message").text("Connecting…");

	var path = window.location.pathname + "socket.io/";
	var socket = io({path: path});

	let createEmitMiddleware = socket => () => next => action => {
		if (action.meta && action.meta.socket) {
			const {channel, data} = action.meta.socket;
			socket.emit(channel, data);
		}
		return next(action);
	};

	let store = createStore(
		app,
		applyMiddleware(
			thunk,
			createEmitMiddleware(socket),
			createLogger({collapsed: true})
		)
	);

	let actions = bindActionCreators(actionCreators, store.dispatch);

	var sidebar = $("#sidebar, #footer");
	var chat = $("#chat");
	var viewport = $("#viewport");
	var contextMenuContainer = $("#context-menu-container");
	var contextMenu = $("#context-menu");

	ReactDOM.render(
		<Provider store={store}>
			<Chats />
		</Provider>,
		chat[0]
	);

	let sidebarRoot = document.getElementById("sidebar");
	ReactDOM.render(
		<Provider store={store}>
			<Sidebar />
		</Provider>,
		sidebarRoot
	);
	sidebarRoot.parentNode.insertBefore(sidebarRoot.children[0], sidebarRoot);
	sidebarRoot.remove();

	const getActiveNick = (state) => {
		if (state.activeChannelId && state.channels[state.activeChannelId]) {
			let networkId = state.channels[state.activeChannelId].networkId;
			let network = state.networks.find(n => n.id === networkId);
			return network.nick;
		} else {
			return "";
		}
	};
	const CurrentNick = connect(
		(state) => ({nick: getActiveNick(state)})
	)(({nick}) => <span>{nick}</span>);

	ReactDOM.render(
		<Provider store={store}>
			<CurrentNick />
		</Provider>,
		document.getElementById("nick")
	);

	observeStore(
		store,
		state => state.activeWindowId,
		activeWindowId => {
			$("#windows > .active").removeClass("active");
			$(document.getElementById(activeWindowId)).addClass("active");
			viewport.removeClass("lt");
		}
	);

	observeStore(
		store,
		state => state.activeChannelId,
		(activeChannelId) => {
			viewport.removeClass("lt");
			focus();
			let title = "The Lounge";
			if (activeChannelId) {
				let chanTitle = store.getState().channels[activeChannelId].name;
				if (chanTitle) {
					title = `${chanTitle} - ${title}`;
				}
			}
			document.title = title;
		}
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
			actions.changeActiveWindow("connect");
		} else {
			actions.initialDataReceived(data);
			// renderNetworks(data);
		}

		if (data.token && $("#sign-in-remember").is(":checked")) {
			window.localStorage.setItem("token", data.token);
		} else {
			window.localStorage.removeItem("token");
		}

		$("body").removeClass("signed-out");
		$("#loading").remove();
		$("#sign-in").remove();
	});

	socket.on("join", ({network, chan}) => actions.joinedChannel(network, chan));

	function renderNetworks(data) {
		confirmExit();
		// sortable();

		/*
		if (sidebar.find(".highlight").length) {
			toggleNotificationMarkers(true);
		}
		*/
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

		maybeNotify(data.chan, data.msg);
	});

	socket.on("more", ({chan, messages}) => actions.receivedMore(chan, messages));

	socket.on("network", function(data) {
		actions.joinedNetwork(data.network);

		$("#connect")
			.find(".btn")
			.prop("disabled", false)
			.end();
	});

	socket.on("network_changed", function(data) {
		// sidebar.find("#network-" + data.network).data("options", data.serverOptions);
		// TODO: ^ seems unused?
	});

	socket.on("nick", ({network, nick}) => actions.nickChanged(network, nick));

	socket.on("part", ({chan}) => actions.leftChannel(chan));
	socket.on("quit", ({network}) => actions.leftNetwork(network));

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
		.tab((partialWord => complete(store.getState(), partialWord)), {hint: false});

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
			target: store.getState().activeChannelId,
			text: text
		});
	});

	function findChannelByName(name) {
		name = name.toLowerCase();

		const {channels, activeChannelId} = store.getState();
		const activeNetworkId = channels[activeChannelId].networkId;
		for (let k in channels) {
			const channel = channels[k];
			if (channel.networkId === activeNetworkId && channel.name.toLowerCase() === name) {
				return channel.id;
			}
		}
	}

	function switchToChannel(name, action) {
		const channelId = findChannelByName(name);
		if (channelId) {
			actions.changeActiveChannel(channelId);
		} else {
			const {activeChannelId} = store.getState();
			socket.emit("input", {
				target: activeChannelId,
				text: `${action} ${name}`
			});
		}
	}

	chat.on("click", ".inline-channel", function() {
		const name = $(this).data("chan");
		switchToChannel(name, "/join");
	});

	chat.on("click", ".user", function() {
		const name = $(this).data("name");
		switchToChannel(name, "/whois");
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

	$("#footer").on("click", "button", function() {
		var self = $(this);
		var target = self.data("target");
		if (!target) {
			return;
		}

		actions.changeActiveWindow(target.slice(1));
	});

	sidebar.on("click", "#sign-out", function() {
		window.localStorage.removeItem("token");
		location.reload();
	});

	contextMenu.on("click", ".context-menu-item", function() {
		switch ($(this).data("action")) {
		case "close":
			// TODO
			$(".networks .chan[data-target=" + $(this).data("data") + "] .close").click();
			break;
		case "chan":
			// TODO
			$(".networks .chan[data-target=" + $(this).data("data") + "]").click();
			break;
		case "user":
			// TODO
			$(".channel.active .users .user[data-name=" + $(this).data("data") + "]").click();
			break;
		}
	});

	function maybeNotify(chan, msg) {
		let isImportantMessage = !msg.self && (msg.highlight || (options.notifyAllMessages && msg.type === "message"));
		let {activeChannelId, activeWindowId} = store.getState();
		let chanHasFocus = document.hasFocus() && activeWindowId === "chat-container" && chan === activeChannelId;

		if (isImportantMessage && !chanHasFocus) {
			notify(chan, msg);
		}
	}

	function notify(chan, msg) {
		let channel = store.getState().channels[chan];
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
				if (channel.type !== "query") {
					title += " (" + channel.name.trim() + ")";
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
				actions.changeActiveChannel(channel.id);
				this.close();
			};
			window.setTimeout(function() {
				notify.close();
			}, 5 * 1000);
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

	Mousetrap.bind(["command+up", "ctrl+up"], () => actions.surfChannel(-1));
	Mousetrap.bind(["command+down", "ctrl+down"], () => actions.surfChannel(1));

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
		actions.clearChannel(store.getState().activeChannelId);
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

	/*
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
	*/

	// TODO
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

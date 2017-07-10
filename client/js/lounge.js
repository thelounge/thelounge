"use strict";

// vendor libraries
require("jquery-ui/ui/widgets/sortable");
require("jquery-textcomplete");
const $ = require("jquery");
const moment = require("moment");
const Mousetrap = require("mousetrap");
const URI = require("urijs");
const fuzzy = require("fuzzy");

// our libraries
const emojiMap = require("./libs/simplemap.json");
require("./libs/jquery/inputhistory");
require("./libs/jquery/stickyscroll");
require("./libs/jquery/tabcomplete");
const helpers_roundBadgeNumber = require("./libs/handlebars/roundBadgeNumber");
const slideoutMenu = require("./libs/slideout");
const templates = require("../views");
const socket = require("./socket");
require("./socket-events");
const constants = require("./constants");
const storage = require("./localStorage");
const utils = require("./utils");
require("./webpush");

$(function() {
	var sidebar = $("#sidebar, #footer");
	var chat = $("#chat");

	$(document.body).data("app-name", document.title);

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

	// Autocompletion Strategies

	const emojiSearchTerms = Object.keys(emojiMap);
	const emojiStrategy = {
		id: "emoji",
		match: /\B:([-+\w]*):?$/,
		search(term, callback) {
			const results = fuzzy.filter(
				term,
				emojiSearchTerms,
				{
					pre: "<b>",
					post: "</b>"
				}
			);
			callback(results.map((el) => [el.string, el.original]));
		},
		template([string, original]) {
			return `<span class="emoji">${emojiMap[original]}</span> ${string}`;
		},
		replace([, original]) {
			return emojiMap[original];
		},
		index: 1
	};

	const nicksStrategy = {
		id: "nicks",
		match: /\B(@([a-zA-Z_[\]\\^{}|`@][a-zA-Z0-9_[\]\\^{}|`-]*)?)$/,
		search(term, callback) {
			term = term.slice(1);
			if (term[0] === "@") {
				callback(completeNicks(term.slice(1)).map((val) => "@" + val));
			} else {
				callback(completeNicks(term));
			}
		},
		template(value) {
			return value;
		},
		replace(value) {
			return value;
		},
		index: 1
	};

	const chanStrategy = {
		id: "chans",
		match: /\B((#|\+|&|![A-Z0-9]{5})([^\x00\x0A\x0D\x20\x2C\x3A]+(:[^\x00\x0A\x0D\x20\x2C\x3A]*)?)?)$/,
		search(term, callback, match) {
			callback(completeChans(match[0]));
		},
		template(value) {
			return value;
		},
		replace(value) {
			return value;
		},
		index: 1
	};

	const commandStrategy = {
		id: "commands",
		match: /^\/(\w*)$/,
		search(term, callback) {
			callback(completeCommands("/" + term));
		},
		template(value) {
			return value;
		},
		replace(value) {
			return value;
		},
		index: 1
	};

	const foregroundColorStrategy = {
		id: "foreground-colors",
		match: /\x03(\d{0,2}|[A-Za-z ]{0,10})$/,
		search(term, callback) {
			term = term.toLowerCase();
			const matchingColorCodes = constants.colorCodeMap
				.filter((i) => i[0].startsWith(term) || i[1].toLowerCase().startsWith(term));

			callback(matchingColorCodes);
		},
		template(value) {
			return `<span class="irc-fg${parseInt(value[0], 10)}">${value[1]}</span>`;
		},
		replace(value) {
			return "\x03" + value[0];
		},
		index: 1
	};

	const backgroundColorStrategy = {
		id: "background-colors",
		match: /\x03(\d{2}),(\d{0,2}|[A-Za-z ]{0,10})$/,
		search(term, callback, match) {
			term = term.toLowerCase();
			const matchingColorCodes = constants.colorCodeMap
				.filter((i) => i[0].startsWith(term) || i[1].toLowerCase().startsWith(term))
				.map((pair) => pair.concat(match[1])); // Needed to pass fg color to `template`...

			callback(matchingColorCodes);
		},
		template(value) {
			return `<span class="irc-fg${parseInt(value[2], 10)} irc-bg irc-bg${parseInt(value[0], 10)}">${value[1]}</span>`;
		},
		replace(value) {
			return "\x03$1," + value[0];
		},
		index: 2
	};

	var options = require("./options");

	var windows = $("#windows");

	var viewport = $("#viewport");
	var sidebarSlide = slideoutMenu(viewport[0], sidebar[0]);
	var contextMenuContainer = $("#context-menu-container");
	var contextMenu = $("#context-menu");

	$("#main").on("click", function(e) {
		if ($(e.target).is(".lt")) {
			sidebarSlide.toggle(!sidebarSlide.isOpen());
		} else if (sidebarSlide.isOpen()) {
			sidebarSlide.toggle(false);
		}
	});

	viewport.on("click", ".rt", function(e) {
		var self = $(this);
		viewport.toggleClass(self.attr("class"));
		e.stopPropagation();
		chat.find(".chan.active .chat").trigger("msg.sticky");
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
			output = templates.contextmenu_item({
				class: "user",
				text: target.text(),
				data: target.data("name")
			});
		} else if (target.hasClass("chan")) {
			output = templates.contextmenu_item({
				class: "chan",
				text: target.data("title"),
				data: target.data("target")
			});
			output += templates.contextmenu_divider();
			output += templates.contextmenu_item({
				class: "close",
				text: target.hasClass("lobby") ? "Disconnect" : target.hasClass("channel") ? "Leave" : "Close",
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
		.on("input", function() {
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

			chat.find(".chan.active .chat").trigger("msg.sticky"); // fix growing
		})
		.tab(completeNicks, {hint: false})
		.on("autocomplete:on", function() {
			enableAutocomplete();
		});

	if (options.autocomplete) {
		enableAutocomplete();
	}

	function enableAutocomplete() {
		input.textcomplete([
			emojiStrategy, nicksStrategy, chanStrategy, commandStrategy,
			foregroundColorStrategy, backgroundColorStrategy
		], {
			dropdownClassName: "textcomplete-menu",
			placement: "top"
		}).on({
			"textComplete:show": function() {
				$(this).data("autocompleting", true);
			},
			"textComplete:hide": function() {
				$(this).data("autocompleting", false);
			}
		});
	}

	var focus = $.noop;
	if (!("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
		focus = function() {
			if (chat.find(".active").hasClass("chan")) {
				input.focus();
			}
		};

		$(window).on("focus", focus);

		chat.on("click", ".chat", function() {
			setTimeout(function() {
				var text = "";
				if (window.getSelection) {
					text = window.getSelection().toString();
				} else if (document.selection && document.selection.type !== "Control") {
					text = document.selection.createRange().text;
				}
				if (!text) {
					focus();
				}
			}, 2);
		});
	}

	$("#form").on("submit", function(e) {
		e.preventDefault();
		utils.forceFocus();
		var text = input.val();

		if (text.length === 0) {
			return;
		}

		input.val("");
		resetInputHeight(input.get(0));

		if (text.indexOf("/clear") === 0) {
			utils.clear();
			return;
		}

		if (text.indexOf("/collapse") === 0) {
			$(".chan.active .toggle-button.opened").click();
			return;
		}

		if (text.indexOf("/expand") === 0) {
			$(".chan.active .toggle-button:not(.opened)").click();
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

	$("button#set-nick").on("click", function() {
		utils.toggleNickEditor(true);

		// Selects existing nick in the editable text field
		var element = document.querySelector("#nick-value");
		element.focus();
		var range = document.createRange();
		range.selectNodeContents(element);
		var selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
	});

	$("button#cancel-nick").on("click", cancelNick);
	$("button#submit-nick").on("click", submitNick);

	function submitNick() {
		var newNick = $("#nick-value").text().trim();

		if (newNick.length === 0) {
			cancelNick();
			return;
		}

		utils.toggleNickEditor(false);

		socket.emit("input", {
			target: chat.data("id"),
			text: "/nick " + newNick
		});
	}

	function cancelNick() {
		utils.setNick(sidebar.find(".chan.active").closest(".network").data("nick"));
	}

	$("#nick-value").keypress(function(e) {
		switch (e.keyCode ? e.keyCode : e.which) {
		case 13: // Enter
			// Ensures a new line is not added when pressing Enter
			e.preventDefault();
			break;
		}
	}).keyup(function(e) {
		switch (e.keyCode ? e.keyCode : e.which) {
		case 13: // Enter
			submitNick();
			break;
		case 27: // Escape
			cancelNick();
			break;
		}
	});

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

	chat.on("click", ".condensed-text", function() {
		$(this).closest(".msg.condensed").toggleClass("closed");
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

	sidebar.on("click", ".chan, button", function(e, data) {
		// Pushes states to history web API when clicking elements with a data-target attribute.
		// States are very trivial and only contain a single `clickTarget` property which
		// contains a CSS selector that targets elements which takes the user to a different view
		// when clicked. The `popstate` event listener will trigger synthetic click events using that
		// selector and thus take the user to a different view/state.
		if (data && data.pushState === false) {
			return;
		}
		const self = $(this);
		const target = self.data("target");
		if (!target) {
			return;
		}
		const state = {};

		if (self.hasClass("chan")) {
			state.clickTarget = `.chan[data-id="${self.data("id")}"]`;
		} else {
			state.clickTarget = `#footer button[data-target="${target}"]`;
		}

		if (history && history.pushState) {
			if (data && data.replaceHistory && history.replaceState) {
				history.replaceState(state, null, null);
			} else {
				history.pushState(state, null, null);
			}
		}
	});

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
			.empty();

		if (sidebar.find(".highlight").length === 0) {
			utils.toggleNotificationMarkers(false);
		}

		sidebarSlide.toggle(false);

		var lastActive = $("#windows > .active");

		lastActive
			.removeClass("active")
			.find(".chat")
			.unsticky();

		var lastActiveChan = lastActive
			.find(".chan.active")
			.removeClass("active");

		lastActiveChan
			.find(".unread-marker")
			.appendTo(lastActiveChan.find(".messages"));

		var chan = $(target)
			.addClass("active")
			.trigger("show");

		let title = $(document.body).data("app-name");
		if (chan.data("title")) {
			title = chan.data("title") + " — " + title;
		}
		document.title = title;

		var placeholder = "";
		if (chan.data("type") === "channel" || chan.data("type") === "query") {
			placeholder = `Write to ${chan.data("title")}`;
		}
		input.attr("placeholder", placeholder);

		if (self.hasClass("chan")) {
			$("#chat-container").addClass("active");
			utils.setNick(self.closest(".network").data("nick"));
		}

		var chanChat = chan.find(".chat");
		if (chanChat.length > 0 && chan.data("type") !== "special") {
			chanChat.sticky();
		}

		if (chan.data("needsNamesRefresh") === true) {
			chan.data("needsNamesRefresh", false);
			socket.emit("names", {target: self.data("id")});
		}

		focus();
	});

	sidebar.on("click", "#sign-out", function() {
		socket.emit("sign-out");
		storage.remove("token");

		if (!socket.connected) {
			location.reload();
		}
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
			$(".networks .chan[data-target='" + $(this).data("data") + "'] .close").click();
			break;
		case "chan":
			$(".networks .chan[data-target='" + $(this).data("data") + "']").click();
			break;
		case "user":
			$(".channel.active .users .user[data-name='" + $(this).data("data") + "']").click();
			break;
		}
	});

	chat.on("input", ".search", function() {
		const value = $(this).val();
		const parent = $(this).closest(".users");
		const names = parent.find(".names-original");
		const container = parent.find(".names-filtered");

		if (!value.length) {
			container.hide();
			names.show();
			return;
		}

		const fuzzyOptions = {
			pre: "<b>",
			post: "</b>",
			extract: (el) => $(el).text()
		};

		const result = fuzzy.filter(
			value,
			names.find(".user").toArray(),
			fuzzyOptions
		);

		names.hide();
		container.html(templates.user_filtered({matches: result})).show();
	});

	chat.on("msg", ".messages", function(e, target, msg) {
		var unread = msg.unread;
		msg = msg.msg;

		if (msg.self) {
			return;
		}

		var button = sidebar.find(".chan[data-target='" + target + "']");
		if (msg.highlight || (options.notifyAllMessages && msg.type === "message")) {
			if (!document.hasFocus() || !$(target).hasClass("active")) {
				if (options.notification) {
					try {
						pop.play();
					} catch (exception) {
						// On mobile, sounds can not be played without user interaction.
					}
				}
				utils.toggleNotificationMarkers(true);

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
						if (msg.type === "message") {
							title += " says:";
						}
						body = msg.text.replace(/\x03(?:[0-9]{1,2}(?:,[0-9]{1,2})?)?|[\x00-\x1F]|\x7F/g, "").trim();
					}

					try {
						var notify = new Notification(title, {
							body: body,
							icon: "img/logo-64.png",
							tag: target
						});
						notify.addEventListener("click", function() {
							window.focus();
							button.click();
							this.close();
						});
					} catch (exception) {
						// `new Notification(...)` is not supported and should be silenced.
					}
				}
			}
		}

		if (button.hasClass("active")) {
			return;
		}

		if (!unread) {
			return;
		}

		var badge = button.find(".badge").html(helpers_roundBadgeNumber(unread));

		if (msg.highlight) {
			badge.addClass("highlight");
		}
	});

	chat.on("click", ".show-more-button", function() {
		var self = $(this);
		var lastMessage = self.parent().next(".messages").children(".msg").first();
		if (lastMessage.is(".condensed")) {
			lastMessage = lastMessage.children(".msg").first();
		}
		var lastMessageId = parseInt(lastMessage[0].id.replace("msg-", ""), 10);

		self
			.text("Loading older messages…")
			.prop("disabled", true);

		socket.emit("more", {
			target: self.data("id"),
			lastId: lastMessageId
		});
	});

	var forms = $("#sign-in, #connect, #change-password");

	windows.on("show", "#sign-in", function() {
		$(this).find("input").each(function() {
			var self = $(this);
			if (self.val() === "") {
				self.focus();
				return false;
			}
		});
	});
	if ($("body").hasClass("public")) {
		$("#connect").one("show", function() {
			var params = URI(document.location.search);
			params = params.search(true);
			// Possible parameters:  name, host, port, password, tls, nick, username, realname, join
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in#Iterating_over_own_properties_only
			for (var key in params) {
				if (params.hasOwnProperty(key)) {
					var value = params[key];
					// \W searches for non-word characters
					key = key.replace(/\W/g, "");

					var element = $("#connect input[name='" + key + "']");
					// if the element exists, it isn't disabled, and it isn't hidden
					if (element.length > 0 && !element.is(":disabled") && !element.is(":hidden")) {
						if (element.is(":checkbox")) {
							element.prop("checked", (value === "1" || value === "true") ? true : false);
						} else {
							element.val(value);
						}
					}
				}
			}
		});
	}

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
			storage.set("user", values.user);
		}
		socket.emit(
			event, values
		);
	});

	forms.on("focusin", ".nick", function() {
		// Need to set the first "lastvalue", so it can be used in the below function
		var nick = $(this);
		nick.data("lastvalue", nick.val());
	});

	forms.on("input", ".nick", function() {
		var nick = $(this).val();
		var usernameInput = forms.find(".username");

		// Because this gets called /after/ it has already changed, we need use the previous value
		var lastValue = $(this).data("lastvalue");

		// They were the same before the change, so update the username field
		if (usernameInput.val() === lastValue) {
			usernameInput.val(nick);
		}

		// Store the "previous" value, for next time
		$(this).data("lastvalue", nick);
	});

	(function HotkeysScope() {
		Mousetrap.bind([
			"pageup",
			"pagedown"
		], function(e, key) {
			let container = windows.find(".window.active");

			// Chat windows scroll message container
			if (container.attr("id") === "chat-container") {
				container = container.find(".chan.active .chat");
			}

			container.finish();

			const offset = container.get(0).clientHeight * 0.9;
			let scrollTop = container.scrollTop();

			if (key === "pageup") {
				scrollTop = Math.floor(scrollTop - offset);
			} else {
				scrollTop = Math.ceil(scrollTop + offset);
			}

			container.animate({
				scrollTop: scrollTop
			}, 200);

			return false;
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
			"command+shift+l",
			"ctrl+shift+l"
		], function(e) {
			if (e.target === input[0]) {
				utils.clear();
				e.preventDefault();
			}
		});

		Mousetrap.bind([
			"escape"
		], function() {
			contextMenuContainer.hide();
		});

		var colorsHotkeys = {
			k: "\x03",
			b: "\x02",
			u: "\x1F",
			i: "\x1D",
			o: "\x0F",
		};

		for (var hotkey in colorsHotkeys) {
			Mousetrap.bind([
				"command+" + hotkey,
				"ctrl+" + hotkey
			], function(e) {
				e.preventDefault();

				const cursorPosStart = input.prop("selectionStart");
				const cursorPosEnd = input.prop("selectionEnd");
				const value = input.val();
				let newValue = value.substring(0, cursorPosStart) + colorsHotkeys[e.key];

				if (cursorPosStart === cursorPosEnd) {
					// If no text is selected, insert at cursor
					newValue += value.substring(cursorPosEnd, value.length);
				} else {
					// If text is selected, insert formatting character at start and the end
					newValue += value.substring(cursorPosStart, cursorPosEnd) + colorsHotkeys[e.key] + value.substring(cursorPosEnd, value.length);
				}

				input
					.val(newValue)
					.get(0).setSelectionRange(cursorPosStart + 1, cursorPosEnd + 1);
			});
		}
	}());

	function completeNicks(word) {
		const users = chat.find(".active .users");

		// Lobbies and private chats do not have an user list
		if (!users.length) {
			return [];
		}

		const words = users.data("nicks");

		return $.grep(
			words,
			(w) => !w.toLowerCase().indexOf(word.toLowerCase())
		);
	}

	function completeCommands(word) {
		const words = constants.commands.slice();

		return $.grep(
			words,
			(w) => !w.toLowerCase().indexOf(word.toLowerCase())
		);
	}

	function completeChans(word) {
		const words = [];

		sidebar.find(".chan")
			.each(function() {
				const self = $(this);
				if (!self.hasClass("lobby")) {
					words.push(self.data("title"));
				}
			});

		return $.grep(
			words,
			(w) => !w.toLowerCase().indexOf(word.toLowerCase())
		);
	}

	$(document).on("visibilitychange focus click", () => {
		if (sidebar.find(".highlight").length === 0) {
			utils.toggleNotificationMarkers(false);
		}
	});

	// Compute how many milliseconds are remaining until the next day starts
	function msUntilNextDay() {
		return moment().add(1, "day").startOf("day") - moment();
	}

	// Go through all Today/Yesterday date markers in the DOM and recompute their
	// labels. When done, restart the timer for the next day.
	function updateDateMarkers() {
		$(".date-marker-text[data-label='Today'], .date-marker-text[data-label='Yesterday']")
			.closest(".date-marker-container")
			.each(function() {
				$(this).replaceWith(templates.date_marker({msgDate: $(this).data("timestamp")}));
			});

		// This should always be 24h later but re-computing exact value just in case
		setTimeout(updateDateMarkers, msUntilNextDay());
	}
	setTimeout(updateDateMarkers, msUntilNextDay());

	// Only start opening socket.io connection after all events have been registered
	socket.open();

	window.addEventListener("popstate", (e) => {
		const {state} = e;
		if (!state) {
			return;
		}

		const {clickTarget} = state;
		if (clickTarget) {
			$(clickTarget).trigger("click", {
				pushState: false
			});
		}
	});
});

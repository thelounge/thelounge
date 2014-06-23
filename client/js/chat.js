$(function() {
	var chat = $("#chat");
	var sidebar = $("#sidebar");

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
		"/whois",
	];
	
	var socket = io.connect("");
	var events = [
		"auth",
		"debug",
		"join",
		"messages",
		"msg",
		"networks",
		"nick",
		"part",
		"users",
	].forEach(function(e) {
		socket.on(e, function(data) {
			event(e, data);
		});
	});
	
	var tpl = [];
	function render(name, data) {
		tpl[name] = tpl[name] || Handlebars.compile($("#templates ." + name).html());
		return tpl[name](data);
	}
	
	function event(e, data) {
		switch (e) {
		case "auth":
			$("#networks").add(chat).empty();
			$("#login").trigger("click");
			$.cookie("current", null);
			break;
		
		case "debug":
			console.log(data);
			break;
		
		case "join":
			chat.append(render("windows", {windows: [data.chan]}))
				.find(".window")
				.last()
				.find(".input")
				.tabcomplete(complete, {hint: false})
				.history({submit: true})
				.end()
				.find(".chat")
				.sticky();
			
			$("#network-" + data.id)
				.append(render("channels", {channels: [data.chan]}))
				.find("a")
				.last()
				.trigger("click");
			break;
		
		case "messages":
		case "msg":
			var target = (data.id ? $("#window-" + data.id) : $("#chat .active"))
				.find(".messages");
			var html = render(
				"messages",
				{messages: toArray(data.msg)}
			);
			switch (e) {
			case "messages":
				target.prepend(html);
				break;
			
			case "msg":
				target.append(html);
				break;
			}
			break;
		
		case "networks":
			var channels = $.map(data.networks, function(n) { return n.channels; });
			chat.html(render("windows", {windows: channels}))
				.find(".input")
				.tabcomplete(complete, {hint: false})
				.history({submit: true})
				.end()
				.find(".chat")
				.sticky();
			
			sidebar.addClass("signed-in");
			$("#logout").on("click", function(e) {
				e.stopPropagation();
			});
			
			var networks = render("networks", {networks: data.networks});
			var current = $("#networks")
				.html(networks)
				.closest("#sidebar")
				.find("a[href='" + $.cookie("current") + "']")
				.trigger("click");
			if (!current.length) {
				$("#networks")
					.find("a")
					.last()
					.trigger("click");
			}
			break;
		
		case "part":
			var chan = $("#channel-" + data.id).add("#window-" + data.id).remove();
			if (!chan.hasClass("active")) {
				break;
			}
			
			var next = null;
			var z = 0;
			$("#main .window").each(function() {
				var index = parseInt($(this).css("zIndex"));
				if (index > z) {
					z = index;
					next = this;
				}
			});
			if (typeof next !== "undefined") {
				$("#channel-" + $(next).data("id")).trigger("click");
			}
			break;
		
		case "users":
			var target = $("#window-" + data.id);
			var json = {name: target.find("h1").html(), users: data.users};
			target.find(".meta")
				.replaceWith(render("meta", json))
				.end();
			target.find(".users")
				.html(render("users", json))
				.end();
			break;
		}
	}
	
	$.cookie.json = true;
	$.cookie("settings", $.cookie("settings") || options);
	
	var settings = $("#settings");
	var options = $.extend({
		join: true,
		mode: true,
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
		settings.find("input").each(function() {
			var input = $(this);
			var name = input.attr("name");
			options[name] = input.prop("checked");
			$.cookie("settings", options);
			if ([
				"join",
				"nick",
				"part",
				"mode",
				"quit",
			].indexOf(name) !== -1) {
				chat.toggleClass("hide-" + name, !input.prop("checked"));
			}
		});
	}).find("input")
		.first()
		.trigger("change");
	
	setTimeout(function() {
		// Enable transitions.
		$("body").removeClass("preload");
	}, 500);
	
	var pop = new Audio();
	pop.src = "/audio/pop.ogg";
	
	var favicon = new Favico({
		animation: "none"
	});
	
	document.addEventListener("visibilitychange", function() {
		if (sidebar.find(".highlight").length == 0) {
			favicon.badge("");
		}
	});
	
	var viewport = $("#viewport");
	var touchDevice = (window.screen.width <= 768);
	
	var z = 1;
	sidebar.on("click", "a", function(e) {
		e.preventDefault();
		var link = $(this);
		var target = link.attr("href");
		if (!target) {
			return;
		}
		
		viewport.removeClass();
		sidebar.find(".active").removeClass("active");
		link.addClass("active")
			.find(".badge")
			.removeClass("highlight")
			.empty();
		
		$.cookie("current", target);
		document.title = link.data("name") + " — Shout";
		
		if (sidebar.find(".highlight").length == 0) {
			favicon.badge("");
		}
		
		$("#main .active").removeClass("active");
		var window = $(target)
			.css("z-index", z++)
			.addClass("active")
			.find(".chat")
			.scrollToBottom()
			.end();
		
		if (!touchDevice) {
			window.find("input").focus();
		}
	});
	
	sidebar.on("click", ".close", function() {
		var channel = $(this).closest("a");
		var id = parseInt(channel.attr("id").split("-")[1]);
		var cmd = "/close";
		if (channel.hasClass("lobby")) {
			cmd = "/quit";
			var server = channel
				.clone()
				.remove("span")
				.text()
				.trim();
			if (!confirm("Disconnect from " + server + "?")) {
				return false;
			}
		}
		socket.emit("input", {
			id: id,
			text: cmd,
		});
		channel.css({
			transition: "none",
			opacity: .4
		});
		return false;
	});
	
	chat.on("append", ".messages", function() {
		var messages = $(this);
		var id = messages.closest(".window").find(".form").data("target");
		var last = messages.find(".row:last-child");
		if (last.hasClass("highlight")) {
			if ($.cookie("settings").notification) {
				pop.play();
			}
			if (document.hidden) {
				favicon.badge("!");
			}
		}
		
		var link = $("#channel-" + id + ":not(.active)");
		if (link.length == 0) {
			return;
		}
		
		link.addClass("pulse");
		setTimeout(function() {
			link.removeClass("pulse");
		}, 500);
		
		var type = last.attr("class");
		var ignore = [
			"join",
			"part",
			"quit",
			"nick",
		];
		for (var i = 0; i < ignore.length; i++) {
			if (type.indexOf(ignore[i]) !== -1) {
				return;
			}
		}
		
		var badge = link.find(".badge");
		if (badge.length != 0) {
			var i = (parseInt(badge.html()) || 0) + 1;
			badge.html(i);
			if (last.hasClass("highlight")) {
				badge.addClass("highlight");
			}
		}
	});
	
	chat.on("click", ".show-more", function() {
		var btn = $(this);
		var messages = btn.closest(".chat").find(".messages").children();
		socket.emit("fetch", {
			id: btn.data("id"),
			count: messages.length,
		});
		btn.attr("disabled", true);
	});
	
	chat.on("click", ".user", function(e) {
		e.preventDefault();
		var user = $(this);
		var id = user
			.closest(".window")
			.data("id");
		
		// Strip modes.
		var name = user.html().trim().replace(/[+%@~]/, "");
		if (name.match(/[#.]|-!-/) != null) {
			return;
		}
		
		socket.emit("input", {
			id: id,
			text: "/whois " + name,
		});
	});
	
	chat.on("focus", ".input", function() {
		$(this).closest(".window").find(".chat").scrollToBottom();
	});
	
	chat.on("submit", "form", function(e) {
		e.preventDefault();
		var form = $(this);
		var input = form.find(".input:not(.hint)");
		var text = input.val();
		if (text == "") {
			return;
		}
		input.val("");
		input.prev(".hint").val("");
		socket.emit("input", {
			id: form.data("target"),
			text: text,
		});
	});
	
	chat.on("click", ".toggle", function() {
		var chat = $(this)
			.toggleClass("open")
			.closest(".chat")
			.toggleClass($(this).data("type"))
			.end();
	});
	
	var toggle = "click";
	if (touchDevice) {
		toggle = "touchstart";
	}
	
	chat.on(toggle, ".lt, .rt", function(e) {
		var btn = $(this);
		viewport.toggleClass(btn.attr("class"));
		if (viewport.hasClass("lt")) {
			e.stopPropagation();
			viewport.find("#main").one(toggle, function(e) {
				viewport.removeClass("lt");
			});
		}
	});
	
	$("#sign-in-form").on("submit", function(e) {
		e.preventDefault();
		socket.emit("auth", $("#sign-in-input").val());
	});
	
	$("#notification").on("click", function() {
		pop.play();
	});
	
	function complete(word) {
		var words = commands.slice();
		var users = $(this).closest(".window")
			.find(".users .user")
			.each(function() {
				words.push(this.getAttribute("href").slice(1));
			});
		return $.grep(
			words,
			function(w) {
				return !w.toLowerCase().indexOf(word.toLowerCase());
			}
		);
	}
	
	function toArray(val) {
		return Array.isArray(val) ? val : [val];
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
		"uri", function(text) {
			var urls = [];
			text = URI.withinString(text, function(url) {
				urls.push(url);
				return "{" + (urls.length - 1) + "}";
			});
			text = escape(text);
			for (var i in urls) {
				var url = escape(urls[i]);
				text = text.replace(
					"{" + i + "}",
					"<a href='" + url.replace(/^www/, "//www") + "' target='_blank'>" + url + "</a>"
				);
			}
			return text;
		}
	);
	
	Handlebars.registerHelper(
		"partial", function(id) {
			return new Handlebars.SafeString(render(id, this));
		}
	);
	
	Handlebars.registerHelper(
		"equal", function(a, b, opt) {
			a = a.toString();
			b = b.toString();
			if (a == b) {
				return opt.fn(this);
			}
		}
	);
	
	Handlebars.registerHelper(
		"contains", function(a, b, opt) {
			if (a.indexOf(b) !== -1) {
				return opt.fn(this);
			}
		}
	);
});

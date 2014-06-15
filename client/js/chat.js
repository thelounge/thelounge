$(function() {
	var chat = $("#chat");
	var sidebar = $("#sidebar");
	
	setTimeout(function() {
		// Enable transitions.
		$("body").removeClass("preload");
	}, 500);
	
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
			chat.add($("#networks")).empty();
			$("#sign-in").addClass("active");
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
				.history()
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
				.history()
				.end()
				.find(".chat")
				.sticky();
			
			var networks = $("#networks")
				.html(render("networks", {networks: data.networks}))
				.find("a")
				.last()
				.trigger("click");
			break;
		
		case "part":
			$("#channel-" + data.id)
				.add("#window-" + data.id)
				.remove();
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
		var window = $(target)
			.siblings()
			.removeClass("active")
			.end()
			.css("z-index", z++)
			.addClass("active");
		
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
		
		var link = $("#channel-" + id + ":not(.active)");
		if (link.length == 0) {
			return;
		}
		
		link.addClass("pulse");
		setTimeout(function() {
			link.removeClass("pulse");
		}, 500);
		
		var last = messages.find(".row:last-child");
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
			if (messages.children().last().hasClass("highlight")) {
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
	
	function complete(word) {
		var words = commands.slice();
		var users = $(this).closest(".window")
			.find(".users .user")
			.each(function() {
				words.push(this.getAttribute("href").slice(1));
			});
		return $.grep(
			words,
			function(cmd) {
				return !cmd.indexOf(word);
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
		"equal", function(a, b, opt) {
			a = parseInt(a);
			b = parseInt(b);
			if (a == b) {
				return opt.fn(this);
			}
		}
	);
	
	Handlebars.registerHelper(
		"uri", function(text) {
			text = escape(text);
			return URI.withinString(text, function(url) {
				return "<a href='" + url.replace(/^www/, "//www") + "' target='_blank'>" + url + "</a>";
			});
		}
	);
	
	Handlebars.registerHelper(
		"partial", function(id) {
			return new Handlebars.SafeString(render(id, this));
		}
	);
});

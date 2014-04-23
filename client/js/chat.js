$(function() {
	var chat = $("#chat");
	var sidebar = $("#sidebar");
	
	var commands = [
		"/connect",
		"/deop",
		"/devoice",
		"/disconnect",
		"/join",
		"/kick",
		"/leave",
		"/mode",
		"/msg",
		"/nick",
		"/op",
		"/part",
		"/query",
		"/quit",
		"/server",
		"/topic",
		"/voice",
		"/whois",
	];
	
	var socket = io.connect("");
	var events = [
		"join",
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
	function render(id, data) {
		tpl[id] = tpl[id] || Handlebars.compile($(id).remove().html());
		return tpl[id](data);
	}
	
	function event(e, data) {
		switch (e) {
		case "join":
			chat.append(render("#windows", {
				windows: [data.chan],
			})).find(".window")
				.last()
				.find(".input")
				.tabComplete({after: " ", list: commands})
				.inputHistory({submit: true})
				.end()
				.bringToTop()
				.find(".messages")
				.scrollGlue({speed: 400})
				.end();
			$("#network-" + data.id).append(render("#channels", {
				channels: [data.chan],
			})).find(".channel")
				.last()
				.uniqueClass("active")
				.end();
			break;
		
		case "msg":
			$("#window-" + data.id).find(".messages").append(render("#messages", {
				messages: [data.msg],
			}));
			break;
		
		case "networks":
			chat.html(render("#windows", {
				windows: $.map(data.networks, function(n) { return n.channels; }),
			})).find(".window")
				.find(".input")
				.tabComplete({after: " ", list: commands})
				.inputHistory({submit: true})
				.end()
				.find(".messages")
				.scrollGlue({speed: 400})
				.end()
				.last()
				.bringToTop()
				.end();
			sidebar.html(render("#networks", {
				networks: data.networks,
			})).find(".channel")
				.last()
				.addClass("active")
				.end();
			break;
		
		case "nick":
			// Not yet implemented.
			break;
		
		case "part":
			$("#channel-" + data.id + ", #window-" + data.id).remove();
			break;
		
		case "users":
			$("#window-" + data.id).find(".users").html(render("#users", {
				users: data.users,
			}));
			break;
		}
	}
	
	chat.on("submit", "form", function() {
		var input = $(this).find(".input");
		var text = input.val();
		if (text == "") {
			return false;
		}
		input.val("");
		socket.emit("input", {
			id: input.data("target"),
			text: text,
		});
	});
	
	chat.on("focus", ".input", function() {
		var input = $(this).parents().eq(1).find(".messages").scrollToBottom();
	});
	
	chat.on("click", ".user", function() {
		var user = $(this);
		var id = user.closest(".window").find(".input").data("target");
		var name = user.text().trim();
		if (name == "-!-" || name.indexOf(".") != -1) {
			return;
		}
		socket.emit("input", {
			id: id,
			text: "/whois " + name,
		});
	});
	
	chat.on("click", ".close", function() {
		var id = $(this).closest(".window").find(".input").data("target");
		socket.emit("input", {
			id: id,
			text: "/part",
		});
	});

	sidebar.on("click", ".channel", function(e) {
		e.preventDefault();
		$("#window-" + $(this).attr("id").replace("channel-", ""))
			.bringToTop();
	});
	
	// Utils
	
	function uri(text) {
		return URI.withinString(text, function(url) {
			return "<a href='" + url.replace(/^www/, "//www") + "' target='_blank'>" + url + "</a>";
		});
	}
	
	function escape(string) {
		var e = {
			"<": "&lt;",
			">": "&gt;",
		};
		return string.replace(/[<>]/g, function (s) {
			return e[s];
		});
	}
	
	// Helpers
	
	Handlebars.registerHelper(
		"uri",
		function(text) {
			return uri(escape(text));
		}
	);
	
	Handlebars.registerHelper(
		"partial",
		function(id) {
			return new Handlebars.SafeString(render(id, this));
		}
	);
});

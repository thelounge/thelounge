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
		console.log(arguments);
		switch (e) {
		case "join":
			chat.append(render("#windows", {windows: [data.chan]}))
				.find(".window")
				.last()
				.find(".input")
				.tabComplete({list: commands})
				.inputHistory({submit: true})
				.end()
				.bringToTop()
				.find(".messages")
				.scrollGlue({speed: 400})
				.end();

			// Sidebar
			$("#network-" + data.id)
				.append(render("#channels", {channels: [data.chan]}))
				.find(".channel")
				.last()
				.uniqueClass("active")
				.end();
			break;
		
		case "msg":
			$("#window-" + data.id)
				.find(".messages")
				.append(render("#messages", {messages: [data.msg]}));
			break;
		
		case "networks":
			var channels = $.map(data.networks, function(n) { return n.channels; });
			chat.html(render("#windows", {windows: channels}))
				.find(".window")
				.last()
				.bringToTop()
				.end()
				.find(".input")
				.tabComplete({list: commands})
				.inputHistory({submit: true})
				.end()
				.find(".messages")
				.scrollGlue({speed: 400})
				.end()
				.find(".hidden")
				.prev(".show-more")
				.show();
			
			sidebar.html(render("#networks", {networks: data.networks}))
				.find(".channel")
				.last()
				.addClass("active")
				.end();
			break;
		
		case "nick":
			// ..
			break;
		
		case "part":
			$("#channel-" + data.id)
				.add("#window-" + data.id)
				.remove();
			break;
		
		case "users":
			var users = $.map(data.users, function(u) { return u.name; });
			var tabComplete = commands.concat(users);
			$("#window-" + data.id)
				.find(".input")
				.data("list", tabComplete)
				.end()
				.find(".users")
				.html(render("#users", {users: data.users}))
				.end();
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
	
	chat.on("click", ".show-more-button", function() {
		var more = $(this).parent();
		var html = $.parseHTML(more.next(".hidden").remove().html());
		more.replaceWith(html);
	});

	sidebar.on("click", ".channel", function(e) {
		e.preventDefault();
		$("#window-" + $(this).attr("id").replace("channel-", ""))
			.bringToTop();
	});
	
	function escape(text) {
		var e = {
			"<": "&lt;",
			">": "&gt;"
		};
		return text.replace(/[<>]/g, function (c) {
			return e[c];
		});
	}
	
	Handlebars.registerHelper({
		"partial": function(id) {
			return new Handlebars.SafeString(render(id, this));
		},
		"slice": function(items, block) {
			var limit = block.hash.limit;
			var rows = $.map(items, function(i) {
				return block.fn(i);
			});
			var html = "";
			var hide = rows
				.slice(0, Math.max(0, rows.length - limit))
				.join("");
			if (hide != "") {
				html = "<script type='text/html' class='hidden'>" + hide + "</script>";
			}
			html += rows.slice(-limit).join("");
			return html;
		},
		"uri": function(text) {
			text = escape(text);
			return URI.withinString(text, function(url) {
				return "<a href='" + url.replace(/^www/, "//www") + "' target='_blank'>" + url + "</a>";
			});
		},
	});
});

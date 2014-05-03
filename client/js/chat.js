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
		"/notice",
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
	function render(name, data) {
		tpl[name] = tpl[name] || Handlebars.compile($("#templates ." + name).html());
		return tpl[name](data);
	}
	
	function event(e, data) {
		switch (e) {
		case "join":
			chat.append(render("windows", {windows: [data.chan]}))
				.find(".messages")
				.last()
				.scrollGlue({speed: 400})
				.end()
				.end()
				.find(".input")
				.tabComplete({list: commands});
			
			$("#network-" + data.id)
				.append(render("channels", {channels: [data.chan]}))
				.find(".channel")
				.last()
				.trigger("click");
			break;
		
		case "msg":
			$("#window-" + data.id)
				.find(".messages")
				.append(render("messages", {messages: [data.msg]}));
			break;
		
		case "networks":
			var channels = $.map(data.networks, function(n) { return n.channels; });
			chat.html(render("windows", {windows: channels}))
				.find(".input")
				.tabComplete({list: commands})
				.end()
				.find(".hidden")
				.prev(".show-more")
				.show();
			chat.find(".messages")
				.scrollGlue({speed: 400});
			
			$("#networks")
				.html(render("networks", {networks: data.networks}))
				.parent()
				.find("button")
				.first()
				.trigger("click");
			break;
		
		case "part":
			$("#channel-" + data.id)
				.add("#window-" + data.id)
				.remove();
			break;
		
		case "users":
			$("#window-" + data.id)
				.find(".users")
				.html(render("users", {users: data.users}));
			break;
		}
	}
	
	var z = 1;
	sidebar.on("click", "button", function() {
		var button = $(this);
		var target = button.data("target");
		sidebar.find(".active").removeClass("active");
		button.addClass("active")
			.find(".badge")
			.empty();
		$(target).css("z-index", z++)
			.find("input")
			.focus();
	});
	
	chat.on("append", ".messages", function() {
		var messages = $(this);
		var id = messages.closest(".window").find(".form").data("target");
		var badge = $("#channel-" + id + ":not(.active) .badge");
		if (badge.length != 0) {
			var i = (parseInt(badge.html()) || 0) + 1;
			badge.html(i);
		}
	});
	
	chat.on("click", ".show-more .btn", function() {
		var target = $(this).parent();
		var html = $.parseHTML(target.next(".hidden").remove().html());
		target.replaceWith(html);
	});
	
	chat.on("click", ".user", function() {
		var user = $(this);
		var id = user.closest(".window").find(".form").data("target");
		var name = user.html().replace(/[\s+@]/g, "");
		if (name.match(/[#.]|-!-/) != null) {
			return;
		}
		socket.emit("input", {
			id: id,
			text: "/whois " + name,
		});
	});
	
	chat.on("focus", ".input", function() {
		$(this).closest(".window").find(".messages").scrollToBottom();
	});
	
	chat.on("submit", "form", function() {
		var form = $(this);
		var input = form.find(".input");
		var text = input.val();
		if (text == "") {
			return;
		}
		input.val("");
		socket.emit("input", {
			id: form.data("target"),
			text: text,
		});
	});

	
	Handlebars.registerHelper(
		"partial", function(id) {
			return new Handlebars.SafeString(render(id, this));
		}
	);
});

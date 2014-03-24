$(function() {
	var socket = io.connect("");
	$.each(["network", "channel", "message", "user"], function(i, type) {
		socket.on(type, function(json) {
			event(type, json);
		});
	});

	var chat = $("#chat");
	var sidebar = $("#sidebar");

	var tpl = [];
	function render(id, json) {
		tpl[id] = tpl[id] || Handlebars.compile($(id).html());
		return tpl[id](json);
	}
	
	function event(type, json) {
		console.log(json);
		switch (type) {

		case "network":
			var html = "";
			json.forEach(function(network) {
				html += render("#window", network);
			});
			$("#windows")[0].innerHTML = html;

			sidebar.find("#list").html(
				render("#network", {networks: json})
			).find(".channel")
				.first()
				.addClass("active");

			chat.find(".messages").scrollGlue({animate: 400}).scrollToBottom();
			chat.find(".window")
				.first()
				.bringToTop();
			break;

		case "channel":
			var target = json.target;
			if (json.action == "remove") {
				$("[data-id='" + json.data.id + "']").remove();
				return;
			}

			var network = sidebar
				.find(".network")
				.find(".channel")
				.removeClass("active")
				.end();

			network = network.filter("[data-id='" + json.target + "']").append(
				render("#channel", {channels: json.data})
			).find(".channel")
				.last()
				.addClass("active");

			$("#windows").append(
				render("#window", {channels: json.data})
			).find(".window")
				.last()
				.bringToTop()
				.find(".messages")
				.scrollGlue({animate: 400});
			break;

		case "user":
			var target;
			if (typeof json.target !== "undefined") {
				target = chat.find(".window[data-id='" + json.target + "']");
			}

			target = target.find(".users");
			target.html(render("#user", {users: json.data}));
			break;

		case "message":
			var target;
			if (typeof json.target !== "undefined") {
				target = chat.find(".window[data-id='" + json.target + "']");
			}

			var message = json.data;
			if (message.type == "error") {
				target = target.parent().find(".active");
			}

			target = target.find(".messages");
			target.append(render("#message", {messages: message}));
			break;

		}
	}

	sidebar.on("click", ".channel", function(e) {
		e.preventDefault();
		sidebar.find("#list .active").removeClass("active");
		$("#viewport").removeClass();
		var item = $(this)
			.addClass("active")
			.find(".badge")
			.html("")
			.end();
		var id = item.data("id");
		chat.find(".window[data-id='" + id + "']")
			.bringToTop();
	});

	sidebar.find("input[type=checkbox]").each(function() {
		var input = $(this);
		var value = input.val();
		
		var checked = true;
		if (($.cookie("hidden") || []).indexOf(value) !== -1) {
			checked = false;
		}
		
		input.prop("checked", checked)
			.wrap("<label>")
			.parent()
			.append(value);
		
		if (checked) {
			chat.addClass("show-" + value);
		}
		
		input.on("change", function() {
			var hidden = $.cookie("hidden") || "";
			if (input.prop("checked")) {
				hidden = hidden.replace(value, "");
			} else {
				hidden += value;
			}
			
			// Save the cookie with the new values.
			$.cookie("hidden", hidden);
			
			chat.toggleClass(
				"show-" + value,
				input.prop("checked")
			);
		});
	});

	chat.on("click touchstart", ".toggle a", function(e) {
		e.preventDefault();
		$("#viewport").toggleClass($(this).attr("class"));
	});

	chat.on("submit", "form", function() {
		var input = $(this).find(".input");
		var text = input.val();
		if (text != "") {
			input.val("");
			socket.emit("input", {
				id: input.data("target"),
				text: text
			});
		}
	});

	chat.on("focus", "input[type=text]", function() {
		$(this).closest(".window").find(".messages").scrollToBottom();
	});

	chat.on("click", ".close", function() {
		var btn = $(this);
		btn.prop("disabled", true);
		socket.emit("input", {
			id: btn.closest(".window").data("id"),
			text: "/LEAVE"
		});
	});

	chat.on("append", ".window", function() {
		var id = $(this).data("id");
		var badge = sidebar.find(".channel[data-id='" + id + "']:not(.active) .badge");
		badge.html((parseInt(badge.html()) + 1) || "1");
	});

	chat.on("click", ".user", function(e) {
		e.preventDefault();
	});

	chat.on("dblclick", ".user", function() {
		var user = $(this);
		var id = user.closest(".window").data("id");
		var name = user.attr("href");
		
		var channel = sidebar
			.find(".channel[data-id='" + id + "']")
			.siblings(".channel[data-name='" + name + "']");
		if (channel.size() != 0) {
			channel.trigger("click");
			return;
		}

		socket.emit("input", {
			id: id,
			text: "/QUERY " + name
		});
	});

	var highest = 1;
	$.fn.bringToTop = function() {
		return this.css('z-index', highest++)
			.addClass("active")
			.find(".input")
			.focus()
			.end()
			.siblings()
			.removeClass("active")
			.end();
	};
});

Handlebars.registerHelper("link", function(text) {
	var text = Handlebars.Utils.escapeExpression(text);
	return URI.withinString(text, function(url) {
		return "<a href='" + url + "' target='_blank'>" + url + "</a>";
	});
});

Handlebars.registerHelper("color", function(text) {
	return get_color(text);
});

// colornicks
// https://github.com/avidal

function clean_nick(nick) {
	// attempts to clean up a nickname
	// by removing alternate characters from the end
	// nc_ becomes nc, avidal` becomes avidal
	
	nick = nick.toLowerCase();
	
	// typically ` and _ are used on the end alone
	nick = nick.replace(/[`_]+$/, '');
	
	// remove |<anything> from the end
	nick = nick.replace(/|.*$/, '');
	
	return nick;
}

function hash(nick) {
	var cleaned = clean_nick(nick);
	var h = 0;
	
	for(var i = 0; i < cleaned.length; i++) {
		h = cleaned.charCodeAt(i) + (h << 6) + (h << 16) - h;
	}
	
	return h;
}

function get_color(nick) {
	var nickhash = hash(nick);
	
	// get a random value for the hue
	var h = nickhash % 360;
	
	var l = 50;
	var s = 100;
	
	// playing around with some numbers
	h = 360 + (h % 40);
	
	return "hsl(" + h + "," + s + "%," + l + "%)";
}

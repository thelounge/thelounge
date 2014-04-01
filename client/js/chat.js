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
	function render(id, json, partials) {
		tpl[id] = tpl[id] || $(id).html();
		if (!json) {
			// If no data is supplied, return the template instead.
			// Handy when fetching partials.
			return tpl[id];
		}
		return Mustache.render(
			tpl[id],
			json,
			partials || {}
		);
	}
	
	function event(type, json) {
		switch (type) {
		
		case "network":
			var html = "";
			var partials = {
				users: render("#user"),
				messages: render("#message")
			};
			json.forEach(function(network) {
				html += render("#window", network, partials);
			});
			$("#windows")[0].innerHTML = html;

			sidebar.find("#list").html(
				render("#network", {networks: json}, {channels: render("#channel")})
			).find(".channel")
				.first()
				.addClass("active");

			chat.find(".messages").scrollGlue({animate: 400}).scrollToBottom();
			chat.find(".window")
				.first()
				.bringToTop();
			break;

		case "channel":
			var id = json.data.id;
			if (json.action == "remove") {
				$("#channel-" + id + ", #window-" + id).remove();
				return;
			}

			sidebar.find(".channel").removeClass("active");
			
			$("#network-" + json.target).append(
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
			var target = chat.find("#window-" + json.target);
			if (target.size() == 0) {
				return;
			}

			target = target.find(".users");
			target.html(render("#user", {users: json.data}));
			break;

		case "message":
			var target = $("#window-" + json.target);
			if (target.size() == 0) {
				return;
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
		$("#window-" + item.attr("id").replace("channel-", ""))
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
			$.cookie("hidden", hidden); // Save the cookie with the new values.
			chat.toggleClass(
				"show-" + value,
				input.prop("checked")
			);
		});
	});
	
	chat.on("append", ".messages", function(e) {
		var item = $(this);
		var last = item.find(".message:last");
		var type = last[0].classList[1];
		if (type && !chat.hasClass("show-" + type)) {
			return;
		}
		var id = item.parent()
			.attr("id")
			.replace("window-", "");
		var badge = sidebar
			.find("#channel-" + id + ":not(.active)")
			.find(".badge");
		var num = (parseInt(badge.html()) + 1) || "1";
		badge.html(num);
	});

	chat.on("click touchstart", ".toggle a", function(e) {
		$("#viewport").toggleClass($(this).attr("class"));
		return false;
	});

	chat.on("submit", "form", function() {
		var input = $(this).find(".input");
		var text = input.val();
		if (text == "") {
			return false;
		}
		input.val("");
		socket.emit("input", {
			id: input.data("target"),
			text: text
		});
	});

	chat.on("focus", "input[type=text]", function() {
		$(this).closest(".window").find(".messages").scrollToBottom();
	});

	chat.on("click", ".user", function(e) {
		e.preventDefault();
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

//Handlebars.registerHelper("link", function(text) {
//	var text = Handlebars.Utils.escapeExpression(text);
//	return URI.withinString(text, function(url) {
//		return "<a href='" + url + "' target='_blank'>" + url + "</a>";
//	});
//});

$(function() {
	var socket = io.connect("");

	$.each([
		"NETWORKS",
		"CHANNELS",
		"MESSAGES",
		"USERS"
	], function(i, type) {
		socket.on(type, function(data) {
			render(type, data);
		});
	});

	var chat = $("#chat");
	var sidebar = $("#sidebar");

	// Templates
	var network_tpl = $("#network").html();
	var channel_tpl = $("#channel").html();
	var window_tpl = $("#window").html();
	var message_tpl = $("#message").html();
	var user_tpl = $("#user").html()

	function render(type, data) {
		switch (type) {

		case "NETWORKS":
			var html = "";
			data.forEach(function(network) {
				html += Mustache.render(window_tpl, network);
			});

			$("#windows")[0].innerHTML = html;

			sidebar.find("#list").html(
				Mustache.render(network_tpl, {
					networks: data
				})
			).find(".channel")
				.first()
				.addClass("active");

			chat.find(".messages").sticky().scrollToBottom();
			chat.find(".window")
				.first()
				.bringToTop();
			break;

		case "CHANNELS":
			var target = data.target;
			if (data.action == "remove") {
				$("[data-id='" + data.data.id + "']").remove();
				return;
			}

			var network = sidebar
				.find(".network")
				.find(".channel")
				.removeClass("active")
				.end();

			network = network.filter("[data-id='" + data.target + "']").append(
				Mustache.render(channel_tpl, {
					channels: data.data
				})
			).find(".channel")
				.last()
				.addClass("active");

			$("#windows").append(
				Mustache.render(window_tpl, {
					channels: data.data
				})
			).find(".window")
				.last()
				.bringToTop()
				.find(".messages")
				.sticky();
			break;

		case "USERS":
			var target;
			if (typeof data.target !== "undefined") {
				target = chat.find(".window[data-id='" + data.target + "']");
			}

			target = target.find(".users");
			target.html(Mustache.render(user_tpl, {
				users: data.data
			}));
			break;

		case "MESSAGES":
			var target;
			if (typeof data.target !== "undefined") {
				target = chat.find(".window[data-id='" + data.target + "']");
			}

			var message = data.data;
			if (message.type == "error") {
				target = target.parent().find(".active");
			}

			target = target.find(".messages");
			target.append(Mustache.render(message_tpl, {
				messages: message
			}));
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
		input.prop("checked", true).wrap("<label>").parent().append(value);
		input.on("change", function() {
			chat.toggleClass(
				"hide-" + value,
				!input.prop("checked")
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
});

(function($) {
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
})(jQuery);

// Sticky plugin
// https://github.com/erming/sticky

(function($) {
	var append = $.fn.append;
	$.fn.append = function() {
		return append.apply(this, arguments).trigger("append");
	};

	$.fn.sticky = function() {
		var self = this;
		if (self.size() > 1) {
			return self.each(function() {
				$(this).sticky();
			});
		}

		var timer;
		var resizing = false;
		$(window).on("resize", function() {
			// This will prevent the scroll event from triggering
			// while resizing the window.
			resizing = true;

			clearTimeout(timer);
			timer = setTimeout(function() {
				resizing = false;
			}, 100);

			if (sticky) {
				self.scrollToBottom();
			}
		});

		var sticky = false;
		self.on("scroll", function() {
			if (!resizing) {
				sticky = self.isScrollAtBottom();
			}
		});
		self.trigger("scroll");
		self.on("append", function() {
			if (sticky) {
				self.scrollToBottom();
			}
		});

		return this;
	};

	$.fn.scrollToBottom = function() {
		return this.each(function() {
			this.scrollTop = this.scrollHeight;
		});
	};

	$.fn.isScrollAtBottom = function() {
		if ((this.scrollTop() + this.outerHeight() + 1) >= this.prop("scrollHeight")) {
			return true;
		}
	};
})(jQuery);
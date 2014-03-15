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
	var networks = $("#networks").html();
	var channels = $("#channels").html();
	var messages = $("#messages").html();
	var users = $("#users").html()

	function render(type, data) {
		var target;
		if (typeof data.target !== "undefined") {
			target = $(".window[data-id='" + data.target + "']");
		}

		switch (type) {
		case "NETWORKS":
			var partials = {
				users: users,
				messages: messages
			};
			chat.html("");
			data.forEach(function(network) {
				chat.append(Mustache.render(channels, network, partials));
			});
			sidebar.html(
				Mustache.render(networks, {
					networks: data
				})
			).find(".channel")
				.last()
				.addClass("active");

			chat.find(".messages").sticky().scrollToBottom();
			chat.find(".window")
				// Sort windows by `data-id` value.
				.sort(function(a, b) { return ($(a).data("id") - $(b).data("id")); })
				.last()
				.bringToTop();
			break;

		case "USERS":
			target = target.find(".users");
			target.html(Mustache.render(users, {users: data.data}));
			break;

		case "MESSAGES":
			target = target.find(".messages");
			target.append(Mustache.render(messages, {messages: data.data}));
			break;
		}
	}

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
	
	chat.on("click", ".close", function() {
		var btn = $(this);
		btn.prop("disabled", true);
		socket.emit("input", {
			id: btn.closest(".window").data("id"),
			text: "/leave"
		});
	});
	
	chat.on("append", ".window", function() {
		var id = $(this).data("id");
		var badge = sidebar.find(".channel[data-id='" + id + "']:not(.active) .badge");
		badge.html((parseInt(badge.html()) + 1) || "1");
	});
	
	sidebar.on("click", ".channel", function(e) {
		e.preventDefault();
		sidebar.find(".active").removeClass("active");
		var item = $(this)
			.addClass("active")
			.find(".badge")
			.html("")
			.end();
		var id = item.data("id");
		chat.find(".window[data-id='" + id + "']")
			.bringToTop();
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
		this.scrollTop(this.prop("scrollHeight"));
	};

	$.fn.isScrollAtBottom = function() {
		if ((this.scrollTop() + this.outerHeight()) >= this.prop("scrollHeight")) {
			return true;
		}
	};
})(jQuery);

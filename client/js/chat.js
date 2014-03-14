$(function() {
	var socket = io.connect("");

	$.each([
		"networks",
		"channels",
		"users",
		"messages"
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
		case "networks":
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
			);

			chat.find(".messages").sticky().scrollToBottom();
			chat.find(".window")
				// Sort windows by `data-id` value.
				.sort(function(a, b) { return ($(a).data("id") - $(b).data("id")); })
				.last()
				.bringToTop()
				.find(".input")
					.focus();
			break;

		case "users":
			target = target.find(".users");
			target.html(Mustache.render(users, {users: data.data}));
			break;

		case "messages":
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

	sidebar.on("click", ".channel", function() {
		chat.find(".window[data-id='" + $(this).data("id") + "']")
			.bringToTop();
	});
});

(function($) {
	var highest = 1;
	$.fn.bringToTop = function() {
		return this
			.css('z-index', highest++)
			.find("input")
			.focus();
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
		this.scrollTop(1e10);
	};

	$.fn.isScrollAtBottom = function() {
		if ((this.scrollTop() + this.outerHeight()) >= this.prop("scrollHeight")) {
			return true;
		}
	};
})(jQuery);

$(function() {
	var socket = io.connect("");
	socket.on("event", function(data) {
		render(data);
		
		// Debug
		console.log(data);
	});

	var chat = $("#chat");
	var sidebar = $("#sidebar");
	
	// Templates
	var networks = $("#networks").html();
	var channels = $("#channels").html();
	var messages = $("#messages").html();
	var users = $("#users").html()

	function render(data) {
		chat.html("");
		var partials = {
			users: users,
			messages: messages
		};
		data.forEach(function(network) {
			chat.append(Mustache.render(channels, network, partials));
		});
		sidebar.html(
			Mustache.render(networks, {
				networks: data
			})
		);

		chat.find(".messages").sticky();
		chat.find(".window")
			// Sort windows by `data-id` value.
			.sort(function(a, b) { return ($(a).data("id") - $(b).data("id")); })
			.last()
			.bringToTop()
			.find(".input")
				.focus();
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

		var sticky = false;
		self.on("scroll", function() {
			sticky = self.isScrollAtBottom();
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

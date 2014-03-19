$(function() {
	var socket = io.connect("");

	$.each([
		"NETWORKS",
		"CHANNELS",
		"MESSAGES",
		"USERS"
	], function(i, type) {
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
			// Used when fetching partials.
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

		case "NETWORKS":
			var html = "";
			var partials = {
				messages: render("#message"),
				users: render("#user")
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

			chat.find(".messages").sticky().scrollToBottom();
			chat.find(".window")
				.first()
				.bringToTop();
			break;

		case "CHANNELS":
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
				.sticky();
			break;

		case "USERS":
			var target;
			if (typeof json.target !== "undefined") {
				target = chat.find(".window[data-id='" + json.target + "']");
			}

			target = target.find(".users");
			target.html(render("#user", {users: json.data}));
			break;

		case "MESSAGES":
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
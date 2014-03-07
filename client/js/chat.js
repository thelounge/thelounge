$(function() {
	var socket = io.connect("");
	socket.on("event", function(event) {
		render(event);
	});

	var chat = $("#chat");
	var sidebar = $("#sidebar");
	
	// Templates
	var networks = $("#networks").html();
	var channels = $("#channels").html();
	var messages = $("#messages").html();
	var users = $("#users").html()

	function render(event) {
		var type = event.type;
		var data = event.data;
		var action = event.action;
		var target = event.target;

		if (action == "REMOVE") {
			remove(target);
			return;
		}
		if (target != "") {
			target = $("[data-id='" + target + "']");
		}

		switch (type) {
		
		case "NETWORK":
		case "CHANNEL":
			refresh(data);
			break;

		case "USER":
			target = target.find(".users");
			target.html(Mustache.render(users, {users: event.data}));
			break;
		
		case "MESSAGE":
			var keepAtBottom = target.isScrollBottom();
			target = target.find(".messages");
			target.append(Mustache.render(messages, {messages: event.data}));
			if (keepAtBottom) {
				target.scrollToBottom();
			}
			break;
	
		}
	}

	function remove(id) {
		$("[data-id='" + id + "']").remove();
	}

	function refresh(data) {
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

		chat.find(".messages").scrollToBottom();
		chat.find(".window")
			// Sort windows by `data-id` value.
			.sort(function(a, b) { return ($(a).data("id") - $(b).data("id")); })
			.last()
			.bringToTop()
			.find(".input")
				.focus();
	}

	var View = {};

	View.refresh = function(event) {
		var data = event.data;
		sidebar.html(
			Mustache.render(networks, {
				networks: data
			})
		);

		chat.html("");
		var partials = {
			users: users,
			messages: messages
		};
		data.forEach(function(network) {
			chat.append(Mustache.render(channels, network, partials));
		});

		chat.find(".messages").scrollToBottom();
		chat.find(".window")
			// Sort windows by `data-id` value.
			.sort(function(a, b) { return ($(a).data("id") - $(b).data("id")); })
			.last()
			.bringToTop()
			.find(".input")
				.focus();
	};

	View.add = function(event) {
		var target = $("[data-id='" + event.target + "'] ");
		switch (event.type) {

		case "users":
			target = target.find(".users");
			target.html(Mustache.render(users, {users: event.data}));
			break;

		case "messages":
			var keepAtBottom = target.isScrollBottom();
			target = target.find(".messages");
			target.append(Mustache.render(messages, {messages: event.data}));
			if (keepAtBottom) {
				target.scrollToBottom();
			}
			break;

		}
	};

	View.remove = function(event) {
		$("[data-id='" + event.target + "']").remove();
	};

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


(function() {
	var highest = 1;
	$.fn.bringToTop = function() {
		return this
			.css('z-index', highest++)
			.find("input")
			.focus();
	};

	$.fn.scrollToBottom = function() {
		return this.scrollTop(this.prop("scrollHeight"));
	};

	$.fn.isScrollBottom = function() {
		var height = this.outerHeight();
		var scroll = this.scrollTop();
		if ((scroll + height + 5) >= this.prop("scrollHeight")) {
			return true;
		}
	};
})();

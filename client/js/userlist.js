"use strict";

const $ = require("jquery");
const fuzzy = require("fuzzy");
const Mousetrap = require("mousetrap");

const templates = require("../views");

const chat = $("#chat");

chat.on("input", ".users .search", function() {
	const value = $(this).val();
	const parent = $(this).closest(".users");
	const names = parent.find(".names-original");
	const container = parent.find(".names-filtered");

	// Input content has changed, reset the potential selection
	parent.find(".user").removeClass("active");

	if (!value.length) {
		container.hide();
		names.show();
		return;
	}

	const fuzzyOptions = {
		pre: "<b>",
		post: "</b>",
		extract: (el) => $(el).text(),
	};

	const result = fuzzy.filter(
		value,
		names.find(".user").toArray(),
		fuzzyOptions
	);

	names.hide();
	container.html(templates.user_filtered({matches: result})).show();
});

chat.on("mouseenter", ".users .user", function() {
	// Reset any potential selection, this is required in cas there is already a
	// nick previously selected by keyboard
	$(".users .user").removeClass("active");

	$(this).addClass("active");
});

chat.on("mouseleave", ".users .user", function() {
	// Reset any potential selection
	$(".users .user").removeClass("active");
});

exports.handleKeybinds = function(input) {
	Mousetrap(input.get(0)).bind(["up", "down"], (_e, key) => {
		const userlists = input.closest(".users");
		let userlist;

		// If input field has content, use the filtered list instead
		if (input.val().length) {
			userlist = userlists.find(".names-filtered");
		} else {
			userlist = userlists.find(".names-original");
		}

		const users = userlist.find(".user");

		// Find which item in the array of users is currently selected, if any.
		// Returns -1 if none.
		const activeIndex = users.toArray()
			.findIndex((user) => user.classList.contains("active"));

		// Now that we know which user is active, reset any selection
		userlists.find(".user").removeClass("active");

		// Mark next/previous user as active.
		if (key === "down") {
			// If no users or last user were marked as active, mark the first one.
			users.eq((activeIndex + 1) % users.length).addClass("active");
		} else {
			// If no users or first user was marked as active, mark the last one.
			users.eq(Math.max(activeIndex, 0) - 1).addClass("active");
		}

		// Adjust scroll when active item is outside of the visible area
		const userlistHeight = userlist.height();
		const userlistScroll = userlist.scrollTop();
		const active = $(".user.active");
		const activeTop = active.position().top;
		const activeHeight = active.height();

		if (activeTop > userlistHeight - activeHeight) {
			userlist.scrollTop(userlistScroll + activeTop - userlistHeight + activeHeight);
		} else if (activeTop < 0) {
			userlist.scrollTop(userlistScroll + activeTop - activeHeight);
		}
	});

	// When pressing Enter, open the context menu (emit a click) on the active
	// user
	Mousetrap(input.get(0)).bind("enter", () => {
		const user = input.closest(".users").find(".user.active");

		if (user.length) {
			const clickEvent = new $.Event("click");
			const userOffset = user.offset();
			clickEvent.pageX = userOffset.left;
			clickEvent.pageY = userOffset.top + user.height();
			user.trigger(clickEvent);
		}
	});
};

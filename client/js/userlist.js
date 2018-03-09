"use strict";

const $ = require("jquery");
const fuzzy = require("fuzzy");
const Mousetrap = require("mousetrap");

const templates = require("../views");
const utils = require("./utils");

const chat = $("#chat");

chat.on("input", ".userlist .search", function() {
	const value = $(this).val();
	const parent = $(this).closest(".userlist");
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

	// Mark the first result as active for convenience
	container.find(".user").first().addClass("active");
});

chat.on("mouseenter", ".userlist .user", function() {
	// Reset any potential selection, this is required in cas there is already a
	// nick previously selected by keyboard
	$(this).parent().find(".user.active").removeClass("active");

	$(this).addClass("active");
});

chat.on("mouseleave", ".userlist .user", function() {
	// Reset any potential selection
	$(this).parent().find(".user.active").removeClass("active");
});

exports.handleKeybinds = function(input) {
	Mousetrap(input.get(0)).bind(["up", "down"], (e, key) => {
		e.preventDefault();

		const userlists = input.closest(".userlist");
		let userlist;

		// If input field has content, use the filtered list instead
		if (input.val().length) {
			userlist = userlists.find(".names-filtered");
		} else {
			userlist = userlists.find(".names-original");
		}

		const users = userlist.find(".user");

		if (users.length === 0) {
			return;
		}

		// Find which item in the array of users is currently selected, if any.
		// Returns -1 if none.
		const activeIndex = users.toArray()
			.findIndex((user) => user.classList.contains("active"));

		// Now that we know which user is active, reset any selection
		userlist.find(".user.active").removeClass("active");

		// Mark next/previous user as active.
		if (key === "down") {
			// If no users or last user were marked as active, mark the first one.
			users.eq((activeIndex + 1) % users.length).addClass("active");
		} else {
			// If no users or first user was marked as active, mark the last one.
			users.eq(Math.max(activeIndex, 0) - 1).addClass("active");
		}

		// Adjust scroll when active item is outside of the visible area
		utils.scrollIntoViewNicely(userlist.find(".user.active")[0]);
	});

	// When pressing Enter, open the context menu (emit a click) on the active
	// user
	Mousetrap(input.get(0)).bind("enter", () => {
		const user = input.closest(".userlist").find(".user.active");

		if (user.length) {
			const clickEvent = new $.Event("click");
			const userOffset = user.offset();
			clickEvent.pageX = userOffset.left;
			clickEvent.pageY = userOffset.top + user.height();
			user.trigger(clickEvent);
		}
	});
};

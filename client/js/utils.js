"use strict";
const $ = require("jquery");
const chat = $("#chat");

module.exports = {
	clear
};

function clear() {
	chat.find(".active")
		.find(".show-more").addClass("show").end()
		.find(".messages .msg, .date-marker").remove();
}

"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const messages = $("#search .results .messages");
// const form = $("#search form");

socket.on("search:results", (response) => {
	// form.find(".btn").prop("disabled", false);

	$("#search form input[name=text]").val(response.text);
	$("#search form input[name=target]").val(response.target);
	$("#search form input[name=network]").val(response.network);

	let topic = response.target;

	if (!topic) {
		topic = $('.network[data-uuid="' + response.network + '"] .lobby').attr("aria-label");
	}

	$("#search .topic").text(topic);

	// Navigate to the search page if it's not already open
	if (!$("#search").hasClass("active")) {
		$("#footer button.search").click();
		$("#search input[name=text]").focus();
	}

	const resultCount = response.results.length + (response.results.length === 1 ? " result" : " results");
	$("#search .search-result-count").text(resultCount);

	if (response.results.length) {
		messages.html(render.buildChannelMessages($(document.createDocumentFragment()), 0, "search", response.results));
	} else {
		messages.html('<div class="text-center">No search results found.</div>');
	}
});

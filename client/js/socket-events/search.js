"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const messages = $("#search .results .messages");

function htmlEntities(s) {
	return s.replace(/[\u00A0-\u9999<>&]/gim, function(i) {
		return "&#" + i.charCodeAt(0) + ";";
	});
}

function highlightSearchKeywords(keywords) {
	// Wrap each keyword within the message texts with a <mark> tag
	messages.find(".message .text").each(function() {
		const element = $(this);
		// Avoid parsing possible HTML tags in messages
		let text = htmlEntities(element.text());

		for (let keyword of keywords) {
			keyword = htmlEntities(keyword);
			text = text.split(keyword).join("<mark>" + keyword + "</mark>");
		}

		element.html(text);
	});
}

socket.on("search:results", (response) => {
	$("#search form input[name=text]").val(response.text);
	$("#search form input[name=target]").val(response.target);
	$("#search form input[name=network]").val(response.network);

	let topic = response.target;

	if (!topic) {
		topic = $('.network[data-uuid="' + response.network + '"] .lobby').attr("aria-label");
	}

	$("#search .search-target").text(topic);

	// Navigate to the search page if it's not already open
	if (!$("#search").hasClass("active")) {
		$("#footer button.search").click();
		$("#search input[name=text]").focus();
	}

	const resultCount = response.results.length + (response.results.length === 1 ? " result" : " results");
	$("#search .search-result-count").text(resultCount);

	if (response.results.length) {
		messages.html(render.buildChannelMessages($(document.createDocumentFragment()), 0, "search", response.results));
		highlightSearchKeywords([response.text]);
	} else {
		messages.html('<div class="text-center">No search results found.</div>');
	}
});

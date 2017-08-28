"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const messages = $("#search-query .results .messages");
const form = $("#search-query form");
const select = $("#search-query form select");

socket.on("search-networks-channels", function(data) {
	var groups = {};
	select.empty();
	select.append($("<option></option>").attr("value", "*/*").append("** All networks and channels **"));
	data.forEach(function(entry) {
		if (!groups[entry.network]) {
			groups[entry.network] = [];
		}
		if (entry.network !== entry.chan) {
			groups[entry.network].push(entry.chan);
		}
	});
	Object.keys(groups).forEach(function(network) {
		var group = $("<optgroup></optgroup>").attr("label", network);
		group.append($("<option></option>").attr("value", network + "/*").append("** All channels **"));
		group.append($("<option></option>").attr("value", network).append("** Lobby **"));
		groups[network].forEach(function(chan) {
			group.append($("<option></option>").attr("value", network + "/" + chan).append(chan));
		});
		select.append(group);
	});
});

socket.on("search-results", function(query, results) {
	if (!query.offset) {
		messages.empty();
		form.data("lastQuery", query);
	} else {
		messages.find(".show-more").remove();
	}
	form.find(".btn").prop("disabled", false);
	render.appendSearchResults(messages, results);
});

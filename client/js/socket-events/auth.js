"use strict";
const $ = require("jquery");
const socket = require("../socket");
const sidebar = $("#sidebar, #footer");

socket.on("auth", function(data) {
	var login = $("#sign-in");
	var token;

	login.find(".btn").prop("disabled", false);

	if (!data.success) {
		window.localStorage.removeItem("token");

		var error = login.find(".error");
		error.show().closest("form").one("submit", function() {
			error.hide();
		});
	} else {
		token = window.localStorage.getItem("token");
		if (token) {
			$("#loading-page-message").text("Authorizing…");
			socket.emit("auth", {token: token});
		}
	}

	var input = login.find("input[name='user']");
	if (input.val() === "") {
		input.val(window.localStorage.getItem("user") || "");
	}
	if (token) {
		return;
	}
	sidebar.find(".sign-in")
		.trigger("click", {
			pushState: false,
		})
		.end()
		.find(".networks")
		.html("")
		.next()
		.show();
});

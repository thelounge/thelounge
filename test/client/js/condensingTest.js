"use strict";

const _ = require("lodash");
const expect = require("chai").expect;
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const templates = {};

fs.readdirSync(path.resolve("./client/js/libs/handlebars/"))
	.filter((pluginFile) => pluginFile.slice(-3) === ".js")
	.forEach((file) => {
		handlebars.registerHelper(file.slice(0 , -3), require(path.resolve("./client/js/libs/handlebars/" + file)));
	});

fs.readdirSync(path.resolve("./client/views/"))
	.filter((viewFile) => viewFile.slice(-4) === ".tpl")
	.forEach((file) => {
		templates[file.slice(0, -4)] = handlebars.compile(fs.readFileSync(path.resolve("./client/views/" + file), "utf8"));
	});

const condense = require("../../../client/js/condensed")({templates: templates});

let messageCounter = 1;
const messageMaker = {
	message: {},
	make: function() {
		return this.message;
	},
	defaults: function() {
		this.message = _.assign({},{
			from: "test",
			hostmask: "test@hostmask.com",
			id: messageCounter++,
			self: false,
			template: "",
			text: "",
			time: "2017-04-24T06:09:08.995Z",
			type: "",
		});
		return this;
	},
	user: function(username) {
		this.message = _.assign(this.message, {
			from: username,
			hostmask: username + "@hostmask.com"
		});
		return this;
	},
	join: function() {
		this.message = _.assign(this.message, {
			type: "join",
			template: "actions/join",
		});
		return this;
	},
	part: function() {
		this.message = _.assign(this.message, {
			type: "part",
			template: "actions/part",
		});
		return this;
	},
	quit: function() {
		this.message = _.assign(this.message, {
			type: "quit",
			template: "actions/quit",
		});
		return this;
	},
	mode: function(mode, names) {
		this.message = _.assign(this.message, {
			type: "mode",
			template: "actions/mode",
			text: `${mode} ${names}`
		});
		return this;
	},
	nick: function(nick) {
		this.message = _.assign(this.message, {
			type: "nick",
			template: "actions/nick",
			new_nick: nick,
		});
		return this;
	},
};

describe("condense client", () => {
	describe("join", () => {
		it("should show result of 1 condensed joins", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").join().make());
			const user1 = templates.user_name({nick: "user1"});
			expect(condense.condense(messages)).to.equal("" + user1 + " joined");
		});
		it("should show result of 2 condensed joins", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").join().make());
			messages.push(messageMaker.defaults().user("user2").join().make());
			const user1 = templates.user_name({nick: "user1"});
			const user2 = templates.user_name({nick: "user2"});
			expect(condense.condense(messages)).to.equal("" + user1 + " and " + user2 + " joined");
		});
		it("should show result of 3 condensed joins", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").join().make());
			messages.push(messageMaker.defaults().user("user2").join().make());
			messages.push(messageMaker.defaults().user("user3").join().make());
			const user1 = templates.user_name({nick: "user1"});
			const user2 = templates.user_name({nick: "user2"});
			const user3 = templates.user_name({nick: "user3"});
			expect(condense.condense(messages)).to.equal("" + user1 + ", " + user2 + " and " + user3 + " joined");
		});
		it("should show result of 10 condensed joins", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").join().make());
			messages.push(messageMaker.defaults().user("user2").join().make());
			messages.push(messageMaker.defaults().user("user3").join().make());
			messages.push(messageMaker.defaults().user("user4").join().make());
			messages.push(messageMaker.defaults().user("user5").join().make());
			messages.push(messageMaker.defaults().user("user6").join().make());
			messages.push(messageMaker.defaults().user("user7").join().make());
			messages.push(messageMaker.defaults().user("user8").join().make());
			messages.push(messageMaker.defaults().user("user9").join().make());
			messages.push(messageMaker.defaults().user("user10").join().make());
			const user10 = templates.user_name({nick: "user10"});
			const user9 = templates.user_name({nick: "user9"});
			const user8 = templates.user_name({nick: "user8"});
			expect(condense.condense(messages)).to.equal("" + user10 + ", " + user9 + ", " + user8 + " and 7 others joined");
		});
	});
	describe("part", () => {
		it("should show result of 1 condensed parts", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").part().make());
			const user1 = templates.user_name({nick: "user1"});
			expect(condense.condense(messages)).to.equal("" + user1 + " leaved");
		});
		it("should show result of 2 condensed parts", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").part().make());
			messages.push(messageMaker.defaults().user("user2").part().make());
			const user1 = templates.user_name({nick: "user1"});
			const user2 = templates.user_name({nick: "user2"});
			expect(condense.condense(messages)).to.equal("" + user1 + " and " + user2 + " leaved");
		});
		it("should show result of 3 condensed parts", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").part().make());
			messages.push(messageMaker.defaults().user("user2").part().make());
			messages.push(messageMaker.defaults().user("user3").part().make());
			const user1 = templates.user_name({nick: "user1"});
			const user2 = templates.user_name({nick: "user2"});
			const user3 = templates.user_name({nick: "user3"});
			expect(condense.condense(messages)).to.equal("" + user1 + ", " + user2 + " and " + user3 + " leaved");
		});
		it("should show result of 10 condensed parts", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").part().make());
			messages.push(messageMaker.defaults().user("user2").part().make());
			messages.push(messageMaker.defaults().user("user3").part().make());
			messages.push(messageMaker.defaults().user("user4").part().make());
			messages.push(messageMaker.defaults().user("user5").part().make());
			messages.push(messageMaker.defaults().user("user6").part().make());
			messages.push(messageMaker.defaults().user("user7").part().make());
			messages.push(messageMaker.defaults().user("user8").part().make());
			messages.push(messageMaker.defaults().user("user9").part().make());
			messages.push(messageMaker.defaults().user("user10").part().make());
			const user10 = templates.user_name({nick: "user10"});
			const user9 = templates.user_name({nick: "user9"});
			const user8 = templates.user_name({nick: "user8"});
			expect(condense.condense(messages)).to.equal("" + user10 + ", " + user9 + ", " + user8 + " and 7 others leaved");
		});
	});
	describe("quit", () => {
		it("should show result of 1 condensed quits", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").quit().make());
			const user1 = templates.user_name({nick: "user1"});
			expect(condense.condense(messages)).to.equal("" + user1 + " quit");
		});
		it("should show result of 2 condensed quits", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").quit().make());
			messages.push(messageMaker.defaults().user("user2").quit().make());
			const user1 = templates.user_name({nick: "user1"});
			const user2 = templates.user_name({nick: "user2"});
			expect(condense.condense(messages)).to.equal("" + user1 + " and " + user2 + " quit");
		});
		it("should show result of 3 condensed quits", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").quit().make());
			messages.push(messageMaker.defaults().user("user2").quit().make());
			messages.push(messageMaker.defaults().user("user3").quit().make());
			const user1 = templates.user_name({nick: "user1"});
			const user2 = templates.user_name({nick: "user2"});
			const user3 = templates.user_name({nick: "user3"});
			expect(condense.condense(messages)).to.equal("" + user1 + ", " + user2 + " and " + user3 + " quit");
		});
		it("should show result of 10 condensed quits", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").quit().make());
			messages.push(messageMaker.defaults().user("user2").quit().make());
			messages.push(messageMaker.defaults().user("user3").quit().make());
			messages.push(messageMaker.defaults().user("user4").quit().make());
			messages.push(messageMaker.defaults().user("user5").quit().make());
			messages.push(messageMaker.defaults().user("user6").quit().make());
			messages.push(messageMaker.defaults().user("user7").quit().make());
			messages.push(messageMaker.defaults().user("user8").quit().make());
			messages.push(messageMaker.defaults().user("user9").quit().make());
			messages.push(messageMaker.defaults().user("user10").quit().make());
			const user10 = templates.user_name({nick: "user10"});
			const user9 = templates.user_name({nick: "user9"});
			const user8 = templates.user_name({nick: "user8"});
			expect(condense.condense(messages)).to.equal("" + user10 + ", " + user9 + ", " + user8 + " and 7 others quit");
		});
	});
	describe("reconnect", () => {
		it("should show result of 1 condensed reconnects", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").quit().make());
			messages.push(messageMaker.defaults().user("user1").join().make());
			const user1 = templates.user_name({nick: "user1"});
			expect(condense.condense(messages)).to.equal("" + user1 + " reconnected");
		});
		it("should show result of 2 condensed reconnects", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").quit().make());
			messages.push(messageMaker.defaults().user("user2").quit().make());
			messages.push(messageMaker.defaults().user("user1").join().make());
			messages.push(messageMaker.defaults().user("user2").join().make());
			const user1 = templates.user_name({nick: "user1"});
			const user2 = templates.user_name({nick: "user2"});
			expect(condense.condense(messages)).to.equal("" + user1 + " and " + user2 + " reconnected");
		});
		it("should show result of 3 condensed reconnects", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").quit().make());
			messages.push(messageMaker.defaults().user("user1").join().make());
			messages.push(messageMaker.defaults().user("user2").quit().make());
			messages.push(messageMaker.defaults().user("user2").join().make());
			messages.push(messageMaker.defaults().user("user3").quit().make());
			messages.push(messageMaker.defaults().user("user3").join().make());
			const user1 = templates.user_name({nick: "user1"});
			const user2 = templates.user_name({nick: "user2"});
			const user3 = templates.user_name({nick: "user3"});
			expect(condense.condense(messages)).to.equal("" + user1 + ", " + user2 + " and " + user3 + " reconnected");
		});
		it("should show result of 10 condensed reconnects", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").quit().make());
			messages.push(messageMaker.defaults().user("user2").quit().make());
			messages.push(messageMaker.defaults().user("user3").quit().make());
			messages.push(messageMaker.defaults().user("user4").quit().make());
			messages.push(messageMaker.defaults().user("user5").quit().make());
			messages.push(messageMaker.defaults().user("user6").quit().make());
			messages.push(messageMaker.defaults().user("user7").quit().make());
			messages.push(messageMaker.defaults().user("user8").quit().make());
			messages.push(messageMaker.defaults().user("user9").quit().make());
			messages.push(messageMaker.defaults().user("user10").quit().make());
			messages.push(messageMaker.defaults().user("user10").join().make());
			messages.push(messageMaker.defaults().user("user9").join().make());
			messages.push(messageMaker.defaults().user("user8").join().make());
			messages.push(messageMaker.defaults().user("user7").join().make());
			messages.push(messageMaker.defaults().user("user6").join().make());
			messages.push(messageMaker.defaults().user("user5").join().make());
			messages.push(messageMaker.defaults().user("user4").join().make());
			messages.push(messageMaker.defaults().user("user3").join().make());
			messages.push(messageMaker.defaults().user("user2").join().make());
			messages.push(messageMaker.defaults().user("user1").join().make());
			const user1 = templates.user_name({nick: "user1"});
			const user2 = templates.user_name({nick: "user2"});
			const user3 = templates.user_name({nick: "user3"});
			expect(condense.condense(messages)).to.equal("" + user1 + ", " + user2 + ", " + user3 + " and 7 others reconnected");
		});
	});
	describe("peekin", () => {
		it("should show result of 1 condensed peek in", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").join().make());
			messages.push(messageMaker.defaults().user("user1").quit().make());
			const user1 = templates.user_name({nick: "user1"});
			expect(condense.condense(messages)).to.equal("" + user1 + " peeked in");
		});
		it("should show result of 2 condensed peek ins", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").join().make());
			messages.push(messageMaker.defaults().user("user2").join().make());
			messages.push(messageMaker.defaults().user("user1").quit().make());
			messages.push(messageMaker.defaults().user("user2").quit().make());
			const user1 = templates.user_name({nick: "user1"});
			const user2 = templates.user_name({nick: "user2"});
			expect(condense.condense(messages)).to.equal("" + user1 + " and " + user2 + " peeked in");
		});
		it("should show result of 3 condensed peek ins", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").join().make());
			messages.push(messageMaker.defaults().user("user1").quit().make());
			messages.push(messageMaker.defaults().user("user2").join().make());
			messages.push(messageMaker.defaults().user("user2").quit().make());
			messages.push(messageMaker.defaults().user("user3").join().make());
			messages.push(messageMaker.defaults().user("user3").quit().make());
			const user1 = templates.user_name({nick: "user1"});
			const user2 = templates.user_name({nick: "user2"});
			const user3 = templates.user_name({nick: "user3"});
			expect(condense.condense(messages)).to.equal("" + user1 + ", " + user2 + " and " + user3 + " peeked in");
		});
		it("should show result of 10 condensed peek ins", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user10").join().make());
			messages.push(messageMaker.defaults().user("user9").join().make());
			messages.push(messageMaker.defaults().user("user8").join().make());
			messages.push(messageMaker.defaults().user("user7").join().make());
			messages.push(messageMaker.defaults().user("user6").join().make());
			messages.push(messageMaker.defaults().user("user5").join().make());
			messages.push(messageMaker.defaults().user("user4").join().make());
			messages.push(messageMaker.defaults().user("user3").join().make());
			messages.push(messageMaker.defaults().user("user2").join().make());
			messages.push(messageMaker.defaults().user("user1").join().make());
			messages.push(messageMaker.defaults().user("user1").quit().make());
			messages.push(messageMaker.defaults().user("user2").quit().make());
			messages.push(messageMaker.defaults().user("user3").quit().make());
			messages.push(messageMaker.defaults().user("user4").quit().make());
			messages.push(messageMaker.defaults().user("user5").quit().make());
			messages.push(messageMaker.defaults().user("user6").quit().make());
			messages.push(messageMaker.defaults().user("user7").quit().make());
			messages.push(messageMaker.defaults().user("user8").quit().make());
			messages.push(messageMaker.defaults().user("user9").quit().make());
			messages.push(messageMaker.defaults().user("user10").quit().make());
			const user10 = templates.user_name({nick: "user10"});
			const user9 = templates.user_name({nick: "user9"});
			const user8 = templates.user_name({nick: "user8"});
			expect(condense.condense(messages)).to.equal("" + user10 + ", " + user9 + ", " + user8 + " and 7 others peeked in");
		});
		it("should show result of 1 condensed peek in on multiple join quits", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").join().make());
			messages.push(messageMaker.defaults().user("user1").quit().make());
			messages.push(messageMaker.defaults().user("user1").join().make());
			messages.push(messageMaker.defaults().user("user1").quit().make());
			messages.push(messageMaker.defaults().user("user1").join().make());
			messages.push(messageMaker.defaults().user("user1").quit().make());
			const user1 = templates.user_name({nick: "user1"});
			expect(condense.condense(messages)).to.equal("" + user1 + " peeked in");
		});
	});
	describe("modes", () => {
		it("should show mode change for 1 self", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").mode("+o","user1").make());
			const user1 = templates.user_name({nick: "user1"});
			expect(condense.condense(messages)).to.equal("" + user1 + " changed mode");
		});
	});
	describe("nick", () => {
		it("should show nick change", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").nick("user2").make());
			const user1 = templates.user_name({nick: "user1"});
			const user2 = templates.user_name({nick: "user2"});
			expect(condense.condense(messages)).to.equal("" + user1 + " changed name to " + user2 + "");
		});
		it("should show multiple nick change", () => {
			var messages = [];
			messages.push(messageMaker.defaults().user("user1").nick("user2").make());
			messages.push(messageMaker.defaults().user("user3").nick("user4").make());
			const user1 = templates.user_name({nick: "user1"});
			const user2 = templates.user_name({nick: "user2"});
			const user3 = templates.user_name({nick: "user3"});
			const user4 = templates.user_name({nick: "user4"});
			expect(condense.condense(messages)).to.equal("" + user3 + " changed name to " + user4 + " | " + user1 + " changed name to " + user2 + "");
		});
	});
});

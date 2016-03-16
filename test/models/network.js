"use strict";

var expect = require("chai").expect;

var Chan = require("../../src/models/chan");
var Network = require("../../src/models/network");

describe("Network", function() {
	describe("#export()", function() {

		it("should produce an valid object", function() {
			var network = new Network({name: "networkName"});
			network.channels.push(new Chan({name: "#thelounge"}));
			network.channels.push(new Chan({name: "&foobar"}));

			expect(network.export()).to.deep.equal({
				name: "networkName",
				host: "",
				port: 6667,
				tls: false,
				password: "",
				username: "",
				realname: "",
				commands: [],
				nick: undefined,
				join: "#thelounge,&foobar",
			});
		});
	});
});

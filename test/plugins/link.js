var assert = require("assert");

var util = require("../util");
var link = require("../../src/plugins/irc-events/link.js");

describe("Link plugin", function() {
	before(function(done) {
		this.app = util.createWebserver();
		this.connection = this.app.listen(9002, done);
	});

	after(function(done) {
		this.connection.close(done);
	});

	beforeEach(function() {
		this.irc = util.createClient();
		this.network = util.createNetwork();
	});

	it("should be able to fetch basic information about URLs", function(done) {
		link.call(this.irc, this.irc, this.network);

		this.app.get("/basic", function(req, res) {
			res.send("<title>test</title>");
		});

		this.irc.createMessage({
			message: "http://localhost:9002/basic"
		});

		this.irc.once("toggle", function(data) {
			assert.equal(data.head, "test");
			done();
		});
	});
});

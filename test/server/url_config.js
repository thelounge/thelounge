var assert = require("assert");
var request = require("request");
var cheerio = require("cheerio");
var server = require("../../src/server");
var Helper = require("../../src/helper");

function OverrideDefaults() {
	this.old_config = {};
}

OverrideDefaults.prototype.set = function(property, value) {
	this.old_config[property] = Helper.config.defaults[property];
	Helper.config.defaults[property] = value;
};

OverrideDefaults.prototype.restore = function() {
	for (var property in this.old_config) {
		if (this.old_config.hasOwnProperty(property)) {
			Helper.config.defaults[property] = this.old_config[property];
		}
	}
	this.old_config = {};
};

describe("URL-configurable parameters", function() {
	before(function() {
		Helper.config.port = 0;
		Helper.config.enableOverrides = true;
		global.log = {info: function() {}};
		this.server = server();
		this.base_url = "http://localhost:" + this.server.address().port + "/";
		this.override = new OverrideDefaults();
	});

	after(function() {
		this.server.close();
	});

	afterEach(function() {
		this.override.restore();
	});

	it("should allow simple overriding", function(done) {
		var that = this;
		Helper.config.defaults.username = "DefaultUserName";
		request.get(this.base_url, function (err, res, body) {
			assert.equal(err, null);
			assert.equal(res.statusCode, 200);
			assert.equal(cheerio("input[name=username]", body).attr("value"), "DefaultUserName");
			request.get(that.base_url + "?username=URLUserName", function (err, res, body) {
				assert.equal(err, null);
				assert.equal(res.statusCode, 200);
				assert.equal(cheerio("input[name=username]", body).attr("value"), "URLUserName");
				done();
			});
		});
	});
	it("should honor enableOverrides", function(done) {
		var that = this;
		this.override.set("host", "DefaultHost");
		this.override.set("port", 443);
		const config_url = this.base_url + "?host=URLHost&port=12345";
		request.get(config_url, function (err, res, body) {
			assert.equal(err, null);
			assert.equal(res.statusCode, 200);
			assert.equal(cheerio("input[name=host]", body).attr("value"), "URLHost");
			assert.equal(cheerio("input[name=port]", body).attr("value"), 12345);
			Helper.config.enableOverrides = false;
			request.get(that.base_url + "?host=URLHost", function (err, res, body) {
				assert.equal(err, null);
				assert.equal(res.statusCode, 200);
				assert.equal(cheerio("input[name=host]", body).attr("value"), "DefaultHost");
				assert.equal(cheerio("input[name=port]", body).attr("value"), 443);
				Helper.config.enableOverrides = true;
				done();
			});
		});
	});
	it("should honor lockNetwork", function(done) {
		var that = this;
		this.override.set("host", "DefaultHost");
		this.override.set("port", 443);
		const config_url = this.base_url + "?host=URLHost&port=12345";
		request.get(config_url, function (err, res, body) {
			assert.equal(err, null);
			assert.equal(res.statusCode, 200);
			assert.equal(cheerio("input[name=host]", body).attr("value"), "URLHost");
			assert.equal(cheerio("input[name=port]", body).attr("value"), 12345);
			Helper.config.lockNetwork = true;
			request.get(that.base_url + "?host=URLHost", function (err, res, body) {
				assert.equal(err, null);
				assert.equal(res.statusCode, 200);
				assert.equal(cheerio("input[name=host]", body).attr("value"), "DefaultHost");
				assert.equal(cheerio("input[name=port]", body).attr("value"), 443);
				Helper.config.lockNetwork = false;
				done();
			});
		});
	});
	it("should not allow stuffing inputs", function(done) {
		this.override.set("nick", "DefaultNick");
		const config_url = this.base_url + '?nick="><script></script>';
		request.get(config_url, function (err, res, body) {
			assert.equal(err, null);
			assert.equal(res.statusCode, 200);
			assert.equal(cheerio("input[name=nick]", body).attr("value"), '"><script></script>');
			done();
		});
	});
});

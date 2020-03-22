"use strict";

const log = require("../../src/log");
const expect = require("chai").expect;
const stub = require("sinon").stub;
const mergeConfig = require("../../src/helper").mergeConfig;
const TestUtil = require("../util");

describe("mergeConfig", function () {
	it("should mutate object", function () {
		const config = {
			ip: "default",
		};

		expect(
			mergeConfig(config, {
				ip: "overridden",
			})
		).to.deep.equal({
			ip: "overridden",
		});

		expect(config).to.deep.equal({
			ip: "overridden",
		});
	});

	it("should merge new properties", function () {
		expect(
			mergeConfig(
				{
					ip: "default",
					newProp: "this should appear too",
				},
				{
					ip: "overridden",
				}
			)
		).to.deep.equal({
			ip: "overridden",
			newProp: "this should appear too",
		});
	});

	it("should extend objects", function () {
		expect(
			mergeConfig(
				{
					tlsOptions: {},
				},
				{
					tlsOptions: {
						user: "test",
						thing: 123,
					},
				}
			)
		).to.deep.equal({
			tlsOptions: {
				user: "test",
				thing: 123,
			},
		});
	});

	it("should warn for unknown top level keys", function () {
		let warning = "";
		stub(log, "warn").callsFake(TestUtil.sanitizeLog((str) => (warning += str)));

		expect(
			mergeConfig(
				{
					optionOne: 123,
				},
				{
					optionOne: 456,
					optionTwo: 789,
				}
			)
		).to.deep.equal({
			optionOne: 456,
			optionTwo: 789,
		});

		log.warn.restore();
		expect(warning).to.equal('Unknown key "optionTwo", please verify your config.\n');
	});

	it("should not warn for unknown second level keys", function () {
		expect(
			mergeConfig(
				{
					optionOne: {
						subOne: 123,
					},
				},
				{
					optionOne: {
						subOne: 123,
						subTwo: 123,
					},
				}
			)
		).to.deep.equal({
			optionOne: {
				subOne: 123,
				subTwo: 123,
			},
		});
	});

	it("should allow changing nulls", function () {
		expect(
			mergeConfig(
				{
					oidentd: null,
				},
				{
					oidentd: "some path",
				}
			)
		).to.deep.equal({
			oidentd: "some path",
		});
	});

	it("should allow changing nulls with objects", function () {
		expect(
			mergeConfig(
				{
					webirc: null,
				},
				{
					webirc: {
						serverone: "password",
						servertwo: "password2",
					},
				}
			)
		).to.deep.equal({
			webirc: {
				serverone: "password",
				servertwo: "password2",
			},
		});
	});

	it("should allow changing nulls with objects that has function", function () {
		const callbackFunction = () => ({});

		expect(
			mergeConfig(
				{
					webirc: null,
				},
				{
					webirc: {
						servercb: callbackFunction,
					},
				}
			)
		).to.deep.equal({
			webirc: {
				servercb: callbackFunction,
			},
		});
	});

	it("should keep new properties inside of objects", function () {
		expect(
			mergeConfig(
				{
					nestedOnce: {
						ip: "default",
					},
					nestedTwice: {
						thing: "default",
						nested: {
							otherThing: "also default",
							newThing: "but also this",
						},
					},
				},
				{
					nestedOnce: {},
					nestedTwice: {
						nested: {
							otherThing: "overridden",
						},
					},
				}
			)
		).to.deep.equal({
			nestedOnce: {
				ip: "default",
			},
			nestedTwice: {
				thing: "default",
				nested: {
					otherThing: "overridden",
					newThing: "but also this",
				},
			},
		});
	});

	it("should not merge arrays", function () {
		expect(
			mergeConfig(
				{
					test: ["sqlite", "text"],
				},
				{
					test: ["sqlite"],
				}
			)
		).to.deep.equal({
			test: ["sqlite"],
		});

		expect(
			mergeConfig(
				{
					test: ["sqlite", "text"],
				},
				{
					test: [],
				}
			)
		).to.deep.equal({
			test: [],
		});
	});

	it("should change order in arrays", function () {
		expect(
			mergeConfig(
				{
					test: ["sqlite", "text"],
				},
				{
					test: ["text", "sqlite"],
				}
			)
		).to.deep.equal({
			test: ["text", "sqlite"],
		});
	});

	it("should only merge same type", function () {
		stub(log, "warn");

		expect(
			mergeConfig(
				{
					shouldBeObject: {
						thing: "yes",
					},
				},
				{
					shouldBeObject: "bad type",
				}
			)
		).to.deep.equal({
			shouldBeObject: {
				thing: "yes",
			},
		});

		expect(
			mergeConfig(
				{
					shouldBeString: "string",
				},
				{
					shouldBeString: 1234567,
				}
			)
		).to.deep.equal({
			shouldBeString: "string",
		});

		log.warn.restore();
	});
});

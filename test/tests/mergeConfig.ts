import {expect} from "chai";
import sinon from "sinon";

import log from "../../server/log.js";
import Config from "../../server/config.js";
import TestUtil from "../util.js";

// Test-specific type for config merge testing (arbitrary nested config objects)
type TestConfigValue = string | number | boolean | null | (() => unknown) | string[] | TestConfig;
interface TestConfig {
	[key: string]: TestConfigValue | TestConfig;
}

describe("mergeConfig", function () {
	let sandbox: sinon.SinonSandbox;

	beforeEach(function () {
		sandbox = sinon.createSandbox();
	});

	afterEach(function () {
		sandbox.restore();
	});

	it("should mutate object", function () {
		const config = {
			ip: "default",
		} as TestConfig;

		expect(
			Config._merge_config_objects(config, {
				ip: "overridden",
			} as TestConfig)
		).to.deep.equal({
			ip: "overridden",
		});

		expect(config).to.deep.equal({
			ip: "overridden",
		});
	});

	it("should merge new properties", function () {
		expect(
			Config._merge_config_objects(
				{
					ip: "default",
					newProp: "this should appear too",
				} as TestConfig,
				{
					ip: "overridden",
				} as TestConfig
			)
		).to.deep.equal({
			ip: "overridden",
			newProp: "this should appear too",
		});
	});

	it("should extend objects", function () {
		expect(
			Config._merge_config_objects(
				{
					tlsOptions: {},
				} as TestConfig,
				{
					tlsOptions: {
						user: "test",
						thing: 123,
					},
				} as TestConfig
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
		sandbox.stub(log, "warn").callsFake(TestUtil.sanitizeLog((str) => (warning += str)));

		expect(
			Config._merge_config_objects(
				{
					optionOne: 123,
				} as TestConfig,
				{
					optionOne: 456,
					optionTwo: 789,
				} as TestConfig
			)
		).to.deep.equal({
			optionOne: 456,
			optionTwo: 789,
		});

		expect(warning).to.equal('Unknown key "optionTwo", please verify your config.\n');
	});

	it("should not warn for unknown second level keys", function () {
		expect(
			Config._merge_config_objects(
				{
					optionOne: {
						subOne: 123,
					},
				} as TestConfig,
				{
					optionOne: {
						subOne: 123,
						subTwo: 123,
					},
				} as TestConfig
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
			Config._merge_config_objects(
				{
					oidentd: null,
				} as TestConfig,
				{
					oidentd: "some path",
				} as TestConfig
			)
		).to.deep.equal({
			oidentd: "some path",
		});
	});

	it("should allow changing nulls with objects", function () {
		expect(
			Config._merge_config_objects(
				{
					webirc: null,
				} as TestConfig,
				{
					webirc: {
						serverone: "password",
						servertwo: "password2",
					},
				} as TestConfig
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
			Config._merge_config_objects(
				{
					webirc: null,
				} as TestConfig,
				{
					webirc: {
						servercb: callbackFunction,
					},
				} as TestConfig
			)
		).to.deep.equal({
			webirc: {
				servercb: callbackFunction,
			},
		});
	});

	it("should keep new properties inside of objects", function () {
		expect(
			Config._merge_config_objects(
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
				} as TestConfig,
				{
					nestedOnce: {},
					nestedTwice: {
						nested: {
							otherThing: "overridden",
						},
					},
				} as TestConfig
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
			Config._merge_config_objects(
				{
					test: ["sqlite", "text"],
				} as TestConfig,
				{
					test: ["sqlite"],
				} as TestConfig
			)
		).to.deep.equal({
			test: ["sqlite"],
		});

		expect(
			Config._merge_config_objects(
				{
					test: ["sqlite", "text"],
				} as TestConfig,
				{
					test: [],
				} as TestConfig
			)
		).to.deep.equal({
			test: [],
		});
	});

	it("should change order in arrays", function () {
		expect(
			Config._merge_config_objects(
				{
					test: ["sqlite", "text"],
				} as TestConfig,
				{
					test: ["text", "sqlite"],
				} as TestConfig
			)
		).to.deep.equal({
			test: ["text", "sqlite"],
		});
	});

	it("should only merge same type", function () {
		sandbox.stub(log, "warn");

		expect(
			Config._merge_config_objects(
				{
					shouldBeObject: {
						thing: "yes",
					},
				} as TestConfig,
				{
					shouldBeObject: "bad type",
				} as TestConfig
			)
		).to.deep.equal({
			shouldBeObject: {
				thing: "yes",
			},
		});

		expect(
			Config._merge_config_objects(
				{
					shouldBeString: "string",
				} as TestConfig,
				{
					shouldBeString: 1234567,
				} as TestConfig
			)
		).to.deep.equal({
			shouldBeString: "string",
		});
	});
});

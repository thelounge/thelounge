import {expect} from "chai";
import sinon from "ts-sinon";

import log from "../../server/log";
import Config from "../../server/config";
import TestUtil from "../util";

describe("mergeConfig", function () {
	it("should mutate object", function () {
		const config = {
			ip: "default",
		} as any;

		expect(
			Config._merge_config_objects(config, {
				ip: "overridden",
			} as any)
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
				} as any,
				{
					ip: "overridden",
				} as any
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
				} as any,
				{
					tlsOptions: {
						user: "test",
						thing: 123,
					},
				} as any
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
		const warnStub = sinon
			.stub(log, "warn")
			.callsFake(TestUtil.sanitizeLog((str) => (warning += str)));

		expect(
			Config._merge_config_objects(
				{
					optionOne: 123,
				} as any,
				{
					optionOne: 456,
					optionTwo: 789,
				} as any
			)
		).to.deep.equal({
			optionOne: 456,
			optionTwo: 789,
		});

		warnStub.restore();
		expect(warning).to.equal('Unknown key "optionTwo", please verify your config.\n');
	});

	it("should not warn for unknown second level keys", function () {
		expect(
			Config._merge_config_objects(
				{
					optionOne: {
						subOne: 123,
					},
				} as any,
				{
					optionOne: {
						subOne: 123,
						subTwo: 123,
					},
				} as any
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
				} as any,
				{
					oidentd: "some path",
				} as any
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
				} as any,
				{
					webirc: {
						serverone: "password",
						servertwo: "password2",
					},
				} as any
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
				} as any,
				{
					webirc: {
						servercb: callbackFunction,
					},
				} as any
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
				} as any,
				{
					nestedOnce: {},
					nestedTwice: {
						nested: {
							otherThing: "overridden",
						},
					},
				} as any
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
				} as any,
				{
					test: ["sqlite"],
				} as any
			)
		).to.deep.equal({
			test: ["sqlite"],
		});

		expect(
			Config._merge_config_objects(
				{
					test: ["sqlite", "text"],
				} as any,
				{
					test: [],
				} as any
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
				} as any,
				{
					test: ["text", "sqlite"],
				} as any
			)
		).to.deep.equal({
			test: ["text", "sqlite"],
		});
	});

	it("should only merge same type", function () {
		const logWarnStub = sinon.stub(log, "warn");

		expect(
			Config._merge_config_objects(
				{
					shouldBeObject: {
						thing: "yes",
					},
				} as any,
				{
					shouldBeObject: "bad type",
				} as any
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
				} as any,
				{
					shouldBeString: 1234567,
				} as any
			)
		).to.deep.equal({
			shouldBeString: "string",
		});

		logWarnStub.restore();
	});
});

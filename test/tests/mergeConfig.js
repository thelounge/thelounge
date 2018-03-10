"use strict";

const expect = require("chai").expect;
const mergeConfig = require("../../src/helper").mergeConfig;

describe("mergeConfig", function() {
	it("should mutate object", function() {
		const config = {
			ip: "default",
		};

		expect(mergeConfig(config, {
			ip: "overridden",
		})).to.deep.equal({
			ip: "overridden",
		});

		expect(config).to.deep.equal({
			ip: "overridden",
		});
	});

	it("should merge new properties", function() {
		expect(mergeConfig({
			ip: "default",
			newProp: "this should appear too",
		}, {
			ip: "overridden",
		})).to.deep.equal({
			ip: "overridden",
			newProp: "this should appear too",
		});
	});

	it("should extend objects", function() {
		expect(mergeConfig({
			tlsOptions: {},
		}, {
			tlsOptions: {
				user: "test",
				thing: 123,
			},
		})).to.deep.equal({
			tlsOptions: {
				user: "test",
				thing: 123,
			},
		});
	});

	it("should allow changing nulls", function() {
		expect(mergeConfig({
			oidentd: null,
		}, {
			oidentd: "some path",
		})).to.deep.equal({
			oidentd: "some path",
		});
	});

	it("should keep new properties inside of objects", function() {
		expect(mergeConfig({
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
		}, {
			nestedOnce: {},
			nestedTwice: {
				nested: {
					otherThing: "overridden",
				},
			},
		})).to.deep.equal({
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

	it("should not merge arrays", function() {
		expect(mergeConfig({
			test: ["sqlite", "text"],
		}, {
			test: ["sqlite"],
		})).to.deep.equal({
			test: ["sqlite"],
		});

		expect(mergeConfig({
			test: ["sqlite", "text"],
		}, {
			test: [],
		})).to.deep.equal({
			test: [],
		});
	});

	it("should change order in arrays", function() {
		expect(mergeConfig({
			test: ["sqlite", "text"],
		}, {
			test: ["text", "sqlite"],
		})).to.deep.equal({
			test: ["text", "sqlite"],
		});
	});

	it("should only merge same type", function() {
		const originalLog = log.info;

		log.warn = () => {};

		expect(mergeConfig({
			shouldBeObject: {
				thing: "yes",
			},
		}, {
			shouldBeObject: "bad type",
		})).to.deep.equal({
			shouldBeObject: {
				thing: "yes",
			},
		});

		expect(mergeConfig({
			shouldBeString: "string",
		}, {
			shouldBeString: 1234567,
		})).to.deep.equal({
			shouldBeString: "string",
		});

		log.warn = originalLog;
	});
});

import {expect, vi} from "vitest";
import Config from "../../server/config";
import {StorageCleaner} from "../../server/storageCleaner";
import {DeletionRequest, PrunableMessageStorage} from "../../server/plugins/messageStorage/types";
import {SearchQuery} from "../../shared/types/storage";
import {MessageType} from "../../shared/types/msg";

class StubProvider implements PrunableMessageStorage {
	isEnabled = true;
	requests: DeletionRequest[] = [];

	enable() {}
	close() {}
	index() {}
	deleteChannel() {}

	getMessages() {
		return [];
	}

	canProvideMessages() {
		return this.isEnabled;
	}

	search(query: SearchQuery) {
		return {...query, results: []};
	}

	deleteMessages(req: DeletionRequest) {
		this.requests.push({...req});
		return 0;
	}
}

describe("StorageCleaner", function () {
	const originalPolicy = Config.values.storagePolicy;

	afterEach(function () {
		Config.values.storagePolicy = originalPolicy;
		vi.useRealTimers();
	});

	it("should delete everything without limit", function () {
		Config.values.storagePolicy = {
			enabled: true,
			maxAgeDays: 3,
			deletionPolicy: "everything",
		};

		const provider = new StubProvider();
		const cleaner = new StorageCleaner(provider);

		expect(cleaner.runDeletesNoLimit()).to.equal(0);
		expect(provider.requests).to.deep.equal([
			{olderThanDays: 3, messageTypes: null, limit: -1},
		]);
	});

	it("should refuse to run when the policy is disabled", function () {
		Config.values.storagePolicy = {
			enabled: false,
			maxAgeDays: 3,
			deletionPolicy: "everything",
		};

		const cleaner = new StorageCleaner(new StubProvider());

		expect(() => cleaner.runDeletesNoLimit()).to.throw("storage policy is disabled");
	});

	it("should delete status messages in batches when started", function () {
		vi.useFakeTimers();
		Config.values.storagePolicy = {
			enabled: true,
			maxAgeDays: 7,
			deletionPolicy: "statusOnly",
		};

		const provider = new StubProvider();
		const cleaner = new StorageCleaner(provider);

		cleaner.start();
		vi.advanceTimersByTime(0);
		cleaner.stop();

		expect(provider.requests).to.have.length(1);
		expect(provider.requests[0].limit).to.equal(200);
		expect(provider.requests[0].olderThanDays).to.equal(7);
		expect(provider.requests[0].messageTypes).to.include(MessageType.JOIN);
		expect(provider.requests[0].messageTypes).to.not.include(MessageType.MESSAGE);
	});
});

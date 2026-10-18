import {expect, vi} from "vitest";
import sinon from "ts-sinon";
import Config from "../../server/config";
import changelog from "../../server/plugins/changelog";
import type ClientManager from "../../server/clientManager";

const {gotMock} = vi.hoisted(() => ({gotMock: vi.fn()}));

vi.mock("got", () => ({default: gotMock}));

describe("changelog", function () {
	let setTimeoutSpy: sinon.SinonSpy;

	// Timer used by the automatic update check, excluding jitter
	const checkInterval = 24 * 3600 * 1000;

	function scheduledNextCheck() {
		return setTimeoutSpy.getCalls().some((call) => (call.args[1] as number) >= checkInterval);
	}

	beforeEach(function () {
		setTimeoutSpy = sinon.spy(global, "setTimeout");
		gotMock.mockResolvedValue({statusCode: 200, body: "[]"});
	});

	afterEach(function () {
		setTimeoutSpy.restore();
		vi.restoreAllMocks();
	});

	it("should fetch releases from GitHub and schedule the next check", async function () {
		const manager = {clients: []} as unknown as ClientManager;

		changelog.checkForUpdates(manager);

		await vi.waitFor(() => expect(gotMock.mock.calls.length).to.equal(1));
		expect(String(gotMock.mock.calls[0][0])).to.include(
			"api.github.com/repos/thelounge/thelounge/releases"
		);

		await vi.waitFor(() => expect(scheduledNextCheck()).to.be.true);
	});

	it("should not contact GitHub or schedule a timer when disableUpdateCheck is set", async function () {
		const manager = {clients: []} as unknown as ClientManager;
		Config.values.disableUpdateCheck = true;

		try {
			changelog.checkForUpdates(manager);

			// Let any pending fetch or timer settle before asserting
			const {promise, resolve} = Promise.withResolvers<void>();
			setImmediate(resolve);
			await promise;

			expect(gotMock.mock.calls.length).to.equal(0);
			expect(scheduledNextCheck()).to.be.false;
		} finally {
			Config.values.disableUpdateCheck = false;
		}
	});
});

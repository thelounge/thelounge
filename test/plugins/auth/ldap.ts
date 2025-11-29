import log from "../../../server/log.js";
import ldapAuth from "../../../server/plugins/auth/ldap.js";
import Config from "../../../server/config.js";
import {Client as LdapClient} from "ldapts";
import {expect} from "chai";
import TestUtil from "../../util.js";
import ClientManager from "../../../server/clientManager.js";
import sinon from "sinon";
import type ServerClient from "../../../server/client.js";

type SinonSandbox = sinon.SinonSandbox;

type AuthResult = Promise<boolean>;

const user = "johndoe";
const wrongUser = "eve";
const correctPassword = "loremipsum";
const wrongPassword = "dolorsitamet";
const baseDN = "ou=accounts,dc=example,dc=com";
const primaryKey = "uid";

// LDAP auth tests don't use the ServerClient parameter - it's passed through but unused
const unusedServerClient = {} as ServerClient;

function runAuth(
	sandbox: SinonSandbox,
	manager: ClientManager,
	client: boolean | undefined,
	username: string,
	password: string
): AuthResult {
	// client parameter is ignored - LDAP auth doesn't use it in these test paths
	void client; // suppress unused warning
	return new Promise((resolve) => {
		ldapAuth.auth(manager, unusedServerClient, username, password, resolve);
	});
}

describe("LDAP authentication plugin", function () {
	const defaultSearchDN = {...Config.values.ldap.searchDN};
	let sandbox: SinonSandbox;
	let manager: ClientManager;
	const client = true;

	before(function () {
		// Ensure defaults are in a consistent state before the test suite runs
		Config.values.ldap.searchDN = {...defaultSearchDN};
	});

	beforeEach(function () {
		sandbox = sinon.createSandbox();

		Config.values.public = false;
		Config.values.ldap.enable = true;
		Config.values.ldap.url = "ldap://127.0.0.1:1389";
		Config.values.ldap.primaryKey = primaryKey;
		Config.values.ldap.baseDN = baseDN;
		Config.values.ldap.searchDN = {...defaultSearchDN};

		sandbox.stub(log, "info");

		// Mock ClientManager with only the method used by LDAP auth
		manager = {
			addUser: sandbox.stub(),
		} as ClientManager;
	});

	afterEach(function () {
		Config.values.public = true;
		Config.values.ldap.enable = false;
		delete Config.values.ldap.baseDN;
		Config.values.ldap.searchDN = {...defaultSearchDN};

		sandbox.restore();
	});

	describe("LDAP authentication availability", function () {
		it("checks that the configuration is correctly tied to isEnabled()", function () {
			Config.values.ldap.enable = true;
			expect(ldapAuth.isEnabled()).to.equal(true);

			Config.values.ldap.enable = false;
			expect(ldapAuth.isEnabled()).to.equal(false);
		});
	});

	describe("Simple LDAP authentication (predefined DN pattern)", function () {
		it("should successfully authenticate with correct password", async function () {
			const bindStub = sandbox.stub(LdapClient.prototype, "bind").resolves();
			const unbindStub = sandbox.stub(LdapClient.prototype, "unbind").resolves();

			const valid = await runAuth(sandbox, manager, client, user, correctPassword);

			expect(valid).to.equal(true);
			expect(bindStub.calledOnce).to.equal(true);
			expect(unbindStub.callCount).to.be.greaterThan(0);
		});

		it("should fail to authenticate with incorrect password", async function () {
			let errorMessage = "";
			const errorLogStub = sandbox
				.stub(log, "error")
				.callsFake(TestUtil.sanitizeLog((str) => (errorMessage += str)));
			sandbox
				.stub(LdapClient.prototype, "bind")
				.rejects(new Error("InsufficientAccessRightsError"));
			sandbox.stub(LdapClient.prototype, "unbind").resolves();

			const valid = await runAuth(sandbox, manager, client, user, wrongPassword);

			expect(valid).to.equal(false);
			expect(errorMessage).to.equal(
				"LDAP bind failed: Error: InsufficientAccessRightsError\n"
			);
			expect(errorLogStub.calledOnce).to.equal(true);
		});

		it("should fail to authenticate with incorrect username", async function () {
			let errorMessage = "";
			const errorLogStub = sandbox
				.stub(log, "error")
				.callsFake(TestUtil.sanitizeLog((str) => (errorMessage += str)));
			sandbox.stub(LdapClient.prototype, "bind").rejects(new Error("NoSuchObjectError"));
			sandbox.stub(LdapClient.prototype, "unbind").resolves();

			const valid = await runAuth(sandbox, manager, client, wrongUser, correctPassword);

			expect(valid).to.equal(false);
			expect(errorMessage).to.equal("LDAP bind failed: Error: NoSuchObjectError\n");
			expect(errorLogStub.calledOnce).to.equal(true);
		});
	});

	describe("Advanced LDAP authentication (DN found by a prior search query)", function () {
		beforeEach(function () {
			delete Config.values.ldap.baseDN;
			Config.values.ldap.searchDN = {
				rootDN: "cn=admin,dc=example,dc=com",
				rootPassword: "admin",
				filter: "(objectClass=person)",
				base: baseDN,
				scope: "sub",
			};
		});

		it("should successfully authenticate with correct password", async function () {
			const bindStub = sandbox.stub(LdapClient.prototype, "bind");
			bindStub.onCall(0).resolves();
			bindStub.onCall(1).resolves();

			sandbox.stub(LdapClient.prototype, "search").resolves({
				searchEntries: [{dn: `${primaryKey}=${user},${baseDN}`}],
				searchReferences: [],
			});
			sandbox.stub(LdapClient.prototype, "unbind").resolves();

			const valid = await runAuth(sandbox, manager, client, user, correctPassword);

			expect(valid).to.equal(true);
			expect(bindStub.callCount).to.equal(2);
		});

		it("should fail to authenticate with incorrect password", async function () {
			let errorMessage = "";
			const errorLogStub = sandbox
				.stub(log, "error")
				.callsFake(TestUtil.sanitizeLog((str) => (errorMessage += str)));

			const bindStub = sandbox.stub(LdapClient.prototype, "bind");
			bindStub.onCall(0).resolves();
			bindStub.onCall(1).rejects(new Error("InsufficientAccessRightsError"));

			sandbox.stub(LdapClient.prototype, "search").resolves({
				searchEntries: [{dn: `${primaryKey}=${user},${baseDN}`}],
				searchReferences: [],
			});
			sandbox.stub(LdapClient.prototype, "unbind").resolves();

			const valid = await runAuth(sandbox, manager, client, user, wrongPassword);

			expect(valid).to.equal(false);
			expect(errorMessage).to.equal(
				"LDAP bind failed: Error: InsufficientAccessRightsError\n"
			);
			expect(errorLogStub.calledOnce).to.equal(true);
			expect(bindStub.callCount).to.equal(2);
		});

		it("should fail to authenticate with incorrect username", async function () {
			let warningMessage = "";
			const warnLogStub = sandbox
				.stub(log, "warn")
				.callsFake(TestUtil.sanitizeLog((str) => (warningMessage += str)));

			sandbox.stub(LdapClient.prototype, "bind").resolves();
			sandbox.stub(LdapClient.prototype, "search").resolves({
				searchEntries: [],
				searchReferences: [],
			});
			sandbox.stub(LdapClient.prototype, "unbind").resolves();

			const valid = await runAuth(sandbox, manager, client, wrongUser, correctPassword);

			expect(valid).to.equal(false);
			expect(warningMessage).to.equal("LDAP Search did not find anything for: eve\n");
			expect(warnLogStub.calledOnce).to.equal(true);
		});
	});
});

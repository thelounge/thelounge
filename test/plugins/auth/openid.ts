import log from "../../../server/log";
import ldapAuth from "../../../server/plugins/auth/ldap";
import Config from "../../../server/config";
import {Provider} from "oidc-provider";
import {expect} from "chai";
import TestUtil from "../../util";
import ClientManager from "../../../server/clientManager";
import sinon from "ts-sinon";

const serverPort = 4932;
const clientID = "ircthing";
const clientSecret = "e379379396f2cea78aa1f54b6a580e4b";
const redirectURL = "http://localhost:9000";

function startOpenIDServer(callback) {
	const configuration = {
		clients: [
			{
				client_id: clientID,
				client_secret: clientSecret,
				redirect_uris: [redirectURL],
			},
		],
	};
	const oidc = new Provider("http://localhost:" + serverPort, configuration);
	const server = oidc.listen(serverPort);
}

describe("OpenID authentication plugin", function () {
	// Increase timeout due to unpredictable I/O on CI services
	this.timeout(TestUtil.isRunningOnCI() ? 25000 : 5000);
	this.slow(300);

	let logInfoStub: sinon.SinonStub<string[], void>;

	before(function () {
		logInfoStub = sinon.stub(log, "info");
	});

	after(function () {
		logInfoStub.restore();
	});

	beforeEach(function () {
		Config.values.public = false;
		Config.values.openid.enable = true;
		Config.values.openid.secret = clientSecret;
		Config.values.openid.clientID = clientID;
		Config.values.openid.issuerURL = "http://localhost:" + serverPort;
		Config.values.openid.baseURL = redirectURL;
	});

	afterEach(function () {
		Config.values.public = true;
		Config.values.openid.enable = false;
	});
});

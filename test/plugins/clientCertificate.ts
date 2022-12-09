import fs from "fs";
import path from "path";
import {expect} from "chai";
import ClientCertificate, {ClientCertificateType} from "../../server/plugins/clientCertificate";
import Config from "../../server/config";

describe("ClientCertificate", function () {
	it("should not generate a client certificate in public mode", function () {
		Config.values.public = true;

		const certificate = ClientCertificate.get("this-is-test-uuid");
		expect(certificate).to.be.null;
	});

	it("should generate a client certificate", function () {
		Config.values.public = false;
		const certificate = ClientCertificate.get("this-is-test-uuid") as ClientCertificateType;

		expect(certificate.certificate).to.match(/^-----BEGIN CERTIFICATE-----/);
		expect(certificate.private_key).to.match(/^-----BEGIN RSA PRIVATE KEY-----/);

		const certificate2 = ClientCertificate.get("this-is-test-uuid") as ClientCertificateType;
		expect(certificate2.certificate).to.equal(certificate.certificate);
		expect(certificate2.private_key).to.equal(certificate.private_key);

		Config.values.public = true;
	});

	it("should remove the client certificate files", function () {
		Config.values.public = false;

		const privateKeyPath = path.join(
			Config.getClientCertificatesPath(),
			`this-is-test-uuid.pem`
		);
		const certificatePath = path.join(
			Config.getClientCertificatesPath(),
			`this-is-test-uuid.crt`
		);

		expect(fs.existsSync(privateKeyPath)).to.be.true;
		expect(fs.existsSync(certificatePath)).to.be.true;

		ClientCertificate.remove("this-is-test-uuid");

		expect(fs.existsSync(privateKeyPath)).to.be.false;
		expect(fs.existsSync(certificatePath)).to.be.false;

		Config.values.public = true;
	});
});

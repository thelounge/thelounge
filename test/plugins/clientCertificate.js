"use strict";

const fs = require("fs");
const path = require("path");
const {expect} = require("chai");
const ClientCertificate = require("../../src/plugins/clientCertificate");
const Helper = require("../../src/helper");

describe("ClientCertificate", function () {
	it("should not generate a client certificate in public mode", function () {
		Helper.config.public = true;

		const certificate = ClientCertificate.get("this-is-test-uuid");
		expect(certificate).to.be.null;
	});

	it("should generate a client certificate", function () {
		Helper.config.public = false;
		const certificate = ClientCertificate.get("this-is-test-uuid");

		expect(certificate.certificate).to.match(/^-----BEGIN CERTIFICATE-----/);
		expect(certificate.private_key).to.match(/^-----BEGIN RSA PRIVATE KEY-----/);

		const certificate2 = ClientCertificate.get("this-is-test-uuid");
		expect(certificate2.certificate).to.equal(certificate.certificate);
		expect(certificate2.private_key).to.equal(certificate.private_key);

		Helper.config.public = true;
	});

	it("should remove the client certificate files", function () {
		Helper.config.public = false;

		const privateKeyPath = path.join(
			Helper.getClientCertificatesPath(),
			`this-is-test-uuid.pem`
		);
		const certificatePath = path.join(
			Helper.getClientCertificatesPath(),
			`this-is-test-uuid.crt`
		);

		expect(fs.existsSync(privateKeyPath)).to.be.true;
		expect(fs.existsSync(certificatePath)).to.be.true;

		ClientCertificate.remove("this-is-test-uuid");

		expect(fs.existsSync(privateKeyPath)).to.be.false;
		expect(fs.existsSync(certificatePath)).to.be.false;

		Helper.config.public = true;
	});
});

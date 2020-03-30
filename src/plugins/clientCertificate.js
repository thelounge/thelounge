"use strict";

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const {md, pki} = require("node-forge");
const log = require("../log");
const Helper = require("../helper");

module.exports = {
	get,
	remove,
};

function get(uuid) {
	if (Helper.config.public) {
		return null;
	}

	const folderPath = Helper.getClientCertificatesPath();
	const paths = getPaths(folderPath, uuid);

	if (!fs.existsSync(paths.privateKeyPath) || !fs.existsSync(paths.certificatePath)) {
		return generateAndWrite(folderPath, paths);
	}

	try {
		return {
			private_key: fs.readFileSync(paths.privateKeyPath, "utf-8"),
			certificate: fs.readFileSync(paths.certificatePath, "utf-8"),
		};
	} catch (e) {
		log.error("Unable to remove certificate", e);
	}

	return null;
}

function remove(uuid) {
	if (Helper.config.public) {
		return null;
	}

	const paths = getPaths(Helper.getClientCertificatesPath(), uuid);

	try {
		if (fs.existsSync(paths.privateKeyPath)) {
			fs.unlinkSync(paths.privateKeyPath);
		}

		if (fs.existsSync(paths.certificatePath)) {
			fs.unlinkSync(paths.certificatePath);
		}
	} catch (e) {
		log.error("Unable to remove certificate", e);
	}
}

function generateAndWrite(folderPath, paths) {
	const certificate = generate();

	try {
		fs.mkdirSync(folderPath, {recursive: true});

		fs.writeFileSync(paths.privateKeyPath, certificate.private_key, {
			mode: 0o600,
		});
		fs.writeFileSync(paths.certificatePath, certificate.certificate, {
			mode: 0o600,
		});

		return certificate;
	} catch (e) {
		log.error("Unable to write certificate", e);
	}

	return null;
}

function generate() {
	const keys = pki.rsa.generateKeyPair(2048);
	const cert = pki.createCertificate();

	cert.publicKey = keys.publicKey;
	cert.serialNumber = crypto.randomBytes(16).toString("hex").toUpperCase();

	// Set notBefore a day earlier just in case the time between
	// the client and server is not perfectly in sync
	cert.validity.notBefore = new Date();
	cert.validity.notBefore.setDate(cert.validity.notBefore.getDate() - 1);

	// Set notAfter 100 years into the future just in case
	// the server actually validates this field
	cert.validity.notAfter = new Date();
	cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 100);

	const attrs = [
		{
			name: "commonName",
			value: "The Lounge IRC Client",
		},
	];
	cert.setSubject(attrs);
	cert.setIssuer(attrs);

	// Set extensions that indicate this is a client authentication certificate
	cert.setExtensions([
		{
			name: "extKeyUsage",
			clientAuth: true,
		},
		{
			name: "nsCertType",
			client: true,
		},
	]);

	// Sign this certificate with a SHA256 signature
	cert.sign(keys.privateKey, md.sha256.create());

	const pem = {
		private_key: pki.privateKeyToPem(keys.privateKey),
		certificate: pki.certificateToPem(cert),
	};

	return pem;
}

function getPaths(folderPath, uuid) {
	return {
		privateKeyPath: path.join(folderPath, `${uuid}.pem`),
		certificatePath: path.join(folderPath, `${uuid}.crt`),
	};
}

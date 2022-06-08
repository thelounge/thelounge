import path from "path";
import fs from "fs";
import crypto from "crypto";
import {md, pki} from "node-forge";
import log from "../log";
import Config from "../config";

export default {
	get,
	remove,
};

export type ClientCertificateType = {
	private_key: string;
	certificate: string;
};

function get(uuid: string): ClientCertificateType | null {
	if (Config.values.public) {
		return null;
	}

	const folderPath = Config.getClientCertificatesPath();
	const paths = getPaths(folderPath, uuid);

	if (!fs.existsSync(paths.privateKeyPath) || !fs.existsSync(paths.certificatePath)) {
		return generateAndWrite(folderPath, paths);
	}

	try {
		return {
			private_key: fs.readFileSync(paths.privateKeyPath, "utf-8"),
			certificate: fs.readFileSync(paths.certificatePath, "utf-8"),
		} as ClientCertificateType;
	} catch (e: any) {
		log.error("Unable to get certificate", e);
	}

	return null;
}

function remove(uuid: string) {
	if (Config.values.public) {
		return null;
	}

	const paths = getPaths(Config.getClientCertificatesPath(), uuid);

	try {
		if (fs.existsSync(paths.privateKeyPath)) {
			fs.unlinkSync(paths.privateKeyPath);
		}

		if (fs.existsSync(paths.certificatePath)) {
			fs.unlinkSync(paths.certificatePath);
		}
	} catch (e: any) {
		log.error("Unable to remove certificate", e);
	}
}

function generateAndWrite(folderPath: string, paths: {privateKeyPath: any; certificatePath: any}) {
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
	} catch (e: any) {
		log.error("Unable to write certificate", String(e));
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
	// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
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
	} as ClientCertificateType;

	return pem;
}

function getPaths(folderPath: string, uuid: string) {
	return {
		privateKeyPath: path.join(folderPath, `${uuid}.pem`),
		certificatePath: path.join(folderPath, `${uuid}.crt`),
	};
}

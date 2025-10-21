import {ConfigType} from "../config";
import Helper from "../helper";
import {readFileSync} from "fs";
import {existsSync, writeFileSync} from "node:fs";
import {randomBytes} from "node:crypto";

export function loadSessionSecret(config: ConfigType, sessionSecretPath: string): string {
	if (config.sessionSecretRef) {
		return Helper.loadSecretValue(config.sessionSecretRef, "sessionSecretRef");
	}

	let sessionSecretValue: string;

	try {
		if (!existsSync(sessionSecretPath)) {
			// Generate file if it does not exist
			writeFileSync(sessionSecretPath, JSON.stringify(randomBytes(128)), {
				encoding: "utf8",
				mode: 0o0600,
			});
		}

		sessionSecretValue = readFileSync(sessionSecretPath, "utf8");
	} catch (e: unknown) {
		// Generate key if none exists

		throw new Error(`Unable to read session secret from ${sessionSecretPath}: ${String(e)}`);
	}

	sessionSecretPath = sessionSecretValue.trim();

	return sessionSecretPath;
}

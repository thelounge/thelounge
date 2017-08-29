"use strict";

const fs = require("fs");
const fsextra = require("fs-extra");
const path = require("path");
const crypto = require("crypto");
const helper = require("../helper");

class Storage {
	constructor() {
		this.references = new Map();

		// Ensures that a directory is empty.
		// Deletes directory contents if the directory is not empty.
		// If the directory does not exist, it is created.
		fsextra.emptyDirSync(helper.getStoragePath());
	}

	dereference(url) {
		const references = (this.references.get(url) || 0) - 1;

		if (references < 0) {
			return log.warn("Tried to dereference a file that has no references", url);
		}

		if (references > 0) {
			return this.references.set(url, references);
		}

		this.references.delete(url);

		// Drop "storage/" from url and join it with full storage path
		const filePath = path.join(helper.getStoragePath(), url.substring(8));

		fs.unlink(filePath, (err) => {
			if (err) {
				log.error("Failed to delete stored file", err);
			}
		});
	}

	store(data, extension, callback) {
		const hash = crypto.createHash("sha256").update(data).digest("hex");
		const a = hash.substring(0, 2);
		const b = hash.substring(2, 4);
		const folder = path.join(helper.getStoragePath(), a, b);
		const filePath = path.join(folder, `${hash.substring(4)}.${extension}`);
		const url = `storage/${a}/${b}/${hash.substring(4)}.${extension}`;

		this.references.set(url, 1 + (this.references.get(url) || 0));

		// If file with this name already exists, we don't need to write it again
		if (fs.existsSync(filePath)) {
			return callback(url);
		}

		fsextra.ensureDir(folder).then(() => {
			fs.writeFile(filePath, data, (err) => {
				if (err) {
					log.error("Failed to store a file", err);

					return callback("");
				}

				callback(url);
			});
		}).catch((err) => {
			log.error("Failed to create storage folder", err);

			return callback("");
		});
	}
}

module.exports = new Storage();

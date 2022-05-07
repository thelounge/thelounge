import log from "../log";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import Config from "../config";

class Storage {
	references: Map<string, number>;
	constructor() {
		this.references = new Map();
	}

	emptyDir() {
		// Ensures that a directory is empty.
		// Deletes directory contents if the directory is not empty.
		// If the directory does not exist, it is created.

		const dir = Config.getStoragePath();
		let items;

		try {
			items = fs.readdirSync(dir);
		} catch (e: any) {
			fs.mkdirSync(dir, {recursive: true});
			return;
		}

		// TODO: Use `fs.rmdirSync(dir, {recursive: true});` when it's stable (node 13+)
		items.forEach((item) => deleteFolder(path.join(dir, item)));
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
		const filePath = path.join(Config.getStoragePath(), url.substring(8));

		fs.unlink(filePath, (err) => {
			if (err) {
				log.error("Failed to delete stored file", err.message);
			}
		});
	}

	store(data, extension: string, callback: (url: string) => void) {
		const hash = crypto.createHash("sha256").update(data).digest("hex");
		const a = hash.substring(0, 2);
		const b = hash.substring(2, 4);
		const folder = path.join(Config.getStoragePath(), a, b);
		const filePath = path.join(folder, `${hash.substring(4)}.${extension}`);
		const url = `storage/${a}/${b}/${hash.substring(4)}.${extension}`;

		this.references.set(url, 1 + (this.references.get(url) || 0));

		// If file with this name already exists, we don't need to write it again
		if (fs.existsSync(filePath)) {
			return callback(url);
		}

		fs.mkdir(folder, {recursive: true}, (mkdirErr) => {
			if (mkdirErr) {
				log.error("Failed to create storage folder", mkdirErr.message);

				return callback("");
			}

			fs.writeFile(filePath, data, (err) => {
				if (err) {
					log.error("Failed to store a file", err.message);

					return callback("");
				}

				callback(url);
			});
		});
	}
}

export default new Storage();

function deleteFolder(dir: string) {
	fs.readdirSync(dir).forEach((item) => {
		item = path.join(dir, item);

		if (fs.lstatSync(item).isDirectory()) {
			deleteFolder(item);
		} else {
			fs.unlinkSync(item);
		}
	});

	fs.rmdirSync(dir);
}

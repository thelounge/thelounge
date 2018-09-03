"use strict";

const SocketIOFileUploadServer = require("socketio-file-upload/server");
const Helper = require("../helper");
const path = require("path");
const fsextra = require("fs-extra");
const fs = require("fs");
const fileType = require("file-type");
const readChunk = require("read-chunk");
const crypto = require("crypto");
const isUtf8 = require("is-utf8");
const log = require("../log");

const whitelist = [
	"application/ogg",
	"audio/midi",
	"audio/mpeg",
	"audio/ogg",
	"audio/x-wav",
	"image/bmp",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp",
	"text/plain",
	"video/mp4",
	"video/ogg",
	"video/webm",
];

class Uploader {
	constructor(client, socket) {
		const uploader = new SocketIOFileUploadServer();
		const folder = path.join(Helper.getFileUploadPath(), ".tmp");

		fsextra.ensureDir(folder, (err) => {
			if (err) {
				log.err(`Error ensuring ${folder} exists for uploads.`);
			} else {
				uploader.dir = folder;
			}
		});

		uploader.on("complete", (data) => {
			handleSaving(data).then((randomName) => {
				const randomFileName = randomName;
				const slug = data.file.base;
				const url = `uploads/${randomFileName}/${slug}`;
				client.emit("upload:success", url);
			});
		});

		uploader.on("error", (data) => {
			log.error(`Error uploading ${data.error.name}`);
			log.error(data.error);
		});

		// maxFileSize is in bytes, but config option is passed in as KB
		uploader.maxFileSize = Uploader.getMaxFileSize();
		uploader.listen(socket);

		// Returns Promise
		function handleSaving(data) {
			const tempPath = path.join(Helper.getFileUploadPath(), ".tmp", data.file.name);
			let randomName, destPath;

			// If file conflicts
			do {
				randomName = crypto.randomBytes(8).toString("hex");
				destPath = path.join(Helper.getFileUploadPath(), randomName.substring(0, 2), randomName);
			} while (fs.stat(destPath, (err) => (err ? true : false)));

			return fsextra.move(tempPath, destPath)
				.then(() => randomName).catch(() => {
					log.warn(`Unable to move file ${tempPath} to ${destPath}`);
				});
		}
	}

	static isValidType(mimeType) {
		return whitelist.includes(mimeType);
	}

	static router(express) {
		express.get("/uploads/:name/:slug*?", (req, res) => {
			const name = req.params.name;

			const nameRegex = /^[0-9a-f]{16}$/;

			if (!nameRegex.test(name)) {
				return res.status(404).send("Not found");
			}

			const folder = name.substring(0, 2);
			const uploadPath = Helper.getFileUploadPath();
			const filePath = path.join(uploadPath, folder, name);
			const type = Uploader.getFileType(filePath);
			const mimeType = type || "application/octet-stream";
			const contentDisposition = Uploader.isValidType(type) ? "inline" : "attachment";

			// doesn't exist
			if (type === undefined) {
				return res.status(404).send("Not found");
			}

			res.setHeader("Content-Disposition", contentDisposition);
			res.setHeader("Cache-Control", "max-age=86400");
			res.contentType(mimeType);

			return res.sendFile(filePath);
		});
	}

	static getMaxFileSize() {
		const configOption = Helper.config.fileUpload.maxFileSize;

		if (configOption === -1) { // no file size limit
			return null;
		}

		return configOption * 1024;
	}

	static getFileType(filePath) {
		let buffer;
		let type;

		try {
			buffer = readChunk.sync(filePath, 0, 4100);
		} catch (e) {
			if (e.code === "ENOENT") { // doesn't exist
				return;
			}

			log.warn(`Failed to read ${filePath}`);
			return;
		}

		// returns {ext, mime} if found, null if not.
		const file = fileType(buffer);

		if (file) {
			type = file.mime;
		} else if (isUtf8(buffer)) {
			type = "text/plain";
		}

		return type;
	}
}

module.exports = Uploader;

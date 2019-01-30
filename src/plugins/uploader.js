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
	"audio/vnd.wave",
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
	constructor(socket) {
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
			let randomName;
			let destPath;

			// Generate a random file name for storage on disk
			do {
				randomName = crypto.randomBytes(8).toString("hex");
				destPath = path.join(Helper.getFileUploadPath(), randomName.substring(0, 2), randomName);
			} while (fs.existsSync(destPath));

			fsextra.move(data.file.pathName, destPath).then(() => {
				const slug = encodeURIComponent(path.basename(data.file.pathName));
				const url = `uploads/${randomName}/${slug}`;
				socket.emit("upload:success", url);
			}).catch(() => {
				log.warn(`Unable to move uploaded file "${data.file.pathName}"`);

				// Emit failed upload to the client if file move fails
				socket.emit("siofu_error", {
					id: data.file.id,
					message: "Unable to move uploaded file",
				});
			});
		});

		uploader.on("error", (data) => {
			log.error(`File upload failed: ${data.error}`);
		});

		// maxFileSize is in bytes, but config option is passed in as KB
		uploader.maxFileSize = Uploader.getMaxFileSize();
		uploader.listen(socket);
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
			const detectedMimeType = Uploader.getFileType(filePath);

			// doesn't exist
			if (detectedMimeType === null) {
				return res.status(404).send("Not found");
			}

			// Force a download in the browser if it's not a whitelisted type (binary or otherwise unknown)
			const contentDisposition = Uploader.isValidType(detectedMimeType) ? "inline" : "attachment";

			res.setHeader("Content-Disposition", contentDisposition);
			res.setHeader("Cache-Control", "max-age=86400");
			res.contentType(detectedMimeType);

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

	// Returns null if an error occurred (e.g. file not found)
	// Returns a string with the type otherwise
	static getFileType(filePath) {
		try {
			const buffer = readChunk.sync(filePath, 0, fileType.minimumBytes);

			// returns {ext, mime} if found, null if not.
			const file = fileType(buffer);

			if (file) {
				return file.mime;
			}

			if (isUtf8(buffer)) {
				return "text/plain";
			}

			return "application/octet-stream";
		} catch (e) {
			if (e.code !== "ENOENT") {
				log.warn(`Failed to read ${filePath}: ${e.message}`);
			}
		}

		return null;
	}
}

module.exports = Uploader;

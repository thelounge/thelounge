"use strict";

const Helper = require("../helper");
const busboy = require("busboy");
const uuidv4 = require("uuid/v4");
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

const uploadTokens = new Map();

class Uploader {
	constructor(socket) {
		socket.on("upload:auth", () => {
			const token = uuidv4();

			uploadTokens.set(token, true);

			socket.emit("upload:auth", token);

			// Invalidate the token in one minute
			setTimeout(() => uploadTokens.delete(token), 60 * 1000);
		});
	}

	static isValidType(mimeType) {
		return whitelist.includes(mimeType);
	}

	static router(express) {
		express.get("/uploads/:name/:slug*?", Uploader.routeGetFile);
		express.post("/uploads/new/:token", Uploader.routeUploadFile);
	}

	static routeGetFile(req, res) {
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
	}

	static routeUploadFile(req, res) {
		let busboyInstance;
		let uploadUrl;
		let randomName;
		let destDir;
		let destPath;
		let streamWriter;

		const doneCallback = () => {
			// detach the stream and drain any remaining data
			if (busboyInstance) {
				req.unpipe(busboyInstance);
				req.on("readable", req.read.bind(req));

				busboyInstance.removeAllListeners();
				busboyInstance = null;
			}

			// close the output file stream
			if (streamWriter) {
				streamWriter.end();
				streamWriter = null;
			}
		};

		const abortWithError = (err) => {
			doneCallback();

			// if we ended up erroring out, delete the output file from disk
			if (destPath && fs.existsSync(destPath)) {
				fs.unlinkSync(destPath);
				destPath = null;
			}

			return res.status(400).json({error: err.message});
		};

		// if the authentication token is incorrect, bail out
		if (uploadTokens.delete(req.params.token) !== true) {
			return abortWithError(Error("Invalid upload token"));
		}

		// if the request does not contain any body data, bail out
		if (req.headers["content-length"] < 1) {
			return abortWithError(Error("Length Required"));
		}

		// Only allow multipart, as busboy can throw an error on unsupported types
		if (!req.headers["content-type"].startsWith("multipart/form-data")) {
			return abortWithError(Error("Unsupported Content Type"));
		}

		// create a new busboy processor, it is wrapped in try/catch
		// because it can throw on malformed headers
		try {
			busboyInstance = new busboy({
				headers: req.headers,
				limits: {
					files: 1, // only allow one file per upload
					fileSize: Uploader.getMaxFileSize(),
				},
			});
		} catch (err) {
			return abortWithError(err);
		}

		// Any error or limit from busboy will abort the upload with an error
		busboyInstance.on("error", abortWithError);
		busboyInstance.on("partsLimit", () => abortWithError(Error("Parts limit reached")));
		busboyInstance.on("filesLimit", () => abortWithError(Error("Files limit reached")));
		busboyInstance.on("fieldsLimit", () => abortWithError(Error("Fields limit reached")));

		// generate a random output filename for the file
		// we use do/while loop to prevent the rare case of generating a file name
		// that already exists on disk
		do {
			randomName = crypto.randomBytes(8).toString("hex");
			destDir = path.join(Helper.getFileUploadPath(), randomName.substring(0, 2));
			destPath = path.join(destDir, randomName);
		} while (fs.existsSync(destPath));

		// we split the filename into subdirectories (by taking 2 letters from the beginning)
		// this helps avoid file system and certain tooling limitations when there are
		// too many files on one folder
		try {
			fsextra.ensureDirSync(destDir);
		} catch (err) {
			log.err(`Error ensuring ${destDir} exists for uploads: ${err.message}`);
			return abortWithError(err);
		}

		// Open a file stream for writing
		streamWriter = fs.createWriteStream(destPath);
		streamWriter.on("error", abortWithError);

		busboyInstance.on("file", (fieldname, fileStream, filename) => {
			uploadUrl = `${randomName}/${encodeURIComponent(filename)}`;

			if (Helper.config.fileUpload.baseUrl) {
				uploadUrl = new URL(uploadUrl, Helper.config.fileUpload.baseUrl).toString();
			} else {
				uploadUrl = `uploads/${uploadUrl}`;
			}

			// if the busboy data stream errors out or goes over the file size limit
			// abort the processing with an error
			fileStream.on("error", abortWithError);
			fileStream.on("limit", () => {
				fileStream.unpipe(streamWriter);
				fileStream.on("readable", fileStream.read.bind(fileStream));

				abortWithError(Error("File size limit reached"));
			});

			// Attempt to write the stream to file
			fileStream.pipe(streamWriter);
		});

		busboyInstance.on("finish", () => {
			doneCallback();

			if (!uploadUrl) {
				return res.status(400).json({error: "Missing file"});
			}

			// upload was done, send the generated file url to the client
			res.status(200).json({
				url: uploadUrl,
			});
		});

		// pipe request body to busboy for processing
		return req.pipe(busboyInstance);
	}

	static getMaxFileSize() {
		const configOption = Helper.config.fileUpload.maxFileSize;

		// Busboy uses Infinity to allow unlimited file size
		if (configOption < 1) {
			return Infinity;
		}

		// maxFileSize is in bytes, but config option is passed in as KB
		return configOption * 1024;
	}

	// Returns null if an error occurred (e.g. file not found)
	// Returns a string with the type otherwise
	static getFileType(filePath) {
		try {
			const buffer = readChunk.sync(filePath, 0, fileType.minimumBytes);

			// returns {ext, mime} if found, null if not.
			const file = fileType(buffer);

			// if a file type was detected correctly, return it
			if (file) {
				return file.mime;
			}

			// if the buffer is a valid UTF-8 buffer, use text/plain
			if (isUtf8(buffer)) {
				return "text/plain";
			}

			// otherwise assume it's random binary data
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

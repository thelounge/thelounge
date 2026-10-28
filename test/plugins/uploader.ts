import fs from "fs";
import http from "http";
import path from "path";
import {expect} from "vitest";
import util from "../util";
import Config from "../../server/config";
import Uploader from "../../server/plugins/uploader";

describe("Uploader", function () {
	const uploadPath = Config.getFileUploadPath();
	const boundary = "----TheLoungeUploaderTest";
	const filePart =
		`--${boundary}\r\n` +
		`Content-Disposition: form-data; name="file"; filename="hello.txt"\r\n` +
		`Content-Type: text/plain\r\n\r\n`;
	const fileTail = `\r\n--${boundary}--\r\n`;

	let connection: http.Server;
	let port: number;
	let tokens: string[];

	const listFiles = (): string[] => {
		if (!fs.existsSync(uploadPath)) {
			return [];
		}

		return fs
			.readdirSync(uploadPath)
			.flatMap((dir) => fs.readdirSync(path.join(uploadPath, dir)))
			.sort();
	};

	const waitFor = async (condition: () => boolean) => {
		for (let i = 0; i < 100 && !condition(); i++) {
			await new Promise((resolve) => setTimeout(resolve, 20));
		}
	};

	const requestOptions = (contentLength: number) => ({
		host: "127.0.0.1",
		port,
		method: "POST",
		path: `/uploads/new/${tokens.pop()}`,
		headers: {
			"Content-Type": `multipart/form-data; boundary=${boundary}`,
			"Content-Length": contentLength,
		},
	});

	beforeAll(function () {
		return new Promise<void>((resolve) => {
			const app = util.createWebserver();
			Uploader.router(app);

			tokens = [];
			const socket = {
				on(event: string, handler: () => void) {
					if (event === "upload:auth") {
						socket.requestToken = handler;
					}
				},
				emit(event: string, token: string) {
					if (event === "upload:auth") {
						tokens.push(token);
					}
				},
				requestToken() {},
			};
			new Uploader(socket as any);
			socket.requestToken();
			socket.requestToken();

			connection = app.listen(0, "127.0.0.1", () => {
				port = (connection.address() as any).port;
				resolve();
			});
		});
	});

	afterAll(function () {
		fs.rmSync(uploadPath, {recursive: true, force: true});

		return new Promise<void>((resolve) => {
			connection.close(() => resolve());
		});
	});

	it("stores a complete upload and returns its url", function () {
		const body = `${filePart}hello${fileTail}`;

		return new Promise<void>((resolve, reject) => {
			const req = http.request(requestOptions(Buffer.byteLength(body)), (res) => {
				let data = "";
				res.on("data", (chunk) => (data += chunk));
				res.on("end", () => {
					try {
						expect(res.statusCode).to.equal(200);
						expect(JSON.parse(data).url).to.match(
							/^uploads\/[0-9a-f]{16}\/hello\.txt$/
						);
						expect(listFiles()).to.have.lengthOf(1);
						resolve();
					} catch (e) {
						reject(e);
					}
				});
			});
			req.on("error", reject);
			req.end(body);
		});
	});

	it("removes the partial file when the request is aborted", async function () {
		const before = listFiles();

		await new Promise<void>((resolve) => {
			const req = http.request(requestOptions(1024 * 1024));
			req.on("error", () => {});
			req.on("close", () => resolve());
			req.write(`${filePart}partial`, () => {
				setTimeout(() => req.destroy(), 100);
			});
		});

		await waitFor(() => listFiles().length === before.length);

		expect(listFiles()).to.deep.equal(before);
	});
});

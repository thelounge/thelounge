import got, {Response} from "got";
import colors from "chalk";
import log from "../log";
import pkg from "../../package.json";
import ClientManager from "../clientManager";

const TIME_TO_LIVE = 15 * 60 * 1000; // 15 minutes, in milliseconds

export default {
	isUpdateAvailable: false,
	fetch,
	checkForUpdates,
};
export type ChangelogData = {
	current: {
		prerelease: boolean;
		version: string;
		changelog?: string;
		url: string;
	};
	expiresAt: number;
	latest?: {
		prerelease: boolean;
		version: string;
		url: string;
	};
	packages?: boolean;
};

const versions = {
	current: {
		version: `v${pkg.version}`,
		changelog: undefined,
	},
	expiresAt: -1,
	latest: undefined,
	packages: undefined,
} as ChangelogData;

async function fetch() {
	const time = Date.now();

	// Serving information from cache
	if (versions.expiresAt > time) {
		return versions;
	}

	try {
		const response = await got("https://api.github.com/repos/thelounge/thelounge/releases", {
			headers: {
				Accept: "application/vnd.github.v3.html", // Request rendered markdown
				"User-Agent": pkg.name + "; +" + pkg.repository.url, // Identify the client
			},
		});

		if (response.statusCode !== 200) {
			return versions;
		}

		updateVersions(response);

		// Add expiration date to the data to send to the client for later refresh
		versions.expiresAt = time + TIME_TO_LIVE;
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		log.error(`Failed to fetch changelog: ${error}`);
	}

	return versions;
}

function updateVersions(response: Response<string>) {
	let i: number;
	let release: {tag_name: string; body_html: any; prerelease: boolean; html_url: any};
	let prerelease = false;

	const body = JSON.parse(response.body);

	// Find the current release among releases on GitHub
	for (i = 0; i < body.length; i++) {
		release = body[i];

		if (release.tag_name === versions.current.version) {
			versions.current.changelog = release.body_html;
			prerelease = release.prerelease;

			break;
		}
	}

	// Find the latest release made after the current one if there is one
	if (i > 0) {
		for (let j = 0; j < i; j++) {
			release = body[j];

			// Find latest release or pre-release if current version is also a pre-release
			if (!release.prerelease || release.prerelease === prerelease) {
				module.exports.isUpdateAvailable = true;

				versions.latest = {
					prerelease: release.prerelease,
					version: release.tag_name,
					url: release.html_url,
				};

				break;
			}
		}
	}
}

function checkForUpdates(manager: ClientManager) {
	fetch()
		.then((versionData) => {
			if (!module.exports.isUpdateAvailable) {
				// Check for updates every 24 hours + random jitter of <3 hours
				setTimeout(
					() => checkForUpdates(manager),
					24 * 3600 * 1000 + Math.floor(Math.random() * 10000000)
				);
			}

			if (!versionData.latest) {
				return;
			}

			log.info(
				`The Lounge ${colors.green(
					versionData.latest.version
				)} is available. Read more on GitHub: ${versionData.latest.url}`
			);

			// Notify all connected clients about the new version
			manager.clients.forEach((client) => client.emit("changelog:newversion"));
		})
		.catch((error: Error) => {
			log.error(`Failed to check for updates: ${error.message}`);
		});
}

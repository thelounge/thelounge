import colors from "chalk";
import log from "../log.js";
import pkg from "../../package.json" assert {type: "json"};
import ClientManager from "../clientManager.js";
import Config from "../config.js";
import {SharedChangelogData} from "../../shared/types/changelog.js";
import {Agent as UndiciAgent} from "undici";

const TIME_TO_LIVE = 15 * 60 * 1000; // 15 minutes, in milliseconds

let updateCheckTimeout: NodeJS.Timeout | null = null;

const changelog = {
    isUpdateAvailable: false,
    fetch,
    checkForUpdates,
    stopUpdateChecks,
};

export default changelog;
const versions: SharedChangelogData = {
    current: {
        prerelease: false,
        version: `v${pkg.version}`,
        changelog: undefined,
        url: "", // TODO: properly init
    },
    expiresAt: -1,
    latest: undefined,
    packages: undefined,
};

async function fetch() {
    const time = Date.now();

    // Serving information from cache
    if (versions.expiresAt > time) {
        return versions;
    }

    try {
        const fetchOptions: any = {
            headers: {
                Accept: "application/vnd.github.v3.html", // Request rendered markdown
                "User-Agent": pkg.name + "; +" + pkg.repository.url, // Identify the client
            },
        };

        // Add custom agent for local binding if configured
        if (Config.values.bind) {
            const agent = new UndiciAgent({
                connect: {
                    localAddress: Config.values.bind,
                },
            });
            fetchOptions.dispatcher = agent;
        }

        const response = await globalThis.fetch(
            "https://api.github.com/repos/thelounge/thelounge/releases",
            fetchOptions
        );

        if (response.status !== 200) {
            return versions;
        }

        const body = await response.text();
        updateVersions(body);

        // Add expiration date to the data to send to the client for later refresh
        versions.expiresAt = time + TIME_TO_LIVE;
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        log.error(`Failed to fetch changelog: ${error}`);
    }

    return versions;
}

function updateVersions(responseBody: string) {
    let i: number;
    let release: {tag_name: string; body_html: any; prerelease: boolean; html_url: any};
    let prerelease = false;

    const body = JSON.parse(responseBody);

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
                changelog.isUpdateAvailable = true;

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
            if (!changelog.isUpdateAvailable) {
                // Check for updates every 24 hours + random jitter of <3 hours
                updateCheckTimeout = setTimeout(
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

function stopUpdateChecks() {
    if (updateCheckTimeout) {
        clearTimeout(updateCheckTimeout);
        updateCheckTimeout = null;
    }
}

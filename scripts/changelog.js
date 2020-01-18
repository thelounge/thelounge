/*
This (very The Lounge-custom) script is a helper to generate changelog entries.

Note that it is not meant to produce fully-automated changelogs like other tools
do, but merely prepare a changelog entry without risks of mistyping a URL or
missing a contribution: changelogs are meant for humans, and therefore must be
manually curated as such, with ❤️.

## Set up:

- Create a personal access token with `public_repo` at
  https://github.com/settings/tokens. Make sure to write it down as you will not
  be able to display it again.

- Use Node.js v8+:

  ```sh
  nvm install 8
  ```

## Usage

npm v5 removes packages not listed in package.json when running `npm install` so
it is very likely you will have to run all those each time:

```sh
 export CHANGELOG_TOKEN=<The personal access token created on GitHub above>
node scripts/changelog <version>
```

`<version>` must be either:

- A keyword among: major, minor, patch, prerelease, pre
- An explicit version of either format:
  - `MAJOR.MINOR.PATCH` for a stable release, for example `2.5.0`
  - `MAJOR.MINOR.PATCH-(pre|rc).N` for a pre-release, for example `2.5.0-rc.1`

## TODOs:

- Use better labels for better categorization
- Add some stats to the git commit (how many LOCs total / in this release, etc.)
- This script requires Node v8, but `npm version` currently fails with Node v8
  as we gitignore package-lock.json (how is that even a thing?!).
*/

"use strict";

const _ = require("lodash");
const colors = require("chalk");
const fs = require("fs");
const path = require("path");
const GraphQLClient = require("graphql-request").GraphQLClient;
const dayjs = require("dayjs");
const semver = require("semver");
const util = require("util");
const log = require("../src/log");
const packageJson = require("../package.json");
let token = process.env.CHANGELOG_TOKEN;

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const changelogPath = path.resolve(__dirname, "..", "CHANGELOG.md");

// CLI argument validations

if (token === undefined) {
	try {
		token = fs
			.readFileSync(path.resolve(__dirname, "./github_token.txt"))
			.toString()
			.trim();
	} catch (e) {
		log.error(`Environment variable ${colors.bold("CHANGELOG_TOKEN")} must be set.`);
		log.error(`Alternative create ${colors.bold("scripts/github_token.txt")} file.`);
		process.exit(1);
	}
}

if (process.argv[2] === undefined) {
	log.error(`Argument ${colors.bold("version")} is missing`);
	process.exit(1);
}

// If version is not a valid X.Y.Z, it may be something like "pre".
let version = semver.valid(process.argv[2]);

if (!version) {
	version = semver.inc(packageJson.version, process.argv[2]);
}

function isValidVersion(str) {
	return /^[0-9]+\.[0-9]+\.[0-9]+(-(pre|rc)+\.[0-9]+)?$/.test(str);
}

if (!isValidVersion(version)) {
	log.error(`Argument ${colors.bold("version")} is incorrect It must be either:`);
	log.error(
		`- A keyword among: ${colors.green("major")}, ${colors.green("minor")}, ${colors.green(
			"patch"
		)}, ${colors.green("prerelease")}, ${colors.green("pre")}`
	);
	log.error(
		`- An explicit version of format ${colors.green("x.y.z")} (stable) or ${colors.green(
			"x.y.z-(pre|rc).n"
		)} (pre-release).`
	);
	process.exit(1);
}

// Templates

function prereleaseTemplate(items) {
	return `
## v${items.version} - ${items.date} [Pre-release]

[See the full changelog](${items.fullChangelogUrl})

${
	prereleaseType(items.version) === "rc"
		? `This is a release candidate (RC) for v${stableVersion(
				items.version
		  )} to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.`
		: `This is a pre-release for v${stableVersion(
				items.version
		  )} to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.`
}

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the \`next\` tag to be installed:

\`\`\`sh
yarn global add thelounge@next
\`\`\`
`;
}

// Check if the object is empty, or if all array values within this object are
// empty
function isEmpty(list) {
	const values = Object.values(list);
	return values.length === 0 || values.every((entries) => entries.length === 0);
}

function stableTemplate(items) {
	return `
## v${items.version} - ${items.date}

For more details, [see the full changelog](${items.fullChangelogUrl}) and [milestone](${
		items.milestone.url
	}?closed=1).

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@ DESCRIPTION, ANNOUNCEMENT, ETC. @@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

### Added

### Changed

${
	isEmpty(items.dependencies)
		? ""
		: `- Update production dependencies to their latest versions:
${printDependencyList(items.dependencies)}`
}

### Deprecated

${printList(items.deprecations)}

### Removed

### Fixed

### Security

${printList(items.security)}

### Documentation

${
	items.documentation.length === 0
		? ""
		: `In the main repository:

${printList(items.documentation)}`
}

${
	items.websiteDocumentation.length === 0
		? ""
		: `On the [website repository](https://github.com/thelounge/thelounge.github.io):

${printList(items.websiteDocumentation)}`
}

### Internals

${printList(items.internals)}${
		isEmpty(items.devDependencies)
			? ""
			: `
- Update development dependencies to their latest versions:
${printDependencyList(items.devDependencies)}`
	}

@@@@@@@@@@@@@@@@@@@
@@ UNCATEGORIZED @@
@@@@@@@@@@@@@@@@@@@
${printUncategorizedList(items.uncategorized)}`;
}

// Returns true if the given version is a pre-release (i.e. 2.0.0-pre.3,
// 2.5.0-rc.1, etc.), or false otherwise
function isPrerelease(v) {
	return v.includes("-");
}

// Given a version of `x.y.z-abc.n`, returns `abc`, i.e. the type of pre-release
function prereleaseType(v) {
	return semver.prerelease(v)[0];
}

// Returns the stable version that this pre-release version is targeting. For
// example, if new version is 2.5.0-rc.2, next stable version will be 2.5.0.
function stableVersion(prereleaseVersion) {
	return prereleaseVersion.substr(0, prereleaseVersion.indexOf("-"));
}

// Generates a compare-view URL between 2 versions of The Lounge
function fullChangelogUrl(v1, v2) {
	return `https://github.com/thelounge/thelounge/compare/v${v1}...v${v2}`;
}

// This class is a facade to fetching details about commits / PRs / tags / etc.
// for a given repository of our organization.
class RepositoryFetcher {
	// Holds a GraphQLClient and the name of the repository within the
	// organization https://github.com/thelounge.
	constructor(graphqlClient, repositoryName) {
		this.graphqlClient = graphqlClient;
		this.repositoryName = repositoryName;
	}

	// Base function that actually makes the GraphQL API call
	async fetch(query, variables = {}) {
		return this.graphqlClient.request(
			query,
			Object.assign(variables, {repositoryName: this.repositoryName})
		);
	}

	// Returns the git commit that is attached to a given tag
	async fetchTaggedCommit(tag) {
		const tagQuery = `query fetchTaggedCommit($repositoryName: String!, $tag: String!) {
			repository(owner: "thelounge", name: $repositoryName) {
				ref(qualifiedName: $tag) {
					tag: target {
						oid
						... on Tag {
							commit: target {
								oid
							}
						}
					}
				}
			}
		}`;
		const data = await this.fetch(tagQuery, {tag});
		return data.repository.ref.tag.commit || data.repository.ref.tag;
	}

	// Returns an array of annotated commits that have been made on the master
	// branch since a given version. Each commit is an object that can optionally
	// have a `pullRequestId` if this is a merge-PR commit.
	async fetchCommitsSince(stopCommit) {
		const commitsQuery = `query fetchCommits($repositoryName: String!, $afterCursor: String) {
			repository(owner: "thelounge", name: $repositoryName) {
				ref(qualifiedName: "master") {
					target {
						... on Commit {
							history(first: 100, after: $afterCursor) {
								pageInfo {
									hasNextPage
									endCursor
								}
								commits: nodes {
									__typename
									oid
									abbreviatedOid
									messageHeadline
									url
									author {
										user {
											login
											url
										}
									}
									comments(first: 100) {
										nodes {
											body
											authorAssociation
										}
									}
								}
							}
						}
					}
				}
			}
		}`;

		// Recursive function that retrieves commits page after page until the last
		// page or a given commit are reached.
		const fetchPaginatedCommits = async (afterCursor = null) => {
			const data = await this.fetch(commitsQuery, {afterCursor});
			const {commits, pageInfo} = data.repository.ref.target.history;

			if (commits.map(({oid}) => oid).includes(stopCommit.oid)) {
				return _.takeWhile(commits, ({oid}) => oid !== stopCommit.oid);
			} else if (pageInfo.hasNextPage) {
				return commits.concat(await fetchPaginatedCommits(pageInfo.endCursor));
			}

			return commits;
		};

		const commits = await fetchPaginatedCommits();

		commits.forEach((commit) => {
			const resultPR = /^Merge pull request #([0-9]+) .+/.exec(commit.messageHeadline);

			if (resultPR) {
				commit.pullRequestId = parseInt(resultPR[1], 10);
			}
		});

		return commits.reverse();
	}

	// Returns the last version prior to this new one. If new version is stable,
	// the previous one will be stable as well (all pre-release versions will be
	// skipped).
	async fetchPreviousVersion(newVersion) {
		const lastTagsQuery = `query fetchPreviousVersion($repositoryName: String!) {
			repository(owner: "thelounge", name: $repositoryName) {
				refs(refPrefix: "refs/tags/", first: 20, direction: DESC) {
					tags: nodes {
						name
					}
				}
			}
		}`;
		const data = await this.fetch(lastTagsQuery);
		const tags = data.repository.refs.tags;
		let tag;

		if (isPrerelease(newVersion)) {
			tag = tags[0];
		} else {
			tag = tags.find(({name}) => !isPrerelease(name));
		}

		return tag.name.substr(1);
	}

	// Returns information on a milestone associated to a version (i.e. not a
	// tag!) of the repository
	async fetchMilestone(targetVersion) {
		const milestonesQuery = `query fetchMilestone($repositoryName: String!) {
			repository(owner: "thelounge", name: $repositoryName) {
				milestones(last: 20) {
					nodes {
						title
						url
					}
				}
			}
		}`;
		const data = await this.fetch(milestonesQuery);
		return data.repository.milestones.nodes.find(({title}) => title === targetVersion);
	}

	async fetchChunkedPullRequests(numbers) {
		const chunks = _.chunk(numbers, 100);
		let result = {};

		for (const chunk of chunks) {
			const data = await this.fetchPullRequests(chunk);
			result = _.merge(result, data);
		}

		return result;
	}

	// Given a list of PR numbers, retrieve information for all those PRs. They
	// are returned as a hash whose keys are `PR<number>`.
	// This is a bit wonky (generating a dynamic GraphQL query) but the GitHub API
	// does not have a way to retrieve multiple PRs given a list of IDs.
	async fetchPullRequests(numbers) {
		if (numbers.length === 0) {
			return {};
		}

		const prQuery = `query fetchPullRequests($repositoryName: String!) {
			repository(owner: "thelounge", name: $repositoryName) {
				${numbers
					.map(
						(number) => `
					PR${number}: pullRequest(number: ${number}) {
						__typename
						title
						body
						url
						author {
							__typename
							login
							url
						}
						labels(first: 20) {
							nodes {
								name
							}
						}
						commits(first: 100) {
							nodes {
								commit {
									oid
								}
							}
						}
					}
				`
					)
					.join("")}
			}
		}`;
		const data = await this.fetch(prQuery);
		return data.repository;
	}

	// Chain several of the functions above together. Essentially, returns an
	// array composed of PRs, and commits that belong to no PRs, existing between
	// a given tag and master.
	async fetchCommitsAndPullRequestsSince(tag) {
		const taggedCommit = await this.fetchTaggedCommit(tag);
		const commits = await this.fetchCommitsSince(taggedCommit);
		const pullRequestIds = pullRequestNumbersInCommits(commits);
		const pullRequests = await this.fetchChunkedPullRequests(pullRequestIds);
		return combine(commits, pullRequests);
	}
}

// Given an array of annotated commits, returns an array of PR numbers, integers
function pullRequestNumbersInCommits(commits) {
	return commits.reduce((array, {pullRequestId}) => {
		if (pullRequestId) {
			array.push(pullRequestId);
		}

		return array;
	}, []);
}

// Given 2 arrays of annotated commits and pull requests, replace merge commits
// with the pull request information, and remove commits that are already part
// of a pull request.
// The goal of this function is to return an array consisting only of pull
// requests + commits that have been made to `master` directly.
function combine(allCommits, allPullRequests) {
	const commitsFromPRs = _.flatMap(allPullRequests, ({commits}) =>
		commits.nodes.map(({commit}) => commit.oid)
	);

	return allCommits.reduce((array, commit) => {
		if (commit.pullRequestId) {
			const pullRequest = allPullRequests[`PR${commit.pullRequestId}`];
			pullRequest.number = commit.pullRequestId;
			array.push(pullRequest);
		} else if (!commitsFromPRs.includes(commit.oid)) {
			array.push(commit);
		}

		return array;
	}, []);
}

// Builds a Markdown link for a given author object
function printAuthorLink({login, url}) {
	return `by [@${login}](${url})`;
}

// Builds a Markdown link for a given pull request or commit object
function printEntryLink(entry) {
	const label =
		entry.__typename === "PullRequest" ? `#${entry.number}` : `\`${entry.abbreviatedOid}\``;

	return `[${label}](${entry.url})`;
}

// Builds a Markdown entry list item depending on its type
function printLine(entry) {
	if (entry.__typename === "PullRequest") {
		return printPullRequest(entry);
	}

	return printCommit(entry);
}

// Builds a Markdown list item for a given pull request
function printPullRequest(pullRequest) {
	return `- ${pullRequest.title} (${printEntryLink(pullRequest)} ${printAuthorLink(
		pullRequest.author
	)})`;
}

// Builds a Markdown list item for a commit made directly in `master`
function printCommit(commit) {
	return `- ${commit.messageHeadline} (${printEntryLink(commit)} ${printAuthorLink(
		commit.author.user
	)})`;
}

// Builds a Markdown list of all given items
function printList(items) {
	return items.map((item) => printLine(item)).join("\n");
}

// Given a "dependencies object" (i.e. keys are package names, values are arrays
// of pull request numbers), builds a Markdown list of URLs
function printDependencyList(dependencies) {
	const list = [];

	Object.entries(dependencies).forEach(([name, entries]) => {
		if (entries.length > 0) {
			list.push(`  - \`${name}\` (${entries.map(printEntryLink).join(", ")})`);
		}
	});

	return list.join("\n");
}

function printUncategorizedList(uncategorized) {
	return Object.entries(uncategorized).reduce((memo, [label, items]) => {
		if (items.length === 0) {
			return memo;
		}

		memo += `
@@@@@ ${label.toUpperCase()}

${printList(items)}
`;

		return memo;
	}, "");
}

const dependencies = Object.keys(packageJson.dependencies);
const devDependencies = Object.keys(packageJson.devDependencies);
const optionalDependencies = Object.keys(packageJson.optionalDependencies);

// Returns the package.json section in which that package exists, or undefined
// if that package is not listed there.
function whichDependencyType(packageName) {
	if (dependencies.includes(packageName) || optionalDependencies.includes(packageName)) {
		return "dependencies";
	} else if (devDependencies.includes(packageName)) {
		return "devDependencies";
	}
}

function hasLabelOrAnnotatedComment({labels, comments}, expected) {
	return hasLabel(labels, expected) || hasAnnotatedComment(comments, expected);
}

// Returns true if a label exists amongst a list of labels
function hasLabel(labels, expected) {
	return labels && labels.nodes.some(({name}) => name === expected);
}

function hasAnnotatedComment(comments, expected) {
	return (
		comments &&
		comments.nodes.some(
			({authorAssociation, body}) =>
				["OWNER", "MEMBER"].includes(authorAssociation) &&
				body.split("\r\n").includes(`[${expected}]`)
		)
	);
}

function isSkipped(entry) {
	return (
		(entry.__typename === "Commit" &&
			// Version bump commits created by `yarn version`
			(isValidVersion(entry.messageHeadline) ||
				// Commit message suggested by this script
				entry.messageHeadline.startsWith("Add changelog entry for v"))) ||
		hasLabelOrAnnotatedComment(entry, "Meta: Skip Changelog")
	);
}

// Dependency update PRs are listed in a special, more concise way in the changelog.
function isDependency({labels}) {
	return hasLabel(labels, "Type: Dependencies");
}

function isDocumentation({labels}) {
	return hasLabel(labels, "Type: Documentation");
}

function isSecurity({labels}) {
	return hasLabel(labels, "Type: Security");
}

function isDeprecation({labels}) {
	return hasLabel(labels, "Type: Deprecation");
}

function isInternal(entry) {
	return hasLabelOrAnnotatedComment(entry, "Meta: Internal");
}

function isBug({labels}) {
	return hasLabel(labels, "Type: Bug");
}

function isFeature({labels}) {
	return hasLabel(labels, "Type: Feature");
}

// Examples:
//   Update webpack to the latest version
//   Update `stylelint` to v1.2.3
//   Update `express` and `ua-parser-js` to latest versions
//   Update `express`, `chai`, and `ua-parser-js` to ...
//   Update @fortawesome/fontawesome-free-webfonts to the latest version
//   Update dependency request to v2.87.0
//   chore(deps): update dependency mini-css-extract-plugin to v0.4.3
//   fix(deps): update dependency web-push to v3.3.3
//   chore(deps): update babel monorepo to v7.1.0
function extractPackages({title, body, url}) {
	// Extract updated packages from renovate-bot's pull request body
	let list = /^This PR contains the following updates:\n\n(?:[\s\S]+?)---\|$\n([\s\S]+?)\n\n---/m.exec(
		body
	);

	if (list) {
		const packages = [];
		list = list[1].split("\n");

		for (let line of list) {
			line = line
				.split("|")[1] // Split the table and take the first column
				.trim()
				.split(" ")[0]; // Remove any spaces and take the first word (skip source link, etc)

			const pkgName = /([\w-, ./@]+)/.exec(line);

			if (!pkgName) {
				log.warn(`Failed to extract package name from: ${url}`);
				continue;
			}

			packages.push(pkgName[1]);
		}

		if (packages.length > 0) {
			return packages;
		}

		log.warn(`Failed to extract package from: ${url}`);
	}

	// Fallback to extracting package from title
	const extracted = /(?:U|u)pdate(?: dependency)? ([\w-,` ./@]+?) (?:packages |monorepo )?to /.exec(
		title
	);

	if (!extracted) {
		log.warn(`Failed to extract package from: ${title}  ${colors.gray(url)}`);
		return [];
	}

	return extracted[1].replace(/`/g, "").split(/, and |, | and /);
}

// Given an array of entries (PRs or commits), separates them into sections,
// based on different information that describes them.
function parse(entries) {
	return entries.reduce(
		(result, entry) => {
			let deps;

			if (isSkipped(entry)) {
				result.skipped.push(entry);
			} else if (isDependency(entry) && (deps = extractPackages(entry))) {
				deps.forEach((packageName) => {
					const dependencyType = whichDependencyType(packageName);

					if (dependencyType) {
						if (!result[dependencyType][packageName]) {
							result[dependencyType][packageName] = [];
						}

						result[dependencyType][packageName].push(entry);
					} else {
						log.info(
							`${colors.bold(packageName)} was updated in ${colors.green(
								"#" + entry.number
							)} then removed since last release. Skipping.  ${colors.gray(
								entry.url
							)}`
						);
					}
				});
			} else if (isDocumentation(entry)) {
				result.documentation.push(entry);
			} else if (isDeprecation(entry)) {
				result.deprecations.push(entry);
			} else if (isSecurity(entry)) {
				result.security.push(entry);
			} else if (isInternal(entry)) {
				result.internals.push(entry);
			} else {
				if (isFeature(entry)) {
					result.uncategorized.feature.push(entry);
				} else if (isBug(entry)) {
					result.uncategorized.bug.push(entry);
				} else {
					result.uncategorized.other.push(entry);
				}
			}

			return result;
		},
		{
			skipped: [],
			dependencies: {},
			devDependencies: {},
			deprecations: [],
			documentation: [],
			internals: [],
			security: [],
			uncategorized: {
				feature: [],
				bug: [],
				other: [],
			},
			unknownDependencies: new Set(),
		}
	);
}

function dedupeEntries(changelog, items) {
	const dedupe = (entries) =>
		entries.filter((entry) => !changelog.includes(printEntryLink(entry)));

	["deprecations", "documentation", "websiteDocumentation", "internals", "security"].forEach(
		(type) => {
			items[type] = dedupe(items[type]);
		}
	);

	["dependencies", "devDependencies", "uncategorized"].forEach((type) => {
		Object.entries(items[type]).forEach(([name, entries]) => {
			items[type][name] = dedupe(entries);
		});
	});
}

// Given a list of entries (pull requests, commits), retrieves GitHub usernames
// (with format `@username`) of everyone who contributed to this version.
function extractContributors(entries) {
	const set = Object.values(entries).reduce((memo, {__typename, author}) => {
		if (__typename === "PullRequest" && author.__typename !== "Bot") {
			memo.add("@" + author.login);
			// Commit authors are *always* of type "User", so have to discriminate some
			// other way. Making the assumption of a suffix for now, see how that goes.
		} else if (__typename === "Commit" && !author.user.login.endsWith("-bot")) {
			memo.add("@" + author.user.login);
		}

		return memo;
	}, new Set());

	return Array.from(set).sort((a, b) => a.localeCompare(b, "en", {sensitivity: "base"}));
}

const client = new GraphQLClient("https://api.github.com/graphql", {
	headers: {
		Authorization: `bearer ${token}`,
	},
});

// Main function. Given a version string (i.e. not a tag!), returns a changelog
// entry and the list of contributors, for both pre-releases and stable
// releases. Templates are located at the top of this file.
async function generateChangelogEntry(changelog, targetVersion) {
	let items = {};
	let template;
	let contributors = [];

	const codeRepo = new RepositoryFetcher(client, "thelounge");
	const previousVersion = await codeRepo.fetchPreviousVersion(targetVersion);

	if (isPrerelease(targetVersion)) {
		template = prereleaseTemplate;
	} else {
		template = stableTemplate;

		const codeCommitsAndPullRequests = await codeRepo.fetchCommitsAndPullRequestsSince(
			"v" + previousVersion
		);
		items = parse(codeCommitsAndPullRequests);
		items.milestone = await codeRepo.fetchMilestone(targetVersion);

		const websiteRepo = new RepositoryFetcher(client, "thelounge.github.io");
		const previousWebsiteVersion = await websiteRepo.fetchPreviousVersion(targetVersion);
		const websiteCommitsAndPullRequests = await websiteRepo.fetchCommitsAndPullRequestsSince(
			"v" + previousWebsiteVersion
		);
		items.websiteDocumentation = websiteCommitsAndPullRequests;

		contributors = extractContributors([
			...codeCommitsAndPullRequests,
			...websiteCommitsAndPullRequests,
		]);

		dedupeEntries(changelog, items);
	}

	items.version = targetVersion;
	items.date = dayjs().format("YYYY-MM-DD");
	items.fullChangelogUrl = fullChangelogUrl(previousVersion, targetVersion);

	return {
		changelogEntry: template(items),
		skipped: items.skipped || [],
		contributors,
	};
}

// Write a changelog entry into the CHANGELOG.md file, right after a marker that
// indicates where entries are listed.
function addToChangelog(changelog, newEntry) {
	const changelogMarker = "<!-- New entries go after this line -->\n\n";

	const markerPosition = changelog.indexOf(changelogMarker) + changelogMarker.length;
	const newChangelog =
		changelog.substring(0, markerPosition) +
		newEntry +
		changelog.substring(markerPosition, changelog.length);

	writeFile(changelogPath, newChangelog);
}

// Wrapping this in an Async IIFE because async/await is only supported within
// functions. ¯\_(ツ)_/¯
(async () => {
	log.info(`Generating a changelog entry for ${colors.bold("v" + version)}, please wait...`);
	const startTime = Date.now();
	let changelogEntry, skipped, contributors;

	// Step 1: Generate a changelog entry

	const changelog = await readFile(changelogPath, "utf8");

	try {
		({changelogEntry, skipped, contributors} = await generateChangelogEntry(
			changelog,
			version
		));
	} catch (error) {
		if (error.response && error.response.status === 401) {
			log.error(`GitHub returned an error: ${colors.red(error.response.message)}`);
			log.error(
				`Make sure your personal access token is set with ${colors.bold(
					"public_repo"
				)} scope.`
			);
		} else {
			log.error(error);
		}

		process.exit(1);
	}

	// Step 2: Write that changelog entry into the CHANGELOG.md file

	try {
		await addToChangelog(changelog, `${changelogEntry.trim()}\n\n`);
	} catch (error) {
		log.error(error);
		process.exit(1);
	}

	log.info(`The generated entry was added at the top of ${colors.bold("CHANGELOG.md")}.`);

	// Step 3 (optional): Print a list of skipped entries if there are any
	if (skipped.length > 0) {
		const pad = Math.max(
			...skipped.map((entry) => (entry.title || entry.messageHeadline).length)
		);
		log.warn(`${skipped.length} ${skipped.length > 1 ? "entries were" : "entry was"} skipped:`);
		skipped.forEach((entry) => {
			log.warn(
				`- ${(entry.title || entry.messageHeadline).padEnd(pad)}  ${colors.gray(entry.url)}`
			);
		});
	}

	// Step 4: Print out some information about what just happened to the console
	const commitCommand = `git commit -m 'Add changelog entry for v${version}' CHANGELOG.md`;

	if (isPrerelease(version)) {
		log.info(`You can now run: ${colors.bold(commitCommand)}`);
	} else {
		log.info(
			`Please edit ${colors.bold("CHANGELOG.md")} to your liking then run: ${colors.bold(
				commitCommand
			)}`
		);
	}

	log.info(`Finished in ${colors.bold(Date.now() - startTime)}ms.`);

	// Step 5 (optional): Print contributors shout out if it exists
	if (contributors.length > 0) {
		log.info(`🎉  Thanks to our ${contributors.length} contributors for this release:`);
		log.info(contributors.map((contributor) => colors.green(contributor)).join(", "));
	}
})();

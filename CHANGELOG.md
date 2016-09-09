# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

<!--
Use the following template for each new release, built on recommendations from http://keepachangelog.com/.

```md
## vX.Y.Z - YYYY-MM-DD

[See the full changelog](https://github.com/thelounge/lounge/compare/vPRE.VIO.US...vX.Y.Z)

OPTIONAL DESCRIPTION, ANNOUNCEMENT, ...

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
```

All sections are explained on the link above, they are all optional, and each of them should contain a list of PRs formatted as such:

```md
- Description ([#PR_NUMBER](https://github.com/thelounge/lounge/pull/PR_NUMBER) by [@GITHUB_USERNAME](https://github.com/GITHUB_USERNAME))
```

Don't forget to thank the PR authors in a commit comment, and copy/paste the release content as-is in GitHub releases: https://github.com/thelounge/lounge/releases
-->

## v2.0.0-pre.7 - 2016-08-08 [Pre-release]

[See the full changelog](https://github.com/thelounge/lounge/compare/v2.0.0-pre.6...v2.0.0-pre.7)

This prerelease fixes a lot of bugs on both the server and the client. It also adds a theme selector on the client and connection debug log level on the server. Additionally, custom highlights are now case-insensitive.

### Added

- Add tooltips on every clickable icons ([#540](https://github.com/thelounge/lounge/pull/540) by [@astorije](https://github.com/astorije))
- Add debug config option for `irc-framework` debug log ([#547](https://github.com/thelounge/lounge/pull/547) by [@maxpoulin64](https://github.com/maxpoulin64))
- Client-side theme selector ([#568](https://github.com/thelounge/lounge/pull/568) by [@astorije](https://github.com/astorije))

### Changed

- Use our logger instead of `console.log` and `console.error` for LDAP logs ([#552](https://github.com/thelounge/lounge/pull/552) by [@astorije](https://github.com/astorije))
- Make custom highlights case-insensitive ([#565](https://github.com/thelounge/lounge/pull/565) by [@astorije](https://github.com/astorije))
- Bump `request` dependency to 2.74.0 ([#563](https://github.com/thelounge/lounge/pull/563) by [@astorije](https://github.com/astorije))
- Mention wiki in README ([#548](https://github.com/thelounge/lounge/pull/548) by [@MaxLeiter](https://github.com/MaxLeiter))
- Support ES6 features in JS linting outside of client code ([#593](https://github.com/thelounge/lounge/pull/593) by [@williamboman](https://github.com/williamboman))

### Fixed

- Fix token persistency across server refreshes ([#553](https://github.com/thelounge/lounge/pull/553) by [@astorije](https://github.com/astorije))
- Make sure input height is reset when submitting with icon ([#555](https://github.com/thelounge/lounge/pull/555) by [@astorije](https://github.com/astorije))
- Fix webirc and 4-in-6 addresses ([#535](https://github.com/thelounge/lounge/pull/535) by [@maxpoulin64](https://github.com/maxpoulin64))
- Allow long URLs to break onto next line on Chrome ([#576](https://github.com/thelounge/lounge/pull/576) by [@astorije](https://github.com/astorije))
- Make sure users with wrong tokens are locked out instead of crashing the app ([#570](https://github.com/thelounge/lounge/pull/570) by [@astorije](https://github.com/astorije))
- Remove font family redundancy, fix missed fonts, remove Open Sans ([#562](https://github.com/thelounge/lounge/pull/562) by [@astorije](https://github.com/astorije))
- Do not set app orientation in manifest to use user setting at OS level ([#587](https://github.com/thelounge/lounge/pull/587) by [@astorije](https://github.com/astorije))
- Move border-radius from `#main` to `.window elements` to fix radius once and for all ([#572](https://github.com/thelounge/lounge/pull/572) by [@astorije](https://github.com/astorije))

## v2.0.0-pre.6 - 2016-08-10 [Pre-release]

[See the full changelog](https://github.com/thelounge/lounge/compare/v2.0.0-pre.5...v2.0.0-pre.6)

LDAP! That's all there is to be found in this pre-release, but it should please some administrators out there. Big thanks to [@thisisdarshan](https://github.com/thisisdarshan) and [@lindskogen](https://github.com/lindskogen) for sticking with us on this one.

This feature will remain in beta version until the official v2.0.0 release.

### Added

- LDAP support ([#477](https://github.com/thelounge/lounge/pull/477) by [@thisisdarshan](https://github.com/thisisdarshan) and [@lindskogen](https://github.com/lindskogen))

## v2.0.0-pre.5 - 2016-08-07 [Pre-release]

[See the full changelog](https://github.com/thelounge/lounge/compare/v2.0.0-pre.4...v2.0.0-pre.5)

What an exciting release! It's been in the works for more than a month, but the perks are worth the wait.

On the user side, some long-awaited new features can now be found: The Lounge can now track custom highlights, it comes with an auto-expanding text field, and an unread message marker helps keeping track of what happened when you were not watching. A lot of improvements and various bug fixes have been made to the UI.
Note that scrollbar look-and-feel is now delegated to the browser and OS. Use the custom CSS editor and your OS settings to customize them.

Administrators will notice a different format for channels in the user configuration files, and the Docker-related files have been moved to [a dedicated repository](https://github.com/thelounge/docker-lounge). Many bugs have been solved on the server as well.

### Added

- Add custom highlights ([#425](https://github.com/thelounge/lounge/pull/425) by [@YaManicKill](https://github.com/YaManicKill))
- Add auto-grow textarea support ([#379](https://github.com/thelounge/lounge/pull/379) by [@maxpoulin64](https://github.com/maxpoulin64))
- Display unhandled numerics on the client ([#286](https://github.com/thelounge/lounge/pull/286) by [@xPaw](https://github.com/xPaw))
- A proper unread marker ([#332](https://github.com/thelounge/lounge/pull/332) by [@xPaw](https://github.com/xPaw))
- Add information on the About section of the client ([#497](https://github.com/thelounge/lounge/pull/497) by [@astorije](https://github.com/astorije))
- Add a red dot to the mobile menu icon when being notified ([#486](https://github.com/thelounge/lounge/pull/486) by [@astorije](https://github.com/astorije))
- Add "The Lounge" label to the landing pages ([#487](https://github.com/thelounge/lounge/pull/487) by [@astorije](https://github.com/astorije))
- Display network name on Connect page when network is locked and info is hidden ([#488](https://github.com/thelounge/lounge/pull/488) by [@astorije](https://github.com/astorije))

### Changed

- Store channels in array format in user configuration files ([#417](https://github.com/thelounge/lounge/pull/417) by [@xPaw](https://github.com/xPaw))
- Cache loaded config and merge it with defaults ([#387](https://github.com/thelounge/lounge/pull/387) by [@xPaw](https://github.com/xPaw))
- Ignore unnecessary files at release time ([#499](https://github.com/thelounge/lounge/pull/499) by [@astorije](https://github.com/astorije))
- Improve font icon management, sizing and sharpness ([#493](https://github.com/thelounge/lounge/pull/493) by [@astorije](https://github.com/astorije))
- Maintain scroll position after loading previous messages ([#496](https://github.com/thelounge/lounge/pull/496) by [@davibe](https://github.com/davibe))

### Removed

- Remove Docker-related files ([#288](https://github.com/thelounge/lounge/pull/288) by [@astorije](https://github.com/astorije))
- Remove JavaScript scrollbar library ([#429](https://github.com/thelounge/lounge/pull/429) by [@xPaw](https://github.com/xPaw))

### Fixed

- Fix storing the updated authentication token ([#437](https://github.com/thelounge/lounge/pull/437) by [@williamboman](https://github.com/williamboman))
- Update `irc-framework` to 2.3.0 to fix a bug occurring when posting messages starting with a colon ([#449](https://github.com/thelounge/lounge/pull/449) by [@xPaw](https://github.com/xPaw))
- Update `irc-framework` to 2.4.0 to fix a buffering issue ([#451](https://github.com/thelounge/lounge/pull/451) by [@maxpoulin64](https://github.com/maxpoulin64))
- Only auto join actual channels ([#453](https://github.com/thelounge/lounge/pull/453) by [@xPaw](https://github.com/xPaw))
- Only trigger custom highlights for non-self messages and notices ([#454](https://github.com/thelounge/lounge/pull/454) by [@xPaw](https://github.com/xPaw))
- Stop propagation when hiding the chat through click/tapping the chat ([#455](https://github.com/thelounge/lounge/pull/455) by [@williamboman](https://github.com/williamboman))
- Improve click handling on users and inline channels ([#366](https://github.com/thelounge/lounge/pull/366) by [@xPaw](https://github.com/xPaw))
- Update `irc-framework` to 2.5.0 to fix reconnection counter not being reset ([#451](https://github.com/thelounge/lounge/pull/451) by [@xPaw](https://github.com/xPaw))
- Register irc-framework events before connecting ([#458](https://github.com/thelounge/lounge/pull/458) by [@xPaw](https://github.com/xPaw))
- Only load config if it exists ([#461](https://github.com/thelounge/lounge/pull/461) by [@xPaw](https://github.com/xPaw))
- Fix window layout a bit ([#465](https://github.com/thelounge/lounge/pull/465) by [@maxpoulin64](https://github.com/maxpoulin64))
- Fix slight bugs introduced by #379 and #465 ([#467](https://github.com/thelounge/lounge/pull/467) by [@maxpoulin64](https://github.com/maxpoulin64))
- Prevent the app from crashing when no theme is specified ([#474](https://github.com/thelounge/lounge/pull/474) by [@astorije](https://github.com/astorije))
- Fix unread marker disappearing when opacity set to 1 ([#471](https://github.com/thelounge/lounge/pull/471) by [@astorije](https://github.com/astorije))
- Fix breaking layout when switching portrait/landscape modes ([#478](https://github.com/thelounge/lounge/pull/478) by [@astorije](https://github.com/astorije))
- Fix chat not being "stickied" to the bottom when joining channel ([#484](https://github.com/thelounge/lounge/pull/484) by [@williamboman](https://github.com/williamboman))
- Add self info to TOGGLE messages to prevent unread marker to render for oneself ([#473](https://github.com/thelounge/lounge/pull/473) by [@astorije](https://github.com/astorije))
- Send user to lobby of deleted chan when parting from active chan ([#489](https://github.com/thelounge/lounge/pull/489) by [@astorije](https://github.com/astorije))
- Use `min-height` of textarea when computing auto-resize after deleting a char ([#504](https://github.com/thelounge/lounge/pull/504) by [@astorije](https://github.com/astorije))
- Set title attribute on topic on initial page load ([#515](https://github.com/thelounge/lounge/pull/515) by [@williamboman](https://github.com/williamboman))
- Make sure git commit check for the About section would not send stderr to the console ([#516](https://github.com/thelounge/lounge/pull/516) by [@astorije](https://github.com/astorije))
- Create a single function to render networks to reduce code duplication ([#445](https://github.com/thelounge/lounge/pull/445) by [@xPaw](https://github.com/xPaw))
- Reset the unread marker on channel change ([#527](https://github.com/thelounge/lounge/pull/527) by [@maxpoulin64](https://github.com/maxpoulin64))
- Fix accidentally removed border-radius ([#537](https://github.com/thelounge/lounge/pull/537) by [@astorije](https://github.com/astorije))
- Fix font size in themes for new textarea ([#536](https://github.com/thelounge/lounge/pull/536) by [@maxpoulin64](https://github.com/maxpoulin64))
- Restore padding and height of message input pre-textarea era ([#539](https://github.com/thelounge/lounge/pull/539) by [@astorije](https://github.com/astorije))
- Prevent Ctrl-Tab from triggering tab completion ([#541](https://github.com/thelounge/lounge/pull/541) by [@hho](https://github.com/hho))

## v2.0.0-pre.4 - 2016-06-29 [Pre-release]

[See the full changelog](https://github.com/thelounge/lounge/compare/v2.0.0-pre.3...v2.0.0-pre.4)

This pre-release adds a loading window, helpful on slow connections.
It also implements token persistency, ensuring users do not have to authenticate at every server restart. As a side effect, security is improved by forcing logging out users on all devices when changing their password.

All generated URLs are now HTTP by default, except when explicitly set to HTTPS. For example, `www.example.com` will link to `http://www.example.com`. One needs to share `https://www.example.com` to point others to a HTTPS location.

As a few users have been having issues when running The Lounge with a non-supported Node.js version, we now detect it early to avoid cryptic errors.

This pre-release also adds minor UI improvements, and fixes from the previous version.
While The Lounge still needs a lot of efforts to be fully accessible, this version slightly improves accessibility on clickable nickname.

Internally, we now keep track of our code coverage, which we do not enforce strictly at the moment.

### Added

- Add code coverage ([#408](https://github.com/thelounge/lounge/pull/408) by [@astorije](https://github.com/astorije))
- Display a loading message instead of blank page ([#386](https://github.com/thelounge/lounge/pull/386) by [@xPaw](https://github.com/xPaw))

### Changed

- Perform node version check as soon as possible ([#409](https://github.com/thelounge/lounge/pull/409) by [@xPaw](https://github.com/xPaw))
- Prepend http protocol to www. links in chat ([#410](https://github.com/thelounge/lounge/pull/410) by [@xPaw](https://github.com/xPaw))
- Use tabs when saving user configs ([#418](https://github.com/thelounge/lounge/pull/418) by [@xPaw](https://github.com/xPaw))
- Do not display the sidebar on sign-in page ([#420](https://github.com/thelounge/lounge/pull/420) by [@astorije](https://github.com/astorije))
- Make style of loading page similar to other pages ([#423](https://github.com/thelounge/lounge/pull/423) by [@astorije](https://github.com/astorije))
- Change default configuration for `host` to allow OS to decide and use both IPv4 and IPv6 ([#432](https://github.com/thelounge/lounge/pull/432) by [@maxpoulin64](https://github.com/maxpoulin64))
- Change nicks from links to spans everywhere ([#428](https://github.com/thelounge/lounge/pull/428) by [@xPaw](https://github.com/xPaw))
- Increase join delay at connection to 1000ms ([#434](https://github.com/thelounge/lounge/pull/434) by [@williamboman](https://github.com/williamboman))

### Removed

- Remove navigator.standalone detection ([#427](https://github.com/thelounge/lounge/pull/427) by [@xPaw](https://github.com/xPaw))

### Fixed

- Do not lose authentication token when the connection gets lost ([#369](https://github.com/thelounge/lounge/pull/369) by [@xPaw](https://github.com/xPaw))
- Fix crash in public mode ([#413](https://github.com/thelounge/lounge/pull/413) by [@maxpoulin64](https://github.com/maxpoulin64))
- Do not print user loaded message in public mode ([#415](https://github.com/thelounge/lounge/pull/415) by [@xPaw](https://github.com/xPaw))
- Fix focusing input when clicking chat container on the client ([#364](https://github.com/thelounge/lounge/pull/364) by [@williamboman](https://github.com/williamboman))
- Fix channel join regression and fix possibly joining parted channels ([#411](https://github.com/thelounge/lounge/pull/411) by [@xPaw](https://github.com/xPaw))

### Security

- Implement user token persistency ([#370](https://github.com/thelounge/lounge/pull/370) by [@xPaw](https://github.com/xPaw))

## v2.0.0-pre.3 - 2016-06-15 [Pre-release]

[See the full changelog](https://github.com/thelounge/lounge/compare/v2.0.0-pre.2...v2.0.0-pre.3)

This release introduces a few internal changes as well as two noticeable ones. When using the CLI, the home path can now be set with the `LOUNGE_HOME` environment variable, to avoid repeating `--home` over and over. On the client, sorting channels will now be saved in the user configuration.

### Added

- Fall back to LOUNGE_HOME env variable when using the CLI ([#402](https://github.com/thelounge/lounge/pull/402) by [@williamboman](https://github.com/williamboman))

### Changed

- Rename package variable to pkg, as "package" is reserved. ([#399](https://github.com/thelounge/lounge/pull/399) by [@hogofwar](https://github.com/hogofwar))
- Capitalise constructor Oidentd ([#396](https://github.com/thelounge/lounge/pull/396) by [@hogofwar](https://github.com/hogofwar))
- Bump stylelint and update Travis CI configuration to include OSX builds and package caching ([#403](https://github.com/thelounge/lounge/pull/403) by [@xPaw](https://github.com/xPaw))

### Removed

- Supersede `mkdirp` with `fs-extra` ([#390](https://github.com/thelounge/lounge/pull/390) by [@hogofwar](https://github.com/hogofwar))
- Remove redundant variables ([#397](https://github.com/thelounge/lounge/pull/397) by [@hogofwar](https://github.com/hogofwar))

### Fixed

- Save user's channels when they sort the channel list ([#401](https://github.com/thelounge/lounge/pull/401) by [@xPaw](https://github.com/xPaw))
- Fix description of `host` and `bind` config options ([#378](https://github.com/thelounge/lounge/pull/378) by [@maxpoulin64](https://github.com/maxpoulin64))

## v2.0.0-pre.2 - 2016-06-09 [Pre-release]

[See the full changelog](https://github.com/thelounge/lounge/compare/v2.0.0-pre.1...v2.0.0-pre.2)

This pre-release adds a very, very long-awaited feature: auto-reconnection! It also extends our support of ident with oidentd, shows timestamps on small screens and fix bugs around notifications and sticky scroll.

### Added

- Enable auto reconnection ([#254](https://github.com/thelounge/lounge/pull/254) by [@xPaw](https://github.com/xPaw))
- Add "!" modechar for admin ([#354](https://github.com/thelounge/lounge/pull/354) by [@omnicons](https://github.com/omnicons))
- Add CI tool for Windows builds ([#367](https://github.com/thelounge/lounge/pull/367) by [@astorije](https://github.com/astorije))
- Add support for oidentd spoofing ([#256](https://github.com/thelounge/lounge/pull/256) by [@maxpoulin64](https://github.com/maxpoulin64))

### Changed

- Update Font Awesome to v4.6.3 ([#355](https://github.com/thelounge/lounge/pull/355) by [@MaxLeiter](https://github.com/MaxLeiter))
- Do not hide timestamps on small viewports ([#376](https://github.com/thelounge/lounge/pull/376) by [@xPaw](https://github.com/xPaw))
- Fetch Font Awesome from npm instead of embedded in repo ([#361](https://github.com/thelounge/lounge/pull/361) by [@astorije](https://github.com/astorije))
- Cache npm modules on appveyor ([#381](https://github.com/thelounge/lounge/pull/381) by [@xPaw](https://github.com/xPaw))
- Update eslint and enforce key-spacing ([#384](https://github.com/thelounge/lounge/pull/384) by [@xPaw](https://github.com/xPaw))
- Use `npm-run-all` in npm scripts for testing and linting ([#375](https://github.com/thelounge/lounge/pull/375) by [@williamboman](https://github.com/williamboman))
- Upload test results on appveyor builds ([#382](https://github.com/thelounge/lounge/pull/382) by [@xPaw](https://github.com/xPaw))

### Fixed

- Turn favicon red on page load if there are highlights ([#344](https://github.com/thelounge/lounge/pull/344) by [@xPaw](https://github.com/xPaw))
- Do not send completely empty messages ([#345](https://github.com/thelounge/lounge/pull/345) by [@maxpoulin64](https://github.com/maxpoulin64))
- Make sure npm test script gets run on AppVeyor ([#372](https://github.com/thelounge/lounge/pull/372) by [@astorije](https://github.com/astorije))
- Keep chat stickied to the bottom on resize ([#346](https://github.com/thelounge/lounge/pull/346) by [@maxpoulin64](https://github.com/maxpoulin64))

## v2.0.0-pre.1 - 2016-05-22 [Pre-release]

[See the full changelog](https://github.com/thelounge/lounge/compare/v1.5.0...v2.0.0-pre.1)

This is a pre-release to allow early adopters to use The Lounge with [`irc-framework`](https://github.com/kiwiirc/irc-framework) as our underlying IRC library instead of [`slate`](https://github.com/slate/slate-irc). This change itself solves a lot of issues and adds many features, most of them [listed here](https://github.com/thelounge/lounge/pull/167#issue-139286868): IRCv3 compliance, user feedback improvement, etc.

It also adds WEBIRC support, a better server logging capability, a web app manifest, improves the sticky scroll, and fixes a ton of bugs.

### Added

- Log enabled capabilities ([#272](https://github.com/thelounge/lounge/pull/272) by [@xPaw](https://github.com/xPaw))
- Add global logging helper ([#257](https://github.com/thelounge/lounge/pull/257) by [@xPaw](https://github.com/xPaw))
- Add support for `~` home folder expansion ([#284](https://github.com/thelounge/lounge/pull/284) by [@maxpoulin64](https://github.com/maxpoulin64))
- Document supported node version ([#280](https://github.com/thelounge/lounge/pull/280) by [@xPaw](https://github.com/xPaw))
- Add support for echo-message and znc.in/self-message caps ([#270](https://github.com/thelounge/lounge/pull/270) by [@xPaw](https://github.com/xPaw))
- Implement WEBIRC ([#240](https://github.com/thelounge/lounge/pull/240) by [@maxpoulin64](https://github.com/maxpoulin64))
- Add `manifest.json` for nicer mobile experience ([#310](https://github.com/thelounge/lounge/pull/310) by [@xPaw](https://github.com/xPaw))

### Changed

- Drop `slate-irc`, switch to `irc-framework` ([#167](https://github.com/thelounge/lounge/pull/167) by [@xPaw](https://github.com/xPaw))
- Create a single helper function to write messages ([#266](https://github.com/thelounge/lounge/pull/266) by [@xPaw](https://github.com/xPaw))
- Update dependencies ([#281](https://github.com/thelounge/lounge/pull/281) by [@xPaw](https://github.com/xPaw))
- Improve sticky scroll ([#262](https://github.com/thelounge/lounge/pull/262) by [@xPaw](https://github.com/xPaw))
- Change license link to point at our license file ([#290](https://github.com/thelounge/lounge/pull/290) by [@xPaw](https://github.com/xPaw))
- Stricter eslint rule for curly brackets ([#291](https://github.com/thelounge/lounge/pull/291) by [@xPaw](https://github.com/xPaw))
- Bump patch version of lodash to 4.11.2 ([#306](https://github.com/thelounge/lounge/pull/306) by [@astorije](https://github.com/astorije))
- Minor wording changes for better clarity ([#305](https://github.com/thelounge/lounge/pull/305) by [@astorije](https://github.com/astorije))
- Improve tests execution ([#260](https://github.com/thelounge/lounge/pull/260) by [@maxpoulin64](https://github.com/maxpoulin64))
- Update irc-framework ([#324](https://github.com/thelounge/lounge/pull/324) by [@xPaw](https://github.com/xPaw))
- Do not ignore our handlebars plugins in ESLint ([#329](https://github.com/thelounge/lounge/pull/329) by [@xPaw](https://github.com/xPaw))
- Improve nick highlights ([#327](https://github.com/thelounge/lounge/pull/327) by [@xPaw](https://github.com/xPaw))
- CSS classes in themes for nick colors ([#325](https://github.com/thelounge/lounge/pull/325) by [@astorije](https://github.com/astorije))
- Replace all concatenated paths with Node's path.join ([#307](https://github.com/thelounge/lounge/pull/307) by [@astorije](https://github.com/astorije))

### Removed

- Do not increase font size on highlight in morning theme ([#321](https://github.com/thelounge/lounge/pull/321) by [@xPaw](https://github.com/xPaw))

### Fixed

- Only increase unread counter for whitelisted actions ([#273](https://github.com/thelounge/lounge/pull/273) by [@xPaw](https://github.com/xPaw))
- Parse CTCP replies ([#278](https://github.com/thelounge/lounge/pull/278) by [@xPaw](https://github.com/xPaw))
- Do not count your own messages as unread ([#279](https://github.com/thelounge/lounge/pull/279) by [@xPaw](https://github.com/xPaw))
- Use lowercase global to avoid a deprecation warning in Node.js 6 ([`d9a0dd9`](https://github.com/thelounge/lounge/commit/d9a0dd9406e8fb22d7a5ee1ed4ed7aa8e5f0fa01) by [@xPaw](https://github.com/xPaw))
- Do not display incorrect nick when switching to a non connected network ([#252](https://github.com/thelounge/lounge/pull/252) by [@xPaw](https://github.com/xPaw))
- Keep autocompletion sort whenever user list updates ([#217](https://github.com/thelounge/lounge/pull/217) by [@xPaw](https://github.com/xPaw))
- Make sure app does not crash when webirc is not defined in the configuration ([#294](https://github.com/thelounge/lounge/pull/294) by [@astorije](https://github.com/astorije))
- Save user when parting channels ([#297](https://github.com/thelounge/lounge/pull/297) by [@xPaw](https://github.com/xPaw))
- Add labels in connect window ([#300](https://github.com/thelounge/lounge/pull/300) by [@xPaw](https://github.com/xPaw))
- Add missing `aria-label` on icon buttons ([#303](https://github.com/thelounge/lounge/pull/303) by [@astorije](https://github.com/astorije))
- Fix unread counter not being formatted on page load ([#308](https://github.com/thelounge/lounge/pull/308) by [@xPaw](https://github.com/xPaw))
- Fix wrong CSS for disabled colored nicknames on themes ([#318](https://github.com/thelounge/lounge/pull/318) by [@astorije](https://github.com/astorije))
- Fix missing colors in action messages ([#317](https://github.com/thelounge/lounge/pull/317) by [@astorije](https://github.com/astorije))
- Don't falsely report failed write if it didn't fail ([`e6990e0`](https://github.com/thelounge/lounge/commit/e6990e0fc7641d18a5bcbabddca1aacf2254ae52) by [@xPaw](https://github.com/xPaw))
- Fix sending messages starting with a space ([#320](https://github.com/thelounge/lounge/pull/320) by [@maxpoulin64](https://github.com/maxpoulin64))
- Fix notifications in query windows ([#334](https://github.com/thelounge/lounge/pull/334) by [@xPaw](https://github.com/xPaw))

### Security

- Restrict access to the home directory by default ([#205](https://github.com/thelounge/lounge/pull/205) by [@maxpoulin64](https://github.com/maxpoulin64))
- Update demo link to HTTPS ([#302](https://github.com/thelounge/lounge/pull/302) by [@MaxLeiter](https://github.com/MaxLeiter))
- Add security headers to minimize XSS damage ([#292](https://github.com/thelounge/lounge/pull/292) by [@xPaw](https://github.com/xPaw))
- Do not write user configs outside of the app's users directory ([#238](https://github.com/thelounge/lounge/pull/238) by [@williamboman](https://github.com/williamboman))
- Don't check for existing password emptiness ([#315](https://github.com/thelounge/lounge/pull/315) by [@maxpoulin64](https://github.com/maxpoulin64))

## v1.5.0 - 2016-04-13

[See the full changelog](https://github.com/thelounge/lounge/compare/v1.4.3...v1.5.0)

With this release, administrators can now define a maximum size for channel history.
While this is not optimal nor the definitive solution, it aims at reducing stability issues where The Lounge would crash after filling up the server's memory.

Other changes noticeable by users include removing custom print styles and preventing sequences of white spaces to collapse into one.

### Added

- Add config option to limit in-memory history size ([#243](https://github.com/thelounge/lounge/pull/243) by [@maxpoulin64](https://github.com/maxpoulin64))

### Changed

- Do not parse link titles for IRC formatting ([#245](https://github.com/thelounge/lounge/pull/245) by [@xPaw](https://github.com/xPaw))
- Display multiple white spaces properly ([#239](https://github.com/thelounge/lounge/pull/239) by [@maxpoulin64](https://github.com/maxpoulin64))
- Reword password prompt of `add` and `reset` CLI commands ([#230](https://github.com/thelounge/lounge/pull/230) by [@williamboman](https://github.com/williamboman))

### Removed

- Remove print styles ([#228](https://github.com/thelounge/lounge/pull/228) by [@xPaw](https://github.com/xPaw))

## v1.4.3 - 2016-04-02

[See the full changelog](https://github.com/thelounge/lounge/compare/v1.4.2...v1.4.3)

This PR fixes a bug introduced in v1.3.0 which prevents deleting disconnected networks from users' configuration files.

### Fixed

- Fix not being able to remove networks from user config ([#233](https://github.com/thelounge/lounge/pull/233) by [@xPaw](https://github.com/xPaw))

## v1.4.2 - 2016-03-31

[See the full changelog](https://github.com/thelounge/lounge/compare/v1.4.1...v1.4.2)

This PR fixes a bug introduced in v1.4.1 causing timestamps to use most of the screen.

### Fixed

- Hide options will now remove the entire row ([#227](https://github.com/thelounge/lounge/pull/227) by [@xPaw](https://github.com/xPaw))

## v1.4.1 - 2016-03-28

[See the full changelog](https://github.com/thelounge/lounge/compare/v1.4.0...v1.4.1)

As of this release, running `/query nick` will simply open a chat window with user `nick`, instead of calling `whois` for this user.

### Changed

- Remove `join`, `nick` and `whois` inputs, they are cleanly handled by the server ([#208](https://github.com/thelounge/lounge/pull/208) by [@xPaw](https://github.com/xPaw))
- Add a `/query` command that simply opens a query window ([#218](https://github.com/thelounge/lounge/pull/218) by [@xPaw](https://github.com/xPaw))
- Disallow `/query` on non-nicks ([#221](https://github.com/thelounge/lounge/pull/221) by [@astorije](https://github.com/astorije))

### Fixed

- Fix message and topic text wrapping ([#215](https://github.com/thelounge/lounge/pull/215) by [@xPaw](https://github.com/xPaw))
- Fix `/part` command ([#222](https://github.com/thelounge/lounge/pull/222) by [@maxpoulin64](https://github.com/maxpoulin64))
- Harden URL fetcher and don't crash on non-ASCII urls ([#219](https://github.com/thelounge/lounge/pull/219) by [@xPaw](https://github.com/xPaw))

## v1.4.0 - 2016-03-20

[See the full changelog](https://github.com/thelounge/lounge/compare/v1.3.1...v1.4.0)

Note that this release will reset users' notification settings to their defaults. This unfortunate side effect is the consequence of an improvement of how this setting is handled in the application.

### Added

- Add context menu when right-clicking on a sidebar item ([#9](https://github.com/thelounge/lounge/pull/9) by [@xPaw](https://github.com/xPaw))
- Add tests for the `Chan#sortUsers` method ([#197](https://github.com/thelounge/lounge/pull/197) by [@astorije](https://github.com/astorije))
- Add a very basic test for `Network#export` ([#198](https://github.com/thelounge/lounge/pull/198) by [@astorije](https://github.com/astorije))
- Link to the demo from the IRC channel badge on the README ([#203](https://github.com/thelounge/lounge/pull/203) by [@Henni](https://github.com/Henni))
- Add support for HTTP/2 ([#174](https://github.com/thelounge/lounge/pull/174) by [@xPaw](https://github.com/xPaw))
- Support port in `/connect` command ([#210](https://github.com/thelounge/lounge/pull/210) by [@xPaw](https://github.com/xPaw))

### Changed

- Update Handlebars to 4.0.5 ([#140](https://github.com/thelounge/lounge/pull/140) by [@xPaw](https://github.com/xPaw))
- Update Socket.IO to 1.4.5 and use client library provided by the dependency ([#142](https://github.com/thelounge/lounge/pull/142) by [@xPaw](https://github.com/xPaw))
- Update ESLint to 2.3.0 and add stricter rules ([#171](https://github.com/thelounge/lounge/pull/171) by [@xPaw](https://github.com/xPaw))
- Mute color of the topic actions ([#151](https://github.com/thelounge/lounge/pull/151) by [@astorije](https://github.com/astorije))
- Rename "badge" setting and rely on browser choice for desktop notifications ([#28](https://github.com/thelounge/lounge/pull/28) by [@lpoujol](https://github.com/lpoujol))
- Invoke `handlebars` outside of `grunt` and generate a sourcemap ([#144](https://github.com/thelounge/lounge/pull/144) by [@xPaw](https://github.com/xPaw))
- Make `whois` a client action template and improve its output ([#161](https://github.com/thelounge/lounge/pull/161) by [@xPaw](https://github.com/xPaw))
- Handle commands in a better way and send unknown commands to the IRC server ([#154](https://github.com/thelounge/lounge/pull/154) by [@xPaw](https://github.com/xPaw))
- Switch the Send button to a paper plane icon ([#182](https://github.com/thelounge/lounge/pull/182) by [@astorije](https://github.com/astorije))
- Keep track of highlights when user is offline ([#190](https://github.com/thelounge/lounge/pull/190) by [@xPaw](https://github.com/xPaw))
- Load input plugins at startup and call them directly when a command is received ([#191](https://github.com/thelounge/lounge/pull/191) by [@astorije](https://github.com/astorije))
- Make defaults for socket.io transports consistent to use polling before websocket ([#202](https://github.com/thelounge/lounge/pull/202) by [@xPaw](https://github.com/xPaw))
- Update all server dependencies to current stable versions ([#200](https://github.com/thelounge/lounge/pull/200) by [@xPaw](https://github.com/xPaw))
- Update configuration file to reflect HTTP/2 support addition ([#206](https://github.com/thelounge/lounge/pull/206) by [@astorije](https://github.com/astorije))
- Change close button behavior and add a dropdown context menu ([#184](https://github.com/thelounge/lounge/pull/184) by [@xPaw](https://github.com/xPaw))
- Minor enhancements of the context menu UI ([#212](https://github.com/thelounge/lounge/pull/212) by [@astorije](https://github.com/astorije))

### Removed

- Remove `string.contains` library ([#163](https://github.com/thelounge/lounge/pull/163) by [@xPaw](https://github.com/xPaw))
- Remove Moment.js library from the client ([#183](https://github.com/thelounge/lounge/pull/183) by [@xPaw](https://github.com/xPaw))
- Disabled emails from Travis CI on successful builds ([#172](https://github.com/thelounge/lounge/pull/172) by [@xPaw](https://github.com/xPaw))
- Remove unnecessary operation when sorting users ([#193](https://github.com/thelounge/lounge/pull/193) by [@astorije](https://github.com/astorije))

### Fixed

- Make sure self messages are never highlighted and improve highlight lookup ([#157](https://github.com/thelounge/lounge/pull/157) by [@astorije](https://github.com/astorije))
- Fix Send button style on Zenburn and Morning themes, introduced by this release ([#187](https://github.com/thelounge/lounge/pull/187) by [@astorije](https://github.com/astorije))
- Make sure all close buttons in the sidebar have same weight ([#192](https://github.com/thelounge/lounge/pull/192) by [@astorije](https://github.com/astorije))
- Disallow parting from lobbies ([#209](https://github.com/thelounge/lounge/pull/209) by [@xPaw](https://github.com/xPaw))

## v1.3.1 - 2016-03-05

[See the full changelog](https://github.com/thelounge/lounge/compare/v1.3.0...v1.3.1)

### Removed

- Remove attempts to set file modes ([#117](https://github.com/thelounge/lounge/pull/117) by [@maxpoulin64](https://github.com/maxpoulin64))

### Fixed

- Correctly handle inline channels in messages ([#128](https://github.com/thelounge/lounge/pull/128) by [@xPaw](https://github.com/xPaw))
- Fix crash, introduced by this release ([#143](https://github.com/thelounge/lounge/pull/143) by [@xPaw](https://github.com/xPaw))
- Fix highlighted actions and mute colors of some of the actions ([#47](https://github.com/thelounge/lounge/pull/47) by [@xPaw](https://github.com/xPaw))
- Fix stripping multiple colors from notifications ([#145](https://github.com/thelounge/lounge/pull/145) by [@xPaw](https://github.com/xPaw))
- Correctly display channel name in notifications ([#148](https://github.com/thelounge/lounge/pull/148) by [@xPaw](https://github.com/xPaw))
- Fix hover effect on channels in topics ([#149](https://github.com/thelounge/lounge/pull/149) by [@xPaw](https://github.com/xPaw))
- Add missing mode action to muted colors ([#150](https://github.com/thelounge/lounge/pull/150) by [@astorije](https://github.com/astorije))

## v1.3.0 - 2016-03-03

[See the full changelog](https://github.com/thelounge/lounge/compare/v1.2.1...v1.3.0)

### Added

- Add hostmask in `join`/`part`/`quit` messages and move actions to templates ([#94](https://github.com/thelounge/lounge/pull/94) by [@xPaw](https://github.com/xPaw))
- Add a section in the README explaining why a fork was created ([#95](https://github.com/thelounge/lounge/pull/95) by [@almet](https://github.com/almet))
- Add the ability to let users change their password from the settings page ([#57](https://github.com/thelounge/lounge/pull/57) by [@diddledan](https://github.com/diddledan))
- Add the ability to let users set custom CSS in their settings ([#83](https://github.com/thelounge/lounge/pull/83) by [@xPaw](https://github.com/xPaw))
- Add notifications for channel invites ([#127](https://github.com/thelounge/lounge/pull/127) by [@astorije](https://github.com/astorije))
- Allow locking network configuration ([#82](https://github.com/thelounge/lounge/pull/82) by [@xPaw](https://github.com/xPaw))

### Changed

- Add target channel name in notifications ([#118](https://github.com/thelounge/lounge/pull/118) by [@astorije](https://github.com/astorije))
- Bump `grunt-contrib-uglify` and pin versions of `grunt`-related dependencies ([#119](https://github.com/thelounge/lounge/pull/119) by [@astorije](https://github.com/astorije))
- Switch to a power-off icon for logging out ([#131](https://github.com/thelounge/lounge/pull/131) by [@astorije](https://github.com/astorije))

### Removed

- Remove auto-select on input fields ([#120](https://github.com/thelounge/lounge/pull/120) by [@astorije](https://github.com/astorije))

### Fixed

- Fix the "Show more" button being displayed over chat messages and message paddings when `join`/`part`/`quit` messages are hidden ([`b53e5c4`](https://github.com/thelounge/lounge/commit/b53e5c407c7ca90e9741791b4e0d927fb5f54ea1) by [@xPaw](https://github.com/xPaw))
- Fix how highlights are handled and highlighted ([#91](https://github.com/thelounge/lounge/pull/91) by [@xPaw](https://github.com/xPaw))
- Fix favicon highlight on Chrome and remove `Favico.js` library ([#100](https://github.com/thelounge/lounge/pull/100) by [@xPaw](https://github.com/xPaw))
- Fix complete crash when refreshing a public instance, introduced by this release ([#125](https://github.com/thelounge/lounge/pull/125) by [@astorije](https://github.com/astorije))
- Fix clickable "you" in the text of an `/invite`, introduced by this release ([#122](https://github.com/thelounge/lounge/pull/122) by [@xPaw](https://github.com/xPaw))
- Fix minor issues with the main HTML file ([#134](https://github.com/thelounge/lounge/pull/134) by [@astorije](https://github.com/astorije))
- Strip control codes from notifications ([#123](https://github.com/thelounge/lounge/pull/123) by [@xPaw](https://github.com/xPaw))

## v1.2.1 - 2016-02-26

[See the full changelog](https://github.com/thelounge/lounge/compare/v1.2.0...v1.2.1)

### Changed

- Bump and pin mocha version ([#104](https://github.com/thelounge/lounge/pull/104) by [@astorije](https://github.com/astorije))

### Fixed

- Fix CSS selector syntax in channel message handler ([#102](https://github.com/thelounge/lounge/pull/102) by [@maxpoulin64](https://github.com/maxpoulin64))
- Fix fading channel name in sidebar of Crypto and Zenburn themes ([#105](https://github.com/thelounge/lounge/pull/105) by [@maxpoulin64](https://github.com/maxpoulin64))
- Fix `/invite` command broken by lodash bump ([#106](https://github.com/thelounge/lounge/pull/106) by [@JocelynDelalande](https://github.com/JocelynDelalande))

## v1.2.0 - 2016-02-24

[See the full changelog](https://github.com/thelounge/lounge/compare/v1.1.1...v1.2.0)

Note that this release will reset client-side settings to their defaults. Current users will have to re-set them in the settings page. This is [a conscious trade-off](https://github.com/thelounge/lounge/pull/70#issuecomment-186717859) as the fork is rather new and there are not many settings overall.

### Added

- Add support for the `/invite <nickname> <channel>` command ([#7](https://github.com/thelounge/lounge/pull/7) by [@xPaw](https://github.com/xPaw))
- Add a command shorthand to invite in the current channel with `/invite <nickname>` ([#76](https://github.com/thelounge/lounge/pull/76) by [@astorije](https://github.com/astorije))
- Add style linting for all CSS files in the repository ([#43](https://github.com/thelounge/lounge/pull/43) by [@xPaw](https://github.com/xPaw))

### Changed

- Improve client performance by updating the users' list only when it's needed ([#58](https://github.com/thelounge/lounge/pull/58) by [@maxpoulin64](https://github.com/maxpoulin64))
- Let the badge counter hide with a fade-out ([#73](https://github.com/thelounge/lounge/pull/73) by [@xPaw](https://github.com/xPaw))
- Update `lodash` dependency to the latest major version ([#38](https://github.com/thelounge/lounge/pull/38) by [@xPaw](https://github.com/xPaw))
- Use `localStorage` instead of cookies for client-side settings storage ([#70](https://github.com/thelounge/lounge/pull/70) by [@xPaw](https://github.com/xPaw))
- Replace Bootstrap's tooltips with CSS tooltips from GitHub's Primer ([#79](https://github.com/thelounge/lounge/pull/79) by [@xPaw](https://github.com/xPaw))

### Fixed

- Fade long channel names in the sidebar instead of breaking to another line ([#75](https://github.com/thelounge/lounge/pull/75) by [@maxpoulin64](https://github.com/maxpoulin64))

## v1.1.1 - 2016-02-19

[See the full changelog](https://github.com/thelounge/lounge/compare/v1.1.0...v1.1.1)

### Changed

- Remove compiled assets and generate them at prepublish time ([#63](https://github.com/thelounge/lounge/pull/63) by [@astorije](https://github.com/astorije))

## v1.1.0 - 2016-02-19

[See the full changelog](https://github.com/thelounge/lounge/compare/v1.0.2...v1.1.0)

### Added

- Allow The Lounge to be proxied behind a `/path/` URL ([#27](https://github.com/thelounge/lounge/pull/27) by [@gdamjan](https://github.com/gdamjan))

### Changed

- Simplify a great deal the CONTRIBUTING file ([#40](https://github.com/thelounge/lounge/pull/40) by [@astorije](https://github.com/astorije))
- Use a Font Awesome icon for the channel closing button ([#48](https://github.com/thelounge/lounge/pull/48) by [@xPaw](https://github.com/xPaw))

### Removed

- Remove Node 0.10 from Travis CI ([#60](https://github.com/thelounge/lounge/pull/60) by [@astorije](https://github.com/astorije))

### Fixed

- Suppress deprecation warning for `moment().zone` ([#37](https://github.com/thelounge/lounge/pull/37) by [@deiu](https://github.com/deiu))
- Fix a bug preventing the closing of a channel when the user was kicked out ([#34](https://github.com/thelounge/lounge/pull/34) by [@xPaw](https://github.com/xPaw))

## v1.0.2 - 2016-02-15

[See the full changelog](https://github.com/thelounge/lounge/compare/v1.0.1...v1.0.2)

### Changed

- Remove `#foo` channel from the default configuration file ([#22](https://github.com/thelounge/lounge/pull/22) by [@astorije](https://github.com/astorije))
- Change the Freenode URL to `chat.freenode.net` in the default configuration file ([#13](https://github.com/thelounge/lounge/pull/13) by [@dubzi](https://github.com/dubzi))
- Ensure all `.js` files are linted ([#42](https://github.com/thelounge/lounge/pull/42) by [@williamboman](https://github.com/williamboman))

### Fixed

- Hide the user list button on a server or private message window ([#32](https://github.com/thelounge/lounge/pull/32) by [@MaxLeiter](https://github.com/MaxLeiter))
- Correctly sort the user list whenever a user joins ([#33](https://github.com/thelounge/lounge/pull/33) by [@xPaw](https://github.com/xPaw))

## v1.0.1 - 2016-02-14

[See the full changelog](https://github.com/thelounge/lounge/compare/v1.0.0...v1.0.1)

### Changed

- In the change log, use a permanent URL to link the previous history of The Lounge to Shout ([#12](https://github.com/thelounge/lounge/pull/12) by [@xPaw](https://github.com/xPaw))
- Update some dependencies and pin versions ([#8](https://github.com/thelounge/lounge/pull/8) by [@xPaw](https://github.com/xPaw))

### Fixed

- Add missing form methods that were causing LastPass to trigger a warning ([#19](https://github.com/thelounge/lounge/pull/19) by [@maxpoulin64](https://github.com/maxpoulin64))
- Fix comments in the configuration file ([#1](https://github.com/thelounge/lounge/pull/1) by [@FryDay](https://github.com/FryDay))

## v1.0.0 - 2016-02-12

[See the full changelog](https://github.com/thelounge/lounge/compare/baadc3df3534fb22515a8c2ea29218fbbc1228b4...v1.0.0)

This is the first release of **The Lounge**, picking up where Shout `v0.53.0` left off!

### Added

- Enable notifications on all messages, which can be controlled in the settings ([#540](https://github.com/erming/shout/pull/540) by [@nickel715](https://github.com/nickel715))
- Add Travis CI and David DM badges on the README ([#465](https://github.com/erming/shout/pull/465) by [@astorije](https://github.com/astorije))
- Emit sent notice back to the user ([#590](https://github.com/erming/shout/pull/590) by [@xPaw](https://github.com/xPaw))
- Send user agent with link expander requests ([#608](https://github.com/erming/shout/pull/608) by [@xPaw](https://github.com/xPaw))
- Add a `.gitattributes` file to normalize line endings ([#610](https://github.com/erming/shout/pull/610) by [@xPaw](https://github.com/xPaw))
- Style scrollbars (WebKit only) ([#593](https://github.com/erming/shout/pull/593) by [@xPaw](https://github.com/xPaw))
- Add a badge to display the IRC channel at the top ([#599](https://github.com/erming/shout/pull/599) by [@astorije](https://github.com/astorije))
- Rotate `part`/`quit` icon for new action display ([#617](https://github.com/erming/shout/pull/617) by [@MaxLeiter](https://github.com/MaxLeiter))

### Changed

- Update slate-irc to v0.8.1 ([#597](https://github.com/erming/shout/pull/597) by [@xPaw](https://github.com/xPaw))
- Limit maximum height of inline images ([#598](https://github.com/erming/shout/pull/598) by [@xPaw](https://github.com/xPaw))
- Use a single function to process and render messages ([#596](https://github.com/erming/shout/pull/596) by [@xPaw](https://github.com/xPaw))
- Render user actions separately ([#588](https://github.com/erming/shout/pull/588) by [@xPaw](https://github.com/xPaw))
- Simply parse all 0-99 IRC colors ([#609](https://github.com/erming/shout/pull/609) by [@xPaw](https://github.com/xPaw))
- Tag notifications to reduce notification spam ([#418](https://github.com/erming/shout/pull/418) by [@williamboman](https://github.com/williamboman))
- Change all mentions of Shout to the new name: The Lounge ([#2](https://github.com/thelounge/lounge/pull/2) by [@astorije](https://github.com/astorije))

### Fixed

- Fix initial copyright year in the LICENSE notice ([#591](https://github.com/erming/shout/pull/591) by [@pra85](https://github.com/pra85))
- Fix wrong color class on Zenburn style ([#595](https://github.com/erming/shout/pull/595) by [@astorije](https://github.com/astorije))
- Run new topic through parser when it is updated ([#587](https://github.com/erming/shout/pull/587) by [@xPaw](https://github.com/xPaw))
- Fix several things on Morning and Zenburn themes ([#605](https://github.com/erming/shout/pull/605) by [@xPaw](https://github.com/xPaw))
- Fix word wrap on firefox ([#570](https://github.com/erming/shout/pull/570) by [@YaManicKill](https://github.com/YaManicKill))
- Change user buttons to `a` links, allowing highlighting on Firefox ([#571](https://github.com/erming/shout/pull/571) and [#574](https://github.com/erming/shout/pull/574) by [@YaManicKill](https://github.com/YaManicKill))

---

All previous changes can be found on [Shout's CHANGELOG, starting at `v0.53.0`](https://github.com/erming/shout/blob/35587f3c35d0a8ac78a2495934ff9eaa8f1aa71c/CHANGELOG.md#0530--2016-01-07).

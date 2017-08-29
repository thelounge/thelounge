# Change Log

All notable changes to this project will be documented in this file.

<!--
Use the following template for each new release, built on recommendations from http://keepachangelog.com/.

```md
## vX.Y.Z - YYYY-MM-DD

For more details, [see the full changelog](https://github.com/thelounge/lounge/compare/vPRE.VIO.US...vX.Y.Z) and [milestone](https://github.com/thelounge/lounge/milestone/XX?closed=1).

DESCRIPTION, ANNOUNCEMENT, ...

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
### Documentation
In the main repository:
On the website:
### Internals
```

All sections are explained on the link above, they are all optional, and each of them should contain a list of PRs formatted as such:

```md
- Description ([#PR_NUMBER](https://github.com/thelounge/lounge/pull/PR_NUMBER) by [@GITHUB_USERNAME](https://github.com/GITHUB_USERNAME))
```
-->

## v2.4.0 - 2017-07-30

For more details, [see the full changelog](https://github.com/thelounge/lounge/compare/v2.3.2...v2.4.0) and [milestone](https://github.com/thelounge/lounge/milestone/25?closed=1).

This release improves link and image previews a great deal! On the menu:

- Up to 5 previews are now displayed instead of 1
- All previews on the current channel can now be hidden or displayed using the `/collapse` and `/expand` commands
- Thumbnails can be opened in a fullscreen viewer without leaving the app by clicking on them, and cycled using the previous/next buttons or by hitting <kbd>←</kbd> and <kbd>→</kbd>
- Say bye to mixed content warnings: The Lounge can now proxy all images (opt-in option in the server settings) for better privacy
- Title and description are improved overall

Also in this release, auto-complete feature now has an opt-out option in the client settings, and emoji can be searched using fuzzy-matching:

<img width="241" alt="The Lounge - Emoji fuzzy-matching" src="https://user-images.githubusercontent.com/113730/28757682-54276b5a-7556-11e7-9e4b-ce1d19d7b678.png">

### Added

- Add `title` attributes to previews ([#1291](https://github.com/thelounge/lounge/pull/1291) by [@astorije](https://github.com/astorije))
- Allow opting out of autocomplete ([#1294](https://github.com/thelounge/lounge/pull/1294) by [@awalgarg](https://github.com/awalgarg))
- Add collapse/expand commands to toggle all previews ([#1309](https://github.com/thelounge/lounge/pull/1309) by [@astorije](https://github.com/astorije))
- An image viewer popup for thumbnails and image previews, with buttons to previous/next images ([#1325](https://github.com/thelounge/lounge/pull/1325), [#1365](https://github.com/thelounge/lounge/pull/1365), [#1368](https://github.com/thelounge/lounge/pull/1368), [#1367](https://github.com/thelounge/lounge/pull/1367) by [@astorije](https://github.com/astorije), [#1370](https://github.com/thelounge/lounge/pull/1370) by [@xPaw](https://github.com/xPaw))
- Store preview images on disk for privacy, security and caching ([#1307](https://github.com/thelounge/lounge/pull/1307) by [@xPaw](https://github.com/xPaw))
- Emoji fuzzy-matching ([#1334](https://github.com/thelounge/lounge/pull/1334) by [@MaxLeiter](https://github.com/MaxLeiter))

### Changed

- Check status code in link prefetcher ([#1260](https://github.com/thelounge/lounge/pull/1260) by [@xPaw](https://github.com/xPaw))
- Check `og:description` before `description` tag in previews ([#1255](https://github.com/thelounge/lounge/pull/1255) by [@xPaw](https://github.com/xPaw))
- Check `og:title` before `title` tag in previews ([#1256](https://github.com/thelounge/lounge/pull/1256) by [@xPaw](https://github.com/xPaw))
- Do not display preview if there is nothing to preview ([#1273](https://github.com/thelounge/lounge/pull/1273) by [@xPaw](https://github.com/xPaw))
- Increase max downloaded bytes for link preview ([#1274](https://github.com/thelounge/lounge/pull/1274) by [@xPaw](https://github.com/xPaw))
- Refactor link previews ([#1276](https://github.com/thelounge/lounge/pull/1276) by [@xPaw](https://github.com/xPaw), [#1378](https://github.com/thelounge/lounge/pull/1378) by [@astorije](https://github.com/astorije))
- Support multiple previews per message ([#1303](https://github.com/thelounge/lounge/pull/1303), [#1324](https://github.com/thelounge/lounge/pull/1324), [#1335](https://github.com/thelounge/lounge/pull/1335), [#1348](https://github.com/thelounge/lounge/pull/1348), [#1347](https://github.com/thelounge/lounge/pull/1347), [#1353](https://github.com/thelounge/lounge/pull/1353) by [@astorije](https://github.com/astorije))
- Add `mask-icon` for pinned safari tab ([#1329](https://github.com/thelounge/lounge/pull/1329) by [@MaxLeiter](https://github.com/MaxLeiter))
- Lazily load user list in channels on init, keep autocompletion sort on server ([#1194](https://github.com/thelounge/lounge/pull/1194) by [@xPaw](https://github.com/xPaw))
- Keep track of preview visibility on the server so it persists at page reload ([#1366](https://github.com/thelounge/lounge/pull/1366) by [@astorije](https://github.com/astorije))
- Bump express and socket.io to their latest patch versions ([#1312](https://github.com/thelounge/lounge/pull/1312) by [@astorije](https://github.com/astorije))
- Update production dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `commander` ([#1257](https://github.com/thelounge/lounge/pull/1257), [#1292](https://github.com/thelounge/lounge/pull/1292))
  - `jquery-textcomplete` ([#1279](https://github.com/thelounge/lounge/pull/1279), [#1321](https://github.com/thelounge/lounge/pull/1321))
  - `fs-extra` ([#1332](https://github.com/thelounge/lounge/pull/1332))
  - `semver` ([#1369](https://github.com/thelounge/lounge/pull/1369))

### Removed

- Remove hostname prettifier ([#1306](https://github.com/thelounge/lounge/pull/1306) by [@xPaw](https://github.com/xPaw))
- Remove `X-UA-Compatible` ([#1328](https://github.com/thelounge/lounge/pull/1328) by [@xPaw](https://github.com/xPaw))

### Fixed

- Make sure thumbnail is a valid image in previews ([#1254](https://github.com/thelounge/lounge/pull/1254) by [@xPaw](https://github.com/xPaw))
- Parse `X-Forwarded-For` header correctly ([#1202](https://github.com/thelounge/lounge/pull/1202) by [@xPaw](https://github.com/xPaw))
- Do not truncate link previews if viewport can fit more text ([#1293](https://github.com/thelounge/lounge/pull/1293) by [@xPaw](https://github.com/xPaw))
- Fix too big line height previews text on Crypto ([#1296](https://github.com/thelounge/lounge/pull/1296) by [@astorije](https://github.com/astorije))
- Fix background color contrast on Zenburn previews ([#1297](https://github.com/thelounge/lounge/pull/1297) by [@astorije](https://github.com/astorije))
- Fix jumps when toggling link preview ([#1298](https://github.com/thelounge/lounge/pull/1298) by [@xPaw](https://github.com/xPaw))
- Fix losing network settings ([#1305](https://github.com/thelounge/lounge/pull/1305) by [@xPaw](https://github.com/xPaw))
- Fix missing transitions ([#1314](https://github.com/thelounge/lounge/pull/1314), [#1336](https://github.com/thelounge/lounge/pull/1336), [#1374](https://github.com/thelounge/lounge/pull/1374) by [@astorije](https://github.com/astorije), [#1117](https://github.com/thelounge/lounge/pull/1117) by [@bews](https://github.com/bews))
- Fix incorrect mode on kick target ([#1352](https://github.com/thelounge/lounge/pull/1352) by [@xPaw](https://github.com/xPaw))
- Correctly show whitespace and newlines in messages ([#1242](https://github.com/thelounge/lounge/pull/1242) by [@starquake](https://github.com/starquake), [#1359](https://github.com/thelounge/lounge/pull/1359) by [@xPaw](https://github.com/xPaw))
- Hide overflow on entire message row ([#1361](https://github.com/thelounge/lounge/pull/1361) by [@starquake](https://github.com/starquake))
- Fix link previews not truncating correctly ([#1363](https://github.com/thelounge/lounge/pull/1363) by [@xPaw](https://github.com/xPaw))

### Documentation

In the main repository:

- Remove mention in CHANGELOG that The Lounge uses Semantic Versioning ([#1269](https://github.com/thelounge/lounge/pull/1269) by [@astorije](https://github.com/astorije))
- Remove `devDependencies` badge on README ([#1267](https://github.com/thelounge/lounge/pull/1267) by [@astorije](https://github.com/astorije))
- Reword link preview settings to better match reality ([#1310](https://github.com/thelounge/lounge/pull/1310) by [@astorije](https://github.com/astorije))
- Update screenshot in README ([#1326](https://github.com/thelounge/lounge/pull/1326) by [@MaxLeiter](https://github.com/MaxLeiter))
- Update README badge to new demo URL ([#1345](https://github.com/thelounge/lounge/pull/1345) by [@MaxLeiter](https://github.com/MaxLeiter))
- Update README for when to run `npm run build` ([#1319](https://github.com/thelounge/lounge/pull/1319) by [@MaxLeiter](https://github.com/MaxLeiter))

On the website:

- Update demo URL to new demo ([#70](https://github.com/thelounge/thelounge.github.io/pull/70) by [@MaxLeiter](https://github.com/MaxLeiter))

### Internals

- Move nickname rendering to a single template ([#1252](https://github.com/thelounge/lounge/pull/1252) by [@xPaw](https://github.com/xPaw))
- Ignore all dotfiles in `.npmignore` ([#1287](https://github.com/thelounge/lounge/pull/1287) by [@xPaw](https://github.com/xPaw))
- Add `.npmrc` file with `save-exact` set to `true` so packages are saved already pinned ([#1284](https://github.com/thelounge/lounge/pull/1284) by [@MaxLeiter](https://github.com/MaxLeiter))
- Do not hardcode vendor bundles in webpack configuration ([#1280](https://github.com/thelounge/lounge/pull/1280) by [@xPaw](https://github.com/xPaw))
- Prepare for `SOURCE` CTCP command, when `irc-framework` supports it ([#1284](https://github.com/thelounge/lounge/pull/1284) by [@MaxLeiter](https://github.com/MaxLeiter))
- Change "Show older messages" to use `id` rather than count ([#1354](https://github.com/thelounge/lounge/pull/1354) by [@YaManicKill](https://github.com/YaManicKill))
- Update development dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `eslint` ([#1264](https://github.com/thelounge/lounge/pull/1264), [#1272](https://github.com/thelounge/lounge/pull/1272), [#1315](https://github.com/thelounge/lounge/pull/1315), [#1362](https://github.com/thelounge/lounge/pull/1362))
  - `nyc` ([#1277](https://github.com/thelounge/lounge/pull/1277))
  - `stylelint` ([#1278](https://github.com/thelounge/lounge/pull/1278), [#1320](https://github.com/thelounge/lounge/pull/1320), [#1340](https://github.com/thelounge/lounge/pull/1340))
  - `babel-loader` ([#1282](https://github.com/thelounge/lounge/pull/1282))
  - `babel-preset-env` ([#1295](https://github.com/thelounge/lounge/pull/1295))
  - `webpack` ([#1308](https://github.com/thelounge/lounge/pull/1308), [#1322](https://github.com/thelounge/lounge/pull/1322), [#1338](https://github.com/thelounge/lounge/pull/1338), [#1371](https://github.com/thelounge/lounge/pull/1371), [#1376](https://github.com/thelounge/lounge/pull/1376))
  - `chai` ([#1323](https://github.com/thelounge/lounge/pull/1323))

## v2.4.0-rc.2 - 2017-07-27 [Pre-release]

[See the full changelog](https://github.com/thelounge/lounge/compare/v2.4.0-rc.1...v2.4.0-rc.2)

This is a release candidate for v2.4.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.4.0-rc.1 - 2017-07-27 [Pre-release]

[See the full changelog](https://github.com/thelounge/lounge/compare/v2.3.2...v2.4.0-rc.1)

This is a release candidate for v2.4.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.3.2 - 2017-06-25

For more details, [see the full changelog](https://github.com/thelounge/lounge/compare/v2.3.1...v2.3.2) and [milestone](https://github.com/thelounge/lounge/milestone/24?closed=1).

This patch releases brings a lot of fixes and small improvements here and there, as well as the ability to display seconds in timestamps, a long-awaited feature!

### Added

- Add a client option to display seconds in timestamps ([#1141](https://github.com/thelounge/lounge/pull/1141) by [@bews](https://github.com/bews))
- Add "Reload page" button when the client fails to load ([#1150](https://github.com/thelounge/lounge/pull/1150) by [@bews](https://github.com/bews))

### Changed

- Treat `click` as a read activity ([#1214](https://github.com/thelounge/lounge/pull/1214) by [@xPaw](https://github.com/xPaw))
- Fade out for long nicks ([#1158](https://github.com/thelounge/lounge/pull/1158) by [@bews](https://github.com/bews), [#1253](https://github.com/thelounge/lounge/pull/1253) by [@xPaw](https://github.com/xPaw))
- Include trickery to reduce paints and improve performance ([#1120](https://github.com/thelounge/lounge/pull/1120) by [@xPaw](https://github.com/xPaw), [#1083](https://github.com/thelounge/lounge/pull/1083) by [@bews](https://github.com/bews))
- Make everything un-selectable by default ([#1233](https://github.com/thelounge/lounge/pull/1233) by [@xPaw](https://github.com/xPaw))
- Handle images with unknown size in prefetch ([#1246](https://github.com/thelounge/lounge/pull/1246) by [@bews](https://github.com/bews))
- Update production dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `spdy` ([#1184](https://github.com/thelounge/lounge/pull/1184))

### Fixed

- Stop showing the unread messages marker when `joins`/`parts`/`quits`/etc. are hidden ([#1016](https://github.com/thelounge/lounge/pull/1016) by [@swordbeta](https://github.com/swordbeta))
- Correctly finish scroll animation when using page keys ([#1244](https://github.com/thelounge/lounge/pull/1244) by [@xPaw](https://github.com/xPaw))
- Hide link time element on small devices ([#1261](https://github.com/thelounge/lounge/pull/1261) by [@xPaw](https://github.com/xPaw))
- Fix MOTD underline in Safari ([#1217](https://github.com/thelounge/lounge/pull/1217) by [@MaxLeiter](https://github.com/MaxLeiter))

### Documentation

In the main repository:

- Clarify kilobyte ambiguity ([#1248](https://github.com/thelounge/lounge/pull/1248) by [@xPaw](https://github.com/xPaw))
- Fix stray end tag ([#1251](https://github.com/thelounge/lounge/pull/1251) by [@xPaw](https://github.com/xPaw))

### Internals

- Update to ESLint 4 and enforce extra rules ([#1231](https://github.com/thelounge/lounge/pull/1231) by [@xPaw](https://github.com/xPaw))
- Improve the PR tester script a bit ([#1240](https://github.com/thelounge/lounge/pull/1240) by [@astorije](https://github.com/astorije))
- Add modules for socket events ([#1175](https://github.com/thelounge/lounge/pull/1175) by [@YaManicKill](https://github.com/YaManicKill))
- Ignore `package-lock.json` ([#1247](https://github.com/thelounge/lounge/pull/1247) by [@xPaw](https://github.com/xPaw))
- Use `stylelint-config-standard` ([#1249](https://github.com/thelounge/lounge/pull/1249) by [@xPaw](https://github.com/xPaw))
- Update development dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `babel-core` ([#1212](https://github.com/thelounge/lounge/pull/1212))
  - `babel-loader` ([#1245](https://github.com/thelounge/lounge/pull/1245))
  - `nyc` ([#1198](https://github.com/thelounge/lounge/pull/1198))
  - `stylelint` ([#1215](https://github.com/thelounge/lounge/pull/1215), [#1230](https://github.com/thelounge/lounge/pull/1230))
  - `chai` ([#1206](https://github.com/thelounge/lounge/pull/1206))
  - `webpack` ([#1238](https://github.com/thelounge/lounge/pull/1238))

## v2.3.1 - 2017-06-09

For more details, [see the full changelog](https://github.com/thelounge/lounge/compare/v2.3.0...v2.3.1) and [milestone](https://github.com/thelounge/lounge/milestone/23?closed=1).

This release mostly fixes a few bugs, as listed below.

### Changed

- Keep original `<title>` name when changing the title ([#1205](https://github.com/thelounge/lounge/pull/1205) by [@xPaw](https://github.com/xPaw))
- Update production dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `handlebars` ([#1179](https://github.com/thelounge/lounge/pull/1179))

### Fixed

- Do not store unnecessary information in user objects ([#1195](https://github.com/thelounge/lounge/pull/1195) by [@xPaw](https://github.com/xPaw))
- Correctly configure client socket transports ([#1197](https://github.com/thelounge/lounge/pull/1197) by [@xPaw](https://github.com/xPaw))
- Fix network name not being set when `displayNetwork` is `false` ([#1211](https://github.com/thelounge/lounge/pull/1211) by [@xPaw](https://github.com/xPaw))

### Security

- Do not store passwords in settings storage ([#1204](https://github.com/thelounge/lounge/pull/1204) by [@xPaw](https://github.com/xPaw))

### Internals

- Fix `localtime` test to correctly use UTC ([#1201](https://github.com/thelounge/lounge/pull/1201) by [@xPaw](https://github.com/xPaw))
- Update Node.js versions for Travis CI ([#1191](https://github.com/thelounge/lounge/pull/1191) by [@YaManicKill](https://github.com/YaManicKill))
- Update development dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `mocha` ([#1170](https://github.com/thelounge/lounge/pull/1170))
  - `webpack` ([#1183](https://github.com/thelounge/lounge/pull/1183))
  - `babel-preset-env` ([#1177](https://github.com/thelounge/lounge/pull/1177))

## v2.3.0 - 2017-06-08

For more details, [see the full changelog](https://github.com/thelounge/lounge/compare/v2.2.2...v2.3.0) and [milestone](https://github.com/thelounge/lounge/milestone/9?closed=1).

What a release! Our biggest one since the v2.0.0 [release](https://github.com/thelounge/lounge/releases/tag/v2.0.0) / [milestone](https://github.com/thelounge/lounge/milestone/1?closed=1)!
Expect a lot of new cool stuff, tons of bug fixes and performance improvements.
Thanks to all 16 contributors (!!) who pitched in for this release, open source at its finest!

On the server side, The Lounge now supports an auto-away mechanism, stores channel keys across restarts and key changes, and supports a new SSL CA bundle option in the configuration file.

Users of the client will notice some changes as well:

- A bunch of new hotkeys to style messages (bold, italic, underline, foreground/background color), all listed in the Help window

- A new autocomplete mechanism for emoji, users, channels, commands, and colors:

  <img alt="The Lounge - Auto-completion" src="https://user-images.githubusercontent.com/113730/26863276-a565fad8-4b1f-11e7-8aa4-21bb812c2568.gif" width=500>

  Note that due to the new nick autocomplete, we removed the now unnecessary nick cycle button that was temporarily added in the meantime. Lots of users have reported it had been broken by a previous release anyway.

- Support of page up/down keys to browse the current chat

- Friendliness-bump of time-related tooltips and date marker:

  ![The Lounge - Timestamp tooltips](https://user-images.githubusercontent.com/113730/26863323-f57cb85e-4b1f-11e7-9b4c-27b62d518af5.gif) &nbsp;&nbsp;&nbsp; ![The Lounge - Friendly date marker](https://user-images.githubusercontent.com/113730/26863322-f577f634-4b1f-11e7-8131-c1b3f3ffe743.gif)

- Support of browsers' Back/Forward actions:

  <img alt="The Lounge - Support of browser Back/Forward" src="https://user-images.githubusercontent.com/113730/26863320-f5761efe-4b1f-11e7-8fb4-de2c5c34cca3.gif" width=300>

- Better and more discreet inline previews for links and images:

  <img alt="The Lounge - Link preview" src="https://user-images.githubusercontent.com/113730/26863418-887b9364-4b20-11e7-8016-1b5367690d7e.png" width=400><br>
  <img alt="The Lounge - Image preview" src="https://user-images.githubusercontent.com/113730/26863419-887bcc4e-4b20-11e7-9055-1913a9aba0e4.png" width=300>

- Improved channel list with `/list`

- Support for `/ban`, `/unban` and `/banlist`

- Fuzzy-matching of the user list search to find folks more easily:

  ![The Lounge - Fuzzy matching in the user list](https://user-images.githubusercontent.com/113730/26863472-c86b58c4-4b20-11e7-84c1-f66ee8d3e99b.gif)

That's all for this release, and onto the next one now!

### Added

- Add `data-from` attribute to allow styling messages from specific users ([#978](https://github.com/thelounge/lounge/pull/978) by [@williamboman](https://github.com/williamboman))
- Auto away when no clients are connected ([#775](https://github.com/thelounge/lounge/pull/775), [#1104](https://github.com/thelounge/lounge/pull/1104) by [@xPaw](https://github.com/xPaw))
- Implement color hotkeys ([#810](https://github.com/thelounge/lounge/pull/810) by [@xPaw](https://github.com/xPaw))
- Store channel keys ([#1003](https://github.com/thelounge/lounge/pull/1003) by [@xPaw](https://github.com/xPaw), [#715](https://github.com/thelounge/lounge/pull/715) by [@spookhurb](https://github.com/spookhurb))
- Implement <kbd>pgup</kbd>/<kbd>pgdown</kbd> keys ([#955](https://github.com/thelounge/lounge/pull/955) by [@xPaw](https://github.com/xPaw), [#1078](https://github.com/thelounge/lounge/pull/1078) by [@YaManicKill](https://github.com/YaManicKill))
- Add CSS tooltips on time elements to give ability to view time on mobile ([#824](https://github.com/thelounge/lounge/pull/824) by [@xPaw](https://github.com/xPaw))
- Add SSL CA bundle option ([#1024](https://github.com/thelounge/lounge/pull/1024) by [@metsjeesus](https://github.com/metsjeesus))
- Implement History Web API ([#575](https://github.com/thelounge/lounge/pull/575) by [@williamboman](https://github.com/williamboman), [#1080](https://github.com/thelounge/lounge/pull/1080) by [@YaManicKill](https://github.com/YaManicKill))
- Add slug with command to unhandled messages ([#816](https://github.com/thelounge/lounge/pull/816) by [@DanielOaks](https://github.com/DanielOaks), [#1044](https://github.com/thelounge/lounge/pull/1044) by [@YaManicKill](https://github.com/YaManicKill))
- Add support for the `/banlist` command ([#1009](https://github.com/thelounge/lounge/pull/1009) by [@YaManicKill](https://github.com/YaManicKill))
- Add support for `/ban` and `/unban` commands ([#1077](https://github.com/thelounge/lounge/pull/1077) by [@YaManicKill](https://github.com/YaManicKill))
- Add autocompletion for emoji, users, channels, and commands ([#787](https://github.com/thelounge/lounge/pull/787) by [@yashsriv](https://github.com/yashsriv), [#1138](https://github.com/thelounge/lounge/pull/1138), [#1095](https://github.com/thelounge/lounge/pull/1095) by [@xPaw](https://github.com/xPaw))
- Add autocomplete strategy for foreground and background colors ([#1109](https://github.com/thelounge/lounge/pull/1109) by [@astorije](https://github.com/astorije))
- Add support for `0x04` hex colors ([#1100](https://github.com/thelounge/lounge/pull/1100) by [@xPaw](https://github.com/xPaw))

### Changed

- Remove table layout for chat messages (and fix layout issues yet again) ([#523](https://github.com/thelounge/lounge/pull/523) by [@maxpoulin64](https://github.com/maxpoulin64))
- Improve inline previews for links and images ([#524](https://github.com/thelounge/lounge/pull/524) by [@maxpoulin64](https://github.com/maxpoulin64))
- Use local variables to check length ([#1028](https://github.com/thelounge/lounge/pull/1028) by [@xPaw](https://github.com/xPaw))
- Add `rel="noopener"` to URLs in `index.html` and replace mIRC colors URL to [@DanielOaks](https://github.com/DanielOaks)'s [documentation](https://modern.ircdocs.horse/formatting.html#colors) ([#1034](https://github.com/thelounge/lounge/pull/1034) by [@xPaw](https://github.com/xPaw), [#1051](https://github.com/thelounge/lounge/pull/1051) by [@astorije](https://github.com/astorije))
- Preload scripts as soon as possible ([#1033](https://github.com/thelounge/lounge/pull/1033) by [@xPaw](https://github.com/xPaw))
- Improve channels list ([#1018](https://github.com/thelounge/lounge/pull/1018) by [@swordbeta](https://github.com/swordbeta))
- Show MOTD by default ([#1052](https://github.com/thelounge/lounge/pull/1052) by [@KlipperKyle](https://github.com/KlipperKyle), [#1157](https://github.com/thelounge/lounge/pull/1157) by [@astorije](https://github.com/astorije))
- Switch to a new IRC message parser ([#972](https://github.com/thelounge/lounge/pull/972) by [@xPaw](https://github.com/xPaw), [#699](https://github.com/thelounge/lounge/pull/699) by [@Bonuspunkt](https://github.com/Bonuspunkt))
- Use moment on the client to display friendly dates ([#1054](https://github.com/thelounge/lounge/pull/1054) by [@astorije](https://github.com/astorije))
- Implement fuzzy-matching for the user list ([#856](https://github.com/thelounge/lounge/pull/856), [#1093](https://github.com/thelounge/lounge/pull/1093), [#1167](https://github.com/thelounge/lounge/pull/1167) by [@astorije](https://github.com/astorije), [#1091](https://github.com/thelounge/lounge/pull/1091) by [@PolarizedIons](https://github.com/PolarizedIons), [#1107](https://github.com/thelounge/lounge/pull/1107) by [@xPaw](https://github.com/xPaw))
- Use moment to render dates everywhere ([#1114](https://github.com/thelounge/lounge/pull/1114) by [@xPaw](https://github.com/xPaw))
- Update production dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `moment` ([#976](https://github.com/thelounge/lounge/pull/976), [#999](https://github.com/thelounge/lounge/pull/999))
  - `fs-extra` ([#964](https://github.com/thelounge/lounge/pull/964), [#1098](https://github.com/thelounge/lounge/pull/1098), [#1136](https://github.com/thelounge/lounge/pull/1136))
  - `jquery` ([#969](https://github.com/thelounge/lounge/pull/969), [#998](https://github.com/thelounge/lounge/pull/998))
  - `urijs` ([#995](https://github.com/thelounge/lounge/pull/995))
  - `mousetrap` ([#1006](https://github.com/thelounge/lounge/pull/1006))
  - `irc-framework` ([#1070](https://github.com/thelounge/lounge/pull/1070), [#1074](https://github.com/thelounge/lounge/pull/1074), [#1123](https://github.com/thelounge/lounge/pull/1123))
  - `handlebars` ([#1116](https://github.com/thelounge/lounge/pull/1116), [#1129](https://github.com/thelounge/lounge/pull/1129))

### Removed

- Remove invalid CSS perspective properties ([#1027](https://github.com/thelounge/lounge/pull/1027) by [@astorije](https://github.com/astorije))
- Remove cycle nicks button ([#1062](https://github.com/thelounge/lounge/pull/1062) by [@xPaw](https://github.com/xPaw))

### Fixed

- Rewrite identd server, combine with oidentd ([#804](https://github.com/thelounge/lounge/pull/804), [#970](https://github.com/thelounge/lounge/pull/970) by [@xPaw](https://github.com/xPaw))
- Fix wrong font size in help center labels ([#994](https://github.com/thelounge/lounge/pull/994) by [@astorije](https://github.com/astorije))
- Fix filling in the nickname, overriding the username in the New Network window ([#873](https://github.com/thelounge/lounge/pull/873) by [@PolarizedIons](https://github.com/PolarizedIons))
- Correctly append date marker when receiving a message ([#1002](https://github.com/thelounge/lounge/pull/1002) by [@xPaw](https://github.com/xPaw))
- Count only message items for when loading more messages ([#1013](https://github.com/thelounge/lounge/pull/1013) by [@awalgarg](https://github.com/awalgarg))
- Fix Zenburn and Morning channel list font color ([#1017](https://github.com/thelounge/lounge/pull/1017) by [@swordbeta](https://github.com/swordbeta))
- Stick to bottom when opening user list ([#1032](https://github.com/thelounge/lounge/pull/1032) by [@xPaw](https://github.com/xPaw))
- Reset notification markers on document focus ([#1040](https://github.com/thelounge/lounge/pull/1040) by [@xPaw](https://github.com/xPaw))
- Disable show more button when loading messages ([#1045](https://github.com/thelounge/lounge/pull/1045) by [@YaManicKill](https://github.com/YaManicKill))
- Fix to `helper.expandhome` to correctly resolve `""` and `undefined` ([#1050](https://github.com/thelounge/lounge/pull/1050) by [@metsjeesus](https://github.com/metsjeesus))
- Fix displayNetwork to work correctly ([#1069](https://github.com/thelounge/lounge/pull/1069) by [@xPaw](https://github.com/xPaw))
- Enable show more button correctly ([#1068](https://github.com/thelounge/lounge/pull/1068) by [@xPaw](https://github.com/xPaw))
- Rewrite server code of channel sorting ([#1064](https://github.com/thelounge/lounge/pull/1064) by [@xPaw](https://github.com/xPaw) and ([#1115](https://github.com/thelounge/lounge/pull/1115) by [@PolarizedIons](https://github.com/PolarizedIons)))
- Fix showing prefetch options ([#1087](https://github.com/thelounge/lounge/pull/1087) by [@YaManicKill](https://github.com/YaManicKill))
- Add `/ctcp` command to constants and auto-completion ([#1108](https://github.com/thelounge/lounge/pull/1108) by [@MaxLeiter](https://github.com/MaxLeiter))
- Disable `tabindex` on user list search input ([#1122](https://github.com/thelounge/lounge/pull/1122) by [@xPaw](https://github.com/xPaw))
- Fix date-marker not being removed on loading new messages ([#1132](https://github.com/thelounge/lounge/pull/1132), [#1156](https://github.com/thelounge/lounge/pull/1156) by [@PolarizedIons](https://github.com/PolarizedIons))

### Security

- Switch to `bcryptjs` and make password comparison asynchronous ([#985](https://github.com/thelounge/lounge/pull/985) by [@rockhouse](https://github.com/rockhouse), [`b46f92c`](https://github.com/thelounge/lounge/commit/b46f92c7d8a07e84f49a550b32204c0a0672e831) by [@xPaw](https://github.com/xPaw))
- Use Referrer-Policy header instead of CSP referrer ([#1015](https://github.com/thelounge/lounge/pull/1015) by [@astorije](https://github.com/astorije))

### Internals

- Enforce more space and new line rules ([#975](https://github.com/thelounge/lounge/pull/975) by [@xPaw](https://github.com/xPaw))
- Setup ESLint to make sure an EOF feed is always present ([#991](https://github.com/thelounge/lounge/pull/991) by [@astorije](https://github.com/astorije))
- Do not build json3 module with Webpack ([#977](https://github.com/thelounge/lounge/pull/977) by [@xPaw](https://github.com/xPaw))
- Remove extra newline to please ESLint ([#997](https://github.com/thelounge/lounge/pull/997) by [@astorije](https://github.com/astorije))
- Use `require()` instead of import in client code ([#973](https://github.com/thelounge/lounge/pull/973) by [@xPaw](https://github.com/xPaw))
- Do not build feature branch with open pull requests on AppVeyor ([`934400f`](https://github.com/thelounge/lounge/commit/934400f5ee094e61c62dd0304cb55ea9f9666078) by [@xPaw](https://github.com/xPaw))
- Exclude Webpack config from coverage report ([#1053](https://github.com/thelounge/lounge/pull/1053) by [@astorije](https://github.com/astorije))
- Create socket module ([#1060](https://github.com/thelounge/lounge/pull/1060) by [@YaManicKill](https://github.com/YaManicKill))
- Change index.html to be rendered using handlebars ([#1057](https://github.com/thelounge/lounge/pull/1057) by [@YaManicKill](https://github.com/YaManicKill))
- Move commands into constants module ([#1067](https://github.com/thelounge/lounge/pull/1067) by [@YaManicKill](https://github.com/YaManicKill))
- Use `babel-preset-env` ([#1072](https://github.com/thelounge/lounge/pull/1072) by [@xPaw](https://github.com/xPaw))
- Use `irc-framework`'s `setTopic()` for topic command ([#1082](https://github.com/thelounge/lounge/pull/1082) by [@MaxLeiter](https://github.com/MaxLeiter))
- Create options module ([#1066](https://github.com/thelounge/lounge/pull/1066) by [@YaManicKill](https://github.com/YaManicKill))
- Update development dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `babel-core` ([#958](https://github.com/thelounge/lounge/pull/958), [#1021](https://github.com/thelounge/lounge/pull/1021))
  - `babel-loader` ([#968](https://github.com/thelounge/lounge/pull/968), [#1020](https://github.com/thelounge/lounge/pull/1020), [#1063](https://github.com/thelounge/lounge/pull/1063))
  - `babel-preset-es2015` ([#960](https://github.com/thelounge/lounge/pull/960))
  - `eslint` ([#971](https://github.com/thelounge/lounge/pull/971), [#1000](https://github.com/thelounge/lounge/pull/1000))
  - `nyc` ([#989](https://github.com/thelounge/lounge/pull/989), [#1113](https://github.com/thelounge/lounge/pull/1113), [#1140](https://github.com/thelounge/lounge/pull/1140))
  - `webpack` ([#981](https://github.com/thelounge/lounge/pull/981), [#1007](https://github.com/thelounge/lounge/pull/1007), [#1030](https://github.com/thelounge/lounge/pull/1030), [#1133](https://github.com/thelounge/lounge/pull/1133), [#1142](https://github.com/thelounge/lounge/pull/1142))
  - `stylelint` ([#1004](https://github.com/thelounge/lounge/pull/1004), [#1005](https://github.com/thelounge/lounge/pull/1005))
  - `handlebars-loader` ([#1058](https://github.com/thelounge/lounge/pull/1058))
  - `mocha` ([#1079](https://github.com/thelounge/lounge/pull/1079))

## v2.3.0-rc.2 - 2017-05-16 [Pre-release]

[See the full changelog](https://github.com/thelounge/lounge/compare/v2.3.0-rc.1...v2.3.0-rc.2)

This is a release candidate for v2.3.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.3.0-rc.1 - 2017-05-07 [Pre-release]

[See the full changelog](https://github.com/thelounge/lounge/compare/v2.2.2...v2.3.0-rc.1)

This is a release candidate for v2.3.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.2.2 - 2017-03-13

For more details, [see the full changelog](https://github.com/thelounge/lounge/compare/v2.2.1...v2.2.2) and [milestone](https://github.com/thelounge/lounge/milestone/11?closed=1).

This patch release brings a lot of dependency upgrades and a few fixes. Passing options to the `lounge` CLI (`lounge start --port 8080`, etc.) now works as expected without requiring `--`. We have also disabled ping timeouts for now to hopefully fix automatic reconnection. Finally, upgrading `irc-framework` allows us to fix an extra couple of bugs.

You will now notice a new `(?)` icon at the bottom of the sidebar. It is home of a help center that currently details supported shortcuts and commands. It will be improved over time, but we encourage contributors to help us improve it.

Note that as of this release, `lounge` without any arguments wil display the help information (mirroring `lounge --help`). Prior to this release, it used to start a server, which must now be done explicitly using `lounge start`.

### Changed

- Update to `jQuery` 3 ([#931](https://github.com/thelounge/lounge/pull/931) by [@xPaw](https://github.com/xPaw))
- Update `express` and `nyc` to latest versions ([#954](https://github.com/thelounge/lounge/pull/954) by [@xPaw](https://github.com/xPaw))
- Update production dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `mousetrap` ([#881](https://github.com/thelounge/lounge/pull/881))
  - `fs-extra` ([#878](https://github.com/thelounge/lounge/pull/878))
  - `irc-framework` ([#918](https://github.com/thelounge/lounge/pull/918) and [#952](https://github.com/thelounge/lounge/pull/952))
  - `urijs` ([#921](https://github.com/thelounge/lounge/pull/921), [#940](https://github.com/thelounge/lounge/pull/940) and [#946](https://github.com/thelounge/lounge/pull/946))
  - `socket.io` and `socket.io-client` ([#926](https://github.com/thelounge/lounge/pull/926))
  - `request` ([#944](https://github.com/thelounge/lounge/pull/944))

### Fixed

- Disable (temporarily) client ping timeouts ([#939](https://github.com/thelounge/lounge/pull/939) by [@xPaw](https://github.com/xPaw))
- Update arg parsing and default `lounge` to `lounge --help` ([#929](https://github.com/thelounge/lounge/pull/929) by [@msaun008](https://github.com/msaun008))
- Prevent message sending in lobbies ([#957](https://github.com/thelounge/lounge/pull/957) by [@xPaw](https://github.com/xPaw))

### Documentation

In the main repository:

- Help window with supported commands and shortcuts ([#941](https://github.com/thelounge/lounge/pull/941) by [@astorije](https://github.com/astorije))

On the website:

- Add notes about moving client docs to the app itself ([#63](https://github.com/thelounge/thelounge.github.io/pull/63) by [@astorije](https://github.com/astorije))
- Deprecate (and attempt one last fixing) documentations of Heroku and Passenger ([#61](https://github.com/thelounge/thelounge.github.io/pull/61) by [@astorije](https://github.com/astorije))

### Internals

- Fix `run_pr.sh` script ([#919](https://github.com/thelounge/lounge/pull/919) by [@astorije](https://github.com/astorije))
- Make sure multiline chains of calls are correctly indented ([#930](https://github.com/thelounge/lounge/pull/930) by [@astorije](https://github.com/astorije))
- Update development dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `babel-core`, `babel-loader` and `babel-preset-es2015` ([#922](https://github.com/thelounge/lounge/pull/922) and [#947](https://github.com/thelounge/lounge/pull/947))
  - `webpack` ([#905](https://github.com/thelounge/lounge/pull/905))
  - `stylelint` ([#934](https://github.com/thelounge/lounge/pull/934))
  - `npm-run-all` ([#938](https://github.com/thelounge/lounge/pull/938))
  - `eslint` ([#937](https://github.com/thelounge/lounge/pull/937) and [#943](https://github.com/thelounge/lounge/pull/943))

## v2.2.1 - 2017-02-12

For more details, [see the full changelog](https://github.com/thelounge/lounge/compare/v2.2.0...v2.2.1) and [milestone](https://github.com/thelounge/lounge/milestone/10?closed=1).

This patch release packs up a change of the default value of `maxHistory`, an interactive prompt when creating a user to enable/disable user logging, a UI bug fix, and a few dependency upgrades.

### Changed

- Change default `maxHistory` to 10000 ([#899](https://github.com/thelounge/lounge/pull/899) by [@xPaw](https://github.com/xPaw))
- Prompt admin for user log at user creation ([#903](https://github.com/thelounge/lounge/pull/903) by [@astorije](https://github.com/astorije))
- Update `irc-framework` to the latest version 🚀 ([#902](https://github.com/thelounge/lounge/pull/902) by [Greenkeeper](https://greenkeeper.io/))
- Update `urijs` to the latest version 🚀 ([#904](https://github.com/thelounge/lounge/pull/904) by [Greenkeeper](https://greenkeeper.io/))
- Update `express` to the latest version 🚀 ([#898](https://github.com/thelounge/lounge/pull/898) by [Greenkeeper](https://greenkeeper.io/))

### Fixed

- Fix body height, regression from v2.2.0 ([#913](https://github.com/thelounge/lounge/pull/913) by [@YaManicKill](https://github.com/YaManicKill))

### Documentation

In the main repository:

- Explain about `lounge` command in dev installations ([#887](https://github.com/thelounge/lounge/pull/887) by [@drkitty](https://github.com/drkitty))

On the website:

- Port recent changes to `maxHistory` from default config file ([#60](https://github.com/thelounge/thelounge.github.io/pull/60) by [@astorije](https://github.com/astorije))

### Internals

- Sort depedencies in `package.json` ([#896](https://github.com/thelounge/lounge/pull/896) by [@xPaw](https://github.com/xPaw))
- Update `nyc` to the latest version 🚀 ([#882](https://github.com/thelounge/lounge/pull/882) by [Greenkeeper](https://greenkeeper.io/))
- Update `npm-run-all` to the latest version 🚀 ([#880](https://github.com/thelounge/lounge/pull/880) by [Greenkeeper](https://greenkeeper.io/))
- Add nyc and Webpack config files to the files ignored when releasing ([#906](https://github.com/thelounge/lounge/pull/906) by [@astorije](https://github.com/astorije))
- Update `stylelint` to the latest version 🚀 ([#907](https://github.com/thelounge/lounge/pull/907) by [Greenkeeper](https://greenkeeper.io/))
- Update `eslint` to the latest version 🚀 ([#910](https://github.com/thelounge/lounge/pull/910) by [Greenkeeper](https://greenkeeper.io/))

## v2.2.0 - 2017-01-31

For more details, [see the full changelog](https://github.com/thelounge/lounge/compare/v2.1.0...v2.2.0) and [milestone](https://github.com/thelounge/lounge/milestone/2?closed=1).

Another long-overdue release for The Lounge!

On the client, it is now possible to generate URLs that pre-fill connection inputs in public mode, a date separator makes it into the chats, `/away` and `/back` commands are now supported, idle time gets displayed on `/whois`.<br>
Also, the client does not abruptly refresh when connection is lost anymore, and user search has been slightly improved. Note however that these last 2 items are still not optimal, but improvements are underway!

On the server, more logging! The `debug` option is now an object instead of a boolean, so make sure to update your configuration file accordingly. More details [here](https://github.com/thelounge/lounge/blob/v2.2.0/defaults/config.js#L364-L383).<br>
There are changes revolving around user configuration autoloading: it has been greatly improved and therefore it is now enabled by default. Make sure to remove the `autoload` option from your configuration files.

And of course, tons of fixes and less noticeable feature additions and changes, so make sure to check the full list below!

### Added

- Override network connection inputs with URL parameters ([#674](https://github.com/thelounge/lounge/pull/674) by [@MaxLeiter](https://github.com/MaxLeiter))
- Add `id` to submit button ([#717](https://github.com/thelounge/lounge/pull/717) by [@xPaw](https://github.com/xPaw))
- Add a UI element to cycle through nick completions on mobile ([#708](https://github.com/thelounge/lounge/pull/708) by [@astorije](https://github.com/astorije))
- Report configuration file path, Node.js version and OS platform on server start-up ([#736](https://github.com/thelounge/lounge/pull/736) by [@williamboman](https://github.com/williamboman) and [#743](https://github.com/thelounge/lounge/pull/743) by [@xPaw](https://github.com/xPaw))
- Add `lounge` keyword to npm registry ([#747](https://github.com/thelounge/lounge/pull/747) by [@xPaw](https://github.com/xPaw))
- Add a date separator to channels/PMs ([#671](https://github.com/thelounge/lounge/pull/671) and [#765](https://github.com/thelounge/lounge/pull/765) by [@PolarizedIons](https://github.com/PolarizedIons))
- Add support for hexip ilines and fix storing client IP address in configuration file ([#749](https://github.com/thelounge/lounge/pull/749) and [#822](https://github.com/thelounge/lounge/pull/822) by [@xPaw](https://github.com/xPaw))
- Implement `/away` and `/back` commands ([#745](https://github.com/thelounge/lounge/pull/745) by [@xPaw](https://github.com/xPaw))
- Remind channel name or nick in input placeholder ([#832](https://github.com/thelounge/lounge/pull/832) and [#889](https://github.com/thelounge/lounge/pull/889) by [@astorije](https://github.com/astorije))
- Add human-readable idle time in whois info ([#721](https://github.com/thelounge/lounge/pull/721) by [@astorije](https://github.com/astorije))
- Option to log raw IRC traffic ([#783](https://github.com/thelounge/lounge/pull/783) by [@astorije](https://github.com/astorije))

### Changed

- Improve support for opening multiple clients at once ([#636](https://github.com/thelounge/lounge/pull/636) by [@xPaw](https://github.com/xPaw))
- Match window title border line to text color ([#716](https://github.com/thelounge/lounge/pull/716) by [@xPaw](https://github.com/xPaw))
- Focus input after chat form submit ([#483](https://github.com/thelounge/lounge/pull/483) by [@williamboman](https://github.com/williamboman))
- Refactor user autoload to use `fs.watch` and make it more transparent in the app ([#751](https://github.com/thelounge/lounge/pull/751) by [@xPaw](https://github.com/xPaw) and [#779](https://github.com/thelounge/lounge/pull/779) by [@astorije](https://github.com/astorije))
- Sync reordering of channels/networks to other clients in real-time ([#757](https://github.com/thelounge/lounge/pull/757) by [@PolarizedIons](https://github.com/PolarizedIons))
- Do not accept empty password when adding new user ([#795](https://github.com/thelounge/lounge/pull/795) by [@MaxLeiter](https://github.com/MaxLeiter))
- Stop refreshing the page on every socket.io error ([#784](https://github.com/thelounge/lounge/pull/784) by [@xPaw](https://github.com/xPaw))
- Only append "says" to notifications if it is a message ([#805](https://github.com/thelounge/lounge/pull/805) by [@xPaw](https://github.com/xPaw))
- Allow user search to find a pattern anywhere in the nicks ([#855](https://github.com/thelounge/lounge/pull/855) by [@MaxLeiter](https://github.com/MaxLeiter))

### Removed

- Remove browser notification polyfill and inform user when unsupported ([#709](https://github.com/thelounge/lounge/pull/709) by [@astorije](https://github.com/astorije))
- Remove erroneous classname from password field ([#748](https://github.com/thelounge/lounge/pull/748) by [@xPaw](https://github.com/xPaw))
- Do not dismiss native web notifications programmatically after 5s ([#739](https://github.com/thelounge/lounge/pull/739) by [@williamboman](https://github.com/williamboman))

### Fixed

- Fix `/mode` command to correctly assume target ([#679](https://github.com/thelounge/lounge/pull/679) by [@xPaw](https://github.com/xPaw))
- Fix crash when LDAP server is unreachable ([#697](https://github.com/thelounge/lounge/pull/697) by [@gramakri](https://github.com/gramakri))
- Fix channels behaving strangely while dragging ([#697](https://github.com/thelounge/lounge/pull/697) by [@PolarizedIons](https://github.com/PolarizedIons))
- Fix unread counters resetting when they should not ([#720](https://github.com/thelounge/lounge/pull/720) by [@PolarizedIons](https://github.com/PolarizedIons))
- Silence failures to trigger notifications when not available ([#732](https://github.com/thelounge/lounge/pull/732) by [@astorije](https://github.com/astorije))
- Avoid unnecessary disk writes when saving user ([#750](https://github.com/thelounge/lounge/pull/750) by [@xPaw](https://github.com/xPaw))
- Use correct channel when pushing link prefetch messages ([#782](https://github.com/thelounge/lounge/pull/782) by [@xPaw](https://github.com/xPaw))
- Correctly remove closed sockets from oident file, remove unused functions ([#753](https://github.com/thelounge/lounge/pull/753) by [@xPaw](https://github.com/xPaw))
- Do not automatically focus on touch devices ([#801](https://github.com/thelounge/lounge/pull/801) by [@xPaw](https://github.com/xPaw))
- Strip control characters from notifications ([#818](https://github.com/thelounge/lounge/pull/818) by [@xPaw](https://github.com/xPaw))
- Improve CLI a bit (output formatting and subcommand/option bug fix) ([#799](https://github.com/thelounge/lounge/pull/799) and [#868](https://github.com/thelounge/lounge/pull/868) by [@astorije](https://github.com/astorije))
- Make HTML container take the entire screen estate ([#821](https://github.com/thelounge/lounge/pull/821) by [@xPaw](https://github.com/xPaw))
- Fix unread marker being removed from DOM ([#820](https://github.com/thelounge/lounge/pull/820) by [@xPaw](https://github.com/xPaw))
- Remove margin on date marker on smallest screen size ([#830](https://github.com/thelounge/lounge/pull/830) by [@xPaw](https://github.com/xPaw))
- Do not ignore window opens when considering active channels ([#834](https://github.com/thelounge/lounge/pull/834) by [@xPaw](https://github.com/xPaw))
- Calculate menu width on touch start ([#836](https://github.com/thelounge/lounge/pull/836) by [@xPaw](https://github.com/xPaw))
- Increase IRC colors contrast ([#829](https://github.com/thelounge/lounge/pull/829) by [@xPaw](https://github.com/xPaw))
- Do not prefetch URLs unless they are messages or `/me` actions ([#812](https://github.com/thelounge/lounge/pull/812) by [@birkof](https://github.com/birkof))
- Bump `irc-framework` to bring a couple of fixes ([#790](https://github.com/thelounge/lounge/pull/790) by [@astorije](https://github.com/astorije), [#802](https://github.com/thelounge/lounge/pull/802) by [@xPaw](https://github.com/xPaw) and [#852](https://github.com/thelounge/lounge/pull/852) by [Greenkeeper](https://greenkeeper.io/))

### Security

- Change bcrypt rounds from 8 to 11 ([#711](https://github.com/thelounge/lounge/pull/711) by [@xPaw](https://github.com/xPaw))

### Documentation

In the main repository:

- Warn against running from source as root in README ([#725](https://github.com/thelounge/lounge/pull/725) by [@astorije](https://github.com/astorije))
- Add screenshot to README ([#694](https://github.com/thelounge/lounge/pull/694) by [@MaxLeiter](https://github.com/MaxLeiter))
- Simplify introduction on README ([#789](https://github.com/thelounge/lounge/pull/789) by [@astorije](https://github.com/astorije))

On the website:

- Remove distribution-specific install instructions of Node.js ([#49](https://github.com/thelounge/thelounge.github.io/pull/49) by [@astorije](https://github.com/astorije))
- Remove wrong information about setting up password along with creating a user ([#50](https://github.com/thelounge/thelounge.github.io/pull/50) by [@astorije](https://github.com/astorije))
- Update documentation of the configuration file ([#43](https://github.com/thelounge/thelounge.github.io/pull/43) by [@daftaupe](https://github.com/daftaupe))
- Document the `/away` and `/back` commands ([#59](https://github.com/thelounge/thelounge.github.io/pull/59) by [@drkitty](https://github.com/drkitty))

### Internals

- Fix AppVeyor cache never being successfully built and unblock AppVeyor ([#700](https://github.com/thelounge/lounge/pull/700) by [@astorije](https://github.com/astorije) and [#755](https://github.com/thelounge/lounge/pull/755) by [@IlyaFinkelshteyn](https://github.com/IlyaFinkelshteyn))
- Add a simple (first) test for `localetime` Handlebars helper ([#703](https://github.com/thelounge/lounge/pull/703) by [@astorije](https://github.com/astorije))
- Get rid of OSX CI builds until they get much faster ([#707](https://github.com/thelounge/lounge/pull/707) by [@astorije](https://github.com/astorije))
- Update badges in README ([#713](https://github.com/thelounge/lounge/pull/713) by [@xPaw](https://github.com/xPaw) and [#780](https://github.com/thelounge/lounge/pull/780) by [@astorije](https://github.com/astorije))
- Add Node.js v7, current stable, to Travis CI ([#800](https://github.com/thelounge/lounge/pull/800) by [@astorije](https://github.com/astorije))
- Use Webpack to build our client code and dependencies ([#640](https://github.com/thelounge/lounge/pull/640) by [@nornagon](https://github.com/nornagon) and [#817](https://github.com/thelounge/lounge/pull/817) by [@xPaw](https://github.com/xPaw))
- Switch `istanbul` code coverage CLI to more recent `nyc` one ([#850](https://github.com/thelounge/lounge/pull/850) by [@astorije](https://github.com/astorije))
- Add web server tests ([#838](https://github.com/thelounge/lounge/pull/838) by [@xPaw](https://github.com/xPaw))
- Fix stuff that breaks in jQuery 3 ([#854](https://github.com/thelounge/lounge/pull/854) by [@xPaw](https://github.com/xPaw))
- Do not uglify builds when running start-dev ([#858](https://github.com/thelounge/lounge/pull/858) by [@xPaw](https://github.com/xPaw))
- Update dependencies to latest stable versions ([#746](https://github.com/thelounge/lounge/pull/746) by [@xPaw](https://github.com/xPaw))
- Update dependencies to enable Greenkeeper 🌴 ([#826](https://github.com/thelounge/lounge/pull/826) by [Greenkeeper](https://greenkeeper.io/))
- Update `lodash` to the latest version 🚀 ([#840](https://github.com/thelounge/lounge/pull/840) and [#862](https://github.com/thelounge/lounge/pull/862) by [Greenkeeper](https://greenkeeper.io/))
- Update `stylelint` to the latest version 🚀 ([#861](https://github.com/thelounge/lounge/pull/861) by [Greenkeeper](https://greenkeeper.io/))
- Update `npm-run-all` to the latest version 🚀 ([#860](https://github.com/thelounge/lounge/pull/860) by [Greenkeeper](https://greenkeeper.io/))
- Update `eslint` to the latest version 🚀 ([#875](https://github.com/thelounge/lounge/pull/875) by [Greenkeeper](https://greenkeeper.io/))
- Update `babel-core` to the latest version 🚀 ([#883](https://github.com/thelounge/lounge/pull/883) by [Greenkeeper](https://greenkeeper.io/))

## v2.1.0 - 2016-10-17

[See the full changelog](https://github.com/thelounge/lounge/compare/v2.0.1...v2.1.0)

Here comes another release with some nice additions!

While the administrators will notice some bug fixes, most of the changes are client-side: support for `/list`, a slideout menu on mobile, editing one's nick from the UI, wallops message handling.

Enjoy!

### Added

- Implement `/list` ([#258](https://github.com/thelounge/lounge/pull/258) by [@maxpoulin64](https://github.com/maxpoulin64))
- Add touch slideout menu for mobile ([#400](https://github.com/thelounge/lounge/pull/400) by [@maxpoulin64](https://github.com/maxpoulin64))
- Display extra steps when loading the app ([#637](https://github.com/thelounge/lounge/pull/637) by [@xPaw](https://github.com/xPaw))
- Display localized timestamp in title of message times ([#660](https://github.com/thelounge/lounge/pull/660) by [@astorije](https://github.com/astorije))
- Changing nick in the UI ([#551](https://github.com/thelounge/lounge/pull/551) by [@astorije](https://github.com/astorije))
- Add hostmasks in logs when possible ([#670](https://github.com/thelounge/lounge/pull/670) by [@astorije](https://github.com/astorije))
- Display wallops in server window ([#658](https://github.com/thelounge/lounge/pull/658) by [@xPaw](https://github.com/xPaw))

### Changed

- Make use of multi-prefix cap and remove NAMES spam on mode changes ([#632](https://github.com/thelounge/lounge/pull/632) by [@xPaw](https://github.com/xPaw))
- Strict mode for all JS files ([#684](https://github.com/thelounge/lounge/pull/684) by [@astorije](https://github.com/astorije))
- Enforce more ESLint rules ([#681](https://github.com/thelounge/lounge/pull/681) by [@xPaw](https://github.com/xPaw))
- Use CI caches for downloaded files instead of installed ones ([#687](https://github.com/thelounge/lounge/pull/687) by [@astorije](https://github.com/astorije))
- Consolidate version numbers throughout all interfaces  ([#592](https://github.com/thelounge/lounge/pull/592) by [@williamboman](https://github.com/williamboman))
- Replace lodash's each/map with ES5 native forEach/map ([#689](https://github.com/thelounge/lounge/pull/689) by [@astorije](https://github.com/astorije))

### Removed

- Remove all font files except WOFF ([#682](https://github.com/thelounge/lounge/pull/682) by [@xPaw](https://github.com/xPaw))

### Fixed

- Themes: Fixed CSS rule selectors for highlight messages ([#652](https://github.com/thelounge/lounge/pull/652) by [@DamonGant](https://github.com/DamonGant))
- Fix unhandled message color in default and Crypto themes ([#653](https://github.com/thelounge/lounge/pull/653) by [@MaxLeiter](https://github.com/MaxLeiter))
- Check if SSL key and certificate files exist ([#673](https://github.com/thelounge/lounge/pull/673) by [@toXel](https://github.com/toXel))
- Fix loading fonts in Microsoft Edge ([#683](https://github.com/thelounge/lounge/pull/683) by [@xPaw](https://github.com/xPaw))
- Fill in prefixLookup on network initialization ([#647](https://github.com/thelounge/lounge/pull/647) by [@nornagon](https://github.com/nornagon))
- Fix nick changes not being properly reported in the logs ([#685](https://github.com/thelounge/lounge/pull/685) by [@astorije](https://github.com/astorije))
- Fix memory and reference shuffling when creating models ([#664](https://github.com/thelounge/lounge/pull/664) by [@xPaw](https://github.com/xPaw))

## v2.0.1 - 2016-09-28

[See the full changelog](https://github.com/thelounge/lounge/compare/v2.0.0...v2.0.1)

This is a minor house-keeping release with mostly two sets of changes.

First, a few bugs were fixed, including one simply preventing The Lounge to run in Safari's private browsing.

Additionally, the developer experience has been made a tiny bit better, with better documentation, lighter dependencies and simpler theme creation.

### Changed

- Add info on README about how to run from source, how to upgrade ([#621](https://github.com/thelounge/lounge/pull/621) by [@astorije](https://github.com/astorije))
- Move uglify invocation into npm scripts and remove grunt ([#628](https://github.com/thelounge/lounge/pull/628) by [@nornagon](https://github.com/nornagon))
- Move Shout theme borders to example theme ([#359](https://github.com/thelounge/lounge/pull/359) by [@xPaw](https://github.com/xPaw))
- Update developer dependencies ([#639](https://github.com/thelounge/lounge/pull/639) by [@xPaw](https://github.com/xPaw))

### Fixed

- Remove -ms-transform and add missed -webkit-transform ([#629](https://github.com/thelounge/lounge/pull/629) by [@xPaw](https://github.com/xPaw))
- Ensure localStorage cannot fail because of quota or Safari private browsing ([#625](https://github.com/thelounge/lounge/pull/625) by [@astorije](https://github.com/astorije))
- Disable pull-to-refresh on mobile that conflicts with scrolling the message list ([#618](https://github.com/thelounge/lounge/pull/618) by [@astorije](https://github.com/astorije))
- Handle stderr when using edit or config command ([#622](https://github.com/thelounge/lounge/pull/622) by [@MaxLeiter](https://github.com/MaxLeiter))

## v2.0.0 - 2016-09-24

[See the full changelog](https://github.com/thelounge/lounge/compare/v1.5.0...v2.0.0)

After more than 5 months in the works, v2.0.0 is finally happening, and it's shipping with lots of new and enhanced features! 🎉

First of all, the backend IRC library is completely different, which was the first step to deciding on a major release.
This change brings many improvements and fixes, including support for auto-reconnection! This also allows us to easily improve our [IRCv3 compliance](http://ircv3.net/software/clients.html#web-clients).

Main changes on the server include support for WEBIRC, oidentd and LDAP. On the client, users will notice a lot of improvements about reporting unseen activity (notifications, markers, etc.), support for custom highlights, a new loading page, an auto-expanding message input, a theme selector, and more.

Administrators should note that the channel list format in user configuration files has changed. The old format is deprecated, but it will be automatically converted when the server starts (support may or may not be removed later). Additionally, The Lounge now only runs on Node v4 and up.

The above is only a small subset of changes. A more detailed list can be found below.
The following list features the most noticeable changes only, and more details can be found on all [v2.0.0 pre-releases](https://www.github.com/thelounge/lounge/releases).

### Added

- Add tooltips on every clickable icons ([#540](https://github.com/thelounge/lounge/pull/540) by [@astorije](https://github.com/astorije))
- Add debug config option for `irc-framework` debug log ([#547](https://github.com/thelounge/lounge/pull/547) by [@maxpoulin64](https://github.com/maxpoulin64))
- Client-side theme selector ([#568](https://github.com/thelounge/lounge/pull/568) by [@astorije](https://github.com/astorije))
- LDAP support ([#477](https://github.com/thelounge/lounge/pull/477) by [@thisisdarshan](https://github.com/thisisdarshan) and [@lindskogen](https://github.com/lindskogen))
- Add custom highlights ([#425](https://github.com/thelounge/lounge/pull/425) by [@YaManicKill](https://github.com/YaManicKill))
- Add auto-grow textarea support ([#379](https://github.com/thelounge/lounge/pull/379) by [@maxpoulin64](https://github.com/maxpoulin64))
- Display unhandled numerics on the client ([#286](https://github.com/thelounge/lounge/pull/286) by [@xPaw](https://github.com/xPaw))
- A proper unread marker ([#332](https://github.com/thelounge/lounge/pull/332) by [@xPaw](https://github.com/xPaw))
- Add information on the About section of the client ([#497](https://github.com/thelounge/lounge/pull/497) by [@astorije](https://github.com/astorije))
- Add a red dot to the mobile menu icon when being notified ([#486](https://github.com/thelounge/lounge/pull/486) by [@astorije](https://github.com/astorije))
- Add "The Lounge" label to the landing pages ([#487](https://github.com/thelounge/lounge/pull/487) by [@astorije](https://github.com/astorije))
- Display network name on Connect page when network is locked and info is hidden ([#488](https://github.com/thelounge/lounge/pull/488) by [@astorije](https://github.com/astorije))
- Display a loading message instead of blank page ([#386](https://github.com/thelounge/lounge/pull/386) by [@xPaw](https://github.com/xPaw))
- Fall back to LOUNGE_HOME env variable when using the CLI ([#402](https://github.com/thelounge/lounge/pull/402) by [@williamboman](https://github.com/williamboman))
- Enable auto reconnection ([#254](https://github.com/thelounge/lounge/pull/254) by [@xPaw](https://github.com/xPaw))
- Add "!" modechar for admin ([#354](https://github.com/thelounge/lounge/pull/354) by [@omnicons](https://github.com/omnicons))
- Add support for oidentd spoofing ([#256](https://github.com/thelounge/lounge/pull/256) by [@maxpoulin64](https://github.com/maxpoulin64))
- Log enabled capabilities ([#272](https://github.com/thelounge/lounge/pull/272) by [@xPaw](https://github.com/xPaw))
- Add support for `~` home folder expansion ([#284](https://github.com/thelounge/lounge/pull/284) by [@maxpoulin64](https://github.com/maxpoulin64))
- Document supported node version ([#280](https://github.com/thelounge/lounge/pull/280) by [@xPaw](https://github.com/xPaw))
- Implement WEBIRC ([#240](https://github.com/thelounge/lounge/pull/240) by [@maxpoulin64](https://github.com/maxpoulin64))
- Add `manifest.json` for nicer mobile experience ([#310](https://github.com/thelounge/lounge/pull/310) by [@xPaw](https://github.com/xPaw))

### Changed

- Cache loaded config and merge it with defaults ([#387](https://github.com/thelounge/lounge/pull/387) by [@xPaw](https://github.com/xPaw))
- Ignore unnecessary files at release time ([#499](https://github.com/thelounge/lounge/pull/499) by [@astorije](https://github.com/astorije))
- Improve font icon management, sizing and sharpness ([#493](https://github.com/thelounge/lounge/pull/493) by [@astorije](https://github.com/astorije))
- Maintain scroll position after loading previous messages ([#496](https://github.com/thelounge/lounge/pull/496) by [@davibe](https://github.com/davibe))
- Perform node version check as soon as possible ([#409](https://github.com/thelounge/lounge/pull/409) by [@xPaw](https://github.com/xPaw))
- Prepend http protocol to www. links in chat ([#410](https://github.com/thelounge/lounge/pull/410) by [@xPaw](https://github.com/xPaw))
- Change default configuration for `host` to allow OS to decide and use both IPv4 and IPv6 ([#432](https://github.com/thelounge/lounge/pull/432) by [@maxpoulin64](https://github.com/maxpoulin64))
- Do not hide timestamps on small viewports ([#376](https://github.com/thelounge/lounge/pull/376) by [@xPaw](https://github.com/xPaw))
- Drop `slate-irc`, switch to `irc-framework` ([#167](https://github.com/thelounge/lounge/pull/167) by [@xPaw](https://github.com/xPaw))
- Improve sticky scroll ([#262](https://github.com/thelounge/lounge/pull/262) by [@xPaw](https://github.com/xPaw))
- Minor wording changes for better clarity ([#305](https://github.com/thelounge/lounge/pull/305) by [@astorije](https://github.com/astorije))
- Improve nick highlights ([#327](https://github.com/thelounge/lounge/pull/327) by [@xPaw](https://github.com/xPaw))
- CSS classes in themes for nick colors ([#325](https://github.com/thelounge/lounge/pull/325) by [@astorije](https://github.com/astorije))
- Replace all concatenated paths with Node's path.join ([#307](https://github.com/thelounge/lounge/pull/307) by [@astorije](https://github.com/astorije))

### Deprecated

- Store channels in array format in user configuration files, deprecating previous format ([#417](https://github.com/thelounge/lounge/pull/417) by [@xPaw](https://github.com/xPaw))

### Removed

- Disable tooltips on mobile to prevent them to stay after clicking ([#612](https://github.com/thelounge/lounge/pull/612) by [@astorije](https://github.com/astorije))
- Remove Docker-related files now that we have a dedicated repository ([#288](https://github.com/thelounge/lounge/pull/288) by [@astorije](https://github.com/astorije))
- Remove JavaScript scrollbar library ([#429](https://github.com/thelounge/lounge/pull/429) by [@xPaw](https://github.com/xPaw))
- Remove navigator.standalone detection ([#427](https://github.com/thelounge/lounge/pull/427) by [@xPaw](https://github.com/xPaw))
- Do not increase font size on highlight in morning theme ([#321](https://github.com/thelounge/lounge/pull/321) by [@xPaw](https://github.com/xPaw))

### Fixed

- Remove font family redundancy, fix missed fonts, remove Open Sans ([#562](https://github.com/thelounge/lounge/pull/562) by [@astorije](https://github.com/astorije))
- Stop propagation when hiding the chat through click/tapping the chat ([#455](https://github.com/thelounge/lounge/pull/455) by [@williamboman](https://github.com/williamboman))
- Improve click handling on users and inline channels ([#366](https://github.com/thelounge/lounge/pull/366) by [@xPaw](https://github.com/xPaw))
- Only load config if it exists ([#461](https://github.com/thelounge/lounge/pull/461) by [@xPaw](https://github.com/xPaw))
- Send user to lobby of deleted chan when parting from active chan ([#489](https://github.com/thelounge/lounge/pull/489) by [@astorije](https://github.com/astorije))
- Set title attribute on topic on initial page load ([#515](https://github.com/thelounge/lounge/pull/515) by [@williamboman](https://github.com/williamboman))
- Save user's channels when they sort the channel list ([#401](https://github.com/thelounge/lounge/pull/401) by [@xPaw](https://github.com/xPaw))
- Turn favicon red on page load if there are highlights ([#344](https://github.com/thelounge/lounge/pull/344) by [@xPaw](https://github.com/xPaw))
- Keep chat stickied to the bottom on resize ([#346](https://github.com/thelounge/lounge/pull/346) by [@maxpoulin64](https://github.com/maxpoulin64))
- Only increase unread counter for whitelisted actions ([#273](https://github.com/thelounge/lounge/pull/273) by [@xPaw](https://github.com/xPaw))
- Parse CTCP replies ([#278](https://github.com/thelounge/lounge/pull/278) by [@xPaw](https://github.com/xPaw))
- Do not count your own messages as unread ([#279](https://github.com/thelounge/lounge/pull/279) by [@xPaw](https://github.com/xPaw))
- Do not display incorrect nick when switching to a non connected network ([#252](https://github.com/thelounge/lounge/pull/252) by [@xPaw](https://github.com/xPaw))
- Keep autocompletion sort whenever user list updates ([#217](https://github.com/thelounge/lounge/pull/217) by [@xPaw](https://github.com/xPaw))
- Save user when parting channels ([#297](https://github.com/thelounge/lounge/pull/297) by [@xPaw](https://github.com/xPaw))
- Add labels in connect window ([#300](https://github.com/thelounge/lounge/pull/300) by [@xPaw](https://github.com/xPaw))
- Add missing `aria-label` on icon buttons ([#303](https://github.com/thelounge/lounge/pull/303) by [@astorije](https://github.com/astorije))
- Fix missing colors in action messages ([#317](https://github.com/thelounge/lounge/pull/317) by [@astorije](https://github.com/astorije))
- Don't falsely report failed write if it didn't fail ([`e6990e0`](https://github.com/thelounge/lounge/commit/e6990e0fc7641d18a5bcbabddca1aacf2254ae52) by [@xPaw](https://github.com/xPaw))
- Fix sending messages starting with a space ([#320](https://github.com/thelounge/lounge/pull/320) by [@maxpoulin64](https://github.com/maxpoulin64))
- Fix notifications in query windows ([#334](https://github.com/thelounge/lounge/pull/334) by [@xPaw](https://github.com/xPaw))

### Security

- Implement user token persistency ([#370](https://github.com/thelounge/lounge/pull/370) by [@xPaw](https://github.com/xPaw))
- Restrict access to the home directory by default ([#205](https://github.com/thelounge/lounge/pull/205) by [@maxpoulin64](https://github.com/maxpoulin64))
- Add security headers to minimize XSS damage ([#292](https://github.com/thelounge/lounge/pull/292) by [@xPaw](https://github.com/xPaw))
- Do not write user configs outside of the app's users directory ([#238](https://github.com/thelounge/lounge/pull/238) by [@williamboman](https://github.com/williamboman))
- Don't check for existing password emptiness ([#315](https://github.com/thelounge/lounge/pull/315) by [@maxpoulin64](https://github.com/maxpoulin64))

## v2.0.0-rc.2 - 2016-09-21 [Pre-release]

[See the full changelog](https://github.com/thelounge/lounge/compare/v2.0.0-rc.1...v2.0.0-rc.2)

This release candidate only fixes a UI bug affecting iOS 8 users, introduced in v2.0.0-pre.5.

### Fixed

- Fix flexboxes to work on iOS 8 ([#626](https://github.com/thelounge/lounge/pull/626) by [@Gilles123](https://github.com/Gilles123))

## v2.0.0-rc.1 - 2016-09-17 [Pre-release]

[See the full changelog](https://github.com/thelounge/lounge/compare/v2.0.0-pre.7...v2.0.0-rc.1)

Prior to this release, users of Safari 10 were not able to access The Lounge anymore, because of a conscious change the WebKit made to their support of CSP, as [explained here](https://webkit.org/blog/6830/a-refined-content-security-policy/). This release addresses this issue.

Another notable change is the removal of tooltips on mobiles, as hovering states on mobile devices breaks in different kind of ways. Hopefully there will be a better solution in the future, or better support across mobiles.

This is also the first release candidate for v2.0.0. This means only critical bug fixes will be merged before releasing v2.0.0.

### Changed

- Explicitly authorize websockets in CSP header ([#597](https://github.com/thelounge/lounge/pull/597) by [@astorije](https://github.com/astorije))

### Removed

- Disable tooltips on mobile to prevent them to stay after clicking ([#612](https://github.com/thelounge/lounge/pull/612) by [@astorije](https://github.com/astorije))

### Fixed

- Fix small input text on Morning and Zenburn ([#601](https://github.com/thelounge/lounge/pull/601) by [@astorije](https://github.com/astorije))
- Fix a left margin appearing on all non-default themes ([#615](https://github.com/thelounge/lounge/pull/615) by [@astorije](https://github.com/astorije))

## v2.0.0-pre.7 - 2016-09-08 [Pre-release]

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

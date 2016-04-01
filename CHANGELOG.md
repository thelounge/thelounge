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

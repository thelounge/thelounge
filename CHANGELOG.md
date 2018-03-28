# Change Log

All notable changes to this project will be documented in this file.

<!-- New entries go after this line -->

## v3.0.0-pre.5 - 2018-03-28 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.0.0-pre.4...v3.0.0-pre.5)

This is a pre-release for v3.0.0 to offer latest changes without having to wait for a stable release.
 At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v3.0.0-pre.4 - 2018-03-27 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.0.0-pre.3...v3.0.0-pre.4)

This is a pre-release for v3.0.0 to offer latest changes without having to wait for a stable release.
 At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v3.0.0-pre.3 - 2018-03-08 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.0.0-pre.2...v3.0.0-pre.3)

This is a pre-release for v3.0.0 to offer latest changes without having to wait for a stable release.
 At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v3.0.0-pre.2 - 2018-03-03 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.0.0-pre.1...v3.0.0-pre.2)

This is a pre-release for v3.0.0 to offer latest changes without having to wait for a stable release.
 At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v3.0.0-pre.1 - 2018-02-21 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.7.1...v3.0.0-pre.1)

This is a pre-release for v3.0.0 to offer latest changes without having to wait for a stable release.
 At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.7.1 - 2018-02-18

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v2.7.0...v2.7.1) and [milestone](https://github.com/thelounge/thelounge/milestone/29?closed=1).

This releases mainly fixes bugs that were introduced by previous versions, and comes with very minor improvements to the UI. Among other things, we fixed the unread markers showing multiple times, which in turn fixes memory leaks when keeping The Lounge open for long periods of time (e.g. overnight).

This simply ensures we did not leave any unattended bugs before going for The Lounge v3.

### Changed

- Autocomplete channels on the current network ([#1993](https://github.com/thelounge/thelounge/pull/1993) by [@milindl](https://github.com/milindl))
- Set `decoding="async"` on image previews ([#1924](https://github.com/thelounge/thelounge/pull/1924) by [@xPaw](https://github.com/xPaw))
- Add tooltip to channel close button ([#1856](https://github.com/thelounge/thelounge/pull/1856) by [@MaxLeiter](https://github.com/MaxLeiter))
- Show channel name on channel-related errors ([#1933](https://github.com/thelounge/thelounge/pull/1933) by [@RockyTV](https://github.com/RockyTV))
- Display password field when `displayNetwork` is false ([#2066](https://github.com/thelounge/thelounge/pull/2066) by [@xPaw](https://github.com/xPaw))
- Update production dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `semver` ([#1985](https://github.com/thelounge/thelounge/pull/1985))
  - `primer-tooltips` ([#1988](https://github.com/thelounge/thelounge/pull/1988))
  - `lodash` ([#2032](https://github.com/thelounge/thelounge/pull/2032))
  - `commander` ([#2038](https://github.com/thelounge/thelounge/pull/2038), [#2041](https://github.com/thelounge/thelounge/pull/2041))
  - `urijs` ([#2053](https://github.com/thelounge/thelounge/pull/2053))
  - `mime-types` ([#2067](https://github.com/thelounge/thelounge/pull/2067))

### Fixed

- Prevent user context menu from opening while selecting text ([#1955](https://github.com/thelounge/thelounge/pull/1955) by [@xPaw](https://github.com/xPaw))
- Fix timestamp tooltips not aligning correctly with timestamps ([#1999](https://github.com/thelounge/thelounge/pull/1999) by [@astorije](https://github.com/astorije))
- Set `start_url` in `manifest.json` so that The Lounge always opens the correct window ([#2010](https://github.com/thelounge/thelounge/pull/2010) by [@xPaw](https://github.com/xPaw))
- Do not statically serve the index template prior to rendering it ([#1979](https://github.com/thelounge/thelounge/pull/1979) by [@astorije](https://github.com/astorije))
- Persist query windows between server restarts ([#2019](https://github.com/thelounge/thelounge/pull/2019) by [@McInkay](https://github.com/McInkay))
- Preload preview images before appending them to DOM ([#1925](https://github.com/thelounge/thelounge/pull/1925) by [@xPaw](https://github.com/xPaw))
- Fix `textcomplete` reference in `autocompletion.disable` ([#2023](https://github.com/thelounge/thelounge/pull/2023) by [@xPaw](https://github.com/xPaw))
- Send visible defaults when `displayNetwork` is `false` ([#2025](https://github.com/thelounge/thelounge/pull/2025) by [@xPaw](https://github.com/xPaw))
- Wait for server response when parting channels ([#2020](https://github.com/thelounge/thelounge/pull/2020) by [@xPaw](https://github.com/xPaw))
- Fix auto-open media option not working ([#2027](https://github.com/thelounge/thelounge/pull/2027) by [@xPaw](https://github.com/xPaw))
- Do not block `/join` command from being sent ([#2013](https://github.com/thelounge/thelounge/pull/2013) by [@xPaw](https://github.com/xPaw))
- Define which message types should not be logged ([#2022](https://github.com/thelounge/thelounge/pull/2022) by [@xPaw](https://github.com/xPaw))
- Fix messages not being condensed correctly ([#2030](https://github.com/thelounge/thelounge/pull/2030) by [@xPaw](https://github.com/xPaw))
- Fix queries going to lobby if the network name matches user name ([#2037](https://github.com/thelounge/thelounge/pull/2037) by [@xPaw](https://github.com/xPaw))
- Fix default theme not being correct ([#2033](https://github.com/thelounge/thelounge/pull/2033) by [@xPaw](https://github.com/xPaw))
- Fix duplicate chat containers and unread markers when reconnecting ([#2039](https://github.com/thelounge/thelounge/pull/2039) by [@xPaw](https://github.com/xPaw))
- Fix crash when hostname is changed in lockNetwork mode ([#2042](https://github.com/thelounge/thelounge/pull/2042) by [@xPaw](https://github.com/xPaw))
- Still render link previews if image fails to load ([#2043](https://github.com/thelounge/thelounge/pull/2043) by [@xPaw](https://github.com/xPaw))
- Make sure packages can be referenced in subfolders ([#2045](https://github.com/thelounge/thelounge/pull/2045) by [@xPaw](https://github.com/xPaw))
- Ensure packages loaded are directories ([#2035](https://github.com/thelounge/thelounge/pull/2035) by [@astorije](https://github.com/astorije), [#2060](https://github.com/thelounge/thelounge/pull/2060) by [@xPaw](https://github.com/xPaw))
- Fix border after nickname not taking full height ([#2055](https://github.com/thelounge/thelounge/pull/2055) by [@xPaw](https://github.com/xPaw))
- Provide exact version into `npm install` command ([#2063](https://github.com/thelounge/thelounge/pull/2063) by [@xPaw](https://github.com/xPaw))
- Track channel state to allow removing channels user is not in ([#2058](https://github.com/thelounge/thelounge/pull/2058) by [@xPaw](https://github.com/xPaw))
- Allow scaling the page ([#1910](https://github.com/thelounge/thelounge/pull/1910) by [@xPaw](https://github.com/xPaw))
- Fix `bind` not being passed to `irc-framework` ([#2071](https://github.com/thelounge/thelounge/pull/2071) by [@xPaw](https://github.com/xPaw))

### Security

- Allow stylesheets to be served behind HTTPS in CSP rules ([#2014](https://github.com/thelounge/thelounge/pull/2014) by [@McInkay](https://github.com/McInkay))

### Internals

- Build template list at Webpack time instead of manually keeping this in sync with the views folders ([#1931](https://github.com/thelounge/thelounge/pull/1931) by [@astorije](https://github.com/astorije))
- Remove deprecated jQuery calls ([#2015](https://github.com/thelounge/thelounge/pull/2015) by [@xPaw](https://github.com/xPaw))
- Unbind image events after the image is loaded ([#2047](https://github.com/thelounge/thelounge/pull/2047) by [@xPaw](https://github.com/xPaw))
- Use forked ldapjs to remove dtrace ([#2021](https://github.com/thelounge/thelounge/pull/2021) by [@xPaw](https://github.com/xPaw))
- Update development dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `eslint` ([#1992](https://github.com/thelounge/thelounge/pull/1992), [#2029](https://github.com/thelounge/thelounge/pull/2029), [#2068](https://github.com/thelounge/thelounge/pull/2068))
  - `mocha` ([#1989](https://github.com/thelounge/thelounge/pull/1989), [#2061](https://github.com/thelounge/thelounge/pull/2061))
  - `jquery` ([#1994](https://github.com/thelounge/thelounge/pull/1994))
  - `copy-webpack-plugin` ([#2046](https://github.com/thelounge/thelounge/pull/2046), [#2048](https://github.com/thelounge/thelounge/pull/2048))
  - `webpack` ([#2052](https://github.com/thelounge/thelounge/pull/2052))
  - `stylelint-config-standard` ([#2070](https://github.com/thelounge/thelounge/pull/2070))

## v2.7.0 - 2018-01-28

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v2.6.0...v2.7.0) and [milestone](https://github.com/thelounge/thelounge/milestone/27?closed=1).

The Lounge v2.7.0 is out, and it's a big one! Here is a shortlist of the most notable additions and changes, but as usual, a comprehensive list is available below.

It is now possible to join a channel directly from the UI:

<p align="center">
  <img width="187" alt="A tooltip saying Join a channel shows up when hovering the + next to a network name in the channel list" src="https://user-images.githubusercontent.com/113730/35205922-f5662fc6-ff06-11e7-8b33-2f76354eff51.png"> <img width="192" alt="A form lets the user type a channel name, an optional password, which can then be joined by clicking the submit button" src="https://user-images.githubusercontent.com/113730/35205923-f57147e4-ff06-11e7-942b-5bce2c2d3e78.png">
  <br>
  <em>The <kbd>+</kbd> button next to any network opens a form to join a channel.</em>
</p>

Nicks mentioned in messages are now clickable:

<p align="center">
  <img width="385" alt="A user mentions someone else's nick in a message, which is now clickable and takes the user's color" src="https://user-images.githubusercontent.com/113730/35206011-8cbc48ec-ff07-11e7-8969-8305a0501d24.png">
</p>

Context menu actions have been improved, and new actions have been added:

<p align="center">
  <img width="186" alt="Available actions in user context menu: User information, Direct messages, Kick" src="https://user-images.githubusercontent.com/113730/35206072-f29768e0-ff07-11e7-993f-10668751053e.png"> <img width="184" alt="Available actions in channel context menu: List banned users, Leave" src="https://user-images.githubusercontent.com/113730/35206073-f2a45424-ff07-11e7-897e-a94b64339bf9.png"> <img width="186" alt="Available actions in network context menu: List all channels, Join a channel, Disconnect" src="https://user-images.githubusercontent.com/113730/35206074-f2af90a0-ff07-11e7-8e19-d818c2c5579c.png">
  <br>
  <em>Available actions on nicks in the chat window, and on channels and networks in the channel list</em>
</p>

A long-awaited feature, it is now possible to add customizable strings when auto-completing nicks at the beginning of a message:

<p align="center">
  <img width="512" alt="When comma+whitespace is set in the Settings, auto-completing nicks will add a comma and a space at the beginning of the message, and a space otherwise" src="https://user-images.githubusercontent.com/113730/35206213-12a904d0-ff09-11e7-9d32-ea68693677f7.gif">
  <br>
  <em>To achieve this, set <code>, </code> in your client settings.</em>
</p>

The user information available when sending the `/whois` command (or clicking the corresponding action in a user context menu) has been enhanced:

<p align="center">
  <img width="620" alt="User information is now displayed as a definition list" src="https://user-images.githubusercontent.com/113730/35206346-09e23230-ff0a-11e7-95b7-c4826aa2f82c.png">
</p>

Message styling now supports strikethrough text, monospace font, and additional colors:

<p align="center">
  <img width="183" alt="'Hello world' in a message, where 'Hello' is striked through, and 'world' is monospace" src="https://user-images.githubusercontent.com/113730/35206448-b5c51d2e-ff0a-11e7-83d6-62375bf7a302.png">
  <br>
  <em>Strikethrough is achieved with <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>S</kbd>. Monospace is achieved with <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>M</kbd>.</em>
</p>

The Help window gains a version checker, to inform you if a new version was released:

<p align="center">
  <img width="595" alt="A version checker says: 'The Lounge v2.7.0 is now available. Read more on GitHub'. There is also a link to release notes of the current version displayed in the UI." src="https://user-images.githubusercontent.com/113730/35206466-db97c1b4-ff0a-11e7-9a39-4aef6c89e628.png">
</p>

By clicking on the "release notes" link that can be seen above, all the details about the current version appear directly in the client:

<p align="center">
  <img width="589" alt="A Release notes page displays the changelog for the current version." src="https://user-images.githubusercontent.com/113730/35206467-dba2ef26-ff0a-11e7-9cd0-f1c813e024e2.png">
</p>

The link previewer now supports WebP images, as well as audio and video links:

<p align="center">
	<img width="537" alt="Big Buck Bunny video on an embedded video player" src="https://user-images.githubusercontent.com/113730/35251930-cd33ca7c-ffab-11e7-8ad2-f274c6b2a11b.png">
</p>

Another noticeable change is the new message alignment in the main chat window, in order to improve visual experience and reduce flickering when loading a page:

<p align="center">
  <img width="553" alt="screen shot 2018-01-21 at 23 53 26" src="https://user-images.githubusercontent.com/113730/35252040-7a65d6fe-ffac-11e7-91f9-bbcdc0e54d50.png">
</p>

There were other changes on the client: accessibility of the application has been improved, notices and errors are now displayed in the current channel (then sent to the corresponding network window when reloading), and many bug fixes.

The Lounge v2.7.0 finally comes with its first package API, letting packages register stylesheets in the client. It is in its very early stage at the moment and is subject to change in future releases, so use it at your own risk. There will not be an official documentation before the API stabilizes in v3, but for more information, [refer to the corresponding PR](https://github.com/thelounge/thelounge/pull/1619).

The CLI has also been improved:

- When a password gets changed using the `reset` command, the new password takes effect immediately, it is not necessary to restart the server anymore.
- A new `uninstall` command has been added to remove themes and packages.
- A new `--config`/`-c` option is available to override entries of the configuration file.

⚠️ This version also comes with a few **deprecations**. All deprecated features are still supported in The Lounge v2.7.0 but be removed from The Lounge v3 (the next version). We recommend upgrading to v2.7.0 **before** upgrading to the future v3, as v2.7.0 will warn you about deprecated configurations in the server output. Those deprecations are:

- Support for Node.js v4 is being removed, making Node.js v6 the oldest version we will support.
- The `LOUNGE_HOME` environment variable is getting replaced with `THELOUNGE_HOME`. Use this in lieu of the deprecated `--home` option as well.
- In the unlikely situation that you are relying on the `.lounge_home` file (mainly useful for package maintainers), it is being renamed to `.thelounge_home`.
- The CLI command is being changed from `lounge` to `thelounge`.
- All options for the `start` command are being removed, replaced with the `--config`/`-c` option mentioned above. For example, `--public` becomes `-c public=true`, `--port 9001` becomes `-c port=9001`, etc.
- Referring to themes in the `theme` option of the configuration file is now done through their name, not their CSS file name.


And finally... **The Lounge has its own logo!** 🎉

<p align="center">
  <img width="1239" alt="The Lounge logos on dark and white backgrounds" src="https://user-images.githubusercontent.com/113730/35253668-ae9604aa-ffb4-11e7-8328-3933b6474c42.png">
</p>

A huge thank you to **Francesca Segantini**, the artist who designed it!
We will start rolling out our new logo in all the relevant places as of The Lounge v3. In the meantime, you can find details about the logo (and stickers!) on [the corresponding issue](https://github.com/thelounge/thelounge/issues/282#issuecomment-360368920).

### Added

- Link and color nicks mentioned in messages  ([#1709](https://github.com/thelounge/thelounge/pull/1709), [#1758](https://github.com/thelounge/thelounge/pull/1758) by [@MaxLeiter](https://github.com/MaxLeiter), [#1779](https://github.com/thelounge/thelounge/pull/1779), [#1901](https://github.com/thelounge/thelounge/pull/1901) by [@xPaw](https://github.com/xPaw))
- Detect `image/webp` as an image ([#1753](https://github.com/thelounge/thelounge/pull/1753) by [@xPaw](https://github.com/xPaw))
- Implement strikethrough and monospace formatting ([#1792](https://github.com/thelounge/thelounge/pull/1792) by [@grissly-man](https://github.com/grissly-man), [#1814](https://github.com/thelounge/thelounge/pull/1814) by [@xPaw](https://github.com/xPaw))
- Add the user's actual IP in the result of `/whois` ([#1788](https://github.com/thelounge/thelounge/pull/1788) by [@PolarizedIons](https://github.com/PolarizedIons))
- Handle `CHGHOST` cap ([#1578](https://github.com/thelounge/thelounge/pull/1578) by [@xPaw](https://github.com/xPaw))
- Handle JavaScript errors while loading ([#1794](https://github.com/thelounge/thelounge/pull/1794) by [@xPaw](https://github.com/xPaw), [#1845](https://github.com/thelounge/thelounge/pull/1845) by [@astorije](https://github.com/astorije))
- Add actions to user context menu ([#1722](https://github.com/thelounge/thelounge/pull/1722) by [@creesch](https://github.com/creesch))
- Add styling for 16-98 colors ([#1831](https://github.com/thelounge/thelounge/pull/1831) by [@xPaw](https://github.com/xPaw))
- Add "Channel list" to network context menu ([#1802](https://github.com/thelounge/thelounge/pull/1802) by [@MaxLeiter](https://github.com/MaxLeiter))
- Support audio file previews ([#1806](https://github.com/thelounge/thelounge/pull/1806) by [@MaxLeiter](https://github.com/MaxLeiter))
- Support video file previews ([#1817](https://github.com/thelounge/thelounge/pull/1817) by [@MaxLeiter](https://github.com/MaxLeiter), [#1904](https://github.com/thelounge/thelounge/pull/1904) by [@astorije](https://github.com/astorije))
- Insert user-configurable string when autocompleting nicks ([#1799](https://github.com/thelounge/thelounge/pull/1799) by [@xPaw](https://github.com/xPaw))
- Add banlist action to channel context menus ([#1858](https://github.com/thelounge/thelounge/pull/1858) by [@YaManicKill](https://github.com/YaManicKill))
- Join a channel from the UI ([#1836](https://github.com/thelounge/thelounge/pull/1836) by [@MaxLeiter](https://github.com/MaxLeiter), [#1881](https://github.com/thelounge/thelounge/pull/1881), [#1882](https://github.com/thelounge/thelounge/pull/1882) by [@astorije](https://github.com/astorije), [#1916](https://github.com/thelounge/thelounge/pull/1916), [#1917](https://github.com/thelounge/thelounge/pull/1917) by [@williamboman](https://github.com/williamboman))
- Changelog viewer and updater checker in the client ([#1327](https://github.com/thelounge/thelounge/pull/1327) by [@xPaw](https://github.com/xPaw), [#1897](https://github.com/thelounge/thelounge/pull/1897) by [@astorije](https://github.com/astorije))
- Add a `thelounge uninstall` command to remove themes and packages ([#1938](https://github.com/thelounge/thelounge/pull/1938), [#1974](https://github.com/thelounge/thelounge/pull/1974) by [@astorije](https://github.com/astorije))
- Add a package API for custom CSS ([#1619](https://github.com/thelounge/thelounge/pull/1619) by [@YaManicKill](https://github.com/YaManicKill), [#1970](https://github.com/thelounge/thelounge/pull/1970) by [@astorije](https://github.com/astorije))

### Changed

- Parse formatting in real name ([#1689](https://github.com/thelounge/thelounge/pull/1689) by [@xPaw](https://github.com/xPaw))
- Use service worker to display notifications if available ([#1580](https://github.com/thelounge/thelounge/pull/1580) by [@xPaw](https://github.com/xPaw))
- Include all available whois info ([#1681](https://github.com/thelounge/thelounge/pull/1681) by [@creesch](https://github.com/creesch), [#1743](https://github.com/thelounge/thelounge/pull/1743) by [@MaxLeiter](https://github.com/MaxLeiter))
- Focus a channel by joining it, refactor user commands #1189 ([#1491](https://github.com/thelounge/thelounge/pull/1491) by [@realies](https://github.com/realies))
- Handle hex colors when cleaning string ([#1731](https://github.com/thelounge/thelounge/pull/1731) by [@xPaw](https://github.com/xPaw))
- Trim channel messages in active channel and when switching channels ([#1738](https://github.com/thelounge/thelounge/pull/1738) by [@xPaw](https://github.com/xPaw))
- Do not keep scroll to bottom in inactive channels ([#1739](https://github.com/thelounge/thelounge/pull/1739) by [@xPaw](https://github.com/xPaw))
- Show notices and errors inline ([#1380](https://github.com/thelounge/thelounge/pull/1380) by [@xPaw](https://github.com/xPaw))
- Ensure passwords are reloaded when updated via CLI ([#1593](https://github.com/thelounge/thelounge/pull/1593) by [@RJacksonm1](https://github.com/RJacksonm1))
- Warn if user configuration being loaded is empty ([#1821](https://github.com/thelounge/thelounge/pull/1821) by [@astorije](https://github.com/astorije))
- Align message container to the bottom ([#1787](https://github.com/thelounge/thelounge/pull/1787) by [@xPaw](https://github.com/xPaw))
- Clear storage folder after successful start and graceful exit ([#1853](https://github.com/thelounge/thelounge/pull/1853) by [@xPaw](https://github.com/xPaw))
- Format whois as a definition list ([#1850](https://github.com/thelounge/thelounge/pull/1850) by [@xPaw](https://github.com/xPaw))
- Rename "Client Settings" into "Settings" in tooltip + cleanup ([#1880](https://github.com/thelounge/thelounge/pull/1880) by [@astorije](https://github.com/astorije))
- Open and focus correct channel when clicking on push notifications ([#1895](https://github.com/thelounge/thelounge/pull/1895) by [@xPaw](https://github.com/xPaw))
- Add screen reader label for custom css textarea ([#1908](https://github.com/thelounge/thelounge/pull/1908) by [@xPaw](https://github.com/xPaw))
- Set `aria-label` on main input ([#1906](https://github.com/thelounge/thelounge/pull/1906) by [@xPaw](https://github.com/xPaw))
- Mute disabled inputs ([#1905](https://github.com/thelounge/thelounge/pull/1905) by [@xPaw](https://github.com/xPaw))
- Update production dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `commander` ([#1736](https://github.com/thelounge/thelounge/pull/1736), [#1763](https://github.com/thelounge/thelounge/pull/1763), [#1963](https://github.com/thelounge/thelounge/pull/1963))
  - `moment` ([#1775](https://github.com/thelounge/thelounge/pull/1775), [#1822](https://github.com/thelounge/thelounge/pull/1822), [#1848](https://github.com/thelounge/thelounge/pull/1848), [#1857](https://github.com/thelounge/thelounge/pull/1857))
  - `web-push` ([#1781](https://github.com/thelounge/thelounge/pull/1781))
  - `irc-framework` ([#1782](https://github.com/thelounge/thelounge/pull/1782), [#1937](https://github.com/thelounge/thelounge/pull/1937))
  - `fs-extra` ([#1798](https://github.com/thelounge/thelounge/pull/1798), [#1826](https://github.com/thelounge/thelounge/pull/1826))
  - `ldapjs` ([#1965](https://github.com/thelounge/thelounge/pull/1965))
  - `primer-tooltips` ([#1923](https://github.com/thelounge/thelounge/pull/1923))

### Deprecated

- Deprecate support of Node.js v4 in preparation of The Lounge v3 ([#1715](https://github.com/thelounge/thelounge/pull/1715) by [@astorije](https://github.com/astorije))
- Deprecate `LOUNGE_HOME` environment variable in favor of `THELOUNGE_HOME`, `.lounge_home` file in favor of `.thelounge_home` ([#1717](https://github.com/thelounge/thelounge/pull/1717), [#1785](https://github.com/thelounge/thelounge/pull/1785) by [@astorije](https://github.com/astorije))
- Switch CLI tool from `lounge` to `thelounge`, deprecate `lounge` ([#1708](https://github.com/thelounge/thelounge/pull/1708) by [@astorije](https://github.com/astorije))
- Deprecate existing options of `thelounge start` and add a generic `--config` override ([#1820](https://github.com/thelounge/thelounge/pull/1820) by [@astorije](https://github.com/astorije))
- Rename thumbnail/image option to more general `media` ([#1832](https://github.com/thelounge/thelounge/pull/1832) by [@MaxLeiter](https://github.com/MaxLeiter))

### Removed

- Remove lobby close button ([#1833](https://github.com/thelounge/thelounge/pull/1833) by [@Cldfire](https://github.com/Cldfire))

### Fixed

- Handle empty client queries ([#1676](https://github.com/thelounge/thelounge/pull/1676) by [@realies](https://github.com/realies))
- Call callback on fetch error ([#1742](https://github.com/thelounge/thelounge/pull/1742) by [@xPaw](https://github.com/xPaw))
- Trigger keep to bottom for previews correctly ([#1746](https://github.com/thelounge/thelounge/pull/1746) by [@xPaw](https://github.com/xPaw))
- Fix duplicate text generated when sending channel and link together ([#1747](https://github.com/thelounge/thelounge/pull/1747) by [@astorije](https://github.com/astorije))
- Fix text highlighting when clicking on condensed message toggles ([#1748](https://github.com/thelounge/thelounge/pull/1748) by [@MaxLeiter](https://github.com/MaxLeiter))
- Do not keep sign-in and loader references in memory ([#1757](https://github.com/thelounge/thelounge/pull/1757) by [@xPaw](https://github.com/xPaw))
- Fix nick changes wrongly reported ([#1772](https://github.com/thelounge/thelounge/pull/1772) by [@astorije](https://github.com/astorije))
- Clone instances of `User` in `Msg` to avoid unintentional mutations ([#1771](https://github.com/thelounge/thelounge/pull/1771) by [@astorije](https://github.com/astorije), [#1859](https://github.com/thelounge/thelounge/pull/1859), [#1865](https://github.com/thelounge/thelounge/pull/1865) by [@xPaw](https://github.com/xPaw))
- Ask for notification permission on page load if setting is enabled ([#1789](https://github.com/thelounge/thelounge/pull/1789) by [@xPaw](https://github.com/xPaw))
- Merge condensed messages when loading more history ([#1803](https://github.com/thelounge/thelounge/pull/1803) by [@xPaw](https://github.com/xPaw))
- Proper network icon in context menu ([#1816](https://github.com/thelounge/thelounge/pull/1816) by [@MaxLeiter](https://github.com/MaxLeiter))
- Implement reverse style ([#1797](https://github.com/thelounge/thelounge/pull/1797) by [@grissly-man](https://github.com/grissly-man))
- Do not load user commands or display them on `--help` if public mode or using LDAP ([#1807](https://github.com/thelounge/thelounge/pull/1807) by [@astorije](https://github.com/astorije))
- Improve user and channel icons in channel list and context menu ([#1824](https://github.com/thelounge/thelounge/pull/1824) by [@astorije](https://github.com/astorije))
- Use better icons for channel/query list and context menu actions ([#1829](https://github.com/thelounge/thelounge/pull/1829) by [@astorije](https://github.com/astorije))
- Fix UI issues with special channels ([#1849](https://github.com/thelounge/thelounge/pull/1849) by [@astorije](https://github.com/astorije))
- Fix gap between `#sidebar` and `#footer` ([#1691](https://github.com/thelounge/thelounge/pull/1691) by [@realies](https://github.com/realies))
- Add missing time (and icon) of status messages on mobile ([#1843](https://github.com/thelounge/thelounge/pull/1843) by [@astorije](https://github.com/astorije))
- Add visual feedback on focused buttons, for example when tabbing to it ([#1871](https://github.com/thelounge/thelounge/pull/1871) by [@astorije](https://github.com/astorije))
- Fix missing messages when reconnecting ([#1884](https://github.com/thelounge/thelounge/pull/1884) by [@xPaw](https://github.com/xPaw))
- Fix slideout not closing on mobile when hitting a footer icon ([#1892](https://github.com/thelounge/thelounge/pull/1892) by [@astorije](https://github.com/astorije))
- Display the correct window on page reload ([#1889](https://github.com/thelounge/thelounge/pull/1889) by [@astorije](https://github.com/astorije))
- Fix error not showing up in failed push subscription ([#1896](https://github.com/thelounge/thelounge/pull/1896) by [@xPaw](https://github.com/xPaw))
- Only emit "more" history to the client that requested it ([#1949](https://github.com/thelounge/thelounge/pull/1949) by [@xPaw](https://github.com/xPaw))
- Provide correct timestamp to browser notifications ([#1956](https://github.com/thelounge/thelounge/pull/1956) by [@xPaw](https://github.com/xPaw))
- Fix enabling push notifications on Firefox ([#1975](https://github.com/thelounge/thelounge/pull/1975) by [@xPaw](https://github.com/xPaw))
- Add missing execution of callback in `ClientManager.updateUser` ([#1978](https://github.com/thelounge/thelounge/pull/1978) by [@merlinthp](https://github.com/merlinthp))
- Make sure existing packages (and themes) are not deleted when installing a new one on Node.js v8 ([#1986](https://github.com/thelounge/thelounge/pull/1986) by [@astorije](https://github.com/astorije))
- Stop expanding condensed messages on `/expand` ([#2006](https://github.com/thelounge/thelounge/pull/2006) by [@YaManicKill](https://github.com/YaManicKill))

### Security

- Harden content security policy even further ([#1810](https://github.com/thelounge/thelounge/pull/1810) by [@xPaw](https://github.com/xPaw))
- Stop LDAP authentication from succeeding without password ([#1725](https://github.com/thelounge/thelounge/pull/1725) by [@keegan](https://github.com/keegan))
- Store images with correct file extension ([#1926](https://github.com/thelounge/thelounge/pull/1926) by [@xPaw](https://github.com/xPaw))
- Hash user tokens, increase token entropy ([#1940](https://github.com/thelounge/thelounge/pull/1940) by [@xPaw](https://github.com/xPaw))

### Documentation

In the main repository:

- Fix incorrect documentation URL in default config ([#1875](https://github.com/thelounge/thelounge/pull/1875) by [@MiniDigger](https://github.com/MiniDigger))
- Allow keywords as changelog script version argument, e.g. `node scripts/changelog pre` ([#1913](https://github.com/thelounge/thelounge/pull/1913) by [@astorije](https://github.com/astorije))
- Separate and improve wording for `pre` and `rc` pre-release versions ([#1914](https://github.com/thelounge/thelounge/pull/1914) by [@astorije](https://github.com/astorije))
- Add SECURITY guidelines about security vulnerability disclosures, and link them from the CONTRIBUTING guidelines ([#1984](https://github.com/thelounge/thelounge/pull/1984) by [@astorije](https://github.com/astorije))

### Internals

- Enforce dangling commas with ESLint ([#1711](https://github.com/thelounge/thelounge/pull/1711) by [@astorije](https://github.com/astorije))
- Refactor how user object is sent to the client ([#1698](https://github.com/thelounge/thelounge/pull/1698), [#1716](https://github.com/thelounge/thelounge/pull/1716), [#1720](https://github.com/thelounge/thelounge/pull/1720), [#1764](https://github.com/thelounge/thelounge/pull/1764), [#1941](https://github.com/thelounge/thelounge/pull/1941) by [@xPaw](https://github.com/xPaw), [#1773](https://github.com/thelounge/thelounge/pull/1773) by [@astorije](https://github.com/astorije))
- Convert users list to map ([#1712](https://github.com/thelounge/thelounge/pull/1712) by [@xPaw](https://github.com/xPaw))
- Split `index.html` into components ([#1683](https://github.com/thelounge/thelounge/pull/1683) by [@xPaw](https://github.com/xPaw))
- Parallelize `npm test` ([#1750](https://github.com/thelounge/thelounge/pull/1750) by [@astorije](https://github.com/astorije))
- Avoid using `npm-run-all` for build ([#1752](https://github.com/thelounge/thelounge/pull/1752) by [@xPaw](https://github.com/xPaw))
- Avoid escaping quotes whenever possible ([#1749](https://github.com/thelounge/thelounge/pull/1749), [#1759](https://github.com/thelounge/thelounge/pull/1759) by [@astorije](https://github.com/astorije))
- Mark slow tests as such to reduce noise on test report ([#1761](https://github.com/thelounge/thelounge/pull/1761) by [@astorije](https://github.com/astorije))
- Increase timeout of server tests ([#1769](https://github.com/thelounge/thelounge/pull/1769) by [@astorije](https://github.com/astorije))
- Add a bunch of client tests ([#1770](https://github.com/thelounge/thelounge/pull/1770) by [@astorije](https://github.com/astorije))
- Heavily improve performance of "init" event ([#1778](https://github.com/thelounge/thelounge/pull/1778) by [@xPaw](https://github.com/xPaw))
- Enable `no-use-before-define` rule ([#1804](https://github.com/thelounge/thelounge/pull/1804) by [@xPaw](https://github.com/xPaw))
- Update textcomplete library and rewrite tabcomplete ([#1800](https://github.com/thelounge/thelounge/pull/1800) by [@xPaw](https://github.com/xPaw))
- Clean up path helpers, expand defaults location in `thelounge --help`, add tests for `expandHome` ([#1811](https://github.com/thelounge/thelounge/pull/1811) by [@astorije](https://github.com/astorije))
- Remove dead code in tests, and fix a link test ([#1818](https://github.com/thelounge/thelounge/pull/1818) by [@astorije](https://github.com/astorije))
- Use cross-platform modifier shortcut for Mousetrap when possible ([#1844](https://github.com/thelounge/thelounge/pull/1844) by [@astorije](https://github.com/astorije))
- Update to primer on npm ([#1855](https://github.com/thelounge/thelounge/pull/1855) by [@MaxLeiter](https://github.com/MaxLeiter))
- Add a `notEqual` block helper for Handlebars and tests for `equal` ([#1874](https://github.com/thelounge/thelounge/pull/1874) by [@astorije](https://github.com/astorije))
- Use `notEqual` helper for close button ([#1876](https://github.com/thelounge/thelounge/pull/1876) by [@xPaw](https://github.com/xPaw))
- Improve a bit window loading on init ([#1899](https://github.com/thelounge/thelounge/pull/1899) by [@astorije](https://github.com/astorije))
- Fix stylelint ([#1921](https://github.com/thelounge/thelounge/pull/1921) by [@astorije](https://github.com/astorije))
- Set `sign-git-tag` to true in `.npmrc` ([#1964](https://github.com/thelounge/thelounge/pull/1964) by [@xPaw](https://github.com/xPaw))
- Update development dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `copy-webpack-plugin` ([#1713](https://github.com/thelounge/thelounge/pull/1713), [#1737](https://github.com/thelounge/thelounge/pull/1737), [#1837](https://github.com/thelounge/thelounge/pull/1837), [#1877](https://github.com/thelounge/thelounge/pull/1877))
  - `eslint` ([#1744](https://github.com/thelounge/thelounge/pull/1744), [#1777](https://github.com/thelounge/thelounge/pull/1777), [#1815](https://github.com/thelounge/thelounge/pull/1815), [#1828](https://github.com/thelounge/thelounge/pull/1828), [#1887](https://github.com/thelounge/thelounge/pull/1887), [#1947](https://github.com/thelounge/thelounge/pull/1947))
  - `stylelint` ([#1745](https://github.com/thelounge/thelounge/pull/1745), [#1751](https://github.com/thelounge/thelounge/pull/1751), [#1841](https://github.com/thelounge/thelounge/pull/1841))
  - `webpack` ([#1780](https://github.com/thelounge/thelounge/pull/1780), [#1796](https://github.com/thelounge/thelounge/pull/1796))
  - `intersection-observer` ([#1790](https://github.com/thelounge/thelounge/pull/1790))
  - `textcomplete` ([#1835](https://github.com/thelounge/thelounge/pull/1835), [#1854](https://github.com/thelounge/thelounge/pull/1854))
  - `nyc` ([#1863](https://github.com/thelounge/thelounge/pull/1863))
  - `graphql-request` ([#1903](https://github.com/thelounge/thelounge/pull/1903))
  - `mocha` ([#1922](https://github.com/thelounge/thelounge/pull/1922))

## v2.7.0-rc.3 - 2018-01-27 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.7.0-rc.2...v2.7.0-rc.3)

This is a release candidate (RC) for v2.7.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.7.0-rc.2 - 2018-01-19 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.7.0-rc.1...v2.7.0-rc.2)

This is a release candidate (RC) for v2.7.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.7.0-rc.1 - 2018-01-13 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.7.0-pre.4...v2.7.0-rc.1)

This is a release candidate (RC) for v2.7.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.7.0-pre.4 - 2017-12-27 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.7.0-pre.3...v2.7.0-pre.4)

This is a pre-release for v2.7.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.7.0-pre.3 - 2017-12-15 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.7.0-pre.2...v2.7.0-pre.3)

This is a pre-release for v2.7.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.7.0-pre.2 - 2017-12-01 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.7.0-pre.1...v2.7.0-pre.2)

This is a pre-release for v2.7.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.7.0-pre.1 - 2017-11-30 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.6.0...v2.7.0-pre.1)

This is a pre-release for v2.7.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.6.0 - 2017-11-18

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v2.5.0...v2.6.0) and [milestone](https://github.com/thelounge/thelounge/milestone/26?closed=1).

This release is very small, as we focused it on bug fixes. You may notice slight improvements to the auto-completion menu (new commands, more accurate emoji list, documentation in the help window), as well as small UI improvements.

Additionally, this release is the first one with official support of Node.js v9.

### Added

- Add service aliases to command list for completion ([#1627](https://github.com/thelounge/thelounge/pull/1627) by [@dgw](https://github.com/dgw))

### Changed

- Mark channels as read when receiving self-messages ([#1615](https://github.com/thelounge/thelounge/pull/1615) by [@dgw](https://github.com/dgw))
- Remove content borders on mobile to maximize use of space ([#1599](https://github.com/thelounge/thelounge/pull/1599) by [@RJacksonm1](https://github.com/RJacksonm1))
- Reduced padding around page titles ([#1637](https://github.com/thelounge/thelounge/pull/1637) by [@Swapnull](https://github.com/Swapnull))
- Generate emoji map from EmojiOne data ([#1651](https://github.com/thelounge/thelounge/pull/1651), [#1670](https://github.com/thelounge/thelounge/pull/1670) by [@xPaw](https://github.com/xPaw))
- Update production dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `moment` ([#1624](https://github.com/thelounge/thelounge/pull/1624), [#1638](https://github.com/thelounge/thelounge/pull/1638), [#1702](https://github.com/thelounge/thelounge/pull/1702))
  - `socket.io` ([#1625](https://github.com/thelounge/thelounge/pull/1625), [#1660](https://github.com/thelounge/thelounge/pull/1660))
  - `express` ([#1638](https://github.com/thelounge/thelounge/pull/1638))
  - `ua-parser-js` ([#1638](https://github.com/thelounge/thelounge/pull/1638))
  - `web-push` ([#1654](https://github.com/thelounge/thelounge/pull/1654))

### Removed

- Remove Inconsolata ([#1602](https://github.com/thelounge/thelounge/pull/1602) by [@xPaw](https://github.com/xPaw))

### Fixed

- Fix possible race condition when attaching clients ([#1639](https://github.com/thelounge/thelounge/pull/1639) by [@xPaw](https://github.com/xPaw))
- Synchronize unread marker when client reconnects ([#1600](https://github.com/thelounge/thelounge/pull/1600) by [@xPaw](https://github.com/xPaw))
- Synchronize unread marker when other client opens a channel ([#1598](https://github.com/thelounge/thelounge/pull/1598) by [@xPaw](https://github.com/xPaw))
- Fix loading app with autocomplete disabled ([#1650](https://github.com/thelounge/thelounge/pull/1650) by [@dgw](https://github.com/dgw))
- Fix URL query parameters in public mode ([#1661](https://github.com/thelounge/thelounge/pull/1661) by [@MaxLeiter](https://github.com/MaxLeiter))
- Fix hyphenated names overflowing (#1667) ([#1671](https://github.com/thelounge/thelounge/pull/1671) by [@LFlare](https://github.com/LFlare))
- Fix missing attributes on unhandled messages ([#1695](https://github.com/thelounge/thelounge/pull/1695) by [@xPaw](https://github.com/xPaw))
- Correctly display kicks when kicker is server ([#1693](https://github.com/thelounge/thelounge/pull/1693) by [@xPaw](https://github.com/xPaw))
- Go back to writing user files synchronously ([#1701](https://github.com/thelounge/thelounge/pull/1701) by [@xPaw](https://github.com/xPaw))
- Fix local theme folder ([#1706](https://github.com/thelounge/thelounge/pull/1706) by [@xPaw](https://github.com/xPaw))

### Documentation

In the main repository:

- Fix "help wanted" link in CONTRIBUTING file ([#1673](https://github.com/thelounge/thelounge/pull/1673) by [@timmw](https://github.com/timmw))
- Document autocompletion in the help page ([#1609](https://github.com/thelounge/thelounge/pull/1609) by [@dgw](https://github.com/dgw))
- Add a script to pre-generate changelog entries ([#1707](https://github.com/thelounge/thelounge/pull/1707) by [@astorije](https://github.com/astorije))

### Internals

- Remove channel containers from DOM after quitting network ([#1607](https://github.com/thelounge/thelounge/pull/1607) by [@PolarizedIons](https://github.com/PolarizedIons))
- Create public folder with Webpack ([#1611](https://github.com/thelounge/thelounge/pull/1611), [#1682](https://github.com/thelounge/thelounge/pull/1682), [#1704](https://github.com/thelounge/thelounge/pull/1704) by [@xPaw](https://github.com/xPaw), [#1705](https://github.com/thelounge/thelounge/pull/1705) by [@astorije](https://github.com/astorije))
- Cleanup client manager functions ([#1636](https://github.com/thelounge/thelounge/pull/1636) by [@xPaw](https://github.com/xPaw))
- Add Node.js v9 testing to Travis builds ([#1678](https://github.com/thelounge/thelounge/pull/1678) by [@astorije](https://github.com/astorije))
- Allow `run-pr` script to pass arguments to `npm start` ([#1662](https://github.com/thelounge/thelounge/pull/1662) by [@MaxLeiter](https://github.com/MaxLeiter))
- Update development dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `webpack` ([#1626](https://github.com/thelounge/thelounge/pull/1626), [#1638](https://github.com/thelounge/thelounge/pull/1638), [#1643](https://github.com/thelounge/thelounge/pull/1643))
  - `mocha` ([#1617](https://github.com/thelounge/thelounge/pull/1617))
  - `stylelint` ([#1616](https://github.com/thelounge/thelounge/pull/1616))
  - `eslint` ([#1632](https://github.com/thelounge/thelounge/pull/1632), [#1666](https://github.com/thelounge/thelounge/pull/1666), [#1699](https://github.com/thelounge/thelounge/pull/1699))
  - `babel-preset-env` ([#1641](https://github.com/thelounge/thelounge/pull/1641))
  - `handlebars` ([#1645](https://github.com/thelounge/thelounge/pull/1645))
  - `socket.io-client` ([#1659](https://github.com/thelounge/thelounge/pull/1659))
  - `copy-webpack-plugin` ([#1653](https://github.com/thelounge/thelounge/pull/1653))
  - `nyc` ([#1680](https://github.com/thelounge/thelounge/pull/1680))
  - `npm-run-all` ([#1688](https://github.com/thelounge/thelounge/pull/1688))
  - `intersection-observer` ([#1697](https://github.com/thelounge/thelounge/pull/1697))

## v2.6.0-rc.4 - 2017-11-12 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.6.0-rc.3...v2.6.0-rc.4)

This is a release candidate for v2.6.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.6.0-rc.3 - 2017-11-12 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.6.0-rc.2...v2.6.0-rc.3)

This is a release candidate for v2.6.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.6.0-rc.2 - 2017-11-12 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.6.0-rc.1...v2.6.0-rc.2)

This is a release candidate for v2.6.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.6.0-rc.1 - 2017-11-11 [Pre-release - DEPRECATED]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.5.0...v2.6.0-rc.1)

This is a release candidate for v2.6.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.5.0 - 2017-10-17

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v2.4.0...v2.5.0) and [milestone](https://github.com/thelounge/thelounge/milestone/22?closed=1).

If you thought the [v2.3.0 release](https://github.com/thelounge/thelounge/releases/tag/v2.3.0) was big, well, v2.5.0 is even bigger! 🎉

If you are a client user, you will notice that The Lounge is now using your operating system's font, and that status messages (joins, parts, nick changes, etc.) are now condensed with each other.

<p align="center">
  <img width="555" alt="Condensed status messages displaying 3 users have joined the channel, 4 users have quit, and 1 user has changed nick" src="https://user-images.githubusercontent.com/113730/31530599-a6d719f2-afaf-11e7-9b82-db0365c41c4e.png">
  <br>
  <em>Condensed status messages</em>
</p>

After a while, you'll realize that the client now automatically reconnects when losing network connection (farewell, `Client connection lost — Click here to reconnect`!), and that the channel backlog now automatically loads when you scroll up. Unfortunately, that last bit forced us to phase out the `/clear` command for technical reasons.

If you go to the _Settings_ page, you'll notice that The Lounge now supports push notifications (yes, even on mobile, except iOS), and that you can remotely log out open sessions.

<p align="center">
  <img width="477" alt="Session list with the ability to disconnect remote sessions" src="https://user-images.githubusercontent.com/113730/31530598-a6c86b46-afaf-11e7-9272-eb742d328686.png">
  <br>
  <em>Current and remote sessions</em>
</p>

As a server administrator, you might be interested in a few new additions:

- Themes can now be [retrieved from npm](https://www.npmjs.com/search?q=keywords%3Athelounge-theme) and installed using a new CLI command `lounge install <theme-name>`
- Integration with LDAP has been completely refactored
- The Lounge can now be bound to Unix sockets

⚠️ Note that `--home` is now deprecated in favor of the `$LOUNGE_HOME` environment variable (or the `.lounge_home` file in the installation directory). Also, if you are running The Lounge behind a proxy (like nginx or Apache), you will need to make sure that `reverseProxy` is set to `true` and the `X-Forwarded-For` header correctly set for session listing to work correctly on the client.

Enjoy! 💬

### Added

- Status message condensing ([#759](https://github.com/thelounge/thelounge/pull/759), [#1421](https://github.com/thelounge/thelounge/pull/1421) by [@YaManicKill](https://github.com/YaManicKill), [#1437](https://github.com/thelounge/thelounge/pull/1437), [#1451](https://github.com/thelounge/thelounge/pull/1451), [#1475](https://github.com/thelounge/thelounge/pull/1475), [#1485](https://github.com/thelounge/thelounge/pull/1485) by [@xPaw](https://github.com/xPaw), [#1417](https://github.com/thelounge/thelounge/pull/1417), [#1442](https://github.com/thelounge/thelounge/pull/1442), [#1509](https://github.com/thelounge/thelounge/pull/1509), [#1524](https://github.com/thelounge/thelounge/pull/1524) by [@astorije](https://github.com/astorije))
- Use `.lounge_home` to help distribution packages handle config paths right ([#1416](https://github.com/thelounge/thelounge/pull/1416), [#1587](https://github.com/thelounge/thelounge/pull/1587) by [@xPaw](https://github.com/xPaw), [#1418](https://github.com/thelounge/thelounge/pull/1418) by [@astorije](https://github.com/astorije))
- Implement push notifications ([#1124](https://github.com/thelounge/thelounge/pull/1124), [#1445](https://github.com/thelounge/thelounge/pull/1445), [#1572](https://github.com/thelounge/thelounge/pull/1572), [#1468](https://github.com/thelounge/thelounge/pull/1468) by [@xPaw](https://github.com/xPaw), [#1463](https://github.com/thelounge/thelounge/pull/1463) by [@astorije](https://github.com/astorije))
- Set default `/quit` message ([#1448](https://github.com/thelounge/thelounge/pull/1448) by [@xPaw](https://github.com/xPaw))
- Gracefully quit on <kbd>Ctrl</kbd>+<kbd>C</kbd> ([#1477](https://github.com/thelounge/thelounge/pull/1477) by [@xPaw](https://github.com/xPaw))
- Add `/rejoin` command (a.k.a. `/cycle`) ([#1449](https://github.com/thelounge/thelounge/pull/1449) by [@dgw](https://github.com/dgw))
- Add support for binding to Unix sockets ([#1479](https://github.com/thelounge/thelounge/pull/1479) by [@xPaw](https://github.com/xPaw))
- Automatically load history when scrolling upwards ([#1318](https://github.com/thelounge/thelounge/pull/1318) by [@xPaw](https://github.com/xPaw))
- Use `away-notify` to show updates on users away state ([#845](https://github.com/thelounge/thelounge/pull/845) by [@MaxLeiter](https://github.com/MaxLeiter))
- Allow themes from npm ([#1266](https://github.com/thelounge/thelounge/pull/1266) by [@YaManicKill](https://github.com/YaManicKill), [#1542](https://github.com/thelounge/thelounge/pull/1542) by [@xPaw](https://github.com/xPaw))
- Add anchor tag to URL to signify open page for reloading ([#1283](https://github.com/thelounge/thelounge/pull/1283) by [@MaxLeiter](https://github.com/MaxLeiter))
- Automatic client reconnection ([#1471](https://github.com/thelounge/thelounge/pull/1471), [#1549](https://github.com/thelounge/thelounge/pull/1549) by [@xPaw](https://github.com/xPaw))
- Create `lounge install` command ([#1539](https://github.com/thelounge/thelounge/pull/1539), [#1579](https://github.com/thelounge/thelounge/pull/1579) by [@xPaw](https://github.com/xPaw), [#1583](https://github.com/thelounge/thelounge/pull/1583) by [@astorije](https://github.com/astorije))

### Changed

- Change history button text while loading ([#1403](https://github.com/thelounge/thelounge/pull/1403) by [@xPaw](https://github.com/xPaw))
- Resolve relative URIs in link previewer ([#1410](https://github.com/thelounge/thelounge/pull/1410) by [@xPaw](https://github.com/xPaw))
- Remove 10-second interval to trim buffer ([#1409](https://github.com/thelounge/thelounge/pull/1409) by [@xPaw](https://github.com/xPaw))
- Refactor authentication flow ([#1411](https://github.com/thelounge/thelounge/pull/1411) by [@xPaw](https://github.com/xPaw))
- Only match emoji autocomplete after two characters ([#1356](https://github.com/thelounge/thelounge/pull/1356) by [@MaxLeiter](https://github.com/MaxLeiter))
- Improve CLI user management ([#1443](https://github.com/thelounge/thelounge/pull/1443) by [@astorije](https://github.com/astorije))
- Bigger font size ([#1153](https://github.com/thelounge/thelounge/pull/1153) by [@bews](https://github.com/bews), [#1553](https://github.com/thelounge/thelounge/pull/1553), [#1561](https://github.com/thelounge/thelounge/pull/1561), [#1610](https://github.com/thelounge/thelounge/pull/1610) by [@astorije](https://github.com/astorije))
- Extend fuzzy search in autocomplete to all strategies ([#1387](https://github.com/thelounge/thelounge/pull/1387) by [@yashsriv](https://github.com/yashsriv))
- Only create config folder in `start` command ([#1350](https://github.com/thelounge/thelounge/pull/1350) by [@xPaw](https://github.com/xPaw))
- Parse emoji to make them bigger ([#1446](https://github.com/thelounge/thelounge/pull/1446) by [@xPaw](https://github.com/xPaw), [#1481](https://github.com/thelounge/thelounge/pull/1481) by [@MaxLeiter](https://github.com/MaxLeiter))
- Process chat messages in `requestIdleCallback` if available ([#1457](https://github.com/thelounge/thelounge/pull/1457) by [@xPaw](https://github.com/xPaw))
- Completely refactor how date markers are inserted ([#1452](https://github.com/thelounge/thelounge/pull/1452) by [@xPaw](https://github.com/xPaw))
- Bump default image prefetch limit ([#1490](https://github.com/thelounge/thelounge/pull/1490) by [@astorije](https://github.com/astorije))
- Take an optional argument in `/part` ([#1476](https://github.com/thelounge/thelounge/pull/1476) by [@eliemichel](https://github.com/eliemichel))
- Checkered background for transparent images in image viewer ([#1511](https://github.com/thelounge/thelounge/pull/1511) by [@xPaw](https://github.com/xPaw))
- Use native font stack ([#1540](https://github.com/thelounge/thelounge/pull/1540) by [@xPaw](https://github.com/xPaw), [#1597](https://github.com/thelounge/thelounge/pull/1597) by [@astorije](https://github.com/astorije))
- Add `touch-action` to messages, sidebar, and user list ([#1520](https://github.com/thelounge/thelounge/pull/1520) by [@iamstratos](https://github.com/iamstratos))
- Handle browser history when opening/closing image preview ([#1503](https://github.com/thelounge/thelounge/pull/1503) by [@astorije](https://github.com/astorije))
- Abort image prefetch if `Content-Length` exceeds limit ([#1567](https://github.com/thelounge/thelounge/pull/1567) by [@dgw](https://github.com/dgw))
- Use monospace font in custom CSS textarea ([#1552](https://github.com/thelounge/thelounge/pull/1552) by [@astorije](https://github.com/astorije))
- Update production dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `irc-framework` ([#1379](https://github.com/thelounge/thelounge/pull/1379), [#1385](https://github.com/thelounge/thelounge/pull/1385))
  - `fs-extra` ([#1386](https://github.com/thelounge/thelounge/pull/1386), [#1521](https://github.com/thelounge/thelounge/pull/1521))
  - `urijs` ([#1401](https://github.com/thelounge/thelounge/pull/1401), [#1405](https://github.com/thelounge/thelounge/pull/1405), [#1604](https://github.com/thelounge/thelounge/pull/1604))
  - `express` ([#1426](https://github.com/thelounge/thelounge/pull/1426), [#1589](https://github.com/thelounge/thelounge/pull/1589))
  - `ua-parser-js` ([#1426](https://github.com/thelounge/thelounge/pull/1426))
  - `web-push` ([#1516](https://github.com/thelounge/thelounge/pull/1516))
  - `request` ([#1546](https://github.com/thelounge/thelounge/pull/1546), [#1577](https://github.com/thelounge/thelounge/pull/1577))

### Removed

- Remove `os.homedir()` polyfill ([#1419](https://github.com/thelounge/thelounge/pull/1419) by [@xPaw](https://github.com/xPaw))
- Get rid of `/clear` command and keybind ([#1526](https://github.com/thelounge/thelounge/pull/1526) by [@astorije](https://github.com/astorije))

### Fixed

- Correctly append OS name ([#1399](https://github.com/thelounge/thelounge/pull/1399) by [@xPaw](https://github.com/xPaw))
- Correctly dereference stored images when leaving channels ([#1406](https://github.com/thelounge/thelounge/pull/1406) by [@xPaw](https://github.com/xPaw))
- Do not throw an exception when URI parsing fails ([#1412](https://github.com/thelounge/thelounge/pull/1412) by [@xPaw](https://github.com/xPaw))
- Take into account word boundaries for custom highlighting ([#1358](https://github.com/thelounge/thelounge/pull/1358) by [@starquake](https://github.com/starquake))
- Do not unintentionally send incorrect messages from history ([#1444](https://github.com/thelounge/thelounge/pull/1444) by [@xPaw](https://github.com/xPaw))
- Escape channel names in slugify helper correctly ([#1472](https://github.com/thelounge/thelounge/pull/1472) by [@xPaw](https://github.com/xPaw))
- Format messages on copy ([#1464](https://github.com/thelounge/thelounge/pull/1464) by [@xPaw](https://github.com/xPaw))
- Add `/list` to autocomplete ([#1496](https://github.com/thelounge/thelounge/pull/1496) by [@MaxLeiter](https://github.com/MaxLeiter))
- Only change nick autocompletion when receiving a message ([#1495](https://github.com/thelounge/thelounge/pull/1495) by [@xPaw](https://github.com/xPaw))
- Render link previews in browser idle event ([#1508](https://github.com/thelounge/thelounge/pull/1508) by [@xPaw](https://github.com/xPaw))
- Fix image viewer turning black sometimes ([#1512](https://github.com/thelounge/thelounge/pull/1512) by [@xPaw](https://github.com/xPaw))
- Fix requesting last messages when no message `id` is known ([#1519](https://github.com/thelounge/thelounge/pull/1519), [#1544](https://github.com/thelounge/thelounge/pull/1544) by [@xPaw](https://github.com/xPaw))
- Display correct kick modes ([#1527](https://github.com/thelounge/thelounge/pull/1527) by [@dgw](https://github.com/dgw))
- Move unread marker when loading more history ([#1517](https://github.com/thelounge/thelounge/pull/1517) by [@xPaw](https://github.com/xPaw))
- Fix wrongly positioned menu when opening it and switching to landscape ([#1565](https://github.com/thelounge/thelounge/pull/1565) by [@astorije](https://github.com/astorije))
- Fix flickering on link hovering, and inconsistencies between chat links and UI links ([#1573](https://github.com/thelounge/thelounge/pull/1573) by [@astorije](https://github.com/astorije))
- Fix nick change on Safari for Mac and iOS ([#1568](https://github.com/thelounge/thelounge/pull/1568) by [@Gilles123](https://github.com/Gilles123))
- Make sure channel list close button is really absent when channel is not selected ([#1623](https://github.com/thelounge/thelounge/pull/1623) by [@astorije](https://github.com/astorije))

### Security

- Implement a proper LDAP authentication process ([#1478](https://github.com/thelounge/thelounge/pull/1478) by [@eliemichel](https://github.com/eliemichel))
- Implement multiple sessions for users ([#1199](https://github.com/thelounge/thelounge/pull/1199) by [@xPaw](https://github.com/xPaw))
- Deleting a user should log them out ([#1474](https://github.com/thelounge/thelounge/pull/1474) by [@xPaw](https://github.com/xPaw))
- Remove the "Stay signed in" checkbox at login ([#1465](https://github.com/thelounge/thelounge/pull/1465) by [@astorije](https://github.com/astorije))
- Implement session list and allow signing out other clients ([#1536](https://github.com/thelounge/thelounge/pull/1536) by [@xPaw](https://github.com/xPaw))

### Documentation

In the main repository:

- Add Stack Overflow link in CONTRIBUTING file ([#1373](https://github.com/thelounge/thelounge/pull/1373) by [@astorije](https://github.com/astorije))
- Add feature overview in README ([#1427](https://github.com/thelounge/thelounge/pull/1427) by [@xPaw](https://github.com/xPaw))
- Add documentation for `LOUNGE_HOME` environment variable in the CLI helper ([#1438](https://github.com/thelounge/thelounge/pull/1438) by [@astorije](https://github.com/astorije))
- Fix general spelling errors ([#1458](https://github.com/thelounge/thelounge/pull/1458) by [@PolarizedIons](https://github.com/PolarizedIons))
- Remove duplicate keybindings help ([#1543](https://github.com/thelounge/thelounge/pull/1543) by [@xPaw](https://github.com/xPaw))

On the [website repository](https://github.com/thelounge/thelounge.chat):

- Remove wrong and inexistent home option from configuration documentation ([#72](https://github.com/thelounge/thelounge.chat/pull/72) by [@astorije](https://github.com/astorije))
- Deprecate `--home` in favor of `LOUNGE_HOME` environment variable ([#73](https://github.com/thelounge/thelounge.chat/pull/73) by [@astorije](https://github.com/astorije))
- Add themes docs ([#69](https://github.com/thelounge/thelounge.chat/pull/69) by [@YaManicKill](https://github.com/YaManicKill))
- Add missing `prefetchStorage` configuration option to docs ([#74](https://github.com/thelounge/thelounge.chat/pull/74) by [@MiniDigger](https://github.com/MiniDigger))

### Internals

- Get closer to stylelint's standard config ([#1439](https://github.com/thelounge/thelounge/pull/1439) by [@astorije](https://github.com/astorije))
- Move all auto completion code to a separate file ([#1453](https://github.com/thelounge/thelounge/pull/1453) by [@xPaw](https://github.com/xPaw))
- Enforce semicolon spacing ([#1488](https://github.com/thelounge/thelounge/pull/1488) by [@xPaw](https://github.com/xPaw))
- One line server startup errors ([#1492](https://github.com/thelounge/thelounge/pull/1492) by [@xPaw](https://github.com/xPaw))
- Move even more code out of `lounge.js` ([#1500](https://github.com/thelounge/thelounge/pull/1500) by [@xPaw](https://github.com/xPaw))
- Remove unnecessary `end()` calls ([#1518](https://github.com/thelounge/thelounge/pull/1518) by [@xPaw](https://github.com/xPaw))
- Move user log function where it belongs ([#1528](https://github.com/thelounge/thelounge/pull/1528), [#1585](https://github.com/thelounge/thelounge/pull/1585) by [@xPaw](https://github.com/xPaw), [#1535](https://github.com/thelounge/thelounge/pull/1535) by [@astorije](https://github.com/astorije))
- Enable `no-console` and `no-alert` ESLint rules  ([#1538](https://github.com/thelounge/thelounge/pull/1538) by [@astorije](https://github.com/astorije))
- Use `Mousetrap` for image viewer shortcuts ([#1566](https://github.com/thelounge/thelounge/pull/1566) by [@astorije](https://github.com/astorije))
- Remove `event-stream` dependency in favor of plain `Buffers` ([#1554](https://github.com/thelounge/thelounge/pull/1554) by [@astorije](https://github.com/astorije))
- Skip cleanup on Travis ([`da31317`](https://github.com/thelounge/thelounge/commit/da31317156047000819fa0363c435005104aa572) by [@xPaw](https://github.com/xPaw))
- Remove `--progress` from webpack ([#1608](https://github.com/thelounge/thelounge/pull/1608) by [@xPaw](https://github.com/xPaw))
- Add tests for invalid URLs ([#1620](https://github.com/thelounge/thelounge/pull/1620) by [@xPaw](https://github.com/xPaw))
- Update development dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `nyc` ([#1382](https://github.com/thelounge/thelounge/pull/1382), [#1498](https://github.com/thelounge/thelounge/pull/1498), [#1505](https://github.com/thelounge/thelounge/pull/1505))
  - `mocha` ([#1388](https://github.com/thelounge/thelounge/pull/1388), [#1513](https://github.com/thelounge/thelounge/pull/1513), [#1514](https://github.com/thelounge/thelounge/pull/1514), [#1515](https://github.com/thelounge/thelounge/pull/1515))
  - `chai` ([#1394](https://github.com/thelounge/thelounge/pull/1394), [#1482](https://github.com/thelounge/thelounge/pull/1482))
  - `eslint` ([#1395](https://github.com/thelounge/thelounge/pull/1395), [#1435](https://github.com/thelounge/thelounge/pull/1435), [#1493](https://github.com/thelounge/thelounge/pull/1493), [#1532](https://github.com/thelounge/thelounge/pull/1532), [#1541](https://github.com/thelounge/thelounge/pull/1541), [#1555](https://github.com/thelounge/thelounge/pull/1555), [#1591](https://github.com/thelounge/thelounge/pull/1591))
  - `webpack` ([#1397](https://github.com/thelounge/thelounge/pull/1397), [#1407](https://github.com/thelounge/thelounge/pull/1407), [#1424](https://github.com/thelounge/thelounge/pull/1424), [#1507](https://github.com/thelounge/thelounge/pull/1507), [#1531](https://github.com/thelounge/thelounge/pull/1531))
  - `babel-core` ([#1425](https://github.com/thelounge/thelounge/pull/1425))
  - `babel-loader` ([#1434](https://github.com/thelounge/thelounge/pull/1434))
  - `npm-run-all` ([#1462](https://github.com/thelounge/thelounge/pull/1462), [#1466](https://github.com/thelounge/thelounge/pull/1466))
  - `jquery-textcomplete` ([#1473](https://github.com/thelounge/thelounge/pull/1473))
  - `handlebars-loader` ([#1487](https://github.com/thelounge/thelounge/pull/1487))
  - `stylelint` ([#1499](https://github.com/thelounge/thelounge/pull/1499))

## v2.5.0-rc.5 - 2017-10-11 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.5.0-rc.4...v2.5.0-rc.5)

This is a release candidate for v2.5.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.5.0-rc.4 - 2017-10-06 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.5.0-rc.3...v2.5.0-rc.4)

This is a release candidate for v2.5.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.5.0-rc.3 - 2017-10-04 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.5.0-rc.2...v2.5.0-rc.3)

This is a release candidate for v2.5.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.5.0-rc.2 - 2017-10-01 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.5.0-rc.1...v2.5.0-rc.2)

This is a release candidate for v2.5.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.5.0-rc.1 - 2017-09-26 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.4.0...v2.5.0-rc.1)

This is a release candidate for v2.5.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.4.0 - 2017-07-30

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v2.3.2...v2.4.0) and [milestone](https://github.com/thelounge/thelounge/milestone/25?closed=1).

This release improves link and image previews a great deal! On the menu:

- Up to 5 previews are now displayed instead of 1
- All previews on the current channel can now be hidden or displayed using the `/collapse` and `/expand` commands
- Thumbnails can be opened in a fullscreen viewer without leaving the app by clicking on them, and cycled using the previous/next buttons or by hitting <kbd>←</kbd> and <kbd>→</kbd>
- Say bye to mixed content warnings: The Lounge can now proxy all images (opt-in option in the server settings) for better privacy
- Title and description are improved overall

Also in this release, auto-complete feature now has an opt-out option in the client settings, and emoji can be searched using fuzzy-matching:

<img width="241" alt="The Lounge - Emoji fuzzy-matching" src="https://user-images.githubusercontent.com/113730/28757682-54276b5a-7556-11e7-9e4b-ce1d19d7b678.png">

### Added

- Add `title` attributes to previews ([#1291](https://github.com/thelounge/thelounge/pull/1291) by [@astorije](https://github.com/astorije))
- Allow opting out of autocomplete ([#1294](https://github.com/thelounge/thelounge/pull/1294) by [@awalgarg](https://github.com/awalgarg))
- Add collapse/expand commands to toggle all previews ([#1309](https://github.com/thelounge/thelounge/pull/1309) by [@astorije](https://github.com/astorije))
- An image viewer popup for thumbnails and image previews, with buttons to previous/next images ([#1325](https://github.com/thelounge/thelounge/pull/1325), [#1365](https://github.com/thelounge/thelounge/pull/1365), [#1368](https://github.com/thelounge/thelounge/pull/1368), [#1367](https://github.com/thelounge/thelounge/pull/1367) by [@astorije](https://github.com/astorije), [#1370](https://github.com/thelounge/thelounge/pull/1370) by [@xPaw](https://github.com/xPaw))
- Store preview images on disk for privacy, security and caching ([#1307](https://github.com/thelounge/thelounge/pull/1307) by [@xPaw](https://github.com/xPaw))
- Emoji fuzzy-matching ([#1334](https://github.com/thelounge/thelounge/pull/1334) by [@MaxLeiter](https://github.com/MaxLeiter))

### Changed

- Check status code in link prefetcher ([#1260](https://github.com/thelounge/thelounge/pull/1260) by [@xPaw](https://github.com/xPaw))
- Check `og:description` before `description` tag in previews ([#1255](https://github.com/thelounge/thelounge/pull/1255) by [@xPaw](https://github.com/xPaw))
- Check `og:title` before `title` tag in previews ([#1256](https://github.com/thelounge/thelounge/pull/1256) by [@xPaw](https://github.com/xPaw))
- Do not display preview if there is nothing to preview ([#1273](https://github.com/thelounge/thelounge/pull/1273) by [@xPaw](https://github.com/xPaw))
- Increase max downloaded bytes for link preview ([#1274](https://github.com/thelounge/thelounge/pull/1274) by [@xPaw](https://github.com/xPaw))
- Refactor link previews ([#1276](https://github.com/thelounge/thelounge/pull/1276) by [@xPaw](https://github.com/xPaw), [#1378](https://github.com/thelounge/thelounge/pull/1378) by [@astorije](https://github.com/astorije))
- Support multiple previews per message ([#1303](https://github.com/thelounge/thelounge/pull/1303), [#1324](https://github.com/thelounge/thelounge/pull/1324), [#1335](https://github.com/thelounge/thelounge/pull/1335), [#1348](https://github.com/thelounge/thelounge/pull/1348), [#1347](https://github.com/thelounge/thelounge/pull/1347), [#1353](https://github.com/thelounge/thelounge/pull/1353) by [@astorije](https://github.com/astorije))
- Add `mask-icon` for pinned safari tab ([#1329](https://github.com/thelounge/thelounge/pull/1329) by [@MaxLeiter](https://github.com/MaxLeiter))
- Lazily load user list in channels on init, keep autocompletion sort on server ([#1194](https://github.com/thelounge/thelounge/pull/1194) by [@xPaw](https://github.com/xPaw))
- Keep track of preview visibility on the server so it persists at page reload ([#1366](https://github.com/thelounge/thelounge/pull/1366) by [@astorije](https://github.com/astorije))
- Bump express and socket.io to their latest patch versions ([#1312](https://github.com/thelounge/thelounge/pull/1312) by [@astorije](https://github.com/astorije))
- Update production dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `commander` ([#1257](https://github.com/thelounge/thelounge/pull/1257), [#1292](https://github.com/thelounge/thelounge/pull/1292))
  - `jquery-textcomplete` ([#1279](https://github.com/thelounge/thelounge/pull/1279), [#1321](https://github.com/thelounge/thelounge/pull/1321))
  - `fs-extra` ([#1332](https://github.com/thelounge/thelounge/pull/1332))
  - `semver` ([#1369](https://github.com/thelounge/thelounge/pull/1369))

### Removed

- Remove hostname prettifier ([#1306](https://github.com/thelounge/thelounge/pull/1306) by [@xPaw](https://github.com/xPaw))
- Remove `X-UA-Compatible` ([#1328](https://github.com/thelounge/thelounge/pull/1328) by [@xPaw](https://github.com/xPaw))

### Fixed

- Make sure thumbnail is a valid image in previews ([#1254](https://github.com/thelounge/thelounge/pull/1254) by [@xPaw](https://github.com/xPaw))
- Parse `X-Forwarded-For` header correctly ([#1202](https://github.com/thelounge/thelounge/pull/1202) by [@xPaw](https://github.com/xPaw))
- Do not truncate link previews if viewport can fit more text ([#1293](https://github.com/thelounge/thelounge/pull/1293) by [@xPaw](https://github.com/xPaw))
- Fix too big line height previews text on Crypto ([#1296](https://github.com/thelounge/thelounge/pull/1296) by [@astorije](https://github.com/astorije))
- Fix background color contrast on Zenburn previews ([#1297](https://github.com/thelounge/thelounge/pull/1297) by [@astorije](https://github.com/astorije))
- Fix jumps when toggling link preview ([#1298](https://github.com/thelounge/thelounge/pull/1298) by [@xPaw](https://github.com/xPaw))
- Fix losing network settings ([#1305](https://github.com/thelounge/thelounge/pull/1305) by [@xPaw](https://github.com/xPaw))
- Fix missing transitions ([#1314](https://github.com/thelounge/thelounge/pull/1314), [#1336](https://github.com/thelounge/thelounge/pull/1336), [#1374](https://github.com/thelounge/thelounge/pull/1374) by [@astorije](https://github.com/astorije), [#1117](https://github.com/thelounge/thelounge/pull/1117) by [@bews](https://github.com/bews))
- Fix incorrect mode on kick target ([#1352](https://github.com/thelounge/thelounge/pull/1352) by [@xPaw](https://github.com/xPaw))
- Correctly show whitespace and newlines in messages ([#1242](https://github.com/thelounge/thelounge/pull/1242) by [@starquake](https://github.com/starquake), [#1359](https://github.com/thelounge/thelounge/pull/1359) by [@xPaw](https://github.com/xPaw))
- Hide overflow on entire message row ([#1361](https://github.com/thelounge/thelounge/pull/1361) by [@starquake](https://github.com/starquake))
- Fix link previews not truncating correctly ([#1363](https://github.com/thelounge/thelounge/pull/1363) by [@xPaw](https://github.com/xPaw))

### Documentation

In the main repository:

- Remove mention in CHANGELOG that The Lounge uses Semantic Versioning ([#1269](https://github.com/thelounge/thelounge/pull/1269) by [@astorije](https://github.com/astorije))
- Remove `devDependencies` badge on README ([#1267](https://github.com/thelounge/thelounge/pull/1267) by [@astorije](https://github.com/astorije))
- Reword link preview settings to better match reality ([#1310](https://github.com/thelounge/thelounge/pull/1310) by [@astorije](https://github.com/astorije))
- Update screenshot in README ([#1326](https://github.com/thelounge/thelounge/pull/1326) by [@MaxLeiter](https://github.com/MaxLeiter))
- Update README badge to new demo URL ([#1345](https://github.com/thelounge/thelounge/pull/1345) by [@MaxLeiter](https://github.com/MaxLeiter))
- Update README for when to run `npm run build` ([#1319](https://github.com/thelounge/thelounge/pull/1319) by [@MaxLeiter](https://github.com/MaxLeiter))

On the website:

- Update demo URL to new demo ([#70](https://github.com/thelounge/thelounge.chat/pull/70) by [@MaxLeiter](https://github.com/MaxLeiter))

### Internals

- Move nickname rendering to a single template ([#1252](https://github.com/thelounge/thelounge/pull/1252) by [@xPaw](https://github.com/xPaw))
- Ignore all dotfiles in `.npmignore` ([#1287](https://github.com/thelounge/thelounge/pull/1287) by [@xPaw](https://github.com/xPaw))
- Add `.npmrc` file with `save-exact` set to `true` so packages are saved already pinned ([#1284](https://github.com/thelounge/thelounge/pull/1284) by [@MaxLeiter](https://github.com/MaxLeiter))
- Do not hardcode vendor bundles in webpack configuration ([#1280](https://github.com/thelounge/thelounge/pull/1280) by [@xPaw](https://github.com/xPaw))
- Prepare for `SOURCE` CTCP command, when `irc-framework` supports it ([#1284](https://github.com/thelounge/thelounge/pull/1284) by [@MaxLeiter](https://github.com/MaxLeiter))
- Change "Show older messages" to use `id` rather than count ([#1354](https://github.com/thelounge/thelounge/pull/1354) by [@YaManicKill](https://github.com/YaManicKill))
- Update development dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `eslint` ([#1264](https://github.com/thelounge/thelounge/pull/1264), [#1272](https://github.com/thelounge/thelounge/pull/1272), [#1315](https://github.com/thelounge/thelounge/pull/1315), [#1362](https://github.com/thelounge/thelounge/pull/1362))
  - `nyc` ([#1277](https://github.com/thelounge/thelounge/pull/1277))
  - `stylelint` ([#1278](https://github.com/thelounge/thelounge/pull/1278), [#1320](https://github.com/thelounge/thelounge/pull/1320), [#1340](https://github.com/thelounge/thelounge/pull/1340))
  - `babel-loader` ([#1282](https://github.com/thelounge/thelounge/pull/1282))
  - `babel-preset-env` ([#1295](https://github.com/thelounge/thelounge/pull/1295))
  - `webpack` ([#1308](https://github.com/thelounge/thelounge/pull/1308), [#1322](https://github.com/thelounge/thelounge/pull/1322), [#1338](https://github.com/thelounge/thelounge/pull/1338), [#1371](https://github.com/thelounge/thelounge/pull/1371), [#1376](https://github.com/thelounge/thelounge/pull/1376))
  - `chai` ([#1323](https://github.com/thelounge/thelounge/pull/1323))

## v2.4.0-rc.2 - 2017-07-27 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.4.0-rc.1...v2.4.0-rc.2)

This is a release candidate for v2.4.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.4.0-rc.1 - 2017-07-27 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.3.2...v2.4.0-rc.1)

This is a release candidate for v2.4.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.3.2 - 2017-06-25

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v2.3.1...v2.3.2) and [milestone](https://github.com/thelounge/thelounge/milestone/24?closed=1).

This patch releases brings a lot of fixes and small improvements here and there, as well as the ability to display seconds in timestamps, a long-awaited feature!

### Added

- Add a client option to display seconds in timestamps ([#1141](https://github.com/thelounge/thelounge/pull/1141) by [@bews](https://github.com/bews))
- Add "Reload page" button when the client fails to load ([#1150](https://github.com/thelounge/thelounge/pull/1150) by [@bews](https://github.com/bews))

### Changed

- Treat `click` as a read activity ([#1214](https://github.com/thelounge/thelounge/pull/1214) by [@xPaw](https://github.com/xPaw))
- Fade out for long nicks ([#1158](https://github.com/thelounge/thelounge/pull/1158) by [@bews](https://github.com/bews), [#1253](https://github.com/thelounge/thelounge/pull/1253) by [@xPaw](https://github.com/xPaw))
- Include trickery to reduce paints and improve performance ([#1120](https://github.com/thelounge/thelounge/pull/1120) by [@xPaw](https://github.com/xPaw), [#1083](https://github.com/thelounge/thelounge/pull/1083) by [@bews](https://github.com/bews))
- Make everything un-selectable by default ([#1233](https://github.com/thelounge/thelounge/pull/1233) by [@xPaw](https://github.com/xPaw))
- Handle images with unknown size in prefetch ([#1246](https://github.com/thelounge/thelounge/pull/1246) by [@bews](https://github.com/bews))
- Update production dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `spdy` ([#1184](https://github.com/thelounge/thelounge/pull/1184))

### Fixed

- Stop showing the unread messages marker when `joins`/`parts`/`quits`/etc. are hidden ([#1016](https://github.com/thelounge/thelounge/pull/1016) by [@swordbeta](https://github.com/swordbeta))
- Correctly finish scroll animation when using page keys ([#1244](https://github.com/thelounge/thelounge/pull/1244) by [@xPaw](https://github.com/xPaw))
- Hide link time element on small devices ([#1261](https://github.com/thelounge/thelounge/pull/1261) by [@xPaw](https://github.com/xPaw))
- Fix MOTD underline in Safari ([#1217](https://github.com/thelounge/thelounge/pull/1217) by [@MaxLeiter](https://github.com/MaxLeiter))

### Documentation

In the main repository:

- Clarify kilobyte ambiguity ([#1248](https://github.com/thelounge/thelounge/pull/1248) by [@xPaw](https://github.com/xPaw))
- Fix stray end tag ([#1251](https://github.com/thelounge/thelounge/pull/1251) by [@xPaw](https://github.com/xPaw))

### Internals

- Update to ESLint 4 and enforce extra rules ([#1231](https://github.com/thelounge/thelounge/pull/1231) by [@xPaw](https://github.com/xPaw))
- Improve the PR tester script a bit ([#1240](https://github.com/thelounge/thelounge/pull/1240) by [@astorije](https://github.com/astorije))
- Add modules for socket events ([#1175](https://github.com/thelounge/thelounge/pull/1175) by [@YaManicKill](https://github.com/YaManicKill))
- Ignore `package-lock.json` ([#1247](https://github.com/thelounge/thelounge/pull/1247) by [@xPaw](https://github.com/xPaw))
- Use `stylelint-config-standard` ([#1249](https://github.com/thelounge/thelounge/pull/1249) by [@xPaw](https://github.com/xPaw))
- Update development dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `babel-core` ([#1212](https://github.com/thelounge/thelounge/pull/1212))
  - `babel-loader` ([#1245](https://github.com/thelounge/thelounge/pull/1245))
  - `nyc` ([#1198](https://github.com/thelounge/thelounge/pull/1198))
  - `stylelint` ([#1215](https://github.com/thelounge/thelounge/pull/1215), [#1230](https://github.com/thelounge/thelounge/pull/1230))
  - `chai` ([#1206](https://github.com/thelounge/thelounge/pull/1206))
  - `webpack` ([#1238](https://github.com/thelounge/thelounge/pull/1238))

## v2.3.1 - 2017-06-09

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v2.3.0...v2.3.1) and [milestone](https://github.com/thelounge/thelounge/milestone/23?closed=1).

This release mostly fixes a few bugs, as listed below.

### Changed

- Keep original `<title>` name when changing the title ([#1205](https://github.com/thelounge/thelounge/pull/1205) by [@xPaw](https://github.com/xPaw))
- Update production dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `handlebars` ([#1179](https://github.com/thelounge/thelounge/pull/1179))

### Fixed

- Do not store unnecessary information in user objects ([#1195](https://github.com/thelounge/thelounge/pull/1195) by [@xPaw](https://github.com/xPaw))
- Correctly configure client socket transports ([#1197](https://github.com/thelounge/thelounge/pull/1197) by [@xPaw](https://github.com/xPaw))
- Fix network name not being set when `displayNetwork` is `false` ([#1211](https://github.com/thelounge/thelounge/pull/1211) by [@xPaw](https://github.com/xPaw))

### Security

- Do not store passwords in settings storage ([#1204](https://github.com/thelounge/thelounge/pull/1204) by [@xPaw](https://github.com/xPaw))

### Internals

- Fix `localtime` test to correctly use UTC ([#1201](https://github.com/thelounge/thelounge/pull/1201) by [@xPaw](https://github.com/xPaw))
- Update Node.js versions for Travis CI ([#1191](https://github.com/thelounge/thelounge/pull/1191) by [@YaManicKill](https://github.com/YaManicKill))
- Update development dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `mocha` ([#1170](https://github.com/thelounge/thelounge/pull/1170))
  - `webpack` ([#1183](https://github.com/thelounge/thelounge/pull/1183))
  - `babel-preset-env` ([#1177](https://github.com/thelounge/thelounge/pull/1177))

## v2.3.0 - 2017-06-08

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v2.2.2...v2.3.0) and [milestone](https://github.com/thelounge/thelounge/milestone/9?closed=1).

What a release! Our biggest one since the v2.0.0 [release](https://github.com/thelounge/thelounge/releases/tag/v2.0.0) / [milestone](https://github.com/thelounge/thelounge/milestone/1?closed=1)!
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

- Add `data-from` attribute to allow styling messages from specific users ([#978](https://github.com/thelounge/thelounge/pull/978) by [@williamboman](https://github.com/williamboman))
- Auto away when no clients are connected ([#775](https://github.com/thelounge/thelounge/pull/775), [#1104](https://github.com/thelounge/thelounge/pull/1104) by [@xPaw](https://github.com/xPaw))
- Implement color hotkeys ([#810](https://github.com/thelounge/thelounge/pull/810) by [@xPaw](https://github.com/xPaw))
- Store channel keys ([#1003](https://github.com/thelounge/thelounge/pull/1003) by [@xPaw](https://github.com/xPaw), [#715](https://github.com/thelounge/thelounge/pull/715) by [@spookhurb](https://github.com/spookhurb))
- Implement <kbd>pgup</kbd>/<kbd>pgdown</kbd> keys ([#955](https://github.com/thelounge/thelounge/pull/955) by [@xPaw](https://github.com/xPaw), [#1078](https://github.com/thelounge/thelounge/pull/1078) by [@YaManicKill](https://github.com/YaManicKill))
- Add CSS tooltips on time elements to give ability to view time on mobile ([#824](https://github.com/thelounge/thelounge/pull/824) by [@xPaw](https://github.com/xPaw))
- Add SSL CA bundle option ([#1024](https://github.com/thelounge/thelounge/pull/1024) by [@metsjeesus](https://github.com/metsjeesus))
- Implement History Web API ([#575](https://github.com/thelounge/thelounge/pull/575) by [@williamboman](https://github.com/williamboman), [#1080](https://github.com/thelounge/thelounge/pull/1080) by [@YaManicKill](https://github.com/YaManicKill))
- Add slug with command to unhandled messages ([#816](https://github.com/thelounge/thelounge/pull/816) by [@DanielOaks](https://github.com/DanielOaks), [#1044](https://github.com/thelounge/thelounge/pull/1044) by [@YaManicKill](https://github.com/YaManicKill))
- Add support for the `/banlist` command ([#1009](https://github.com/thelounge/thelounge/pull/1009) by [@YaManicKill](https://github.com/YaManicKill))
- Add support for `/ban` and `/unban` commands ([#1077](https://github.com/thelounge/thelounge/pull/1077) by [@YaManicKill](https://github.com/YaManicKill))
- Add autocompletion for emoji, users, channels, and commands ([#787](https://github.com/thelounge/thelounge/pull/787) by [@yashsriv](https://github.com/yashsriv), [#1138](https://github.com/thelounge/thelounge/pull/1138), [#1095](https://github.com/thelounge/thelounge/pull/1095) by [@xPaw](https://github.com/xPaw))
- Add autocomplete strategy for foreground and background colors ([#1109](https://github.com/thelounge/thelounge/pull/1109) by [@astorije](https://github.com/astorije))
- Add support for `0x04` hex colors ([#1100](https://github.com/thelounge/thelounge/pull/1100) by [@xPaw](https://github.com/xPaw))

### Changed

- Remove table layout for chat messages (and fix layout issues yet again) ([#523](https://github.com/thelounge/thelounge/pull/523) by [@maxpoulin64](https://github.com/maxpoulin64))
- Improve inline previews for links and images ([#524](https://github.com/thelounge/thelounge/pull/524) by [@maxpoulin64](https://github.com/maxpoulin64))
- Use local variables to check length ([#1028](https://github.com/thelounge/thelounge/pull/1028) by [@xPaw](https://github.com/xPaw))
- Add `rel="noopener"` to URLs in `index.html` and replace mIRC colors URL to [@DanielOaks](https://github.com/DanielOaks)'s [documentation](https://modern.ircdocs.horse/formatting.html#colors) ([#1034](https://github.com/thelounge/thelounge/pull/1034) by [@xPaw](https://github.com/xPaw), [#1051](https://github.com/thelounge/thelounge/pull/1051) by [@astorije](https://github.com/astorije))
- Preload scripts as soon as possible ([#1033](https://github.com/thelounge/thelounge/pull/1033) by [@xPaw](https://github.com/xPaw))
- Improve channels list ([#1018](https://github.com/thelounge/thelounge/pull/1018) by [@swordbeta](https://github.com/swordbeta))
- Show MOTD by default ([#1052](https://github.com/thelounge/thelounge/pull/1052) by [@KlipperKyle](https://github.com/KlipperKyle), [#1157](https://github.com/thelounge/thelounge/pull/1157) by [@astorije](https://github.com/astorije))
- Switch to a new IRC message parser ([#972](https://github.com/thelounge/thelounge/pull/972) by [@xPaw](https://github.com/xPaw), [#699](https://github.com/thelounge/thelounge/pull/699) by [@Bonuspunkt](https://github.com/Bonuspunkt))
- Use moment on the client to display friendly dates ([#1054](https://github.com/thelounge/thelounge/pull/1054) by [@astorije](https://github.com/astorije))
- Implement fuzzy-matching for the user list ([#856](https://github.com/thelounge/thelounge/pull/856), [#1093](https://github.com/thelounge/thelounge/pull/1093), [#1167](https://github.com/thelounge/thelounge/pull/1167) by [@astorije](https://github.com/astorije), [#1091](https://github.com/thelounge/thelounge/pull/1091) by [@PolarizedIons](https://github.com/PolarizedIons), [#1107](https://github.com/thelounge/thelounge/pull/1107) by [@xPaw](https://github.com/xPaw))
- Use moment to render dates everywhere ([#1114](https://github.com/thelounge/thelounge/pull/1114) by [@xPaw](https://github.com/xPaw))
- Update production dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `moment` ([#976](https://github.com/thelounge/thelounge/pull/976), [#999](https://github.com/thelounge/thelounge/pull/999))
  - `fs-extra` ([#964](https://github.com/thelounge/thelounge/pull/964), [#1098](https://github.com/thelounge/thelounge/pull/1098), [#1136](https://github.com/thelounge/thelounge/pull/1136))
  - `jquery` ([#969](https://github.com/thelounge/thelounge/pull/969), [#998](https://github.com/thelounge/thelounge/pull/998))
  - `urijs` ([#995](https://github.com/thelounge/thelounge/pull/995))
  - `mousetrap` ([#1006](https://github.com/thelounge/thelounge/pull/1006))
  - `irc-framework` ([#1070](https://github.com/thelounge/thelounge/pull/1070), [#1074](https://github.com/thelounge/thelounge/pull/1074), [#1123](https://github.com/thelounge/thelounge/pull/1123))
  - `handlebars` ([#1116](https://github.com/thelounge/thelounge/pull/1116), [#1129](https://github.com/thelounge/thelounge/pull/1129))

### Removed

- Remove invalid CSS perspective properties ([#1027](https://github.com/thelounge/thelounge/pull/1027) by [@astorije](https://github.com/astorije))
- Remove cycle nicks button ([#1062](https://github.com/thelounge/thelounge/pull/1062) by [@xPaw](https://github.com/xPaw))

### Fixed

- Rewrite identd server, combine with oidentd ([#804](https://github.com/thelounge/thelounge/pull/804), [#970](https://github.com/thelounge/thelounge/pull/970) by [@xPaw](https://github.com/xPaw))
- Fix wrong font size in help center labels ([#994](https://github.com/thelounge/thelounge/pull/994) by [@astorije](https://github.com/astorije))
- Fix filling in the nickname, overriding the username in the New Network window ([#873](https://github.com/thelounge/thelounge/pull/873) by [@PolarizedIons](https://github.com/PolarizedIons))
- Correctly append date marker when receiving a message ([#1002](https://github.com/thelounge/thelounge/pull/1002) by [@xPaw](https://github.com/xPaw))
- Count only message items for when loading more messages ([#1013](https://github.com/thelounge/thelounge/pull/1013) by [@awalgarg](https://github.com/awalgarg))
- Fix Zenburn and Morning channel list font color ([#1017](https://github.com/thelounge/thelounge/pull/1017) by [@swordbeta](https://github.com/swordbeta))
- Stick to bottom when opening user list ([#1032](https://github.com/thelounge/thelounge/pull/1032) by [@xPaw](https://github.com/xPaw))
- Reset notification markers on document focus ([#1040](https://github.com/thelounge/thelounge/pull/1040) by [@xPaw](https://github.com/xPaw))
- Disable show more button when loading messages ([#1045](https://github.com/thelounge/thelounge/pull/1045) by [@YaManicKill](https://github.com/YaManicKill))
- Fix to `helper.expandhome` to correctly resolve `""` and `undefined` ([#1050](https://github.com/thelounge/thelounge/pull/1050) by [@metsjeesus](https://github.com/metsjeesus))
- Fix displayNetwork to work correctly ([#1069](https://github.com/thelounge/thelounge/pull/1069) by [@xPaw](https://github.com/xPaw))
- Enable show more button correctly ([#1068](https://github.com/thelounge/thelounge/pull/1068) by [@xPaw](https://github.com/xPaw))
- Rewrite server code of channel sorting ([#1064](https://github.com/thelounge/thelounge/pull/1064) by [@xPaw](https://github.com/xPaw) and ([#1115](https://github.com/thelounge/thelounge/pull/1115) by [@PolarizedIons](https://github.com/PolarizedIons)))
- Fix showing prefetch options ([#1087](https://github.com/thelounge/thelounge/pull/1087) by [@YaManicKill](https://github.com/YaManicKill))
- Add `/ctcp` command to constants and auto-completion ([#1108](https://github.com/thelounge/thelounge/pull/1108) by [@MaxLeiter](https://github.com/MaxLeiter))
- Disable `tabindex` on user list search input ([#1122](https://github.com/thelounge/thelounge/pull/1122) by [@xPaw](https://github.com/xPaw))
- Fix date-marker not being removed on loading new messages ([#1132](https://github.com/thelounge/thelounge/pull/1132), [#1156](https://github.com/thelounge/thelounge/pull/1156) by [@PolarizedIons](https://github.com/PolarizedIons))

### Security

- Switch to `bcryptjs` and make password comparison asynchronous ([#985](https://github.com/thelounge/thelounge/pull/985) by [@rockhouse](https://github.com/rockhouse), [`b46f92c`](https://github.com/thelounge/thelounge/commit/b46f92c7d8a07e84f49a550b32204c0a0672e831) by [@xPaw](https://github.com/xPaw))
- Use Referrer-Policy header instead of CSP referrer ([#1015](https://github.com/thelounge/thelounge/pull/1015) by [@astorije](https://github.com/astorije))

### Internals

- Enforce more space and new line rules ([#975](https://github.com/thelounge/thelounge/pull/975) by [@xPaw](https://github.com/xPaw))
- Setup ESLint to make sure an EOF feed is always present ([#991](https://github.com/thelounge/thelounge/pull/991) by [@astorije](https://github.com/astorije))
- Do not build json3 module with Webpack ([#977](https://github.com/thelounge/thelounge/pull/977) by [@xPaw](https://github.com/xPaw))
- Remove extra newline to please ESLint ([#997](https://github.com/thelounge/thelounge/pull/997) by [@astorije](https://github.com/astorije))
- Use `require()` instead of import in client code ([#973](https://github.com/thelounge/thelounge/pull/973) by [@xPaw](https://github.com/xPaw))
- Do not build feature branch with open pull requests on AppVeyor ([`934400f`](https://github.com/thelounge/thelounge/commit/934400f5ee094e61c62dd0304cb55ea9f9666078) by [@xPaw](https://github.com/xPaw))
- Exclude Webpack config from coverage report ([#1053](https://github.com/thelounge/thelounge/pull/1053) by [@astorije](https://github.com/astorije))
- Create socket module ([#1060](https://github.com/thelounge/thelounge/pull/1060) by [@YaManicKill](https://github.com/YaManicKill))
- Change index.html to be rendered using handlebars ([#1057](https://github.com/thelounge/thelounge/pull/1057) by [@YaManicKill](https://github.com/YaManicKill))
- Move commands into constants module ([#1067](https://github.com/thelounge/thelounge/pull/1067) by [@YaManicKill](https://github.com/YaManicKill))
- Use `babel-preset-env` ([#1072](https://github.com/thelounge/thelounge/pull/1072) by [@xPaw](https://github.com/xPaw))
- Use `irc-framework`'s `setTopic()` for topic command ([#1082](https://github.com/thelounge/thelounge/pull/1082) by [@MaxLeiter](https://github.com/MaxLeiter))
- Create options module ([#1066](https://github.com/thelounge/thelounge/pull/1066) by [@YaManicKill](https://github.com/YaManicKill))
- Update development dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `babel-core` ([#958](https://github.com/thelounge/thelounge/pull/958), [#1021](https://github.com/thelounge/thelounge/pull/1021))
  - `babel-loader` ([#968](https://github.com/thelounge/thelounge/pull/968), [#1020](https://github.com/thelounge/thelounge/pull/1020), [#1063](https://github.com/thelounge/thelounge/pull/1063))
  - `babel-preset-es2015` ([#960](https://github.com/thelounge/thelounge/pull/960))
  - `eslint` ([#971](https://github.com/thelounge/thelounge/pull/971), [#1000](https://github.com/thelounge/thelounge/pull/1000))
  - `nyc` ([#989](https://github.com/thelounge/thelounge/pull/989), [#1113](https://github.com/thelounge/thelounge/pull/1113), [#1140](https://github.com/thelounge/thelounge/pull/1140))
  - `webpack` ([#981](https://github.com/thelounge/thelounge/pull/981), [#1007](https://github.com/thelounge/thelounge/pull/1007), [#1030](https://github.com/thelounge/thelounge/pull/1030), [#1133](https://github.com/thelounge/thelounge/pull/1133), [#1142](https://github.com/thelounge/thelounge/pull/1142))
  - `stylelint` ([#1004](https://github.com/thelounge/thelounge/pull/1004), [#1005](https://github.com/thelounge/thelounge/pull/1005))
  - `handlebars-loader` ([#1058](https://github.com/thelounge/thelounge/pull/1058))
  - `mocha` ([#1079](https://github.com/thelounge/thelounge/pull/1079))

## v2.3.0-rc.2 - 2017-05-16 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.3.0-rc.1...v2.3.0-rc.2)

This is a release candidate for v2.3.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.3.0-rc.1 - 2017-05-07 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.2.2...v2.3.0-rc.1)

This is a release candidate for v2.3.0 to ensure maximum stability for public release.
Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v2.2.2 - 2017-03-13

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v2.2.1...v2.2.2) and [milestone](https://github.com/thelounge/thelounge/milestone/11?closed=1).

This patch release brings a lot of dependency upgrades and a few fixes. Passing options to the `lounge` CLI (`lounge start --port 8080`, etc.) now works as expected without requiring `--`. We have also disabled ping timeouts for now to hopefully fix automatic reconnection. Finally, upgrading `irc-framework` allows us to fix an extra couple of bugs.

You will now notice a new `(?)` icon at the bottom of the sidebar. It is home of a help center that currently details supported shortcuts and commands. It will be improved over time, but we encourage contributors to help us improve it.

Note that as of this release, `lounge` without any arguments wil display the help information (mirroring `lounge --help`). Prior to this release, it used to start a server, which must now be done explicitly using `lounge start`.

### Changed

- Update to `jQuery` 3 ([#931](https://github.com/thelounge/thelounge/pull/931) by [@xPaw](https://github.com/xPaw))
- Update `express` and `nyc` to latest versions ([#954](https://github.com/thelounge/thelounge/pull/954) by [@xPaw](https://github.com/xPaw))
- Update production dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `mousetrap` ([#881](https://github.com/thelounge/thelounge/pull/881))
  - `fs-extra` ([#878](https://github.com/thelounge/thelounge/pull/878))
  - `irc-framework` ([#918](https://github.com/thelounge/thelounge/pull/918) and [#952](https://github.com/thelounge/thelounge/pull/952))
  - `urijs` ([#921](https://github.com/thelounge/thelounge/pull/921), [#940](https://github.com/thelounge/thelounge/pull/940) and [#946](https://github.com/thelounge/thelounge/pull/946))
  - `socket.io` and `socket.io-client` ([#926](https://github.com/thelounge/thelounge/pull/926))
  - `request` ([#944](https://github.com/thelounge/thelounge/pull/944))

### Fixed

- Disable (temporarily) client ping timeouts ([#939](https://github.com/thelounge/thelounge/pull/939) by [@xPaw](https://github.com/xPaw))
- Update arg parsing and default `lounge` to `lounge --help` ([#929](https://github.com/thelounge/thelounge/pull/929) by [@msaun008](https://github.com/msaun008))
- Prevent message sending in lobbies ([#957](https://github.com/thelounge/thelounge/pull/957) by [@xPaw](https://github.com/xPaw))

### Documentation

In the main repository:

- Help window with supported commands and shortcuts ([#941](https://github.com/thelounge/thelounge/pull/941) by [@astorije](https://github.com/astorije))

On the website:

- Add notes about moving client docs to the app itself ([#63](https://github.com/thelounge/thelounge.chat/pull/63) by [@astorije](https://github.com/astorije))
- Deprecate (and attempt one last fixing) documentations of Heroku and Passenger ([#61](https://github.com/thelounge/thelounge.chat/pull/61) by [@astorije](https://github.com/astorije))

### Internals

- Fix `run_pr.sh` script ([#919](https://github.com/thelounge/thelounge/pull/919) by [@astorije](https://github.com/astorije))
- Make sure multiline chains of calls are correctly indented ([#930](https://github.com/thelounge/thelounge/pull/930) by [@astorije](https://github.com/astorije))
- Update development dependencies to their latest versions, by [Greenkeeper](https://greenkeeper.io/) 🚀:
  - `babel-core`, `babel-loader` and `babel-preset-es2015` ([#922](https://github.com/thelounge/thelounge/pull/922) and [#947](https://github.com/thelounge/thelounge/pull/947))
  - `webpack` ([#905](https://github.com/thelounge/thelounge/pull/905))
  - `stylelint` ([#934](https://github.com/thelounge/thelounge/pull/934))
  - `npm-run-all` ([#938](https://github.com/thelounge/thelounge/pull/938))
  - `eslint` ([#937](https://github.com/thelounge/thelounge/pull/937) and [#943](https://github.com/thelounge/thelounge/pull/943))

## v2.2.1 - 2017-02-12

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v2.2.0...v2.2.1) and [milestone](https://github.com/thelounge/thelounge/milestone/10?closed=1).

This patch release packs up a change of the default value of `maxHistory`, an interactive prompt when creating a user to enable/disable user logging, a UI bug fix, and a few dependency upgrades.

### Changed

- Change default `maxHistory` to 10000 ([#899](https://github.com/thelounge/thelounge/pull/899) by [@xPaw](https://github.com/xPaw))
- Prompt admin for user log at user creation ([#903](https://github.com/thelounge/thelounge/pull/903) by [@astorije](https://github.com/astorije))
- Update `irc-framework` to the latest version 🚀 ([#902](https://github.com/thelounge/thelounge/pull/902) by [Greenkeeper](https://greenkeeper.io/))
- Update `urijs` to the latest version 🚀 ([#904](https://github.com/thelounge/thelounge/pull/904) by [Greenkeeper](https://greenkeeper.io/))
- Update `express` to the latest version 🚀 ([#898](https://github.com/thelounge/thelounge/pull/898) by [Greenkeeper](https://greenkeeper.io/))

### Fixed

- Fix body height, regression from v2.2.0 ([#913](https://github.com/thelounge/thelounge/pull/913) by [@YaManicKill](https://github.com/YaManicKill))

### Documentation

In the main repository:

- Explain about `lounge` command in dev installations ([#887](https://github.com/thelounge/thelounge/pull/887) by [@drkitty](https://github.com/drkitty))

On the website:

- Port recent changes to `maxHistory` from default config file ([#60](https://github.com/thelounge/thelounge.chat/pull/60) by [@astorije](https://github.com/astorije))

### Internals

- Sort depedencies in `package.json` ([#896](https://github.com/thelounge/thelounge/pull/896) by [@xPaw](https://github.com/xPaw))
- Update `nyc` to the latest version 🚀 ([#882](https://github.com/thelounge/thelounge/pull/882) by [Greenkeeper](https://greenkeeper.io/))
- Update `npm-run-all` to the latest version 🚀 ([#880](https://github.com/thelounge/thelounge/pull/880) by [Greenkeeper](https://greenkeeper.io/))
- Add nyc and Webpack config files to the files ignored when releasing ([#906](https://github.com/thelounge/thelounge/pull/906) by [@astorije](https://github.com/astorije))
- Update `stylelint` to the latest version 🚀 ([#907](https://github.com/thelounge/thelounge/pull/907) by [Greenkeeper](https://greenkeeper.io/))
- Update `eslint` to the latest version 🚀 ([#910](https://github.com/thelounge/thelounge/pull/910) by [Greenkeeper](https://greenkeeper.io/))

## v2.2.0 - 2017-01-31

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v2.1.0...v2.2.0) and [milestone](https://github.com/thelounge/thelounge/milestone/2?closed=1).

Another long-overdue release for The Lounge!

On the client, it is now possible to generate URLs that pre-fill connection inputs in public mode, a date separator makes it into the chats, `/away` and `/back` commands are now supported, idle time gets displayed on `/whois`.<br>
Also, the client does not abruptly refresh when connection is lost anymore, and user search has been slightly improved. Note however that these last 2 items are still not optimal, but improvements are underway!

On the server, more logging! The `debug` option is now an object instead of a boolean, so make sure to update your configuration file accordingly. More details [here](https://github.com/thelounge/thelounge/blob/v2.2.0/defaults/config.js#L364-L383).<br>
There are changes revolving around user configuration autoloading: it has been greatly improved and therefore it is now enabled by default. Make sure to remove the `autoload` option from your configuration files.

And of course, tons of fixes and less noticeable feature additions and changes, so make sure to check the full list below!

### Added

- Override network connection inputs with URL parameters ([#674](https://github.com/thelounge/thelounge/pull/674) by [@MaxLeiter](https://github.com/MaxLeiter))
- Add `id` to submit button ([#717](https://github.com/thelounge/thelounge/pull/717) by [@xPaw](https://github.com/xPaw))
- Add a UI element to cycle through nick completions on mobile ([#708](https://github.com/thelounge/thelounge/pull/708) by [@astorije](https://github.com/astorije))
- Report configuration file path, Node.js version and OS platform on server start-up ([#736](https://github.com/thelounge/thelounge/pull/736) by [@williamboman](https://github.com/williamboman) and [#743](https://github.com/thelounge/thelounge/pull/743) by [@xPaw](https://github.com/xPaw))
- Add `lounge` keyword to npm registry ([#747](https://github.com/thelounge/thelounge/pull/747) by [@xPaw](https://github.com/xPaw))
- Add a date separator to channels/PMs ([#671](https://github.com/thelounge/thelounge/pull/671) and [#765](https://github.com/thelounge/thelounge/pull/765) by [@PolarizedIons](https://github.com/PolarizedIons))
- Add support for hexip ilines and fix storing client IP address in configuration file ([#749](https://github.com/thelounge/thelounge/pull/749) and [#822](https://github.com/thelounge/thelounge/pull/822) by [@xPaw](https://github.com/xPaw))
- Implement `/away` and `/back` commands ([#745](https://github.com/thelounge/thelounge/pull/745) by [@xPaw](https://github.com/xPaw))
- Remind channel name or nick in input placeholder ([#832](https://github.com/thelounge/thelounge/pull/832) and [#889](https://github.com/thelounge/thelounge/pull/889) by [@astorije](https://github.com/astorije))
- Add human-readable idle time in whois info ([#721](https://github.com/thelounge/thelounge/pull/721) by [@astorije](https://github.com/astorije))
- Option to log raw IRC traffic ([#783](https://github.com/thelounge/thelounge/pull/783) by [@astorije](https://github.com/astorije))

### Changed

- Improve support for opening multiple clients at once ([#636](https://github.com/thelounge/thelounge/pull/636) by [@xPaw](https://github.com/xPaw))
- Match window title border line to text color ([#716](https://github.com/thelounge/thelounge/pull/716) by [@xPaw](https://github.com/xPaw))
- Focus input after chat form submit ([#483](https://github.com/thelounge/thelounge/pull/483) by [@williamboman](https://github.com/williamboman))
- Refactor user autoload to use `fs.watch` and make it more transparent in the app ([#751](https://github.com/thelounge/thelounge/pull/751) by [@xPaw](https://github.com/xPaw) and [#779](https://github.com/thelounge/thelounge/pull/779) by [@astorije](https://github.com/astorije))
- Sync reordering of channels/networks to other clients in real-time ([#757](https://github.com/thelounge/thelounge/pull/757) by [@PolarizedIons](https://github.com/PolarizedIons))
- Do not accept empty password when adding new user ([#795](https://github.com/thelounge/thelounge/pull/795) by [@MaxLeiter](https://github.com/MaxLeiter))
- Stop refreshing the page on every socket.io error ([#784](https://github.com/thelounge/thelounge/pull/784) by [@xPaw](https://github.com/xPaw))
- Only append "says" to notifications if it is a message ([#805](https://github.com/thelounge/thelounge/pull/805) by [@xPaw](https://github.com/xPaw))
- Allow user search to find a pattern anywhere in the nicks ([#855](https://github.com/thelounge/thelounge/pull/855) by [@MaxLeiter](https://github.com/MaxLeiter))

### Removed

- Remove browser notification polyfill and inform user when unsupported ([#709](https://github.com/thelounge/thelounge/pull/709) by [@astorije](https://github.com/astorije))
- Remove erroneous classname from password field ([#748](https://github.com/thelounge/thelounge/pull/748) by [@xPaw](https://github.com/xPaw))
- Do not dismiss native web notifications programmatically after 5s ([#739](https://github.com/thelounge/thelounge/pull/739) by [@williamboman](https://github.com/williamboman))

### Fixed

- Fix `/mode` command to correctly assume target ([#679](https://github.com/thelounge/thelounge/pull/679) by [@xPaw](https://github.com/xPaw))
- Fix crash when LDAP server is unreachable ([#697](https://github.com/thelounge/thelounge/pull/697) by [@gramakri](https://github.com/gramakri))
- Fix channels behaving strangely while dragging ([#697](https://github.com/thelounge/thelounge/pull/697) by [@PolarizedIons](https://github.com/PolarizedIons))
- Fix unread counters resetting when they should not ([#720](https://github.com/thelounge/thelounge/pull/720) by [@PolarizedIons](https://github.com/PolarizedIons))
- Silence failures to trigger notifications when not available ([#732](https://github.com/thelounge/thelounge/pull/732) by [@astorije](https://github.com/astorije))
- Avoid unnecessary disk writes when saving user ([#750](https://github.com/thelounge/thelounge/pull/750) by [@xPaw](https://github.com/xPaw))
- Use correct channel when pushing link prefetch messages ([#782](https://github.com/thelounge/thelounge/pull/782) by [@xPaw](https://github.com/xPaw))
- Correctly remove closed sockets from oident file, remove unused functions ([#753](https://github.com/thelounge/thelounge/pull/753) by [@xPaw](https://github.com/xPaw))
- Do not automatically focus on touch devices ([#801](https://github.com/thelounge/thelounge/pull/801) by [@xPaw](https://github.com/xPaw))
- Strip control characters from notifications ([#818](https://github.com/thelounge/thelounge/pull/818) by [@xPaw](https://github.com/xPaw))
- Improve CLI a bit (output formatting and subcommand/option bug fix) ([#799](https://github.com/thelounge/thelounge/pull/799) and [#868](https://github.com/thelounge/thelounge/pull/868) by [@astorije](https://github.com/astorije))
- Make HTML container take the entire screen estate ([#821](https://github.com/thelounge/thelounge/pull/821) by [@xPaw](https://github.com/xPaw))
- Fix unread marker being removed from DOM ([#820](https://github.com/thelounge/thelounge/pull/820) by [@xPaw](https://github.com/xPaw))
- Remove margin on date marker on smallest screen size ([#830](https://github.com/thelounge/thelounge/pull/830) by [@xPaw](https://github.com/xPaw))
- Do not ignore window opens when considering active channels ([#834](https://github.com/thelounge/thelounge/pull/834) by [@xPaw](https://github.com/xPaw))
- Calculate menu width on touch start ([#836](https://github.com/thelounge/thelounge/pull/836) by [@xPaw](https://github.com/xPaw))
- Increase IRC colors contrast ([#829](https://github.com/thelounge/thelounge/pull/829) by [@xPaw](https://github.com/xPaw))
- Do not prefetch URLs unless they are messages or `/me` actions ([#812](https://github.com/thelounge/thelounge/pull/812) by [@birkof](https://github.com/birkof))
- Bump `irc-framework` to bring a couple of fixes ([#790](https://github.com/thelounge/thelounge/pull/790) by [@astorije](https://github.com/astorije), [#802](https://github.com/thelounge/thelounge/pull/802) by [@xPaw](https://github.com/xPaw) and [#852](https://github.com/thelounge/thelounge/pull/852) by [Greenkeeper](https://greenkeeper.io/))

### Security

- Change bcrypt rounds from 8 to 11 ([#711](https://github.com/thelounge/thelounge/pull/711) by [@xPaw](https://github.com/xPaw))

### Documentation

In the main repository:

- Warn against running from source as root in README ([#725](https://github.com/thelounge/thelounge/pull/725) by [@astorije](https://github.com/astorije))
- Add screenshot to README ([#694](https://github.com/thelounge/thelounge/pull/694) by [@MaxLeiter](https://github.com/MaxLeiter))
- Simplify introduction on README ([#789](https://github.com/thelounge/thelounge/pull/789) by [@astorije](https://github.com/astorije))

On the website:

- Remove distribution-specific install instructions of Node.js ([#49](https://github.com/thelounge/thelounge.chat/pull/49) by [@astorije](https://github.com/astorije))
- Remove wrong information about setting up password along with creating a user ([#50](https://github.com/thelounge/thelounge.chat/pull/50) by [@astorije](https://github.com/astorije))
- Update documentation of the configuration file ([#43](https://github.com/thelounge/thelounge.chat/pull/43) by [@daftaupe](https://github.com/daftaupe))
- Document the `/away` and `/back` commands ([#59](https://github.com/thelounge/thelounge.chat/pull/59) by [@drkitty](https://github.com/drkitty))

### Internals

- Fix AppVeyor cache never being successfully built and unblock AppVeyor ([#700](https://github.com/thelounge/thelounge/pull/700) by [@astorije](https://github.com/astorije) and [#755](https://github.com/thelounge/thelounge/pull/755) by [@IlyaFinkelshteyn](https://github.com/IlyaFinkelshteyn))
- Add a simple (first) test for `localetime` Handlebars helper ([#703](https://github.com/thelounge/thelounge/pull/703) by [@astorije](https://github.com/astorije))
- Get rid of OSX CI builds until they get much faster ([#707](https://github.com/thelounge/thelounge/pull/707) by [@astorije](https://github.com/astorije))
- Update badges in README ([#713](https://github.com/thelounge/thelounge/pull/713) by [@xPaw](https://github.com/xPaw) and [#780](https://github.com/thelounge/thelounge/pull/780) by [@astorije](https://github.com/astorije))
- Add Node.js v7, current stable, to Travis CI ([#800](https://github.com/thelounge/thelounge/pull/800) by [@astorije](https://github.com/astorije))
- Use Webpack to build our client code and dependencies ([#640](https://github.com/thelounge/thelounge/pull/640) by [@nornagon](https://github.com/nornagon) and [#817](https://github.com/thelounge/thelounge/pull/817) by [@xPaw](https://github.com/xPaw))
- Switch `istanbul` code coverage CLI to more recent `nyc` one ([#850](https://github.com/thelounge/thelounge/pull/850) by [@astorije](https://github.com/astorije))
- Add web server tests ([#838](https://github.com/thelounge/thelounge/pull/838) by [@xPaw](https://github.com/xPaw))
- Fix stuff that breaks in jQuery 3 ([#854](https://github.com/thelounge/thelounge/pull/854) by [@xPaw](https://github.com/xPaw))
- Do not uglify builds when running start-dev ([#858](https://github.com/thelounge/thelounge/pull/858) by [@xPaw](https://github.com/xPaw))
- Update dependencies to latest stable versions ([#746](https://github.com/thelounge/thelounge/pull/746) by [@xPaw](https://github.com/xPaw))
- Update dependencies to enable Greenkeeper 🌴 ([#826](https://github.com/thelounge/thelounge/pull/826) by [Greenkeeper](https://greenkeeper.io/))
- Update `lodash` to the latest version 🚀 ([#840](https://github.com/thelounge/thelounge/pull/840) and [#862](https://github.com/thelounge/thelounge/pull/862) by [Greenkeeper](https://greenkeeper.io/))
- Update `stylelint` to the latest version 🚀 ([#861](https://github.com/thelounge/thelounge/pull/861) by [Greenkeeper](https://greenkeeper.io/))
- Update `npm-run-all` to the latest version 🚀 ([#860](https://github.com/thelounge/thelounge/pull/860) by [Greenkeeper](https://greenkeeper.io/))
- Update `eslint` to the latest version 🚀 ([#875](https://github.com/thelounge/thelounge/pull/875) by [Greenkeeper](https://greenkeeper.io/))
- Update `babel-core` to the latest version 🚀 ([#883](https://github.com/thelounge/thelounge/pull/883) by [Greenkeeper](https://greenkeeper.io/))

## v2.1.0 - 2016-10-17

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.0.1...v2.1.0)

Here comes another release with some nice additions!

While the administrators will notice some bug fixes, most of the changes are client-side: support for `/list`, a slideout menu on mobile, editing one's nick from the UI, wallops message handling.

Enjoy!

### Added

- Implement `/list` ([#258](https://github.com/thelounge/thelounge/pull/258) by [@maxpoulin64](https://github.com/maxpoulin64))
- Add touch slideout menu for mobile ([#400](https://github.com/thelounge/thelounge/pull/400) by [@maxpoulin64](https://github.com/maxpoulin64))
- Display extra steps when loading the app ([#637](https://github.com/thelounge/thelounge/pull/637) by [@xPaw](https://github.com/xPaw))
- Display localized timestamp in title of message times ([#660](https://github.com/thelounge/thelounge/pull/660) by [@astorije](https://github.com/astorije))
- Changing nick in the UI ([#551](https://github.com/thelounge/thelounge/pull/551) by [@astorije](https://github.com/astorije))
- Add hostmasks in logs when possible ([#670](https://github.com/thelounge/thelounge/pull/670) by [@astorije](https://github.com/astorije))
- Display wallops in server window ([#658](https://github.com/thelounge/thelounge/pull/658) by [@xPaw](https://github.com/xPaw))

### Changed

- Make use of multi-prefix cap and remove NAMES spam on mode changes ([#632](https://github.com/thelounge/thelounge/pull/632) by [@xPaw](https://github.com/xPaw))
- Strict mode for all JS files ([#684](https://github.com/thelounge/thelounge/pull/684) by [@astorije](https://github.com/astorije))
- Enforce more ESLint rules ([#681](https://github.com/thelounge/thelounge/pull/681) by [@xPaw](https://github.com/xPaw))
- Use CI caches for downloaded files instead of installed ones ([#687](https://github.com/thelounge/thelounge/pull/687) by [@astorije](https://github.com/astorije))
- Consolidate version numbers throughout all interfaces  ([#592](https://github.com/thelounge/thelounge/pull/592) by [@williamboman](https://github.com/williamboman))
- Replace lodash's each/map with ES5 native forEach/map ([#689](https://github.com/thelounge/thelounge/pull/689) by [@astorije](https://github.com/astorije))

### Removed

- Remove all font files except WOFF ([#682](https://github.com/thelounge/thelounge/pull/682) by [@xPaw](https://github.com/xPaw))

### Fixed

- Themes: Fixed CSS rule selectors for highlight messages ([#652](https://github.com/thelounge/thelounge/pull/652) by [@DamonGant](https://github.com/DamonGant))
- Fix unhandled message color in default and Crypto themes ([#653](https://github.com/thelounge/thelounge/pull/653) by [@MaxLeiter](https://github.com/MaxLeiter))
- Check if SSL key and certificate files exist ([#673](https://github.com/thelounge/thelounge/pull/673) by [@toXel](https://github.com/toXel))
- Fix loading fonts in Microsoft Edge ([#683](https://github.com/thelounge/thelounge/pull/683) by [@xPaw](https://github.com/xPaw))
- Fill in prefixLookup on network initialization ([#647](https://github.com/thelounge/thelounge/pull/647) by [@nornagon](https://github.com/nornagon))
- Fix nick changes not being properly reported in the logs ([#685](https://github.com/thelounge/thelounge/pull/685) by [@astorije](https://github.com/astorije))
- Fix memory and reference shuffling when creating models ([#664](https://github.com/thelounge/thelounge/pull/664) by [@xPaw](https://github.com/xPaw))

## v2.0.1 - 2016-09-28

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.0.0...v2.0.1)

This is a minor house-keeping release with mostly two sets of changes.

First, a few bugs were fixed, including one simply preventing The Lounge to run in Safari's private browsing.

Additionally, the developer experience has been made a tiny bit better, with better documentation, lighter dependencies and simpler theme creation.

### Changed

- Add info on README about how to run from source, how to upgrade ([#621](https://github.com/thelounge/thelounge/pull/621) by [@astorije](https://github.com/astorije))
- Move uglify invocation into npm scripts and remove grunt ([#628](https://github.com/thelounge/thelounge/pull/628) by [@nornagon](https://github.com/nornagon))
- Move Shout theme borders to example theme ([#359](https://github.com/thelounge/thelounge/pull/359) by [@xPaw](https://github.com/xPaw))
- Update developer dependencies ([#639](https://github.com/thelounge/thelounge/pull/639) by [@xPaw](https://github.com/xPaw))

### Fixed

- Remove -ms-transform and add missed -webkit-transform ([#629](https://github.com/thelounge/thelounge/pull/629) by [@xPaw](https://github.com/xPaw))
- Ensure localStorage cannot fail because of quota or Safari private browsing ([#625](https://github.com/thelounge/thelounge/pull/625) by [@astorije](https://github.com/astorije))
- Disable pull-to-refresh on mobile that conflicts with scrolling the message list ([#618](https://github.com/thelounge/thelounge/pull/618) by [@astorije](https://github.com/astorije))
- Handle stderr when using edit or config command ([#622](https://github.com/thelounge/thelounge/pull/622) by [@MaxLeiter](https://github.com/MaxLeiter))

## v2.0.0 - 2016-09-24

[See the full changelog](https://github.com/thelounge/thelounge/compare/v1.5.0...v2.0.0)

After more than 5 months in the works, v2.0.0 is finally happening, and it's shipping with lots of new and enhanced features! 🎉

First of all, the backend IRC library is completely different, which was the first step to deciding on a major release.
This change brings many improvements and fixes, including support for auto-reconnection! This also allows us to easily improve our [IRCv3 compliance](http://ircv3.net/software/clients.html#web-clients).

Main changes on the server include support for WEBIRC, oidentd and LDAP. On the client, users will notice a lot of improvements about reporting unseen activity (notifications, markers, etc.), support for custom highlights, a new loading page, an auto-expanding message input, a theme selector, and more.

Administrators should note that the channel list format in user configuration files has changed. The old format is deprecated, but it will be automatically converted when the server starts (support may or may not be removed later). Additionally, The Lounge now only runs on Node v4 and up.

The above is only a small subset of changes. A more detailed list can be found below.
The following list features the most noticeable changes only, and more details can be found on all [v2.0.0 pre-releases](https://www.github.com/thelounge/thelounge/releases).

### Added

- Add tooltips on every clickable icons ([#540](https://github.com/thelounge/thelounge/pull/540) by [@astorije](https://github.com/astorije))
- Add debug config option for `irc-framework` debug log ([#547](https://github.com/thelounge/thelounge/pull/547) by [@maxpoulin64](https://github.com/maxpoulin64))
- Client-side theme selector ([#568](https://github.com/thelounge/thelounge/pull/568) by [@astorije](https://github.com/astorije))
- LDAP support ([#477](https://github.com/thelounge/thelounge/pull/477) by [@thisisdarshan](https://github.com/thisisdarshan) and [@lindskogen](https://github.com/lindskogen))
- Add custom highlights ([#425](https://github.com/thelounge/thelounge/pull/425) by [@YaManicKill](https://github.com/YaManicKill))
- Add auto-grow textarea support ([#379](https://github.com/thelounge/thelounge/pull/379) by [@maxpoulin64](https://github.com/maxpoulin64))
- Display unhandled numerics on the client ([#286](https://github.com/thelounge/thelounge/pull/286) by [@xPaw](https://github.com/xPaw))
- A proper unread marker ([#332](https://github.com/thelounge/thelounge/pull/332) by [@xPaw](https://github.com/xPaw))
- Add information on the About section of the client ([#497](https://github.com/thelounge/thelounge/pull/497) by [@astorije](https://github.com/astorije))
- Add a red dot to the mobile menu icon when being notified ([#486](https://github.com/thelounge/thelounge/pull/486) by [@astorije](https://github.com/astorije))
- Add "The Lounge" label to the landing pages ([#487](https://github.com/thelounge/thelounge/pull/487) by [@astorije](https://github.com/astorije))
- Display network name on Connect page when network is locked and info is hidden ([#488](https://github.com/thelounge/thelounge/pull/488) by [@astorije](https://github.com/astorije))
- Display a loading message instead of blank page ([#386](https://github.com/thelounge/thelounge/pull/386) by [@xPaw](https://github.com/xPaw))
- Fall back to LOUNGE_HOME env variable when using the CLI ([#402](https://github.com/thelounge/thelounge/pull/402) by [@williamboman](https://github.com/williamboman))
- Enable auto reconnection ([#254](https://github.com/thelounge/thelounge/pull/254) by [@xPaw](https://github.com/xPaw))
- Add "!" modechar for admin ([#354](https://github.com/thelounge/thelounge/pull/354) by [@omnicons](https://github.com/omnicons))
- Add support for oidentd spoofing ([#256](https://github.com/thelounge/thelounge/pull/256) by [@maxpoulin64](https://github.com/maxpoulin64))
- Log enabled capabilities ([#272](https://github.com/thelounge/thelounge/pull/272) by [@xPaw](https://github.com/xPaw))
- Add support for `~` home folder expansion ([#284](https://github.com/thelounge/thelounge/pull/284) by [@maxpoulin64](https://github.com/maxpoulin64))
- Document supported node version ([#280](https://github.com/thelounge/thelounge/pull/280) by [@xPaw](https://github.com/xPaw))
- Implement WEBIRC ([#240](https://github.com/thelounge/thelounge/pull/240) by [@maxpoulin64](https://github.com/maxpoulin64))
- Add `manifest.json` for nicer mobile experience ([#310](https://github.com/thelounge/thelounge/pull/310) by [@xPaw](https://github.com/xPaw))

### Changed

- Cache loaded config and merge it with defaults ([#387](https://github.com/thelounge/thelounge/pull/387) by [@xPaw](https://github.com/xPaw))
- Ignore unnecessary files at release time ([#499](https://github.com/thelounge/thelounge/pull/499) by [@astorije](https://github.com/astorije))
- Improve font icon management, sizing and sharpness ([#493](https://github.com/thelounge/thelounge/pull/493) by [@astorije](https://github.com/astorije))
- Maintain scroll position after loading previous messages ([#496](https://github.com/thelounge/thelounge/pull/496) by [@davibe](https://github.com/davibe))
- Perform node version check as soon as possible ([#409](https://github.com/thelounge/thelounge/pull/409) by [@xPaw](https://github.com/xPaw))
- Prepend http protocol to www. links in chat ([#410](https://github.com/thelounge/thelounge/pull/410) by [@xPaw](https://github.com/xPaw))
- Change default configuration for `host` to allow OS to decide and use both IPv4 and IPv6 ([#432](https://github.com/thelounge/thelounge/pull/432) by [@maxpoulin64](https://github.com/maxpoulin64))
- Do not hide timestamps on small viewports ([#376](https://github.com/thelounge/thelounge/pull/376) by [@xPaw](https://github.com/xPaw))
- Drop `slate-irc`, switch to `irc-framework` ([#167](https://github.com/thelounge/thelounge/pull/167) by [@xPaw](https://github.com/xPaw))
- Improve sticky scroll ([#262](https://github.com/thelounge/thelounge/pull/262) by [@xPaw](https://github.com/xPaw))
- Minor wording changes for better clarity ([#305](https://github.com/thelounge/thelounge/pull/305) by [@astorije](https://github.com/astorije))
- Improve nick highlights ([#327](https://github.com/thelounge/thelounge/pull/327) by [@xPaw](https://github.com/xPaw))
- CSS classes in themes for nick colors ([#325](https://github.com/thelounge/thelounge/pull/325) by [@astorije](https://github.com/astorije))
- Replace all concatenated paths with Node's path.join ([#307](https://github.com/thelounge/thelounge/pull/307) by [@astorije](https://github.com/astorije))

### Deprecated

- Store channels in array format in user configuration files, deprecating previous format ([#417](https://github.com/thelounge/thelounge/pull/417) by [@xPaw](https://github.com/xPaw))

### Removed

- Disable tooltips on mobile to prevent them to stay after clicking ([#612](https://github.com/thelounge/thelounge/pull/612) by [@astorije](https://github.com/astorije))
- Remove Docker-related files now that we have a dedicated repository ([#288](https://github.com/thelounge/thelounge/pull/288) by [@astorije](https://github.com/astorije))
- Remove JavaScript scrollbar library ([#429](https://github.com/thelounge/thelounge/pull/429) by [@xPaw](https://github.com/xPaw))
- Remove navigator.standalone detection ([#427](https://github.com/thelounge/thelounge/pull/427) by [@xPaw](https://github.com/xPaw))
- Do not increase font size on highlight in morning theme ([#321](https://github.com/thelounge/thelounge/pull/321) by [@xPaw](https://github.com/xPaw))

### Fixed

- Remove font family redundancy, fix missed fonts, remove Open Sans ([#562](https://github.com/thelounge/thelounge/pull/562) by [@astorije](https://github.com/astorije))
- Stop propagation when hiding the chat through click/tapping the chat ([#455](https://github.com/thelounge/thelounge/pull/455) by [@williamboman](https://github.com/williamboman))
- Improve click handling on users and inline channels ([#366](https://github.com/thelounge/thelounge/pull/366) by [@xPaw](https://github.com/xPaw))
- Only load config if it exists ([#461](https://github.com/thelounge/thelounge/pull/461) by [@xPaw](https://github.com/xPaw))
- Send user to lobby of deleted chan when parting from active chan ([#489](https://github.com/thelounge/thelounge/pull/489) by [@astorije](https://github.com/astorije))
- Set title attribute on topic on initial page load ([#515](https://github.com/thelounge/thelounge/pull/515) by [@williamboman](https://github.com/williamboman))
- Save user's channels when they sort the channel list ([#401](https://github.com/thelounge/thelounge/pull/401) by [@xPaw](https://github.com/xPaw))
- Turn favicon red on page load if there are highlights ([#344](https://github.com/thelounge/thelounge/pull/344) by [@xPaw](https://github.com/xPaw))
- Keep chat stickied to the bottom on resize ([#346](https://github.com/thelounge/thelounge/pull/346) by [@maxpoulin64](https://github.com/maxpoulin64))
- Only increase unread counter for whitelisted actions ([#273](https://github.com/thelounge/thelounge/pull/273) by [@xPaw](https://github.com/xPaw))
- Parse CTCP replies ([#278](https://github.com/thelounge/thelounge/pull/278) by [@xPaw](https://github.com/xPaw))
- Do not count your own messages as unread ([#279](https://github.com/thelounge/thelounge/pull/279) by [@xPaw](https://github.com/xPaw))
- Do not display incorrect nick when switching to a non connected network ([#252](https://github.com/thelounge/thelounge/pull/252) by [@xPaw](https://github.com/xPaw))
- Keep autocompletion sort whenever user list updates ([#217](https://github.com/thelounge/thelounge/pull/217) by [@xPaw](https://github.com/xPaw))
- Save user when parting channels ([#297](https://github.com/thelounge/thelounge/pull/297) by [@xPaw](https://github.com/xPaw))
- Add labels in connect window ([#300](https://github.com/thelounge/thelounge/pull/300) by [@xPaw](https://github.com/xPaw))
- Add missing `aria-label` on icon buttons ([#303](https://github.com/thelounge/thelounge/pull/303) by [@astorije](https://github.com/astorije))
- Fix missing colors in action messages ([#317](https://github.com/thelounge/thelounge/pull/317) by [@astorije](https://github.com/astorije))
- Don't falsely report failed write if it didn't fail ([`e6990e0`](https://github.com/thelounge/thelounge/commit/e6990e0fc7641d18a5bcbabddca1aacf2254ae52) by [@xPaw](https://github.com/xPaw))
- Fix sending messages starting with a space ([#320](https://github.com/thelounge/thelounge/pull/320) by [@maxpoulin64](https://github.com/maxpoulin64))
- Fix notifications in query windows ([#334](https://github.com/thelounge/thelounge/pull/334) by [@xPaw](https://github.com/xPaw))

### Security

- Implement user token persistency ([#370](https://github.com/thelounge/thelounge/pull/370) by [@xPaw](https://github.com/xPaw))
- Restrict access to the home directory by default ([#205](https://github.com/thelounge/thelounge/pull/205) by [@maxpoulin64](https://github.com/maxpoulin64))
- Add security headers to minimize XSS damage ([#292](https://github.com/thelounge/thelounge/pull/292) by [@xPaw](https://github.com/xPaw))
- Do not write user configs outside of the app's users directory ([#238](https://github.com/thelounge/thelounge/pull/238) by [@williamboman](https://github.com/williamboman))
- Don't check for existing password emptiness ([#315](https://github.com/thelounge/thelounge/pull/315) by [@maxpoulin64](https://github.com/maxpoulin64))

## v2.0.0-rc.2 - 2016-09-21 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.0.0-rc.1...v2.0.0-rc.2)

This release candidate only fixes a UI bug affecting iOS 8 users, introduced in v2.0.0-pre.5.

### Fixed

- Fix flexboxes to work on iOS 8 ([#626](https://github.com/thelounge/thelounge/pull/626) by [@Gilles123](https://github.com/Gilles123))

## v2.0.0-rc.1 - 2016-09-17 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.0.0-pre.7...v2.0.0-rc.1)

Prior to this release, users of Safari 10 were not able to access The Lounge anymore, because of a conscious change the WebKit made to their support of CSP, as [explained here](https://webkit.org/blog/6830/a-refined-content-security-policy/). This release addresses this issue.

Another notable change is the removal of tooltips on mobiles, as hovering states on mobile devices breaks in different kind of ways. Hopefully there will be a better solution in the future, or better support across mobiles.

This is also the first release candidate for v2.0.0. This means only critical bug fixes will be merged before releasing v2.0.0.

### Changed

- Explicitly authorize websockets in CSP header ([#597](https://github.com/thelounge/thelounge/pull/597) by [@astorije](https://github.com/astorije))

### Removed

- Disable tooltips on mobile to prevent them to stay after clicking ([#612](https://github.com/thelounge/thelounge/pull/612) by [@astorije](https://github.com/astorije))

### Fixed

- Fix small input text on Morning and Zenburn ([#601](https://github.com/thelounge/thelounge/pull/601) by [@astorije](https://github.com/astorije))
- Fix a left margin appearing on all non-default themes ([#615](https://github.com/thelounge/thelounge/pull/615) by [@astorije](https://github.com/astorije))

## v2.0.0-pre.7 - 2016-09-08 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.0.0-pre.6...v2.0.0-pre.7)

This prerelease fixes a lot of bugs on both the server and the client. It also adds a theme selector on the client and connection debug log level on the server. Additionally, custom highlights are now case-insensitive.

### Added

- Add tooltips on every clickable icons ([#540](https://github.com/thelounge/thelounge/pull/540) by [@astorije](https://github.com/astorije))
- Add debug config option for `irc-framework` debug log ([#547](https://github.com/thelounge/thelounge/pull/547) by [@maxpoulin64](https://github.com/maxpoulin64))
- Client-side theme selector ([#568](https://github.com/thelounge/thelounge/pull/568) by [@astorije](https://github.com/astorije))

### Changed

- Use our logger instead of `console.log` and `console.error` for LDAP logs ([#552](https://github.com/thelounge/thelounge/pull/552) by [@astorije](https://github.com/astorije))
- Make custom highlights case-insensitive ([#565](https://github.com/thelounge/thelounge/pull/565) by [@astorije](https://github.com/astorije))
- Bump `request` dependency to 2.74.0 ([#563](https://github.com/thelounge/thelounge/pull/563) by [@astorije](https://github.com/astorije))
- Mention wiki in README ([#548](https://github.com/thelounge/thelounge/pull/548) by [@MaxLeiter](https://github.com/MaxLeiter))
- Support ES6 features in JS linting outside of client code ([#593](https://github.com/thelounge/thelounge/pull/593) by [@williamboman](https://github.com/williamboman))

### Fixed

- Fix token persistency across server refreshes ([#553](https://github.com/thelounge/thelounge/pull/553) by [@astorije](https://github.com/astorije))
- Make sure input height is reset when submitting with icon ([#555](https://github.com/thelounge/thelounge/pull/555) by [@astorije](https://github.com/astorije))
- Fix webirc and 4-in-6 addresses ([#535](https://github.com/thelounge/thelounge/pull/535) by [@maxpoulin64](https://github.com/maxpoulin64))
- Allow long URLs to break onto next line on Chrome ([#576](https://github.com/thelounge/thelounge/pull/576) by [@astorije](https://github.com/astorije))
- Make sure users with wrong tokens are locked out instead of crashing the app ([#570](https://github.com/thelounge/thelounge/pull/570) by [@astorije](https://github.com/astorije))
- Remove font family redundancy, fix missed fonts, remove Open Sans ([#562](https://github.com/thelounge/thelounge/pull/562) by [@astorije](https://github.com/astorije))
- Do not set app orientation in manifest to use user setting at OS level ([#587](https://github.com/thelounge/thelounge/pull/587) by [@astorije](https://github.com/astorije))
- Move border-radius from `#main` to `.window elements` to fix radius once and for all ([#572](https://github.com/thelounge/thelounge/pull/572) by [@astorije](https://github.com/astorije))

## v2.0.0-pre.6 - 2016-08-10 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.0.0-pre.5...v2.0.0-pre.6)

LDAP! That's all there is to be found in this pre-release, but it should please some administrators out there. Big thanks to [@thisisdarshan](https://github.com/thisisdarshan) and [@lindskogen](https://github.com/lindskogen) for sticking with us on this one.

This feature will remain in beta version until the official v2.0.0 release.

### Added

- LDAP support ([#477](https://github.com/thelounge/thelounge/pull/477) by [@thisisdarshan](https://github.com/thisisdarshan) and [@lindskogen](https://github.com/lindskogen))

## v2.0.0-pre.5 - 2016-08-07 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.0.0-pre.4...v2.0.0-pre.5)

What an exciting release! It's been in the works for more than a month, but the perks are worth the wait.

On the user side, some long-awaited new features can now be found: The Lounge can now track custom highlights, it comes with an auto-expanding text field, and an unread message marker helps keeping track of what happened when you were not watching. A lot of improvements and various bug fixes have been made to the UI.
Note that scrollbar look-and-feel is now delegated to the browser and OS. Use the custom CSS editor and your OS settings to customize them.

Administrators will notice a different format for channels in the user configuration files, and the Docker-related files have been moved to [a dedicated repository](https://github.com/thelounge/docker-lounge). Many bugs have been solved on the server as well.

### Added

- Add custom highlights ([#425](https://github.com/thelounge/thelounge/pull/425) by [@YaManicKill](https://github.com/YaManicKill))
- Add auto-grow textarea support ([#379](https://github.com/thelounge/thelounge/pull/379) by [@maxpoulin64](https://github.com/maxpoulin64))
- Display unhandled numerics on the client ([#286](https://github.com/thelounge/thelounge/pull/286) by [@xPaw](https://github.com/xPaw))
- A proper unread marker ([#332](https://github.com/thelounge/thelounge/pull/332) by [@xPaw](https://github.com/xPaw))
- Add information on the About section of the client ([#497](https://github.com/thelounge/thelounge/pull/497) by [@astorije](https://github.com/astorije))
- Add a red dot to the mobile menu icon when being notified ([#486](https://github.com/thelounge/thelounge/pull/486) by [@astorije](https://github.com/astorije))
- Add "The Lounge" label to the landing pages ([#487](https://github.com/thelounge/thelounge/pull/487) by [@astorije](https://github.com/astorije))
- Display network name on Connect page when network is locked and info is hidden ([#488](https://github.com/thelounge/thelounge/pull/488) by [@astorije](https://github.com/astorije))

### Changed

- Store channels in array format in user configuration files ([#417](https://github.com/thelounge/thelounge/pull/417) by [@xPaw](https://github.com/xPaw))
- Cache loaded config and merge it with defaults ([#387](https://github.com/thelounge/thelounge/pull/387) by [@xPaw](https://github.com/xPaw))
- Ignore unnecessary files at release time ([#499](https://github.com/thelounge/thelounge/pull/499) by [@astorije](https://github.com/astorije))
- Improve font icon management, sizing and sharpness ([#493](https://github.com/thelounge/thelounge/pull/493) by [@astorije](https://github.com/astorije))
- Maintain scroll position after loading previous messages ([#496](https://github.com/thelounge/thelounge/pull/496) by [@davibe](https://github.com/davibe))

### Removed

- Remove Docker-related files ([#288](https://github.com/thelounge/thelounge/pull/288) by [@astorije](https://github.com/astorije))
- Remove JavaScript scrollbar library ([#429](https://github.com/thelounge/thelounge/pull/429) by [@xPaw](https://github.com/xPaw))

### Fixed

- Fix storing the updated authentication token ([#437](https://github.com/thelounge/thelounge/pull/437) by [@williamboman](https://github.com/williamboman))
- Update `irc-framework` to 2.3.0 to fix a bug occurring when posting messages starting with a colon ([#449](https://github.com/thelounge/thelounge/pull/449) by [@xPaw](https://github.com/xPaw))
- Update `irc-framework` to 2.4.0 to fix a buffering issue ([#451](https://github.com/thelounge/thelounge/pull/451) by [@maxpoulin64](https://github.com/maxpoulin64))
- Only auto join actual channels ([#453](https://github.com/thelounge/thelounge/pull/453) by [@xPaw](https://github.com/xPaw))
- Only trigger custom highlights for non-self messages and notices ([#454](https://github.com/thelounge/thelounge/pull/454) by [@xPaw](https://github.com/xPaw))
- Stop propagation when hiding the chat through click/tapping the chat ([#455](https://github.com/thelounge/thelounge/pull/455) by [@williamboman](https://github.com/williamboman))
- Improve click handling on users and inline channels ([#366](https://github.com/thelounge/thelounge/pull/366) by [@xPaw](https://github.com/xPaw))
- Update `irc-framework` to 2.5.0 to fix reconnection counter not being reset ([#451](https://github.com/thelounge/thelounge/pull/451) by [@xPaw](https://github.com/xPaw))
- Register irc-framework events before connecting ([#458](https://github.com/thelounge/thelounge/pull/458) by [@xPaw](https://github.com/xPaw))
- Only load config if it exists ([#461](https://github.com/thelounge/thelounge/pull/461) by [@xPaw](https://github.com/xPaw))
- Fix window layout a bit ([#465](https://github.com/thelounge/thelounge/pull/465) by [@maxpoulin64](https://github.com/maxpoulin64))
- Fix slight bugs introduced by #379 and #465 ([#467](https://github.com/thelounge/thelounge/pull/467) by [@maxpoulin64](https://github.com/maxpoulin64))
- Prevent the app from crashing when no theme is specified ([#474](https://github.com/thelounge/thelounge/pull/474) by [@astorije](https://github.com/astorije))
- Fix unread marker disappearing when opacity set to 1 ([#471](https://github.com/thelounge/thelounge/pull/471) by [@astorije](https://github.com/astorije))
- Fix breaking layout when switching portrait/landscape modes ([#478](https://github.com/thelounge/thelounge/pull/478) by [@astorije](https://github.com/astorije))
- Fix chat not being "stickied" to the bottom when joining channel ([#484](https://github.com/thelounge/thelounge/pull/484) by [@williamboman](https://github.com/williamboman))
- Add self info to TOGGLE messages to prevent unread marker to render for oneself ([#473](https://github.com/thelounge/thelounge/pull/473) by [@astorije](https://github.com/astorije))
- Send user to lobby of deleted chan when parting from active chan ([#489](https://github.com/thelounge/thelounge/pull/489) by [@astorije](https://github.com/astorije))
- Use `min-height` of textarea when computing auto-resize after deleting a char ([#504](https://github.com/thelounge/thelounge/pull/504) by [@astorije](https://github.com/astorije))
- Set title attribute on topic on initial page load ([#515](https://github.com/thelounge/thelounge/pull/515) by [@williamboman](https://github.com/williamboman))
- Make sure git commit check for the About section would not send stderr to the console ([#516](https://github.com/thelounge/thelounge/pull/516) by [@astorije](https://github.com/astorije))
- Create a single function to render networks to reduce code duplication ([#445](https://github.com/thelounge/thelounge/pull/445) by [@xPaw](https://github.com/xPaw))
- Reset the unread marker on channel change ([#527](https://github.com/thelounge/thelounge/pull/527) by [@maxpoulin64](https://github.com/maxpoulin64))
- Fix accidentally removed border-radius ([#537](https://github.com/thelounge/thelounge/pull/537) by [@astorije](https://github.com/astorije))
- Fix font size in themes for new textarea ([#536](https://github.com/thelounge/thelounge/pull/536) by [@maxpoulin64](https://github.com/maxpoulin64))
- Restore padding and height of message input pre-textarea era ([#539](https://github.com/thelounge/thelounge/pull/539) by [@astorije](https://github.com/astorije))
- Prevent Ctrl-Tab from triggering tab completion ([#541](https://github.com/thelounge/thelounge/pull/541) by [@hho](https://github.com/hho))

## v2.0.0-pre.4 - 2016-06-29 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.0.0-pre.3...v2.0.0-pre.4)

This pre-release adds a loading window, helpful on slow connections.
It also implements token persistency, ensuring users do not have to authenticate at every server restart. As a side effect, security is improved by forcing logging out users on all devices when changing their password.

All generated URLs are now HTTP by default, except when explicitly set to HTTPS. For example, `www.example.com` will link to `http://www.example.com`. One needs to share `https://www.example.com` to point others to a HTTPS location.

As a few users have been having issues when running The Lounge with a non-supported Node.js version, we now detect it early to avoid cryptic errors.

This pre-release also adds minor UI improvements, and fixes from the previous version.
While The Lounge still needs a lot of efforts to be fully accessible, this version slightly improves accessibility on clickable nickname.

Internally, we now keep track of our code coverage, which we do not enforce strictly at the moment.

### Added

- Add code coverage ([#408](https://github.com/thelounge/thelounge/pull/408) by [@astorije](https://github.com/astorije))
- Display a loading message instead of blank page ([#386](https://github.com/thelounge/thelounge/pull/386) by [@xPaw](https://github.com/xPaw))

### Changed

- Perform node version check as soon as possible ([#409](https://github.com/thelounge/thelounge/pull/409) by [@xPaw](https://github.com/xPaw))
- Prepend http protocol to www. links in chat ([#410](https://github.com/thelounge/thelounge/pull/410) by [@xPaw](https://github.com/xPaw))
- Use tabs when saving user configs ([#418](https://github.com/thelounge/thelounge/pull/418) by [@xPaw](https://github.com/xPaw))
- Do not display the sidebar on sign-in page ([#420](https://github.com/thelounge/thelounge/pull/420) by [@astorije](https://github.com/astorije))
- Make style of loading page similar to other pages ([#423](https://github.com/thelounge/thelounge/pull/423) by [@astorije](https://github.com/astorije))
- Change default configuration for `host` to allow OS to decide and use both IPv4 and IPv6 ([#432](https://github.com/thelounge/thelounge/pull/432) by [@maxpoulin64](https://github.com/maxpoulin64))
- Change nicks from links to spans everywhere ([#428](https://github.com/thelounge/thelounge/pull/428) by [@xPaw](https://github.com/xPaw))
- Increase join delay at connection to 1000ms ([#434](https://github.com/thelounge/thelounge/pull/434) by [@williamboman](https://github.com/williamboman))

### Removed

- Remove navigator.standalone detection ([#427](https://github.com/thelounge/thelounge/pull/427) by [@xPaw](https://github.com/xPaw))

### Fixed

- Do not lose authentication token when the connection gets lost ([#369](https://github.com/thelounge/thelounge/pull/369) by [@xPaw](https://github.com/xPaw))
- Fix crash in public mode ([#413](https://github.com/thelounge/thelounge/pull/413) by [@maxpoulin64](https://github.com/maxpoulin64))
- Do not print user loaded message in public mode ([#415](https://github.com/thelounge/thelounge/pull/415) by [@xPaw](https://github.com/xPaw))
- Fix focusing input when clicking chat container on the client ([#364](https://github.com/thelounge/thelounge/pull/364) by [@williamboman](https://github.com/williamboman))
- Fix channel join regression and fix possibly joining parted channels ([#411](https://github.com/thelounge/thelounge/pull/411) by [@xPaw](https://github.com/xPaw))

### Security

- Implement user token persistency ([#370](https://github.com/thelounge/thelounge/pull/370) by [@xPaw](https://github.com/xPaw))

## v2.0.0-pre.3 - 2016-06-15 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.0.0-pre.2...v2.0.0-pre.3)

This release introduces a few internal changes as well as two noticeable ones. When using the CLI, the home path can now be set with the `LOUNGE_HOME` environment variable, to avoid repeating `--home` over and over. On the client, sorting channels will now be saved in the user configuration.

### Added

- Fall back to LOUNGE_HOME env variable when using the CLI ([#402](https://github.com/thelounge/thelounge/pull/402) by [@williamboman](https://github.com/williamboman))

### Changed

- Rename package variable to pkg, as "package" is reserved. ([#399](https://github.com/thelounge/thelounge/pull/399) by [@hogofwar](https://github.com/hogofwar))
- Capitalise constructor Oidentd ([#396](https://github.com/thelounge/thelounge/pull/396) by [@hogofwar](https://github.com/hogofwar))
- Bump stylelint and update Travis CI configuration to include OSX builds and package caching ([#403](https://github.com/thelounge/thelounge/pull/403) by [@xPaw](https://github.com/xPaw))

### Removed

- Supersede `mkdirp` with `fs-extra` ([#390](https://github.com/thelounge/thelounge/pull/390) by [@hogofwar](https://github.com/hogofwar))
- Remove redundant variables ([#397](https://github.com/thelounge/thelounge/pull/397) by [@hogofwar](https://github.com/hogofwar))

### Fixed

- Save user's channels when they sort the channel list ([#401](https://github.com/thelounge/thelounge/pull/401) by [@xPaw](https://github.com/xPaw))
- Fix description of `host` and `bind` config options ([#378](https://github.com/thelounge/thelounge/pull/378) by [@maxpoulin64](https://github.com/maxpoulin64))

## v2.0.0-pre.2 - 2016-06-09 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v2.0.0-pre.1...v2.0.0-pre.2)

This pre-release adds a very, very long-awaited feature: auto-reconnection! It also extends our support of ident with oidentd, shows timestamps on small screens and fix bugs around notifications and sticky scroll.

### Added

- Enable auto reconnection ([#254](https://github.com/thelounge/thelounge/pull/254) by [@xPaw](https://github.com/xPaw))
- Add "!" modechar for admin ([#354](https://github.com/thelounge/thelounge/pull/354) by [@omnicons](https://github.com/omnicons))
- Add CI tool for Windows builds ([#367](https://github.com/thelounge/thelounge/pull/367) by [@astorije](https://github.com/astorije))
- Add support for oidentd spoofing ([#256](https://github.com/thelounge/thelounge/pull/256) by [@maxpoulin64](https://github.com/maxpoulin64))

### Changed

- Update Font Awesome to v4.6.3 ([#355](https://github.com/thelounge/thelounge/pull/355) by [@MaxLeiter](https://github.com/MaxLeiter))
- Do not hide timestamps on small viewports ([#376](https://github.com/thelounge/thelounge/pull/376) by [@xPaw](https://github.com/xPaw))
- Fetch Font Awesome from npm instead of embedded in repo ([#361](https://github.com/thelounge/thelounge/pull/361) by [@astorije](https://github.com/astorije))
- Cache npm modules on appveyor ([#381](https://github.com/thelounge/thelounge/pull/381) by [@xPaw](https://github.com/xPaw))
- Update eslint and enforce key-spacing ([#384](https://github.com/thelounge/thelounge/pull/384) by [@xPaw](https://github.com/xPaw))
- Use `npm-run-all` in npm scripts for testing and linting ([#375](https://github.com/thelounge/thelounge/pull/375) by [@williamboman](https://github.com/williamboman))
- Upload test results on appveyor builds ([#382](https://github.com/thelounge/thelounge/pull/382) by [@xPaw](https://github.com/xPaw))

### Fixed

- Turn favicon red on page load if there are highlights ([#344](https://github.com/thelounge/thelounge/pull/344) by [@xPaw](https://github.com/xPaw))
- Do not send completely empty messages ([#345](https://github.com/thelounge/thelounge/pull/345) by [@maxpoulin64](https://github.com/maxpoulin64))
- Make sure npm test script gets run on AppVeyor ([#372](https://github.com/thelounge/thelounge/pull/372) by [@astorije](https://github.com/astorije))
- Keep chat stickied to the bottom on resize ([#346](https://github.com/thelounge/thelounge/pull/346) by [@maxpoulin64](https://github.com/maxpoulin64))

## v2.0.0-pre.1 - 2016-05-22 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v1.5.0...v2.0.0-pre.1)

This is a pre-release to allow early adopters to use The Lounge with [`irc-framework`](https://github.com/kiwiirc/irc-framework) as our underlying IRC library instead of [`slate`](https://github.com/slate/slate-irc). This change itself solves a lot of issues and adds many features, most of them [listed here](https://github.com/thelounge/thelounge/pull/167#issue-139286868): IRCv3 compliance, user feedback improvement, etc.

It also adds WEBIRC support, a better server logging capability, a web app manifest, improves the sticky scroll, and fixes a ton of bugs.

### Added

- Log enabled capabilities ([#272](https://github.com/thelounge/thelounge/pull/272) by [@xPaw](https://github.com/xPaw))
- Add global logging helper ([#257](https://github.com/thelounge/thelounge/pull/257) by [@xPaw](https://github.com/xPaw))
- Add support for `~` home folder expansion ([#284](https://github.com/thelounge/thelounge/pull/284) by [@maxpoulin64](https://github.com/maxpoulin64))
- Document supported node version ([#280](https://github.com/thelounge/thelounge/pull/280) by [@xPaw](https://github.com/xPaw))
- Add support for echo-message and znc.in/self-message caps ([#270](https://github.com/thelounge/thelounge/pull/270) by [@xPaw](https://github.com/xPaw))
- Implement WEBIRC ([#240](https://github.com/thelounge/thelounge/pull/240) by [@maxpoulin64](https://github.com/maxpoulin64))
- Add `manifest.json` for nicer mobile experience ([#310](https://github.com/thelounge/thelounge/pull/310) by [@xPaw](https://github.com/xPaw))

### Changed

- Drop `slate-irc`, switch to `irc-framework` ([#167](https://github.com/thelounge/thelounge/pull/167) by [@xPaw](https://github.com/xPaw))
- Create a single helper function to write messages ([#266](https://github.com/thelounge/thelounge/pull/266) by [@xPaw](https://github.com/xPaw))
- Update dependencies ([#281](https://github.com/thelounge/thelounge/pull/281) by [@xPaw](https://github.com/xPaw))
- Improve sticky scroll ([#262](https://github.com/thelounge/thelounge/pull/262) by [@xPaw](https://github.com/xPaw))
- Change license link to point at our license file ([#290](https://github.com/thelounge/thelounge/pull/290) by [@xPaw](https://github.com/xPaw))
- Stricter eslint rule for curly brackets ([#291](https://github.com/thelounge/thelounge/pull/291) by [@xPaw](https://github.com/xPaw))
- Bump patch version of lodash to 4.11.2 ([#306](https://github.com/thelounge/thelounge/pull/306) by [@astorije](https://github.com/astorije))
- Minor wording changes for better clarity ([#305](https://github.com/thelounge/thelounge/pull/305) by [@astorije](https://github.com/astorije))
- Improve tests execution ([#260](https://github.com/thelounge/thelounge/pull/260) by [@maxpoulin64](https://github.com/maxpoulin64))
- Update irc-framework ([#324](https://github.com/thelounge/thelounge/pull/324) by [@xPaw](https://github.com/xPaw))
- Do not ignore our handlebars plugins in ESLint ([#329](https://github.com/thelounge/thelounge/pull/329) by [@xPaw](https://github.com/xPaw))
- Improve nick highlights ([#327](https://github.com/thelounge/thelounge/pull/327) by [@xPaw](https://github.com/xPaw))
- CSS classes in themes for nick colors ([#325](https://github.com/thelounge/thelounge/pull/325) by [@astorije](https://github.com/astorije))
- Replace all concatenated paths with Node's path.join ([#307](https://github.com/thelounge/thelounge/pull/307) by [@astorije](https://github.com/astorije))

### Removed

- Do not increase font size on highlight in morning theme ([#321](https://github.com/thelounge/thelounge/pull/321) by [@xPaw](https://github.com/xPaw))

### Fixed

- Only increase unread counter for whitelisted actions ([#273](https://github.com/thelounge/thelounge/pull/273) by [@xPaw](https://github.com/xPaw))
- Parse CTCP replies ([#278](https://github.com/thelounge/thelounge/pull/278) by [@xPaw](https://github.com/xPaw))
- Do not count your own messages as unread ([#279](https://github.com/thelounge/thelounge/pull/279) by [@xPaw](https://github.com/xPaw))
- Use lowercase global to avoid a deprecation warning in Node.js 6 ([`d9a0dd9`](https://github.com/thelounge/thelounge/commit/d9a0dd9406e8fb22d7a5ee1ed4ed7aa8e5f0fa01) by [@xPaw](https://github.com/xPaw))
- Do not display incorrect nick when switching to a non connected network ([#252](https://github.com/thelounge/thelounge/pull/252) by [@xPaw](https://github.com/xPaw))
- Keep autocompletion sort whenever user list updates ([#217](https://github.com/thelounge/thelounge/pull/217) by [@xPaw](https://github.com/xPaw))
- Make sure app does not crash when webirc is not defined in the configuration ([#294](https://github.com/thelounge/thelounge/pull/294) by [@astorije](https://github.com/astorije))
- Save user when parting channels ([#297](https://github.com/thelounge/thelounge/pull/297) by [@xPaw](https://github.com/xPaw))
- Add labels in connect window ([#300](https://github.com/thelounge/thelounge/pull/300) by [@xPaw](https://github.com/xPaw))
- Add missing `aria-label` on icon buttons ([#303](https://github.com/thelounge/thelounge/pull/303) by [@astorije](https://github.com/astorije))
- Fix unread counter not being formatted on page load ([#308](https://github.com/thelounge/thelounge/pull/308) by [@xPaw](https://github.com/xPaw))
- Fix wrong CSS for disabled colored nicknames on themes ([#318](https://github.com/thelounge/thelounge/pull/318) by [@astorije](https://github.com/astorije))
- Fix missing colors in action messages ([#317](https://github.com/thelounge/thelounge/pull/317) by [@astorije](https://github.com/astorije))
- Don't falsely report failed write if it didn't fail ([`e6990e0`](https://github.com/thelounge/thelounge/commit/e6990e0fc7641d18a5bcbabddca1aacf2254ae52) by [@xPaw](https://github.com/xPaw))
- Fix sending messages starting with a space ([#320](https://github.com/thelounge/thelounge/pull/320) by [@maxpoulin64](https://github.com/maxpoulin64))
- Fix notifications in query windows ([#334](https://github.com/thelounge/thelounge/pull/334) by [@xPaw](https://github.com/xPaw))

### Security

- Restrict access to the home directory by default ([#205](https://github.com/thelounge/thelounge/pull/205) by [@maxpoulin64](https://github.com/maxpoulin64))
- Update demo link to HTTPS ([#302](https://github.com/thelounge/thelounge/pull/302) by [@MaxLeiter](https://github.com/MaxLeiter))
- Add security headers to minimize XSS damage ([#292](https://github.com/thelounge/thelounge/pull/292) by [@xPaw](https://github.com/xPaw))
- Do not write user configs outside of the app's users directory ([#238](https://github.com/thelounge/thelounge/pull/238) by [@williamboman](https://github.com/williamboman))
- Don't check for existing password emptiness ([#315](https://github.com/thelounge/thelounge/pull/315) by [@maxpoulin64](https://github.com/maxpoulin64))

## v1.5.0 - 2016-04-13

[See the full changelog](https://github.com/thelounge/thelounge/compare/v1.4.3...v1.5.0)

With this release, administrators can now define a maximum size for channel history.
While this is not optimal nor the definitive solution, it aims at reducing stability issues where The Lounge would crash after filling up the server's memory.

Other changes noticeable by users include removing custom print styles and preventing sequences of white spaces to collapse into one.

### Added

- Add config option to limit in-memory history size ([#243](https://github.com/thelounge/thelounge/pull/243) by [@maxpoulin64](https://github.com/maxpoulin64))

### Changed

- Do not parse link titles for IRC formatting ([#245](https://github.com/thelounge/thelounge/pull/245) by [@xPaw](https://github.com/xPaw))
- Display multiple white spaces properly ([#239](https://github.com/thelounge/thelounge/pull/239) by [@maxpoulin64](https://github.com/maxpoulin64))
- Reword password prompt of `add` and `reset` CLI commands ([#230](https://github.com/thelounge/thelounge/pull/230) by [@williamboman](https://github.com/williamboman))

### Removed

- Remove print styles ([#228](https://github.com/thelounge/thelounge/pull/228) by [@xPaw](https://github.com/xPaw))

## v1.4.3 - 2016-04-02

[See the full changelog](https://github.com/thelounge/thelounge/compare/v1.4.2...v1.4.3)

This PR fixes a bug introduced in v1.3.0 which prevents deleting disconnected networks from users' configuration files.

### Fixed

- Fix not being able to remove networks from user config ([#233](https://github.com/thelounge/thelounge/pull/233) by [@xPaw](https://github.com/xPaw))

## v1.4.2 - 2016-03-31

[See the full changelog](https://github.com/thelounge/thelounge/compare/v1.4.1...v1.4.2)

This PR fixes a bug introduced in v1.4.1 causing timestamps to use most of the screen.

### Fixed

- Hide options will now remove the entire row ([#227](https://github.com/thelounge/thelounge/pull/227) by [@xPaw](https://github.com/xPaw))

## v1.4.1 - 2016-03-28

[See the full changelog](https://github.com/thelounge/thelounge/compare/v1.4.0...v1.4.1)

As of this release, running `/query nick` will simply open a chat window with user `nick`, instead of calling `whois` for this user.

### Changed

- Remove `join`, `nick` and `whois` inputs, they are cleanly handled by the server ([#208](https://github.com/thelounge/thelounge/pull/208) by [@xPaw](https://github.com/xPaw))
- Add a `/query` command that simply opens a query window ([#218](https://github.com/thelounge/thelounge/pull/218) by [@xPaw](https://github.com/xPaw))
- Disallow `/query` on non-nicks ([#221](https://github.com/thelounge/thelounge/pull/221) by [@astorije](https://github.com/astorije))

### Fixed

- Fix message and topic text wrapping ([#215](https://github.com/thelounge/thelounge/pull/215) by [@xPaw](https://github.com/xPaw))
- Fix `/part` command ([#222](https://github.com/thelounge/thelounge/pull/222) by [@maxpoulin64](https://github.com/maxpoulin64))
- Harden URL fetcher and don't crash on non-ASCII urls ([#219](https://github.com/thelounge/thelounge/pull/219) by [@xPaw](https://github.com/xPaw))

## v1.4.0 - 2016-03-20

[See the full changelog](https://github.com/thelounge/thelounge/compare/v1.3.1...v1.4.0)

Note that this release will reset users' notification settings to their defaults. This unfortunate side effect is the consequence of an improvement of how this setting is handled in the application.

### Added

- Add context menu when right-clicking on a sidebar item ([#9](https://github.com/thelounge/thelounge/pull/9) by [@xPaw](https://github.com/xPaw))
- Add tests for the `Chan#sortUsers` method ([#197](https://github.com/thelounge/thelounge/pull/197) by [@astorije](https://github.com/astorije))
- Add a very basic test for `Network#export` ([#198](https://github.com/thelounge/thelounge/pull/198) by [@astorije](https://github.com/astorije))
- Link to the demo from the IRC channel badge on the README ([#203](https://github.com/thelounge/thelounge/pull/203) by [@Henni](https://github.com/Henni))
- Add support for HTTP/2 ([#174](https://github.com/thelounge/thelounge/pull/174) by [@xPaw](https://github.com/xPaw))
- Support port in `/connect` command ([#210](https://github.com/thelounge/thelounge/pull/210) by [@xPaw](https://github.com/xPaw))

### Changed

- Update Handlebars to 4.0.5 ([#140](https://github.com/thelounge/thelounge/pull/140) by [@xPaw](https://github.com/xPaw))
- Update Socket.IO to 1.4.5 and use client library provided by the dependency ([#142](https://github.com/thelounge/thelounge/pull/142) by [@xPaw](https://github.com/xPaw))
- Update ESLint to 2.3.0 and add stricter rules ([#171](https://github.com/thelounge/thelounge/pull/171) by [@xPaw](https://github.com/xPaw))
- Mute color of the topic actions ([#151](https://github.com/thelounge/thelounge/pull/151) by [@astorije](https://github.com/astorije))
- Rename "badge" setting and rely on browser choice for desktop notifications ([#28](https://github.com/thelounge/thelounge/pull/28) by [@lpoujol](https://github.com/lpoujol))
- Invoke `handlebars` outside of `grunt` and generate a sourcemap ([#144](https://github.com/thelounge/thelounge/pull/144) by [@xPaw](https://github.com/xPaw))
- Make `whois` a client action template and improve its output ([#161](https://github.com/thelounge/thelounge/pull/161) by [@xPaw](https://github.com/xPaw))
- Handle commands in a better way and send unknown commands to the IRC server ([#154](https://github.com/thelounge/thelounge/pull/154) by [@xPaw](https://github.com/xPaw))
- Switch the Send button to a paper plane icon ([#182](https://github.com/thelounge/thelounge/pull/182) by [@astorije](https://github.com/astorije))
- Keep track of highlights when user is offline ([#190](https://github.com/thelounge/thelounge/pull/190) by [@xPaw](https://github.com/xPaw))
- Load input plugins at startup and call them directly when a command is received ([#191](https://github.com/thelounge/thelounge/pull/191) by [@astorije](https://github.com/astorije))
- Make defaults for socket.io transports consistent to use polling before websocket ([#202](https://github.com/thelounge/thelounge/pull/202) by [@xPaw](https://github.com/xPaw))
- Update all server dependencies to current stable versions ([#200](https://github.com/thelounge/thelounge/pull/200) by [@xPaw](https://github.com/xPaw))
- Update configuration file to reflect HTTP/2 support addition ([#206](https://github.com/thelounge/thelounge/pull/206) by [@astorije](https://github.com/astorije))
- Change close button behavior and add a dropdown context menu ([#184](https://github.com/thelounge/thelounge/pull/184) by [@xPaw](https://github.com/xPaw))
- Minor enhancements of the context menu UI ([#212](https://github.com/thelounge/thelounge/pull/212) by [@astorije](https://github.com/astorije))

### Removed

- Remove `string.contains` library ([#163](https://github.com/thelounge/thelounge/pull/163) by [@xPaw](https://github.com/xPaw))
- Remove Moment.js library from the client ([#183](https://github.com/thelounge/thelounge/pull/183) by [@xPaw](https://github.com/xPaw))
- Disabled emails from Travis CI on successful builds ([#172](https://github.com/thelounge/thelounge/pull/172) by [@xPaw](https://github.com/xPaw))
- Remove unnecessary operation when sorting users ([#193](https://github.com/thelounge/thelounge/pull/193) by [@astorije](https://github.com/astorije))

### Fixed

- Make sure self messages are never highlighted and improve highlight lookup ([#157](https://github.com/thelounge/thelounge/pull/157) by [@astorije](https://github.com/astorije))
- Fix Send button style on Zenburn and Morning themes, introduced by this release ([#187](https://github.com/thelounge/thelounge/pull/187) by [@astorije](https://github.com/astorije))
- Make sure all close buttons in the sidebar have same weight ([#192](https://github.com/thelounge/thelounge/pull/192) by [@astorije](https://github.com/astorije))
- Disallow parting from lobbies ([#209](https://github.com/thelounge/thelounge/pull/209) by [@xPaw](https://github.com/xPaw))

## v1.3.1 - 2016-03-05

[See the full changelog](https://github.com/thelounge/thelounge/compare/v1.3.0...v1.3.1)

### Removed

- Remove attempts to set file modes ([#117](https://github.com/thelounge/thelounge/pull/117) by [@maxpoulin64](https://github.com/maxpoulin64))

### Fixed

- Correctly handle inline channels in messages ([#128](https://github.com/thelounge/thelounge/pull/128) by [@xPaw](https://github.com/xPaw))
- Fix crash, introduced by this release ([#143](https://github.com/thelounge/thelounge/pull/143) by [@xPaw](https://github.com/xPaw))
- Fix highlighted actions and mute colors of some of the actions ([#47](https://github.com/thelounge/thelounge/pull/47) by [@xPaw](https://github.com/xPaw))
- Fix stripping multiple colors from notifications ([#145](https://github.com/thelounge/thelounge/pull/145) by [@xPaw](https://github.com/xPaw))
- Correctly display channel name in notifications ([#148](https://github.com/thelounge/thelounge/pull/148) by [@xPaw](https://github.com/xPaw))
- Fix hover effect on channels in topics ([#149](https://github.com/thelounge/thelounge/pull/149) by [@xPaw](https://github.com/xPaw))
- Add missing mode action to muted colors ([#150](https://github.com/thelounge/thelounge/pull/150) by [@astorije](https://github.com/astorije))

## v1.3.0 - 2016-03-03

[See the full changelog](https://github.com/thelounge/thelounge/compare/v1.2.1...v1.3.0)

### Added

- Add hostmask in `join`/`part`/`quit` messages and move actions to templates ([#94](https://github.com/thelounge/thelounge/pull/94) by [@xPaw](https://github.com/xPaw))
- Add a section in the README explaining why a fork was created ([#95](https://github.com/thelounge/thelounge/pull/95) by [@almet](https://github.com/almet))
- Add the ability to let users change their password from the settings page ([#57](https://github.com/thelounge/thelounge/pull/57) by [@diddledan](https://github.com/diddledan))
- Add the ability to let users set custom CSS in their settings ([#83](https://github.com/thelounge/thelounge/pull/83) by [@xPaw](https://github.com/xPaw))
- Add notifications for channel invites ([#127](https://github.com/thelounge/thelounge/pull/127) by [@astorije](https://github.com/astorije))
- Allow locking network configuration ([#82](https://github.com/thelounge/thelounge/pull/82) by [@xPaw](https://github.com/xPaw))

### Changed

- Add target channel name in notifications ([#118](https://github.com/thelounge/thelounge/pull/118) by [@astorije](https://github.com/astorije))
- Bump `grunt-contrib-uglify` and pin versions of `grunt`-related dependencies ([#119](https://github.com/thelounge/thelounge/pull/119) by [@astorije](https://github.com/astorije))
- Switch to a power-off icon for logging out ([#131](https://github.com/thelounge/thelounge/pull/131) by [@astorije](https://github.com/astorije))

### Removed

- Remove auto-select on input fields ([#120](https://github.com/thelounge/thelounge/pull/120) by [@astorije](https://github.com/astorije))

### Fixed

- Fix the "Show more" button being displayed over chat messages and message paddings when `join`/`part`/`quit` messages are hidden ([`b53e5c4`](https://github.com/thelounge/thelounge/commit/b53e5c407c7ca90e9741791b4e0d927fb5f54ea1) by [@xPaw](https://github.com/xPaw))
- Fix how highlights are handled and highlighted ([#91](https://github.com/thelounge/thelounge/pull/91) by [@xPaw](https://github.com/xPaw))
- Fix favicon highlight on Chrome and remove `Favico.js` library ([#100](https://github.com/thelounge/thelounge/pull/100) by [@xPaw](https://github.com/xPaw))
- Fix complete crash when refreshing a public instance, introduced by this release ([#125](https://github.com/thelounge/thelounge/pull/125) by [@astorije](https://github.com/astorije))
- Fix clickable "you" in the text of an `/invite`, introduced by this release ([#122](https://github.com/thelounge/thelounge/pull/122) by [@xPaw](https://github.com/xPaw))
- Fix minor issues with the main HTML file ([#134](https://github.com/thelounge/thelounge/pull/134) by [@astorije](https://github.com/astorije))
- Strip control codes from notifications ([#123](https://github.com/thelounge/thelounge/pull/123) by [@xPaw](https://github.com/xPaw))

## v1.2.1 - 2016-02-26

[See the full changelog](https://github.com/thelounge/thelounge/compare/v1.2.0...v1.2.1)

### Changed

- Bump and pin mocha version ([#104](https://github.com/thelounge/thelounge/pull/104) by [@astorije](https://github.com/astorije))

### Fixed

- Fix CSS selector syntax in channel message handler ([#102](https://github.com/thelounge/thelounge/pull/102) by [@maxpoulin64](https://github.com/maxpoulin64))
- Fix fading channel name in sidebar of Crypto and Zenburn themes ([#105](https://github.com/thelounge/thelounge/pull/105) by [@maxpoulin64](https://github.com/maxpoulin64))
- Fix `/invite` command broken by lodash bump ([#106](https://github.com/thelounge/thelounge/pull/106) by [@JocelynDelalande](https://github.com/JocelynDelalande))

## v1.2.0 - 2016-02-24

[See the full changelog](https://github.com/thelounge/thelounge/compare/v1.1.1...v1.2.0)

Note that this release will reset client-side settings to their defaults. Current users will have to re-set them in the settings page. This is [a conscious trade-off](https://github.com/thelounge/thelounge/pull/70#issuecomment-186717859) as the fork is rather new and there are not many settings overall.

### Added

- Add support for the `/invite <nickname> <channel>` command ([#7](https://github.com/thelounge/thelounge/pull/7) by [@xPaw](https://github.com/xPaw))
- Add a command shorthand to invite in the current channel with `/invite <nickname>` ([#76](https://github.com/thelounge/thelounge/pull/76) by [@astorije](https://github.com/astorije))
- Add style linting for all CSS files in the repository ([#43](https://github.com/thelounge/thelounge/pull/43) by [@xPaw](https://github.com/xPaw))

### Changed

- Improve client performance by updating the users' list only when it's needed ([#58](https://github.com/thelounge/thelounge/pull/58) by [@maxpoulin64](https://github.com/maxpoulin64))
- Let the badge counter hide with a fade-out ([#73](https://github.com/thelounge/thelounge/pull/73) by [@xPaw](https://github.com/xPaw))
- Update `lodash` dependency to the latest major version ([#38](https://github.com/thelounge/thelounge/pull/38) by [@xPaw](https://github.com/xPaw))
- Use `localStorage` instead of cookies for client-side settings storage ([#70](https://github.com/thelounge/thelounge/pull/70) by [@xPaw](https://github.com/xPaw))
- Replace Bootstrap's tooltips with CSS tooltips from GitHub's Primer ([#79](https://github.com/thelounge/thelounge/pull/79) by [@xPaw](https://github.com/xPaw))

### Fixed

- Fade long channel names in the sidebar instead of breaking to another line ([#75](https://github.com/thelounge/thelounge/pull/75) by [@maxpoulin64](https://github.com/maxpoulin64))

## v1.1.1 - 2016-02-19

[See the full changelog](https://github.com/thelounge/thelounge/compare/v1.1.0...v1.1.1)

### Changed

- Remove compiled assets and generate them at prepublish time ([#63](https://github.com/thelounge/thelounge/pull/63) by [@astorije](https://github.com/astorije))

## v1.1.0 - 2016-02-19

[See the full changelog](https://github.com/thelounge/thelounge/compare/v1.0.2...v1.1.0)

### Added

- Allow The Lounge to be proxied behind a `/path/` URL ([#27](https://github.com/thelounge/thelounge/pull/27) by [@gdamjan](https://github.com/gdamjan))

### Changed

- Simplify a great deal the CONTRIBUTING file ([#40](https://github.com/thelounge/thelounge/pull/40) by [@astorije](https://github.com/astorije))
- Use a Font Awesome icon for the channel closing button ([#48](https://github.com/thelounge/thelounge/pull/48) by [@xPaw](https://github.com/xPaw))

### Removed

- Remove Node 0.10 from Travis CI ([#60](https://github.com/thelounge/thelounge/pull/60) by [@astorije](https://github.com/astorije))

### Fixed

- Suppress deprecation warning for `moment().zone` ([#37](https://github.com/thelounge/thelounge/pull/37) by [@deiu](https://github.com/deiu))
- Fix a bug preventing the closing of a channel when the user was kicked out ([#34](https://github.com/thelounge/thelounge/pull/34) by [@xPaw](https://github.com/xPaw))

## v1.0.2 - 2016-02-15

[See the full changelog](https://github.com/thelounge/thelounge/compare/v1.0.1...v1.0.2)

### Changed

- Remove `#foo` channel from the default configuration file ([#22](https://github.com/thelounge/thelounge/pull/22) by [@astorije](https://github.com/astorije))
- Change the Freenode URL to `chat.freenode.net` in the default configuration file ([#13](https://github.com/thelounge/thelounge/pull/13) by [@dubzi](https://github.com/dubzi))
- Ensure all `.js` files are linted ([#42](https://github.com/thelounge/thelounge/pull/42) by [@williamboman](https://github.com/williamboman))

### Fixed

- Hide the user list button on a server or private message window ([#32](https://github.com/thelounge/thelounge/pull/32) by [@MaxLeiter](https://github.com/MaxLeiter))
- Correctly sort the user list whenever a user joins ([#33](https://github.com/thelounge/thelounge/pull/33) by [@xPaw](https://github.com/xPaw))

## v1.0.1 - 2016-02-14

[See the full changelog](https://github.com/thelounge/thelounge/compare/v1.0.0...v1.0.1)

### Changed

- In the change log, use a permanent URL to link the previous history of The Lounge to Shout ([#12](https://github.com/thelounge/thelounge/pull/12) by [@xPaw](https://github.com/xPaw))
- Update some dependencies and pin versions ([#8](https://github.com/thelounge/thelounge/pull/8) by [@xPaw](https://github.com/xPaw))

### Fixed

- Add missing form methods that were causing LastPass to trigger a warning ([#19](https://github.com/thelounge/thelounge/pull/19) by [@maxpoulin64](https://github.com/maxpoulin64))
- Fix comments in the configuration file ([#1](https://github.com/thelounge/thelounge/pull/1) by [@FryDay](https://github.com/FryDay))

## v1.0.0 - 2016-02-12

[See the full changelog](https://github.com/thelounge/thelounge/compare/baadc3df3534fb22515a8c2ea29218fbbc1228b4...v1.0.0)

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
- Change all mentions of Shout to the new name: The Lounge ([#2](https://github.com/thelounge/thelounge/pull/2) by [@astorije](https://github.com/astorije))

### Fixed

- Fix initial copyright year in the LICENSE notice ([#591](https://github.com/erming/shout/pull/591) by [@pra85](https://github.com/pra85))
- Fix wrong color class on Zenburn style ([#595](https://github.com/erming/shout/pull/595) by [@astorije](https://github.com/astorije))
- Run new topic through parser when it is updated ([#587](https://github.com/erming/shout/pull/587) by [@xPaw](https://github.com/xPaw))
- Fix several things on Morning and Zenburn themes ([#605](https://github.com/erming/shout/pull/605) by [@xPaw](https://github.com/xPaw))
- Fix word wrap on firefox ([#570](https://github.com/erming/shout/pull/570) by [@YaManicKill](https://github.com/YaManicKill))
- Change user buttons to `a` links, allowing highlighting on Firefox ([#571](https://github.com/erming/shout/pull/571) and [#574](https://github.com/erming/shout/pull/574) by [@YaManicKill](https://github.com/YaManicKill))

---

All previous changes can be found on [Shout's CHANGELOG, starting at `v0.53.0`](https://github.com/erming/shout/blob/35587f3c35d0a8ac78a2495934ff9eaa8f1aa71c/CHANGELOG.md#0530--2016-01-07).

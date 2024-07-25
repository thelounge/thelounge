# Change Log

All notable changes to this project will be documented in this file.

<!-- New entries go after this line -->

## v4.4.3 - 2024-04-01

The Lounge finally gains the ability to automatically clean up sqlite databases.
Note that cleaning existing, large databases can take a significant amount of time
and running a database `VACUUM` will use up ~2x the current DB disc space for a short period.

If you enable the storagePolicy, stop the running instance and run `thelounge storage clean`.
This will force a full cleanup once, rather than doing so incrementally and will release all the
disc space back to the OS.

As usual, we follow the Node.js release schedule, so the minimum Node.js version required is now 18.

Many thanks to all the contributors to this release, be that documentation, code or maintaining the packages.  
Your help is greatly appreciated!

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v4.4.1...v4.4.3)

### Added

- Sign in: use v-model ([`c5326e8`](https://github.com/thelounge/thelounge/commit/c5326e87958b1e99ca9405da5c8d17e3f45c983c) by [@brunnre8](https://github.com/brunnre8))
- Add comments explaining behavior when echo-message is not available ([`43a2b39`](https://github.com/thelounge/thelounge/commit/43a2b397a2efc65c7214893846831376bb880138) by [@brunnre8](https://github.com/brunnre8))
- Fix semver for prerelease versions #4744 ([`8aa5e33`](https://github.com/thelounge/thelounge/commit/8aa5e33b1d9e0a56e51481c227bf7d61fdd7b21f) by [@brunnre8](https://github.com/brunnre8))
- sqlite: add migrations support and introduce primary key ([`2ef8b37`](https://github.com/thelounge/thelounge/commit/2ef8b3700945deb9a113ddf4e3010ad36556deef) by [@brunnre8](https://github.com/brunnre8))
- test/link: use helper for url creation ([`c6b1913`](https://github.com/thelounge/thelounge/commit/c6b1913b919421ab2b70093218422a390d822c75) by [@brunnre8](https://github.com/brunnre8))
- test/storage: use helper for url creation ([`79fae26`](https://github.com/thelounge/thelounge/commit/79fae26f396081b6f557ae7b4f0c8fd4649b6a74) by [@brunnre8](https://github.com/brunnre8))
- Respect bind setting for all outgoing requests ([`3af4ad1`](https://github.com/thelounge/thelounge/commit/3af4ad1076330428da41f4205bb069d714b2a4e2) by [@brunnre8](https://github.com/brunnre8))
- bump emoji-regex to latest ([`ed0a47f`](https://github.com/thelounge/thelounge/commit/ed0a47fe2c10a2512832c9365a863967f9fc1ee0) by [@brunnre8](https://github.com/brunnre8))
- use shebang for generate-emoji script ([`1a1153a`](https://github.com/thelounge/thelounge/commit/1a1153aed638de0e5e2ca4089cb7656bbfa4394a) by [@brunnre8](https://github.com/brunnre8))
- Respect bind setting for all outgoing requests ([`2878f87`](https://github.com/thelounge/thelounge/commit/2878f87879cab30eabedbe2376507dae33295f22) by [@brunnre8](https://github.com/brunnre8))
- store: use return type over a type cast ([#4770](https://github.com/thelounge/thelounge/pull/4770) by [@brunnre8](https://github.com/brunnre8))
- don't crash on rDNS failure ([`8c54cd5`](https://github.com/thelounge/thelounge/commit/8c54cd50d8431481a70dec26a66a5343f2bbbd2c) by [@brunnre8](https://github.com/brunnre8))
- sqlite: fix typo fetch_rollbacks ([`884a92c`](https://github.com/thelounge/thelounge/commit/884a92c74bb669ff9a94c5a1c164912a9bd9891b) by [@brunnre8](https://github.com/brunnre8))
- sqlite: don't modify global array during tests ([`ec75ff0`](https://github.com/thelounge/thelounge/commit/ec75ff00cb8fdcef1857749ce6d033860e1ca157) by [@brunnre8](https://github.com/brunnre8))
- sqlite: return new version in downgrade() ([`d1561f8`](https://github.com/thelounge/thelounge/commit/d1561f8ebccacd0277d185626f3737bfd23bc99e) by [@brunnre8](https://github.com/brunnre8))
- cli: don't fail if stderr is not in json format ([`97f553e`](https://github.com/thelounge/thelounge/commit/97f553eea8ed4a57f6d760a767425159f6451e08) by [@brunnre8](https://github.com/brunnre8))
- sqlite: use variadic function for serialize_run ([`60ddf17`](https://github.com/thelounge/thelounge/commit/60ddf17124af8e451412b14a11910ded894979d8) by [@brunnre8](https://github.com/brunnre8))
- sqlite: accept db connection string ([`aec8d0b`](https://github.com/thelounge/thelounge/commit/aec8d0b03341691a0211d172538afc61560a919c) by [@brunnre8](https://github.com/brunnre8))
- sqlite: implement deleteMessages ([`14d9ff2`](https://github.com/thelounge/thelounge/commit/14d9ff247d51e77640bc0f37464804eadc822dd7) by [@brunnre8](https://github.com/brunnre8))
- introduce storage cleaner ([`74aff7e`](https://github.com/thelounge/thelounge/commit/74aff7ee5a9440a653859879390191031f81153e) by [@brunnre8](https://github.com/brunnre8))
- cleaner: expose cli task to do cleaning + vacuum ([`21b1152`](https://github.com/thelounge/thelounge/commit/21b1152f5357f47586456949cadfb9876a0613da) by [@brunnre8](https://github.com/brunnre8))
- wire up storage cleaner upon server start ([`b0ca8e5`](https://github.com/thelounge/thelounge/commit/b0ca8e51fb21b23859f95406f41dfe1ce273f419) by [@brunnre8](https://github.com/brunnre8))
- sqlite: add msg type index to speed up cleaner ([`edb1226`](https://github.com/thelounge/thelounge/commit/edb1226b474e9dc74d096201220d8e675821ac21) by [@brunnre8](https://github.com/brunnre8))
- add storage cleaner ([`7f0b721`](https://github.com/thelounge/thelounge/commit/7f0b7217906abf90343f5b91dc7ceaa650dd058f) by [@brunnre8](https://github.com/brunnre8))
- scripts: fix generate-config-doc, handle usage errors ([#4807](https://github.com/thelounge/thelounge/pull/4807) by [@flotwig](https://github.com/flotwig))
- router: don't use next() in router guards ([#4783](https://github.com/thelounge/thelounge/pull/4783) by [@brunnre8](https://github.com/brunnre8))
- linkify: Add web+ schema support ([`ae6bae6`](https://github.com/thelounge/thelounge/commit/ae6bae69ac2c915c3dcac4262168da46f8eddf39) by [@SoniEx2](https://github.com/SoniEx2))
- linkify: simplify noscheme detection logic ([`dd24cb1`](https://github.com/thelounge/thelounge/commit/dd24cb13002b76ba0a67abfa11faedaa455df828) by [@brunnre8](https://github.com/brunnre8))
- Add shortcut to navigate between channels with undread msgs ([`daabb76`](https://github.com/thelounge/thelounge/commit/daabb7678172fc6b6d7c6eebc6fad40b6f84ea39) by [@Nachtalb](https://github.com/Nachtalb))
- Remove husky, add githooks-install ([#4826](https://github.com/thelounge/thelounge/pull/4826) by [@brunnre8](https://github.com/brunnre8))
- Testing setup ([#4825](https://github.com/thelounge/thelounge/pull/4825) by [@brunnre8](https://github.com/brunnre8))
- Remove Node.js 16 from package.json and testing matrix ([`113e9bd`](https://github.com/thelounge/thelounge/commit/113e9bd2fb9a5154c048234d8ebbd8c0a61070d1) by [@MaxLeiter](https://github.com/MaxLeiter))
- server: remove version from CTCP response ([`45563d9`](https://github.com/thelounge/thelounge/commit/45563d9a5938ae4fa46da8a2d6c51fc829ebb910) by [@flotwig](https://github.com/flotwig))

### Documentation

On the [website repository](https://github.com/thelounge/thelounge.github.io):

- Merge branch 'localInstall' ([`8c0d5a5`](https://github.com/thelounge/thelounge.github.io/commit/8c0d5a58075fc1035f5c71675847823751e1f98d) by [@brunnre8](https://github.com/brunnre8))
- docs: update docker image to point to the new ghcr.io repository ([`5d7c993`](https://github.com/thelounge/thelounge.github.io/commit/5d7c993b9e26050b482550cb3f16aa11e0b99d9e) by [@brunnre8](https://github.com/brunnre8))
- Add "Hide all chat messages containing a link in a specific channel" … ([`993cf8b`](https://github.com/thelounge/thelounge.github.io/commit/993cf8b00e35ffeff1c20d122defc32d09e236b3) by [@zDEFz](https://github.com/zDEFz))
- ctcp: remove stale link to code (#273) ([`379c34d`](https://github.com/thelounge/thelounge.github.io/commit/379c34d88aa73dd86078af7757a4536bb9958e02) by [@brunnre8](https://github.com/brunnre8))
- docs: sync config.js.md (add prefetchTimeout, update ldap) (#275) ([`51dfc80`](https://github.com/thelounge/thelounge.github.io/commit/51dfc803415946e985c36317ea362ba625c67a3c) by [@flotwig](https://github.com/flotwig))
- Removing #thelounge-scandinavia due to inactivity (#278) ([`403cc6a`](https://github.com/thelounge/thelounge.github.io/commit/403cc6aa05cd30a0f9a86b81369ec0c9f1ffd24f) by [@fnutt](https://github.com/fnutt))
- Nodejs documentation link update (#277) ([`06e4725`](https://github.com/thelounge/thelounge.github.io/commit/06e47254cc6b98eabe4d527b1ce6be6f7ea7b9eb) by [@xfisbest](https://github.com/xfisbest))
- Add installation instructions for Gentoo (#276) ([`52be432`](https://github.com/thelounge/thelounge.github.io/commit/52be432b36cabc7a9d393a07e7702e3aebff8075) by [@rahilarious](https://github.com/rahilarious))

### Dependency updates

- chore(deps): update dependency webpack-hot-middleware to v2.25.4 ([`06f1387`](https://github.com/thelounge/thelounge/commit/06f1387f7b5ff374b52bc4aeac06d6e936bc00f4) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @vue/test-utils to v2.4.0 ([`303f53f`](https://github.com/thelounge/thelounge/commit/303f53fe72a6cde53410821b2d59c81db90d308a) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency postcss to v8.4.26 ([`54ff563`](https://github.com/thelounge/thelounge/commit/54ff56324714bd5c6221250d02491f20b7ede6df) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/linkify-it to v3.0.3 ([`2985727`](https://github.com/thelounge/thelounge/commit/2985727996c1e84fefce06e5c2a0da02a8b6ccb6) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/bcryptjs to v2.4.4 ([`48301b1`](https://github.com/thelounge/thelounge/commit/48301b1ca31f0eb145695f320c81d0047e6883e6) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- build(deps): bump word-wrap from 1.2.3 to 1.2.5 ([`08413c7`](https://github.com/thelounge/thelounge/commit/08413c7b6b78f460bdee31239a87e6f86e14dda2) by [@dependabot[bot]](https://github.com/dependabot%5Bbot%5D))
- chore(deps): update dependency postcss to v8.4.31 [security] ([`ff77a33`](https://github.com/thelounge/thelounge/commit/ff77a3366305c23180e6e509f5f39d285edca8d1) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/cheerio to v0.22.33 ([`b686059`](https://github.com/thelounge/thelounge/commit/b686059c6bf2f2014497d7dceb093422c5fb8fc2) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/content-disposition to v0.5.7 ([`bcca111`](https://github.com/thelounge/thelounge/commit/bcca111a4dd42e8b648acee1da9548a0c677d056) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/lodash to v4.14.200 ([`d4d5a8e`](https://github.com/thelounge/thelounge/commit/d4d5a8e386df60c69826fb9b1c63c138a1503640) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/mousetrap to v1.6.13 ([`250433c`](https://github.com/thelounge/thelounge/commit/250433c87549b59f34cd4d3933364a3766cf587e) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update actions/setup-node action to v4 ([`785ec0a`](https://github.com/thelounge/thelounge/commit/785ec0a0e26f2233ddea6f51ef16cd5cc5e14e40) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/bcryptjs to v2.4.5 ([`b506966`](https://github.com/thelounge/thelounge/commit/b506966b08fba11ab9b8b88268c9371dac78c314) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/is-utf8 to v0.2.2 ([`59de6af`](https://github.com/thelounge/thelounge/commit/59de6afd3fdbeb894e8cf39321c786220bbcf66b) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/bcryptjs to v2.4.6 ([`2f40d9d`](https://github.com/thelounge/thelounge/commit/2f40d9dbcca6fff43f1a66a2e0efb826e22cd4b4) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/cheerio to v0.22.35 ([`73a529a`](https://github.com/thelounge/thelounge/commit/73a529acea765705c1903762106d8f8f3221e6fc) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/content-disposition to v0.5.8 ([`aa95032`](https://github.com/thelounge/thelounge/commit/aa95032760761cc7e28d802ed9bec93d4a807335) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/is-utf8 to v0.2.3 ([`eaa70ca`](https://github.com/thelounge/thelounge/commit/eaa70caad7e578af4bf5f1603c5008b9159a04e6) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/linkify-it to v3.0.5 ([`1d2fdd9`](https://github.com/thelounge/thelounge/commit/1d2fdd95b0ee698bbdc85eb70fd02f47d46e86da) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/lodash to v4.14.202 ([`fe50a90`](https://github.com/thelounge/thelounge/commit/fe50a9023509412b8c6d981053b469e27b5a49c0) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/mousetrap to v1.6.15 ([`a77fbb8`](https://github.com/thelounge/thelounge/commit/a77fbb894ff550cabf7d6f54e06296babdeb2b67) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/node to v17.0.45 ([`e2fda1f`](https://github.com/thelounge/thelounge/commit/e2fda1fb84da9cdbb445d6ebfe0f9795cb83633d) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- build(deps): bump semver from 7.3.5 to 7.5.2 ([`447a237`](https://github.com/thelounge/thelounge/commit/447a237fc6d54e59e563e982a406e16011c57b7a) by [@dependabot[bot]](https://github.com/dependabot%5Bbot%5D))
- build(deps): bump get-func-name from 2.0.0 to 2.0.2 ([`d308e74`](https://github.com/thelounge/thelounge/commit/d308e7418367e880f1b5454ade8267f5996bd035) by [@dependabot[bot]](https://github.com/dependabot%5Bbot%5D))
- build(deps): bump @babel/traverse from 7.18.9 to 7.23.6 ([`20227b1`](https://github.com/thelounge/thelounge/commit/20227b174c4bf375af1168c60ef57e6124c199f4) by [@dependabot[bot]](https://github.com/dependabot%5Bbot%5D))
- update emoji ([`607b9fc`](https://github.com/thelounge/thelounge/commit/607b9fc96a9ca933154dcc082fb2bb6dd545a2db) by [@brunnre8](https://github.com/brunnre8))
- update dependency cheerio to v1.0.0-rc.12 ([`3e21bfc`](https://github.com/thelounge/thelounge/commit/3e21bfcbea579c08f0c02d692e59242653b553b3) by [@brunnre8](https://github.com/brunnre8))
- update dependency webpack-hot-middleware to v2.25.4 ([`57c4d55`](https://github.com/thelounge/thelounge/commit/57c4d5513cfe6f0770a89330932dc07623c35e26) by [@brunnre8](https://github.com/brunnre8))
- update dependency @vue/test-utils to v2.4.0 ([`4f9ca3e`](https://github.com/thelounge/thelounge/commit/4f9ca3e1923837f2886a58df4605255229b200b2) by [@brunnre8](https://github.com/brunnre8))
- update dependency @types/lodash to v4.14.195 ([`2e019a2`](https://github.com/thelounge/thelounge/commit/2e019a2fdba684ad4cef15f55e514ae7a1bc8edf) by [@brunnre8](https://github.com/brunnre8))
- update dependency @types/chai to v4.3.5 ([`816b768`](https://github.com/thelounge/thelounge/commit/816b7686e36aaac36371a5bfbcd2648443bc4e48) by [@brunnre8](https://github.com/brunnre8))
- update dependency postcss to v8.4.26 ([`430a865`](https://github.com/thelounge/thelounge/commit/430a865e9fd7218ac8b0deaa6fc0841341b823ab) by [@brunnre8](https://github.com/brunnre8))
- update @types/mousetrap ([`139ce47`](https://github.com/thelounge/thelounge/commit/139ce47b73a4907da0e2737dbb245bc686330ec1) by [@brunnre8](https://github.com/brunnre8))
- bump caniuse-lite ([`22ae594`](https://github.com/thelounge/thelounge/commit/22ae594cc3d6905c82aa2238f4cd68506acf79a3) by [@brunnre8](https://github.com/brunnre8))

## v4.4.2-rc.1 - 2024-02-19 [Pre-release]

The Lounge finally gains the ability to automatically clean up sqlite databases.
Note that cleaning existing, large databases can take a significant amount of time
and running a database `VACUUM` will use up ~2x the current DB disc space for a short period.
If you enable the storagePolicy, stop the running instance and run `thelounge storage clean`.
This will force a full cleanup once, rather than doing so incrementally and will release all the
disc space back to the OS.

As usual, we follow the Node.js release schedule, so the minimum Node.js version required is now 18.

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.4.1...v4.4.2-rc.1)

This is a release candidate (RC) for v4.4.2 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v4.4.1 - 2023-06-13

Small bug fix release that addresses the bugs reported since v4.4.0

- fixes the image preview buttons disappearing.
- Restores the ability to change the password via the user interface.

Following the [Node.js maintenance schedule](https://nodejs.dev/en/about/releases/), The Lounge now needs at least Node.js 16 to run.

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v4.4.0...v4.4.1) and [milestone](https://github.com/thelounge/thelounge/milestone/43?closed=1).

### Fixed

- linkPreview: Pass channel prop ([`9388960`](https://github.com/thelounge/thelounge/commit/93889604973eeefb3a875e3ad5c9de737638888c) by [@brunnre8](https://github.com/brunnre8))
- client: fix password change input ([`8f08cf3`](https://github.com/thelounge/thelounge/commit/8f08cf3d0bd5b839016000afca1c700c74193f39) by [@brunnre8](https://github.com/brunnre8))

### Documentation

On the [website repository](https://github.com/thelounge/thelounge.github.io):

- Document local installation of packages ([`c72092e`](https://github.com/thelounge/thelounge.github.io/commit/c72092e2f8feab66f912b2c63c5a0572b123ea29) by [@brunnre8](https://github.com/brunnre8))
- docs: update docker image to point to the new ghcr.io repository ([`b43d002`](https://github.com/thelounge/thelounge.github.io/commit/b43d002584757709fff19dfdcf558c9d378f3d61) by [@williamboman](https://github.com/williamboman))
- Fix deb link ([`485570d`](https://github.com/thelounge/thelounge.github.io/commit/485570d4c4027296c546c2773272e4b44b0db06a) by [@brunnre8](https://github.com/brunnre8))
- deb: directly link to latest ([`c9a8ad9`](https://github.com/thelounge/thelounge.github.io/commit/c9a8ad95bbfc62f9ef704581fc742b069ff605fe) by [@brunnre8](https://github.com/brunnre8))

### Internals

- Remove unused code ([`7bce779`](https://github.com/thelounge/thelounge/commit/7bce77925449e2bcfa2db5d66dc5f808e04058c7) by [@brunnre8](https://github.com/brunnre8))
- settings: make missing_field msg descriptive ([`7a9ddc0`](https://github.com/thelounge/thelounge/commit/7a9ddc01e1819da8d28860548a82736f35283ab0) by [@brunnre8](https://github.com/brunnre8))

### Dependency updates

- build(deps): bump socket.io-parser from 4.2.1 to 4.2.3 ([`af49ef2`](https://github.com/thelounge/thelounge/commit/af49ef21ea3fed54c0807a4d87f9c0f9f70017c3) by [@dependabot[bot]](https://github.com/dependabot%5Bbot%5D))
- bump socket.io-parser from 4.2.1 to 4.2.3 ([`4d60d9c`](https://github.com/thelounge/thelounge/commit/4d60d9c282490ad63a1ff61e57e9a6c7a5fb9684) by [@brunnre8](https://github.com/brunnre8))

## v4.4.1-rc.2 - 2023-05-27 [Pre-release]

Restore the ability to change the password via the user interface.

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.4.0-rc.1...v4.4.1-rc.2)

This is a release candidate (RC) for v4.4.1 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

## v4.4.1-rc.1 - 2023-05-20 [Pre-release]

Small bug fix release that addresses the image preview buttons disappearing.

Following the [Node.js maintenance schedule](https://nodejs.dev/en/about/releases/), The Lounge now needs at least Node.js 16 to run.

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.4.0...v4.4.1-rc.1)

This is a release candidate (RC) for v4.4.1 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v4.4.0 - 2023-04-22

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v4.3.1...v4.4.0) and [milestone](https://github.com/thelounge/thelounge/milestone/42?closed=1).

This is mostly a developer focused release. Max, Eric and others rewrote the whole thing in TypeScript / Vue 3,
which should make it much easier to add features and find bugs in the future. So huge kudos from the rest of the team!

Additionally, there's the obvious grab bag of fixes, dependency updates and improvements.  
Settings are now grouped and easier to navigate for new users.

Following the Node.js maintenance schedule, The Lounge now needs at least Node.js 14 to run.

A big thanks to everyone who contributed in any way to this release, your help is much appreciated.

Considering that a bunch of our dependencies had security issues assigned to them, all users are advised to update to the new version.

Packagers: Considering the switch to TypeScript, the server build now emits to the dist/ folder.  
You might need to adapt your build scripts.

### Added

- Add prefetchTimeout ([`aa7db1e`](https://github.com/thelounge/thelounge/commit/aa7db1e7f787350f4102f98b85a2e8173173f92a) by [@brunnre8](https://github.com/brunnre8))

### Changed

- Refactor settings to their own tabs and routes ([#4489](https://github.com/thelounge/thelounge/pull/4489) by [@MaxLeiter](https://github.com/MaxLeiter))
- allow away and back to be collapsed ([#4669](https://github.com/thelounge/thelounge/pull/4669) by [@brunnre8](https://github.com/brunnre8))
- Kill TL when ident can't start up (#4512) ([`37d7de7`](https://github.com/thelounge/thelounge/commit/37d7de7671cf07f8a7fb3a8b3ea32122a738b646) by [@brunnre8](https://github.com/brunnre8))
- enable znc/playback even without message storage ([`c8115e2`](https://github.com/thelounge/thelounge/commit/c8115e22acf4a6e34a1546fd2fc273c76cbb7e86) by [@brunnre8](https://github.com/brunnre8))
- Remove node 12, add node 18. Bump minimum node version 14 (#4552) ([`9dbb6e5`](https://github.com/thelounge/thelounge/commit/9dbb6e5e1923dc1a2d3d69b0eac2778ff8cf5d3b) by [@xPaw](https://github.com/xPaw))
- linkPreviews: Enforce TLS validity ([`621fa92`](https://github.com/thelounge/thelounge/commit/621fa92036d59aa6558df828a1ff48136eed19ce) by [@brunnre8](https://github.com/brunnre8))
- Use nick as a realname fallback ([`30e9f45`](https://github.com/thelounge/thelounge/commit/30e9f45fac5b675ddadf5f904f0d0f05a7cdb5f9) by [@brunnre8](https://github.com/brunnre8))
- Plugins: include pre-releases in compatibility lookup (#4506) ([`e4840b4`](https://github.com/thelounge/thelounge/commit/e4840b4d75ff4dc79083955ebd9dfbdd7dd7ea8a) by [@brunnre8](https://github.com/brunnre8))
- install: expand ~ for local paths ([`e221e70`](https://github.com/thelounge/thelounge/commit/e221e708c1237eaa3088d97aebf8bf4869843dc6) by [@brunnre8](https://github.com/brunnre8))

### Fixed

- Fix the alignment of the header buttons ([#4539](https://github.com/thelounge/thelounge/pull/4539) by [@ronilaukkarinen](https://github.com/ronilaukkarinen))
- Fix user commands not working ([#4594](https://github.com/thelounge/thelounge/pull/4594) by [@xPaw](https://github.com/xPaw))
- Don't crash on oidentd socket race condition ([#4695](https://github.com/thelounge/thelounge/pull/4695) by [@maxpoulin64](https://github.com/maxpoulin64))
- cli: don't error if the user folder doesn't exist (#4508) ([`8153198`](https://github.com/thelounge/thelounge/commit/815319810c28ffe17119a5dc62f7eac33eba12f5) by [@brunnre8](https://github.com/brunnre8))
- Fix user file permissions on create (#4507) ([`d7bba32`](https://github.com/thelounge/thelounge/commit/d7bba325a73b1898edfa4299c4525749e174bbac) by [@brunnre8](https://github.com/brunnre8))
- sqlite: Escape '%' and '\_' in search queries. (#4487) ([`20ed3e6`](https://github.com/thelounge/thelounge/commit/20ed3e6dc5cf482e38d537444163e98b2bae0879) by [@progval](https://github.com/progval))
- set 'video/quicktime' to 'video/mp4' (#4495) ([`57b1e51`](https://github.com/thelounge/thelounge/commit/57b1e51e9f0f65e0866f5a809b12efaaf277536a) by [@xnaas](https://github.com/xnaas))
- Preserve client certificate ([`c9c8cad`](https://github.com/thelounge/thelounge/commit/c9c8cadb1a00f01d00920792cc129077aa6934fd) by [@brunnre8](https://github.com/brunnre8))
- Remove uploading event listeners on ChatInput unmount (#4600) ([`80f65c5`](https://github.com/thelounge/thelounge/commit/80f65c5b7276c466d2032fb3a7822fa39df3c685) by [@MaxLeiter](https://github.com/MaxLeiter))
- Potentially fix saving new networks (#4599) ([`d72d869`](https://github.com/thelounge/thelounge/commit/d72d8694bbea9fde7bf86275fb77b4c4c8a168ec) by [@MaxLeiter](https://github.com/MaxLeiter))
- Fix regex escape for prefix patterns ([`d6e1af0`](https://github.com/thelounge/thelounge/commit/d6e1af0e7dedb34dcd9932105ee4f2ddbe98e221) by [@brunnre8](https://github.com/brunnre8))
- Fix ctcp request message (#4603) ([`c8cd405`](https://github.com/thelounge/thelounge/commit/c8cd4057bc4ef19271720fc6b893b9c74e690457) by [@brunnre8](https://github.com/brunnre8))
- connect: Trim white space from user input fields (#4623) ([`0fa2035`](https://github.com/thelounge/thelounge/commit/0fa203569a62ee6bc6062b781729c7d801ccb8ba) by [@brunnre8](https://github.com/brunnre8))
- Search: Clear earlier searches when a new one is executed ([`83e11b0`](https://github.com/thelounge/thelounge/commit/83e11b0143e599a40924cab856636beeca6df27c) by [@brunnre8](https://github.com/brunnre8))
- Fix previous-source calculation (#4656) ([`073a38e`](https://github.com/thelounge/thelounge/commit/073a38ef1ef3c46740a028d4cbe7ebe4c7a08526) by [@brunnre8](https://github.com/brunnre8))
- Fix sidebar swipe flicker after letting go ([`502780c`](https://github.com/thelounge/thelounge/commit/502780c5a3e3455d977d8873506f1be51946fa68) by [@xPaw](https://github.com/xPaw))
- search: ignore searchResults if it isn't the active query ([`0ebc3a5`](https://github.com/thelounge/thelounge/commit/0ebc3a574c42185c818ca8795a56d8eb58a20f4e) by [@brunnre8](https://github.com/brunnre8))
- fix motd display to match settings ([#4726])(https://github.com/thelounge/thelounge/pull/4726) by [@SpaceLenore](https://github.com/SpaceLenore))

### Documentation

- Fix misleading LDAP filiter in default config ([`f785acb`](https://github.com/thelounge/thelounge/commit/f785acb07d78ae791a24a39821a93afb81616934) by [@goodspeed34](https://github.com/goodspeed34))
- Use correct option name (filter instead of ldapFilter) in config.js c… ([`4af5fc6`](https://github.com/thelounge/thelounge/commit/4af5fc6f33b43d64adcebcbf5aa8c4dceaad493f) by [@murph](https://github.com/murph))
- Add password param to /join docs ([`8b1a4f7`](https://github.com/thelounge/thelounge/commit/8b1a4f72fa79e12b43ff3073f0d48b13d93008e7) by [@aab12345](https://github.com/aab12345))
- install: Document file: prefix in cli help ([`31739b8`](https://github.com/thelounge/thelounge/commit/31739b8ac9ff95a03c374b32cc9bce2163d05d1e) by [@brunnre8](https://github.com/brunnre8))

On the [website repository](https://github.com/thelounge/thelounge.github.io):

- Link directly to themes on npm (#261) ([`410f5d0`](https://github.com/thelounge/thelounge.github.io/commit/410f5d077676cf597397b01acdc81414cc3dbc01) by [@jeremiah-rs](https://github.com/jeremiah-rs))
- Don't use yarn link for source installs ([#262](https://github.com/thelounge/thelounge.github.io/pull/262) by [@brunnre8](https://github.com/brunnre8))
- Add Insecure Warning CSS (#264) ([`95efa48`](https://github.com/thelounge/thelounge.github.io/commit/95efa482668af7997c7058cf01dff611efdea644) by [@aab12345](https://github.com/aab12345))
- Add custom nick colors section to custom css guide (#265) ([`63847c3`](https://github.com/thelounge/thelounge.github.io/commit/63847c346b6e49ddcdb34f5b733b57e3db8cc2df) by [@xnaas](https://github.com/xnaas))
- Fix Apache configuration syntax ([`41cb84e`](https://github.com/thelounge/thelounge.github.io/commit/41cb84ee70f5dc4a6920dfd1916fdf5eb00f190c) by [@lucaswerkmeister](https://github.com/lucaswerkmeister))
- Be more explicit about needing Yarn 1 (Classic) (#268) ([`1eff267`](https://github.com/thelounge/thelounge.github.io/commit/1eff26768a437e2bac1b62982da5ae02fdbda950) by [@SyntaxColoring](https://github.com/SyntaxColoring))
- Don't mention `npm` command for installation ([`7e936c2`](https://github.com/thelounge/thelounge.github.io/commit/7e936c2814b2902855570e928e0f13a40e17fce7) by [@SyntaxColoring](https://github.com/SyntaxColoring))
- Update reverse-proxies.md ([`afc7e29`](https://github.com/thelounge/thelounge.github.io/commit/afc7e2957211f0fa9a4f986fb4a0a03547384a6d) by [@PeGaSuS-Coder](https://github.com/PeGaSuS-Coder))

### Internals

- Decouple server ([#4686](https://github.com/thelounge/thelounge/pull/4686) by [@brunnre8](https://github.com/brunnre8))
- Tests/server: Tear down test fixtures in the order they were setup ([#4715](https://github.com/thelounge/thelounge/pull/4715) by [@progval](https://github.com/progval))
- Refactor config out of Helper (#4558) ([`d4cc2dd`](https://github.com/thelounge/thelounge/commit/d4cc2dd361bd2f166924dd18efdc57634d67bc19) by [@brunnre8](https://github.com/brunnre8))
- Convert configs to cjs, move babel to own file, combine webpack confi… ([`c205b89`](https://github.com/thelounge/thelounge/commit/c205b895233f5d7c58ef44bad31ccee777f3b95d) by [@nemchik](https://github.com/nemchik))
- Fix yarn dev (#4574) ([`2e3d9a6`](https://github.com/thelounge/thelounge/commit/2e3d9a6265d4c0d0168729a60b319bea236e098b) by [@nemchik](https://github.com/nemchik))
- TypeScript and Vue 3 (#4559) ([`dd05ee3`](https://github.com/thelounge/thelounge/commit/dd05ee3a656cb5eb5d0ab7620dbc7a1cfa4102ab) by [@MaxLeiter](https://github.com/MaxLeiter))
- Added client type checking to webpack (#4619) ([`117c5fa`](https://github.com/thelounge/thelounge/commit/117c5fa3fdbd2787bc1df521627b7b07fc1522c6) by [@antoniomika](https://github.com/antoniomika))
- don't call search on a disabled msg provider ([`bea4545`](https://github.com/thelounge/thelounge/commit/bea4545abffe738dfeb025b36817490c1b5fa61d) by [@brunnre8](https://github.com/brunnre8))
- extract migrations ([`f04a066`](https://github.com/thelounge/thelounge/commit/f04a06682d3690b571dc0b9720baa79b687b9465) by [@brunnre8](https://github.com/brunnre8))
- sqlite: error if sqlite isn't enabled but search() is called ([`cebc6d0`](https://github.com/thelounge/thelounge/commit/cebc6d069fa609de918881854414768fadc87fed) by [@brunnre8](https://github.com/brunnre8))
- sqlite: move export to bottom of the file ([`f6b2921`](https://github.com/thelounge/thelounge/commit/f6b292107ee4e627562d170babcb272cfa102a1e) by [@brunnre8](https://github.com/brunnre8))
- sqlite: fix docstring ([`e62b169`](https://github.com/thelounge/thelounge/commit/e62b169a6abab4b2a0df34a5da21c92136ba3790) by [@brunnre8](https://github.com/brunnre8))
- sqlite: add run helper function ([`89ee537`](https://github.com/thelounge/thelounge/commit/89ee5373643d1c5cb664401de745109bf7bcb77c) by [@brunnre8](https://github.com/brunnre8))
- sqlite: create serialize_fetchall helper function ([`cc3302e`](https://github.com/thelounge/thelounge/commit/cc3302e8743633b3b87e15fb54a964510b2466d1) by [@brunnre8](https://github.com/brunnre8))
- sqlite: use serialize_fetchall in getMessages ([`ee8223c`](https://github.com/thelounge/thelounge/commit/ee8223c2006ad31fc746824b495125b321da4bf8) by [@brunnre8](https://github.com/brunnre8))
- sqlite: use serialize_fetchall in search ([`5e1cbe3`](https://github.com/thelounge/thelounge/commit/5e1cbe32f95aca776fe4dff550a0c8c369460417) by [@brunnre8](https://github.com/brunnre8))
- sqlite: add serialize_get ([`bbe81bb`](https://github.com/thelounge/thelounge/commit/bbe81bb2fa9001762df90c1a267afa0239ebb7c7) by [@brunnre8](https://github.com/brunnre8))
- sqlite: convert migrations to async ([`f068fd4`](https://github.com/thelounge/thelounge/commit/f068fd429012c47648faf8c4d751f972062709bd) by [@brunnre8](https://github.com/brunnre8))
- messageStorage: convert to async ([`d62dd3e`](https://github.com/thelounge/thelounge/commit/d62dd3e62d106009cbded2fd9af13fe9fae35ae5) by [@brunnre8](https://github.com/brunnre8))
- SearchResults: remove computed search prop ([`6b617f8`](https://github.com/thelounge/thelounge/commit/6b617f893d73fb9e8304d228336cf574c29992a3) by [@brunnre8](https://github.com/brunnre8))
- SearchResults: Fix search progess upon search ([`dca2024`](https://github.com/thelounge/thelounge/commit/dca202427aa543d43d18fb72ae10ffa51b3b6c60) by [@brunnre8](https://github.com/brunnre8))
- SearchResults: remove dead code (#4639) ([`53f6041`](https://github.com/thelounge/thelounge/commit/53f6041f42ac36b5d69fc05cc66618ea0fe67a88) by [@brunnre8](https://github.com/brunnre8))
- SearchQuery: offset is always a number ([`8095d9e`](https://github.com/thelounge/thelounge/commit/8095d9e88a0018d2ac559ab01488d2736b4fe5e6) by [@brunnre8](https://github.com/brunnre8))
- Search: fix off by one offset error ([`51c9ce0`](https://github.com/thelounge/thelounge/commit/51c9ce078d15efafd677cff525b681dcec51fdd5) by [@brunnre8](https://github.com/brunnre8))
- keybinds: Fix invalid return ([`0765d20`](https://github.com/thelounge/thelounge/commit/0765d209f2ce204e2a3e86c56a7c2108a0487a6f) by [@brunnre8](https://github.com/brunnre8))
- server: the http{,s} server can't be null ([`1597c2c`](https://github.com/thelounge/thelounge/commit/1597c2c56ec932859ebc77e31eda8c164f196388) by [@brunnre8](https://github.com/brunnre8))
- make getClientConfiguration type safe ([`fd14b4a`](https://github.com/thelounge/thelounge/commit/fd14b4a17203bc043b8c9c1f371c2c5ced96eef7) by [@brunnre8](https://github.com/brunnre8))
- remove VueApp from router ([`dfb4217`](https://github.com/thelounge/thelounge/commit/dfb4217167bd20232bf2bdc443454a7ea9cc1094) by [@brunnre8](https://github.com/brunnre8))
- search: fix order of result merging ([`8204c34`](https://github.com/thelounge/thelounge/commit/8204c3481ad1e5eb3f59cabdb5c3c52936094b48) by [@brunnre8](https://github.com/brunnre8))
- store: addMessageSearchResults shouldn't accept null ([`982816f`](https://github.com/thelounge/thelounge/commit/982816ff2015077fe2903180df6420005c73b33e) by [@brunnre8](https://github.com/brunnre8))
- sqlite: synchronize enable() internally ([`2d4143b`](https://github.com/thelounge/thelounge/commit/2d4143b7798c9cf0600280a5a79cb9061585be0e) by [@brunnre8](https://github.com/brunnre8))
- messagestorage: remove implementation details from interface ([`661d5cb`](https://github.com/thelounge/thelounge/commit/661d5cb5b0d6c3aebb9a83ac4c5115d0411b3f39) by [@brunnre8](https://github.com/brunnre8))
- textStorage: rip out client instance ([`52b8a2a`](https://github.com/thelounge/thelounge/commit/52b8a2a78e62dfdcdd2313e8c7e81a7b07f383e2) by [@brunnre8](https://github.com/brunnre8))
- sqlite: Remove client from sqlitestorage ([`958a948`](https://github.com/thelounge/thelounge/commit/958a948456d1a0c3c97bb60e8759e8f9f5578ac8) by [@brunnre8](https://github.com/brunnre8))
- Fix uploader mount/unmount lifecycle ([`2ce374f`](https://github.com/thelounge/thelounge/commit/2ce374fe858992c5c930b0c49bf40cba2928f839) by [@maxpoulin64](https://github.com/maxpoulin64))
- Fix git commit not being available in dist build ([`2f04150`](https://github.com/thelounge/thelounge/commit/2f04150461fbd538b09e58d8c1beb33ee0db18ce) by [@xPaw](https://github.com/xPaw))
- network: add getLobby accessor ([`fade6a8`](https://github.com/thelounge/thelounge/commit/fade6a8d2ec5d621d761e2f6a716c5e59f4a9770) by [@brunnre8](https://github.com/brunnre8))
- pluginCommand: type it and guard against bad input ([`4023323`](https://github.com/thelounge/thelounge/commit/402332340b727d7f4087b1f24dcd4eecf16b0891) by [@brunnre8](https://github.com/brunnre8))
- packaging: Use an include list in package.json ([`efd24fd`](https://github.com/thelounge/thelounge/commit/efd24fd12cad9192d6f333c5a3c01c33ad23b0c6) by [@brunnre8](https://github.com/brunnre8))
- Fix incorrect typing of dehydrated networks and channels ([`76098d7`](https://github.com/thelounge/thelounge/commit/76098d7e766ad074eb6278ee487410f1f02817c3) [@progval](https://github.com/progval))
- Client: move socket connection out of the constructor ([`a049a01`](https://github.com/thelounge/thelounge/commit/a049a01aeb2b09edaaf46411bb764c14a607b343) [@progval](https://github.com/progval))
- Fix test wording ([`d58fb84`](https://github.com/thelounge/thelounge/commit/d58fb845651fe2859313c05a80cdcdebc27a8c68) [@progval](https://github.com/progval))
- Remove override of UserConfig ([`320075e`](https://github.com/thelounge/thelounge/commit/320075e376eecc0843f57b2f9b3207f8f245930e) [@progval](https://github.com/progval))
- Fix sqlite query invocation in test ([`845daba`](https://github.com/thelounge/thelounge/commit/845dabad53c4a47b6c39f7529ad02ec810c5ed48) by [@brunnre8](https://github.com/brunnre8))
- Fix config typing and make Client easier to test ([`eb509f7`](https://github.com/thelounge/thelounge/commit/eb509f7100869427d3f8b4dbd54692bf12630e67) by [@brunnre8](https://github.com/brunnre8))
- server/client: refactor command input ([`4e954b9`](https://github.com/thelounge/thelounge/commit/4e954b919c86ad17f6c7f934de4aa8d6fe5b9b1d) by [@brunnre8](https://github.com/brunnre8))
- Clean up command input code ([`e8b6434`](https://github.com/thelounge/thelounge/commit/e8b6434144998693532ce2853c049e878f158d63) by [@brunnre8](https://github.com/brunnre8))
- Inline logger into changelog script ([#4717](https://github.com/thelounge/thelounge/pull/4717) by [@brunnre8](https://github.com/brunnre8))
- Fix load of channels from user config ([`0c7cc85`](https://github.com/thelounge/thelounge/commit/0c7cc85184d9f90987000ffcddfa2b9581bb96cb) Val Lorentz)
- style: Put user colors into the smallest possible scope ([`f55f772`](https://github.com/thelounge/thelounge/commit/f55f772659a505ceb8751d8728c22c810afed018) by [@brunnre8](https://github.com/brunnre8))
- Fix Morning theme nick colors ([#4690](https://github.com/thelounge/thelounge/pull/4690) by [@maxpoulin64](https://github.com/maxpoulin64))
- Publish to npm with provenance ([#4724])(https://github.com/thelounge/thelounge/pull/4724) by [@xPaw](https://github.com/xPaw))

### Dependency updates

_Aka the boring bits... It's the last section too, so feel free to gloss over it_

- fix(deps): update dependency got to v11.8.5 [security] ([#4596](https://github.com/thelounge/thelounge/pull/4596) by [@renovate](https://github.com/apps/renovate))
- `sqlite3` ([#4541](https://github.com/thelounge/thelounge/pull/4541))
- chore(deps): update dependency sqlite3 to v5.0.6 ([`da02350`](https://github.com/thelounge/thelounge/commit/da02350725291be79c0d6c5d15261a2e0ef72313) by [@renovate-bot](https://github.com/renovate-bot))
- chore(deps): update dependency @textcomplete/core to v0.1.11 (#4555) ([`99c48db`](https://github.com/thelounge/thelounge/commit/99c48dbcea2ebe08d64a38946d81301fbfe66ee2) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update babel monorepo (#4554) ([`38f1352`](https://github.com/thelounge/thelounge/commit/38f13525e6104ee332c64d2df20bfe2694bc7fe5) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency mocha to v9.2.2 (#4581) ([`194b85b`](https://github.com/thelounge/thelounge/commit/194b85be4d93813f763b06264124d5545ba8aa27) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency sqlite3 to v5.0.8 (#4564) ([`ddcee53`](https://github.com/thelounge/thelounge/commit/ddcee5371acfe960c53e85e97405d005953dec3c) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @textcomplete/textarea to v0.1.12 ([`e972165`](https://github.com/thelounge/thelounge/commit/e97216518adb9ac7d6ef458c362a591a0f56ed14) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/content-disposition to v0.5.5 ([`740618c`](https://github.com/thelounge/thelounge/commit/740618ca499aeb2efb8ffd4f0363b5cf841a49dc) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @textcomplete/core to v0.1.12 ([`0cb4791`](https://github.com/thelounge/thelounge/commit/0cb4791cd02c0fd2e578edc1366124117529ac10) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency sqlite3 to v5.0.10 ([`520646a`](https://github.com/thelounge/thelounge/commit/520646a212e08f971c870e6f464712a90e198d66) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- fix(deps): update dependency file-type to v16.5.4 [security] ([`0495761`](https://github.com/thelounge/thelounge/commit/0495761c4485ac86b43ced638a361b905e7ddc60) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): lock file maintenance ([`57ed37c`](https://github.com/thelounge/thelounge/commit/57ed37c1fda4024ae655de2defdf4af68ade69fe) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- Revert "chore(deps): update dependency @textcomplete/core to v0.1.12" ([`3240997`](https://github.com/thelounge/thelounge/commit/32409973478ecb88290447faa7f2639a6d5c4d1f) by [@brunnre8](https://github.com/brunnre8))
- chore(deps): update dependency sqlite3 to v5.1.2 ([`5a803cc`](https://github.com/thelounge/thelounge/commit/5a803ccd239e42fe8853b4c615e82ef2c64bbc14) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @vue/test-utils to v2.2.1 ([`cb17f8d`](https://github.com/thelounge/thelounge/commit/cb17f8d87f9eac3b3449455d47c5ddaec09c0c5d) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency postcss to v8.4.18 ([`5a4a39b`](https://github.com/thelounge/thelounge/commit/5a4a39b9d1f4a49ddc2f9c5551f9fd28d0307a4b) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency chai to v4.3.7 ([`0ad033f`](https://github.com/thelounge/thelounge/commit/0ad033fe0aac01e0f4512428fda0e93ddefdcfb6) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/is-utf8 to v0.2.1 ([`b5ea7cc`](https://github.com/thelounge/thelounge/commit/b5ea7cceb3ff6a13f0ee20f4ed1c017b983d7d8c) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/lodash to v4.14.188 ([`dfe288e`](https://github.com/thelounge/thelounge/commit/dfe288ef166a0ac07f538ee5a07c2f7b65ee15f9) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/chai to v4.3.4 ([`19307d0`](https://github.com/thelounge/thelounge/commit/19307d05e70f8b7ed9ab3d6177c7c9ae6c93a438) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency postcss to v8.4.19 ([`2218841`](https://github.com/thelounge/thelounge/commit/221884166df61feb43513205c982b271b299f074) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/lodash to v4.14.191 ([`d61ab7e`](https://github.com/thelounge/thelounge/commit/d61ab7e7a084018d68444c4b0ef8d14702142d84) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency sqlite3 to v5.1.4 ([`c854d27`](https://github.com/thelounge/thelounge/commit/c854d27d3d8451ea25051dc356dc8f101542f9a1) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/ws to v8.5.4 ([`502fb7a`](https://github.com/thelounge/thelounge/commit/502fb7a7050edbecd8e34b6c30664e0bdcfc4a6c) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @vue/test-utils to v2.2.7 ([`6b23b87`](https://github.com/thelounge/thelounge/commit/6b23b87063c893ce588321929598e579401e16ee) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency sinon to v13.0.2 ([`90d17ca`](https://github.com/thelounge/thelounge/commit/90d17cacc155a3a6bafd76411b2e00997347a24b) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency vue-loader to v17.0.1 ([`2f8dc01`](https://github.com/thelounge/thelounge/commit/2f8dc01930f921f4de23dff29abfc703fdbefdbc) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency webpack-dev-middleware to v5.3.3 ([`4742a07`](https://github.com/thelounge/thelounge/commit/4742a077211229191867033320c0efc876a9404c) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @vue/test-utils to v2.3.1 ([`50e8d2a`](https://github.com/thelounge/thelounge/commit/50e8d2a8903b1c1c826208850f46a5d98dbf6458) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency postcss to v8.4.21 ([`8e249d4`](https://github.com/thelounge/thelounge/commit/8e249d46afb234a4a1def2cbcc0204c4edd52bdc) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency sqlite3 to v5.1.5 [security] ([`bc4c308`](https://github.com/thelounge/thelounge/commit/bc4c3082b852e175e55003c8b91b2a69a7d8283f) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency webpack to v5.76.0 [security] ([`a67cee1`](https://github.com/thelounge/thelounge/commit/a67cee1ee43da01afd8c7584b44d46e6e8dc990d) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency sqlite3 to v5.1.6 ([`34a01c2`](https://github.com/thelounge/thelounge/commit/34a01c2dd164b60d7470b588f7c0e0ed3d3b7647) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- chore(deps): update dependency @types/mousetrap to v1.6.11 ([`5037383`](https://github.com/thelounge/thelounge/commit/5037383c4c9a87a53eaa358ffbe7492ab6ad6365) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- Autocomplete: update to @textcomplete package and close on blur (#4493) ([`bdd6e71`](https://github.com/thelounge/thelounge/commit/bdd6e71049a4ddc65eca8d6acc52ce5c7eb3f6fd) by [@MaxLeiter](https://github.com/MaxLeiter))
- Update sqlite3 to 5.0.3 ([`7db0d46`](https://github.com/thelounge/thelounge/commit/7db0d4619d98ad473eff7a1dbdf41c8b0167d0dd) by [@xPaw](https://github.com/xPaw))
- Merge sqlite3 upgrade to v5.0.6 ([`abf8906`](https://github.com/thelounge/thelounge/commit/abf89067575810339fa3c723af54a7ea670fe4e5) by [@brunnre8](https://github.com/brunnre8))
- bump socket.io to 4.5.2 ([`d4bbd91`](https://github.com/thelounge/thelounge/commit/d4bbd9191cd78f065386fe25c7e8e90b1171a159) by [@brunnre8](https://github.com/brunnre8))
- bump socket.io-client to 4.5.0 ([`4c7337b`](https://github.com/thelounge/thelounge/commit/4c7337b6257af2428e6e9f8af570126da094d266) by [@brunnre8](https://github.com/brunnre8))
- Bump engine.io from 6.2.0 to 6.2.1 ([`f8eb0eb`](https://github.com/thelounge/thelounge/commit/f8eb0ebafdf8824bfe316fd2ad8adb3b8beda2d2) by [@dependabot[bot]](https://github.com/dependabot%5Bbot%5D))
- Bump loader-utils from 2.0.2 to 2.0.4 ([`8924545`](https://github.com/thelounge/thelounge/commit/89245455ceceba157821437a3f8f4e80f3b03268) by [@dependabot[bot]](https://github.com/dependabot%5Bbot%5D))
- Bump loader-utils from 2.0.2 to 2.0.4 ([`21c8b0d`](https://github.com/thelounge/thelounge/commit/21c8b0d17fc7e09d1cad77990fa833fdcad62927) by [@brunnre8](https://github.com/brunnre8))
- update dependency @types/mousetrap to v1.6.11 ([`7ee4b80`](https://github.com/thelounge/thelounge/commit/7ee4b80a6e744b09385fc686cdca1fbf0e7784ac) by [@brunnre8](https://github.com/brunnre8))
- update dependency @types/lodash to v4.14.191 ([`c67df36`](https://github.com/thelounge/thelounge/commit/c67df36a29a04bacc9e3197a32368493ae0a2ae9) by [@brunnre8](https://github.com/brunnre8))
- caniuse-lite: update db ([`efd3b64`](https://github.com/thelounge/thelounge/commit/efd3b645642ff75639ecb27a8ff9d6f6e1c0ccab) by [@brunnre8](https://github.com/brunnre8))
- build(deps): bump json5 from 2.2.1 to 2.2.3 ([`ce3ad56`](https://github.com/thelounge/thelounge/commit/ce3ad56ced3b498def5bb65065b4185a46a20995) by [@dependabot[bot]](https://github.com/dependabot%5Bbot%5D))
- fix(deps): update dependency ua-parser-js to v1.0.33 [security] ([`bde5c3d`](https://github.com/thelounge/thelounge/commit/bde5c3d443dc1e965bdd2641abb94b526600ddec) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))
- build(deps): bump http-cache-semantics from 4.1.0 to 4.1.1 ([`7304acd`](https://github.com/thelounge/thelounge/commit/7304acd8e072af33dfdd1ea2f108b91a6e449f65) by [@dependabot[bot]](https://github.com/dependabot%5Bbot%5D))
- update dependency postcss to v8.4.21 ([`95e5630`](https://github.com/thelounge/thelounge/commit/95e56300db48bbb75b3463267eb0809ee9739686) by [@brunnre8](https://github.com/brunnre8))
- update dependency sinon to v13.0.2 ([`0183d89`](https://github.com/thelounge/thelounge/commit/0183d89384405ad944863ecffd783c99f0c36517) by [@brunnre8](https://github.com/brunnre8))
- update dependency vue-loader to v17.0.1 ([`eddcbcc`](https://github.com/thelounge/thelounge/commit/eddcbcc7660e5f51d9b794ab0302abb9790c6b3c) by [@brunnre8](https://github.com/brunnre8))
- update dependency webpack-dev-middleware to v5.3.3 ([`4831c20`](https://github.com/thelounge/thelounge/commit/4831c2080415a72492e97d55be8512c86c4324b3) by [@brunnre8](https://github.com/brunnre8))
- update dependency webpack to v5.76.0 ([`6b00ccf`](https://github.com/thelounge/thelounge/commit/6b00ccf82b60503b31e4fee1e32f2765c234d8cc) by [@brunnre8](https://github.com/brunnre8))

## v4.4.0-pre.2 - 2023-03-19 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.4.0-pre.1...v4.4.0-pre.2)

Hot fix for a bug that lead to channel loss upon restart of TL.

## v4.4.0-pre.1 - 2023-03-19 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.3.1...v4.4.0-pre.1)

This is a pre-release for v4.4.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

This is mostly a developer focused release. Max, Eric and others rewrote the whole thing in typescript / vue3,
which should make it much easier to add features and find bugs in the future. So huge kudos from the rest of the team!

Besides that, there's the obvious grab bag of fixes, dependency updates and improvements.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v4.3.1 - 2022-04-11

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v4.3.0...v4.3.1) and [milestone](https://github.com/thelounge/thelounge/milestone/39?closed=1).

4.3.1 closes numerous bugs and introduces one prominent new feature closing [one of our most voted-on issues](https://github.com/thelounge/thelounge/issues/2490): muting! Users now have the ability to mute channels, networks, and private messages. Muted channels are dimmed in the channel list and notifications from them (including nick mentions) are disabled.

Also note that the npm package manager is no longer officially supported by The Lounge and we now only support using [yarn](https://yarnpkg.com).

### Added

- Add context menu when clicking inline channel name ([#4376](https://github.com/thelounge/thelounge/pull/4376) by [@sfan5](https://github.com/sfan5))
- Add /kickban ([#4361](https://github.com/thelounge/thelounge/pull/4361) by [@supertassu](https://github.com/supertassu))
- Add the option to mute channels, queries, and networks ([#4282](https://github.com/thelounge/thelounge/pull/4282) by [@MaxLeiter](https://github.com/MaxLeiter))
- Handle RPL_UMODEIS ([#4427](https://github.com/thelounge/thelounge/pull/4427) by [@brunnre8](https://github.com/brunnre8))
- Don't download image contents during prefetch if not needed ([#4363](https://github.com/thelounge/thelounge/pull/4363) by [@sfan5](https://github.com/sfan5))
- Emit a message for SASL loggedin/loggedout events ([`1e3a7b1`](https://github.com/thelounge/thelounge/commit/1e3a7b12500d8898500eaf54c01e52f8d5a0b3fd) by [@progval](https://github.com/progval))
- Log when file permissions should be changed ([#4373](https://github.com/thelounge/thelounge/pull/4373) by [@brunnre8](https://github.com/brunnre8))

### Changed

- Count number of mode changes, not mode messages in condensed messages ([#4438](https://github.com/thelounge/thelounge/pull/4438) by [@supertassu](https://github.com/supertassu))
- upload: improve error message ([#4435](https://github.com/thelounge/thelounge/pull/4435) by [@brunnre8](https://github.com/brunnre8))
- Use non 0 exit code in abnormal shutdown ([#4423](https://github.com/thelounge/thelounge/pull/4423) by [@brunnre8](https://github.com/brunnre8))
- Show a nicer error in Chan.loadMessages() when network is misconfigured ([#4476](https://github.com/thelounge/thelounge/pull/4476) by [@progval](https://github.com/progval))
- Remove uses of window.event. ([#4434](https://github.com/thelounge/thelounge/pull/4434) by [@itsjohncs](https://github.com/itsjohncs))
- Upload m4a as audio/mp4; embed audio/mp4, x-flac, and x-m4a ([#4470](https://github.com/thelounge/thelounge/pull/4470) by [@xnaas](https://github.com/xnaas))
- Use the DNS result order returned by the OS ([#4484](https://github.com/thelounge/thelounge/pull/4484) by [@sfan5](https://github.com/sfan5))
- Update dependencies to their latest versions:
  - Production: `irc-framework` ([#4425](https://github.com/thelounge/thelounge/pull/4425)), `got` ([#4377](https://github.com/thelounge/thelounge/commit/cb404cd986416a9202a8d452bb29960520703b44)), `mime-types` ([#4378](https://github.com/thelounge/thelounge/commit/b54cdf7880a45387561125d1702a539ec0dca36b)), `yarn` ([#4380](https://github.com/thelounge/thelounge/pull/4380)), `file-type` ([#4384](https://github.com/thelounge/thelounge/pull/4384)), `css-loader` ([#4381](https://github.com/thelounge/thelounge/pull/4381)), `ua-parser-js` ([#4389](https://github.com/thelounge/thelounge/pull/4389)), `filenamify` ([#4391](https://github.com/thelounge/thelounge/pull/4391)), `irc-framework` ([#4392](https://github.com/thelounge/thelounge/pull/4392)), `tlds` ([#4397](https://github.com/thelounge/thelounge/pull/4397)), `vue monorepo` ([#4403](https://github.com/thelounge/thelounge/pull/4403)), `package-json` ([#4414](https://github.com/thelounge/thelounge/pull/4414)), `express` ([#4520](https://github.com/thelounge/thelounge/pull/4520)), `sqlite3` ([#4446](https://github.com/thelounge/thelounge/pull/4446))
  - Development: `babel`, `babel-plugin-istanbul`, `cssnano`, `dayjs`, `mini-css-extract-plugin`, `mocha`, `postcss`, `postcss-preset-env`, `posscss-loader`, `webpack`, `webpack-cli`,
- Bump most deps ([#4453](https://github.com/thelounge/thelounge/pull/4453) by [@brunnre8](https://github.com/brunnre8))
- Switch busboy implementation to `@fastify/busboy` ([#4428](https://github.com/thelounge/thelounge/pull/4428) by [@maxpoulin64](https://github.com/maxpoulin64))

### Fixed

- Clear obsolete mentions upon channel part ([#4436](https://github.com/thelounge/thelounge/pull/4436) by [@brunnre8](https://github.com/brunnre8))
- clientCert: fix up error message ([#4462](https://github.com/thelounge/thelounge/pull/4462) by [@brunnre8](https://github.com/brunnre8))
- getGitCommit: allow git worktrees ([#4426](https://github.com/thelounge/thelounge/pull/4426) by [@brunnre8](https://github.com/brunnre8))
- Make sure the leading '<' is select when copypasting a message ([#4473](https://github.com/thelounge/thelounge/pull/4473) by [@progval](https://github.com/progval))
- Mentions window: filter list when we part a chan ([#4436](https://github.com/thelounge/thelounge/pull/4436) by [@brunnre8](https://github.com/brunnre8))
- Fix /collapse and /expand from interacting with the server in public mode ([#4488](https://github.com/thelounge/thelounge/pull/4488) by [@MaxLeiter](https://github.com/MaxLeiter))

### Documentation

In the main repository:

- Remove extra 'be' in default config.js LDAP comment ([#4430](https://github.com/thelounge/thelounge/pull/4430) by [@MaxLeiter](https://github.com/MaxLeiter))
- Adding 'to' in a sentence in config.js ([#4459](https://github.com/thelounge/thelounge/pull/4459) by [@fnutt](https://github.com/fnutt))
- Remove downloads badge and add thelounge/thelounge-docker link to README ([#4371](https://github.com/thelounge/thelounge/pull/4371) by [@MaxLeiter](https://github.com/MaxLeiter))
- README: suggest running 'yarn format:prettier' when linting fails ([#4467](https://github.com/thelounge/thelounge/pull/4467) by [@progval](https://github.com/progval))

On the [website repository](https://github.com/thelounge/thelounge.github.io):

- update lsio link ([#255](https://github.com/thelounge/thelounge.github.io/pull/255) by [@xnaas](https://github.com/xnaas))
- Document prefetchMaxSearchSize config option ([#256](https://github.com/thelounge/thelounge.github.io/pull/256) by [@MaxLeiter](https://github.com/MaxLeiter))
- Update custom-css.md (#258) ([`de8c020`](https://github.com/thelounge/thelounge.github.io/commit/de8c02017cdd8c9bd46e60b899a3bd6a2d8977ec) by [@PeGaSuS-Coder](https://github.com/PeGaSuS-Coder))
- Remove analytics ([`3eb7fdc`](https://github.com/thelounge/thelounge.github.io/commit/3eb7fdc0bf07ade96829bcfe858e06a47e796ab2) by [@xPaw](https://github.com/xPaw))
- Remove star button ([`eec5b9c`](https://github.com/thelounge/thelounge.github.io/commit/eec5b9c99ec48a28b6ccfc5de7f7273eb284f558) by [@xPaw](https://github.com/xPaw))
- Bump addressable from 2.5.2 to 2.8.0 ([#246](https://github.com/thelounge/thelounge.github.io/pull/246) by [@dependabot](https://github.com/apps/dependabot))
- Update to Jekyll ~> 4.2.1 (#259) ([`db06e52`](https://github.com/thelounge/thelounge.github.io/commit/db06e524fdd2c55a929b0751abeaa761c8550882) by [@MaxLeiter](https://github.com/MaxLeiter))
- Update config documentation for 4.3.1 (#260) ([`94a1179`](https://github.com/thelounge/thelounge.github.io/commit/94a1179e7fa513ee6c1006455d4cdd9729033429) by [@MaxLeiter](https://github.com/MaxLeiter))

### Internals

- Remove node 15.x from build matrix ([#4449](https://github.com/thelounge/thelounge/pull/4449) by [@brunnre8](https://github.com/brunnre8))
- Fix vue/this-in-template linter warning ([#4418](https://github.com/thelounge/thelounge/pull/4418) by [@brunnre8](https://github.com/brunnre8))
- Update actions/setup-node action to v3 ([#4496](https://github.com/thelounge/thelounge/pull/4496) by [@renovate[bot]](https://github.com/renovate%5Bbot%5D))

## v4.3.1-rc.1 - 2022-03-02 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.3.0...v4.3.1-rc.1)

This is a release candidate (RC) for v4.3.1 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v4.3.0 - 2021-11-22

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v4.2.0...v4.3.0) and [milestone](https://github.com/thelounge/thelounge/milestone/37?closed=1).

4.3 is a smaller release with one major feature: message search! A big thank you to [richrd](https://github.com/richrd) and [Nachtalb](https://github.com/Nachtalb) for working on this. Note that it is somewhat limited at the moment — you cannot jump to messages or see context around them, but this was a major hurdle and we can improve upon it. You can try it out by using `/search` or by clicking or tapping the new icon in the topic bar above channels or queries as long as your `messageStorage` server setting includes `sqlite`. Some other additions are an improved ordering of elements for screen reader users, more context menu options, and new gestures for touchscreen users. You can learn about the gestures and new commands by navigating to the Help page with the `?` button in the bottom of your channel sidebar.

Additionally, support for Node 10 has been removed as it reached its end-of-life and the new minimum supported version is Node 12.0.0.

A huge thank you to the 32 contributors who made this release possible!

### Added

- Classes for channels in list with unread counts and highlights ([#4214](https://github.com/thelounge/thelounge/pull/4214) by [@sha1sum](https://github.com/sha1sum))
- Add proper filename to the content-disposition header ([#4187](https://github.com/thelounge/thelounge/pull/4187) by [@Nachtalb](https://github.com/Nachtalb))
- Add HTML lang and labelled-by field to upload ([#4051](https://github.com/thelounge/thelounge/pull/4051) by [@MaxLeiter](https://github.com/MaxLeiter))
- Improve inline audio file support ([#4210](https://github.com/thelounge/thelounge/pull/4210) by [@Nachtalb](https://github.com/Nachtalb))
- Show give/revoke modes and kick in context menu on other modes than +o ([#4176](https://github.com/thelounge/thelounge/pull/4176) by [@mitaka8](https://github.com/mitaka8), [#4181](https://github.com/thelounge/thelounge/pull/4181) by [@MaxLeiter](https://github.com/MaxLeiter))
- Add prefetchMaxSearchSize to override limit for link previews ([#4135](https://github.com/thelounge/thelounge/pull/4135) by [@brunnre8](https://github.com/brunnre8))
- Skip video/audio embeds if og:type exists but does not specify it ([#4040](https://github.com/thelounge/thelounge/pull/4040) by [@xPaw](https://github.com/xPaw))
- Add version support for packages. ([#4041](https://github.com/thelounge/thelounge/pull/4041) by [@McInkay](https://github.com/McInkay))
- Add enterkeyhint on chat input and topic save ([#4055](https://github.com/thelounge/thelounge/pull/4055) by [@xPaw](https://github.com/xPaw))
- Make `add` and `reset` CLI commands scriptable ([#4090](https://github.com/thelounge/thelounge/pull/4090) by [@supertassu](https://github.com/supertassu))
- Add extended join information to join message ([#4105](https://github.com/thelounge/thelounge/pull/4105) by [@GewoonYorick](https://github.com/GewoonYorick))
- Add ignore option to contextmenu ([#4104](https://github.com/thelounge/thelounge/pull/4104) by [@GewoonYorick](https://github.com/GewoonYorick))
- Add gopher and gemini to the commonSchemes ([#4151](https://github.com/thelounge/thelounge/pull/4151) by [@Willamin](https://github.com/Willamin))
- Add network specific leave message ([#4116](https://github.com/thelounge/thelounge/pull/4116) by [@Nachtalb](https://github.com/Nachtalb))
- Message Search ([#4197](https://github.com/thelounge/thelounge/pull/4197) by [@Nachtalb](https://github.com/Nachtalb), [`69c37a5`](https://github.com/thelounge/thelounge/commit/69c37a535b91226ad744068fb38cdfdea5be167e), [`521426b`](https://github.com/thelounge/thelounge/commit/521426bb05ada1784bc61d157fd0d965fbe5fffc) by [@JeDaYoshi](https://github.com/JeDaYoshi), [`40a5ee7`](https://github.com/thelounge/thelounge/commit/40a5ee70b6b5eaaef8380b430172491a6ae4f7bb) by [@MaxLeiter](https://github.com/MaxLeiter), [#3664](https://github.com/thelounge/thelounge/pull/4197) by [@richrd](https://github.com/richrd))
- Fill inputhistory on channel load and more message load ([#4206](https://github.com/thelounge/thelounge/pull/4206) by [@Nachtalb](https://github.com/Nachtalb), [`af96f77`](https://github.com/thelounge/thelounge/commit/af96f7771cd067b71a9fbe92b7de5640fe9f2087) by [@MaxLeiter](https://github.com/MaxLeiter))
- Allow installation of local packages ([#4251](https://github.com/thelounge/thelounge/pull/4251) by [@brunnre8](https://github.com/brunnre8))
- Toggle recent mentions popup with ctrl/alt+m ([#4258](https://github.com/thelounge/thelounge/pull/4258) by [@bl1nk](https://github.com/bl1nk))
- Add support for SOCKS ([#4211](https://github.com/thelounge/thelounge/pull/4211) by [@Mstrodl](https://github.com/Mstrodl))
- Accessibility improvements (re-order, hide, and label certain DOM elements)([#4201](https://github.com/thelounge/thelounge/pull/4201) by [@MaxLeiter](https://github.com/MaxLeiter), [#4279](https://github.com/thelounge/thelounge/pull/4279) by [@JeDaYoshi](https://github.com/JeDaYoshi))
- Add /umode support ([#4274](https://github.com/thelounge/thelounge/pull/4274) by [@JeDaYoshi](https://github.com/JeDaYoshi))
- Add warning for HTTPS requirement on notifications ([#4280](https://github.com/thelounge/thelounge/pull/4280) by [@JeDaYoshi](https://github.com/JeDaYoshi))
- Allow network list reordering via touch. ([#4326](https://github.com/thelounge/thelounge/pull/4326), [#4332](https://github.com/thelounge/thelounge/pull/4332) by [@itsjohncs](https://github.com/itsjohncs))
- Two-finger swipe now switches windows (#3901) ([#4324](https://github.com/thelounge/thelounge/pull/4324) by [@itsjohncs](https://github.com/itsjohncs))
- Improve responsiveness of channel name and topic. ([#4340](https://github.com/thelounge/thelounge/pull/4340) by [@itsjohncs](https://github.com/itsjohncs))
- Add more plugin functionality ([#4329](https://github.com/thelounge/thelounge/pull/4329) by [@brunnre8](https://github.com/brunnre8))
- Add keyboard shortcut for help screen (#4315) ([`9a0ba1d`](https://github.com/thelounge/thelounge/commit/9a0ba1da6c318e74545d931ec67c67e87071285a) by [@NoahvdAa](https://github.com/NoahvdAa))

### Changed

- Vertically center topic editing input in Safari. (#4325) ([`2ab6716`](https://github.com/thelounge/thelounge/commit/2ab671664e1ac550fbb22b81284c665f72eee1d9) by [@itsjohncs](https://github.com/itsjohncs))
- Do not condense single messages (#4313) ([`7873847`](https://github.com/thelounge/thelounge/commit/7873847a7ebb4c26c0c380c6304f55a431a3872e) by [@supertassu](https://github.com/supertassu))
- MessageSearchForm: do not focus input if search is closed ([#4242](https://github.com/thelounge/thelounge/pull/4242) by [@brunnre8](https://github.com/brunnre8))
- Add new "/search query" command to open the search window ([#4213](https://github.com/thelounge/thelounge/pull/4213) by [@Nachtalb](https://github.com/Nachtalb))
- Add support for JPEG XL image previews ([#4219](https://github.com/thelounge/thelounge/pull/4219) by [@TheDecryptor](https://github.com/TheDecryptor))
- Make esc key close mentions window (#4365) ([`9dbf647`](https://github.com/thelounge/thelounge/commit/9dbf647f7e3248eedd0f237be55ef7244647a005) by [@brunnre8](https://github.com/brunnre8))
- Display server-originated notices to channels in the channel window ([#4260](https://github.com/thelounge/thelounge/pull/4260) by [@BradleyShaw](https://github.com/BradleyShaw))
- Optimise modes based on ISUPPORT ([#4275](https://github.com/thelounge/thelounge/pull/4275) by [@JeDaYoshi](https://github.com/JeDaYoshi))
- Allow wildcards in hostmask ([#4351](https://github.com/thelounge/thelounge/pull/4351) by [@brunnre8](https://github.com/brunnre8))
- Only scroll history when cursor is on first or last row ([#4205](https://github.com/thelounge/thelounge/pull/4205) by [@Nachtalb](https://github.com/Nachtalb))
- Cleanup of SQLite message storage ([#4345](https://github.com/thelounge/thelounge/pull/4345) by [@itsjohncs](https://github.com/itsjohncs))
- Do not generate and send client certificate unless SASL EXTERNAL is requested ([#4093](https://github.com/thelounge/thelounge/pull/4093) by [@xPaw](https://github.com/xPaw))
- NetworkForm: s/away message/leave message/ ([#4193](https://github.com/thelounge/thelounge/pull/4193) by [@brunnre8](https://github.com/brunnre8))
- Settings: show label for nick autocompletion postfix ([#4195](https://github.com/thelounge/thelounge/pull/4195) by [@brunnre8](https://github.com/brunnre8))
- Move font assignment of password reveal icon ([#4342](https://github.com/thelounge/thelounge/pull/4342) by [@deejayy](https://github.com/deejayy))
- Prevent round and white search styling in iOS 15. ([#4352](https://github.com/thelounge/thelounge/pull/4352) by [@itsjohncs](https://github.com/itsjohncs))
- Allow escape key to close search bar and search page ([#4364](https://github.com/thelounge/thelounge/pull/4364) by [@MaxLeiter](https://github.com/MaxLeiter))
- Use SortableJS 1.14.0. (#4330) ([`2b634a6`](https://github.com/thelounge/thelounge/commit/2b634a6ba61bfc4c3b45f620b11396497f2f77a5) by [@itsjohncs](https://github.com/itsjohncs))
- Switch to thelounge/Sortable fork for Sortable.js (#4368) ([`315198a`](https://github.com/thelounge/thelounge/commit/315198ac0ba07400a33e8949ba50cddb774695c4) by [@MaxLeiter](https://github.com/MaxLeiter))
- Update production dependencies to their latest versions:
  - `tlds` ([#4046](https://github.com/thelounge/thelounge/pull/4046))
  - `commander` ([#4168](https://github.com/thelounge/thelounge/pull/4168), [#4185](https://github.com/thelounge/thelounge/pull/4185))
  - `sqlite3` ([#4142](https://github.com/thelounge/thelounge/pull/4142))
  - `chalk` ([#4208](https://github.com/thelounge/thelounge/pull/4208))
  - `mime-types` ([#4349](https://github.com/thelounge/thelounge/pull/4349))
  - `linkify-it` ([#4348](https://github.com/thelounge/thelounge/pull/4348))

### Fixed

- Differentiate WALLOPS from NOTICE ([#4264](https://github.com/thelounge/thelounge/pull/4264) by [@BradleyShaw](https://github.com/BradleyShaw))
- Fix sporadic rounding on message search bar. ([#4333]((https://github.com/thelounge/thelounge/pull/4333), [#4328](<(https://github.com/thelounge/thelounge/pull/4328)>) by [@itsjohncs](https://github.com/itsjohncs))
- Fix missing users in userlist after removing searchinput ([#4221](https://github.com/thelounge/thelounge/pull/4221) by [@Nachtalb](https://github.com/Nachtalb))
- Always use multi-prefix modes ([#4060](https://github.com/thelounge/thelounge/pull/4060) by [@xPaw](https://github.com/xPaw))
- Fix breaking GIFs while removing metadata ([#4110](https://github.com/thelounge/thelounge/pull/4110) by [@Nachtalb](https://github.com/Nachtalb))
- Improved handling of empty userdata ([#4190](https://github.com/thelounge/thelounge/pull/4190) by [@Nachtalb](https://github.com/Nachtalb))
- Restrict what the browser should try to autocomplete ([#4192](https://github.com/thelounge/thelounge/pull/4192) by [@Nachtalb](https://github.com/Nachtalb), [#4337](https://github.com/thelounge/thelounge/commit/3ba7fb6de4270db1310b8624c9f308e858352f4a) by [@brunnre8](https://github.com/brunnre8))
- Render styling for colored host masks ([#4235](https://github.com/thelounge/thelounge/pull/4235) by [@angerson](https://github.com/angerson))
- Fix not overriding config options with -c ([#4262](https://github.com/thelounge/thelounge/pull/4262) by [@MaxLeiter](https://github.com/MaxLeiter))
- Fix nick-less messages from servers ([#4277](https://github.com/thelounge/thelounge/pull/4277) by [@JeDaYoshi](https://github.com/JeDaYoshi))
- Fix authenticated proxy ([#4341](https://github.com/thelounge/thelounge/pull/4341) by [@Nachtalb](https://github.com/Nachtalb))
- Allow text drag & drop into input text field ([#4212](https://github.com/thelounge/thelounge/pull/4212) by [@Nachtalb](https://github.com/Nachtalb))

### Security

- Update dependency ua-parser-js to v0.7.24 ([#4216](https://github.com/thelounge/thelounge/pull/4216) by [@renovate](https://github.com/apps/renovate))
- Update dependency postcss to v8.2.10 ([#4223](https://github.com/thelounge/thelounge/pull/4223) by [@renovate](https://github.com/apps/renovate))
- CSP adjustments ([#4344](https://github.com/thelounge/thelounge/pull/4344) by [@brunnre8](https://github.com/brunnre8))
- Bump required node version to 12.x and add 16.x builds ([#4356](https://github.com/thelounge/thelounge/pull/4356) by [@MaxLeiter](https://github.com/MaxLeiter))

### Documentation

In the main repository:

- Clarify description of prefetchMaxSearchSize. (#4338) ([`21c6abd`](https://github.com/thelounge/thelounge/commit/21c6abdd1d9e7ab09612250857ea418beb2885ec) by [@itsjohncs](https://github.com/itsjohncs))
- `client/views` -> `client/components` in README ([#4196](https://github.com/thelounge/thelounge/pull/4196) by [@MaxLeiter](https://github.com/MaxLeiter))

On the [website repository](https://github.com/thelounge/thelounge.github.io):

- Update commands API docs (#217) ([`9c6a9e4`](https://github.com/thelounge/thelounge.github.io/commit/9c6a9e4b7d31efa37708a2796254f6cbe6e9abdf) by [@McInkay](https://github.com/McInkay))
- Add Caddy v2 examples (#230) ([`5554338`](https://github.com/thelounge/thelounge.github.io/commit/55543386feaf1f41dd845d500458a49be417da39) by [@Jay2k1](https://github.com/Jay2k1))
- Add self hosted pod to community.md (#231) ([`9e658c6`](https://github.com/thelounge/thelounge.github.io/commit/9e658c618daa144c8d757826c54d9bd67c53a133) by [@MaxLeiter](https://github.com/MaxLeiter))
- reword note on daemonizing when installing from npm (#232) ([`6fab4fe`](https://github.com/thelounge/thelounge.github.io/commit/6fab4fe456abed6343b84f21f7caf5a3a0c6fed3) by [@igalic](https://github.com/igalic))
- Add css snippets for hiding account and realname from join messages ([#233](https://github.com/thelounge/thelounge.github.io/pull/233) by [@GewoonYorick](https://github.com/GewoonYorick))
- Add macOS Instructions ([#237](https://github.com/thelounge/thelounge.github.io/pull/237) by [@xnaas](https://github.com/xnaas))
- add "Hide unread counters in sidebar, just show a highlight indicator" ([#235](https://github.com/thelounge/thelounge.github.io/pull/235) by [@Jay2k1](https://github.com/Jay2k1))
- Clarify enabling Advanced settings to access custom CSS ([`cb0a427`](https://github.com/thelounge/thelounge.github.io/commit/cb0a427f49a313d7fc0eb56b0e422c14eb234574) by [@MaxLeiter](https://github.com/MaxLeiter))
- Update outdated CSS snippets in custom-css.md (#238) ([`fe9d09c`](https://github.com/thelounge/thelounge.github.io/commit/fe9d09c5062dd7dbe3563c7e72f82ef0c1a9eeb9) by [@EliteOfGods](https://github.com/EliteOfGods))
- Change the IRC server to Libera.Chat (#242) ([`7b8c010`](https://github.com/thelounge/thelounge.github.io/commit/7b8c0100fc66e368e02ece5e8a62e40f0817b3ae) by [@mhajder](https://github.com/mhajder))
- Fix spaces ([`3a41b12`](https://github.com/thelounge/thelounge.github.io/commit/3a41b121ec0d5e0b93694438dec8a4758b88627b) by [@xPaw](https://github.com/xPaw))
- Update custom-css.md ([#240](https://github.com/thelounge/thelounge.github.io/pull/240) by [@PeGaSuS-Coder](https://github.com/PeGaSuS-Coder))
- Alphabetically sorted unofficial install methods, added Swizzin ([#236](https://github.com/thelounge/thelounge.github.io/pull/236) by [@flying-sausages](https://github.com/flying-sausages))
- Update dependencies and community page (#245) ([`0762606`](https://github.com/thelounge/thelounge.github.io/commit/0762606c3bbfe55a4b053d6a6bddd0129ba1fff8) by [@MaxLeiter](https://github.com/MaxLeiter))
- Update config.js.md (#247) ([`3036977`](https://github.com/thelounge/thelounge.github.io/commit/3036977f3ea7c521cd22f29bfb3425f079ce5ed3) by [@ledakis](https://github.com/ledakis))
- Docs - Adding plugins section on main website (#248) ([`1fbaa17`](https://github.com/thelounge/thelounge.github.io/commit/1fbaa17cd9baa74e8d4c3dfab91b445105a503e5) by [@aab12345](https://github.com/aab12345))
- Docs - Change header links on main website (#249) ([`52eb866`](https://github.com/thelounge/thelounge.github.io/commit/52eb8668577ba9e7a4813831c77440be64c5aac8) by [@aab12345](https://github.com/aab12345))
- Extend theming guide with "files" section (#252) ([`94b8c8d`](https://github.com/thelounge/thelounge.github.io/commit/94b8c8dacea0d8b5941e35ca9a6b0ed30eaa7b2d) by [@deejayy](https://github.com/deejayy))
- Protect The Lounge with HTTPS (#253) ([`c4cfe60`](https://github.com/thelounge/thelounge.github.io/commit/c4cfe60421dc19e530119f63b637991ac0c465d8) by [@aab12345](https://github.com/aab12345))
- Plugin docs (#254) ([`45b32c5`](https://github.com/thelounge/thelounge.github.io/commit/45b32c5bf5282fc207427e9c22bdbc622b947eb0) by [@brunnre8](https://github.com/brunnre8))

### Internals

- Clean up global listener in Sidebar component. (#4331) ([`5d76ed8`](https://github.com/thelounge/thelounge/commit/5d76ed888ce8d328913c15fde0b1026f0d60eb54) by [@itsjohncs](https://github.com/itsjohncs))
- Properly track user modes for context menu (#4267) ([`8fcd079`](https://github.com/thelounge/thelounge/commit/8fcd079204f6c44cadf7fff95c00a44242a61c68) by [@brunnre8](https://github.com/brunnre8))
- Optimise commands processing ([`0d839c5`](https://github.com/thelounge/thelounge/commit/0d839c501efa0cf56bce72263ab5c93535e34cd1) by [@JeDaYoshi](https://github.com/JeDaYoshi))
- Fix linter warnings for aria-label placement ([`d05cf5f`](https://github.com/thelounge/thelounge/commit/d05cf5fe628596a55a8aebda03e5692488890d94) by [@MaxLeiter](https://github.com/MaxLeiter))
- Configure server ping timeout to 60 seconds ([#4171](https://github.com/thelounge/thelounge/pull/4171) by [@emilyst](https://github.com/emilyst))
- Fix test for production build ([`c2e8eaf`](https://github.com/thelounge/thelounge/commit/c2e8eaf9dfed3720657b80619397f6d037d1c835) by [@xPaw](https://github.com/xPaw))
- Add node 15 to test matrix ([`69986b3`](https://github.com/thelounge/thelounge/commit/69986b3ee5727cee9ecd274efcfcfe5137116857) by [@xPaw](https://github.com/xPaw))
- Add .vscode settings and suggested extensions ([#4042](https://github.com/thelounge/thelounge/pull/4042) by [@xPaw](https://github.com/xPaw))
- Change the IRC server to Libera.Chat ([#4238](https://github.com/thelounge/thelounge/pull/4238) by [@mhajder](https://github.com/mhajder))
- Update prettier and apply formatting ([`b74b692`](https://github.com/thelounge/thelounge/commit/b74b6923912ec7c498a8fbcd0a6f53c44c7a3f25) by [@xPaw](https://github.com/xPaw))
- Update dependencies ([[`#4155`](https://github.com/thelounge/thelounge/pulls/4155), [`#4252`](https://github.com/thelounge/thelounge/pulls/4252), [`#4265`](https://github.com/thelounge/thelounge/pulls/4265), [`#4281`](https://github.com/thelounge/thelounge/pulls/4281), [`#4312`](https://github.com/thelounge/thelounge/pulls/4312) by [@MaxLeiter], [#4087](https://github.com/thelounge/thelounge/pulls/4087) by [@xPaw](https://github.com/xPaw))
- Change renovate to monthly ([`7ee0732`](https://github.com/thelounge/thelounge/commit/7ee0732f56644f4f337cfdc5244f44e3e27dc8bc) by [@xPaw](https://github.com/xPaw))
- Add depTypeList to renovate ([`61ebd65`](https://github.com/thelounge/thelounge/commit/61ebd65367fa4d829b84ef2a48ad185cb2c8a385) by [@xPaw](https://github.com/xPaw))
- Update mini-css-extract-plugin ([`a9fb563`](https://github.com/thelounge/thelounge/commit/a9fb563c01a3c4ff9520e5017c42b28911eda38f) by [@xPaw](https://github.com/xPaw))
- Upgrade to webpack 5 ([`41831d1`](https://github.com/thelounge/thelounge/commit/41831d18b1507275de61bf79bb32cb25a3b590eb) by [@xPaw](https://github.com/xPaw))
- Update development dependencies to their latest versions:
  - `pretty-quick` ([#4045](https://github.com/thelounge/thelounge/pull/4045))
  - `@babel/core` ([#4043](https://github.com/thelounge/thelounge/pull/4043), [#4167](https://github.com/thelounge/thelounge/pull/4167), [#4182](https://github.com/thelounge/thelounge/pull/4182), [#4207](https://github.com/thelounge/thelounge/pull/4207))
  - `@vue/server-test-utils` ([#4094](https://github.com/thelounge/thelounge/pull/4094))
  - `@vue/test-utils` ([#4094](https://github.com/thelounge/thelounge/pull/4094))
  - `vue-loader` ([#4094](https://github.com/thelounge/thelounge/pull/4094))
  - `eslint-plugin-vue` ([#4141](https://github.com/thelounge/thelounge/pull/4141))
  - `eslint` ([#4140](https://github.com/thelounge/thelounge/pull/4140), [#4170](https://github.com/thelounge/thelounge/pull/4170), [#4076](https://github.com/thelounge/thelounge/pull/4076))
  - `dayjs` ([#4139](https://github.com/thelounge/thelounge/pull/4139))
  - `copy-webpack-plugin` ([#4138](https://github.com/thelounge/thelounge/pull/4138))
  - `css-loader` ([#4169](https://github.com/thelounge/thelounge/pull/4169))
  - `@babel/preset-env` ([#4167](https://github.com/thelounge/thelounge/pull/4167), [#4182](https://github.com/thelounge/thelounge/pull/4182), [#4207](https://github.com/thelounge/thelounge/pull/4207))
  - `@fortawesome/fontawesome-free` ([#4183](https://github.com/thelounge/thelounge/pull/4183))
  - `chai` ([#4184](https://github.com/thelounge/thelounge/pull/4184))

In the [deb repository](https://github.com/thelounge/thelounge-deb):

- Add node 14 to GitHub action ([`56c7ba6`](https://github.com/thelounge/thelounge-deb/commit/56c7ba6cc598ccf9da1e04876b4e107f98cc3ed2) by [@xPaw](https://github.com/xPaw))
- Upgrade TravisCI to Bionic ([#77](https://github.com/thelounge/thelounge-deb/pull/77) by [@maxpoulin64](https://github.com/maxpoulin64))
- systemd: Don't force enable units ([#74](https://github.com/thelounge/thelounge-deb/pull/74) by [@brunnre8](https://github.com/brunnre8))
- Use dedicated npm cache dir ([#76](https://github.com/thelounge/thelounge-deb/pull/76) by [@brunnre8](https://github.com/brunnre8))
- Make all files root owned ([#75](https://github.com/thelounge/thelounge-deb/pull/75) by [@brunnre8](https://github.com/brunnre8))

## v4.3.0-rc.2 - 2021-11-18 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.3.0-rc.1...v4.3.0-rc.2)

This is a release candidate (RC) for v4.3.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v4.3.0-rc.1 - 2021-11-17 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.3.0-pre.6...v4.3.0-rc.1)

This is a release candidate (RC) for v4.3.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v4.3.0-pre.6 - 2021-11-04 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.3.0-pre.5...v4.3.0-pre.6)

This is a pre-release for v4.3.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v4.3.0-pre.5 - 2021-11-03 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.3.0-pre.4...v4.3.0-pre.5)

This is a pre-release for v4.3.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v4.3.0-pre.4 - 2021-07-01 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.3.0-pre.3...v4.3.0-pre.4)

This is a pre-release for v4.3.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v4.3.0-pre.3 - 2021-06-29 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.3.0-pre.2...v4.3.0-pre.3)

This is a pre-release for v4.3.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v4.3.0-pre.2 - 2021-06-07 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.3.0-pre.1...v4.3.0-pre.2)

This is a pre-release for v4.3.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v4.3.0-pre.1 - 2021-03-02 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.2.0...v4.3.0-pre.1)

This is a pre-release for v4.3.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v4.2.0 - 2020-08-19

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v4.1.0...v4.2.0) and [milestone](https://github.com/thelounge/thelounge/milestone/36?closed=1).

This is a minor release with one significant new feature: a mentions panel!

<p align="center">
  <img width="466" alt="Mentions panel" src="https://user-images.githubusercontent.com/613331/90796491-0fadf380-e318-11ea-8fda-51613a9a3221.png">
</p>

Other notable additions include custom highlight exceptions, a new configuration option to not send preview requests to 3rd party websites, and uploaded images will have [EXIF](https://en.wikipedia.org/wiki/Exif) data automatically removed.

There's also a new section for configuring SASL on the Connect screen, and `SASL EXTERNAL` is now supported.

<p align="center">
  <img width="489" alt="SASL authentication" src="https://user-images.githubusercontent.com/613331/90796501-15a3d480-e318-11ea-9dab-c225816a6685.png">
  <img width="474" alt="SASL external (certfp)" src="https://user-images.githubusercontent.com/613331/90796504-15a3d480-e318-11ea-9636-c1025c9d2306.png">
</p>

Along with other bugs, a Chrome bug causing lag when typing has been fixed. Additionally, the `node-sqlite3` dependency has been updated, and you no longer need to re-install The Lounge when you update Node.js.

And as an update for our Docker users, `thelounge-docker` now has support for ARM images; thanks [@williamboman](https://github.com/williamboman) and [@klausenbusk](https://github.com/klausenbusk)!

### Added

- Track mentions/highlights and add a window to view them ([#3858](https://github.com/thelounge/thelounge/pull/3858), [#3993](https://github.com/thelounge/thelounge/pull/3993), [#3862](https://github.com/thelounge/thelounge/pull/3862), [#3868](https://github.com/thelounge/thelounge/pull/3868), [#4003](https://github.com/thelounge/thelounge/pull/4003) by [@xPaw](https://github.com/xPaw))
- Add an option to display 12-hour times ([#3787](https://github.com/thelounge/thelounge/pull/3787) by [@xPaw](https://github.com/xPaw))
- Add clear channel history (available in channel context menu)([#3778](https://github.com/thelounge/thelounge/pull/3778) by [@xPaw](https://github.com/xPaw))
- Add CertFP support; separate SASL configuration; merge `displayNetwork` and `lockNetwork` in The Lounge configuration file ([#3844](https://github.com/thelounge/thelounge/pull/3844) by [@xPaw](https://github.com/xPaw))
- Add an indicator to `STATUSMSG` messages ([#3875](https://github.com/thelounge/thelounge/pull/3875) by [@xPaw](https://github.com/xPaw))
- Add native app badges for highlights (Chrome 81+) ([#3845](https://github.com/thelounge/thelounge/pull/3845) by [@xPaw](https://github.com/xPaw))
- Add generic monospace blocks for `INFO` and `HELP` numerics ([#3962](https://github.com/thelounge/thelounge/pull/3962) by [@xPaw](https://github.com/xPaw), [#4032](https://github.com/thelounge/thelounge/pull/4032) by [@xPaw](https://github.com/xPaw))
- Add option to disable media preview ([#3983](https://github.com/thelounge/thelounge/pull/3983) by [@dalcde](https://github.com/dalcde))
- Add custom highlight exceptions ([#3998](https://github.com/thelounge/thelounge/pull/3998) by [@Jay2k1](https://github.com/Jay2k1))
- Add navigation in image viewer ([#3798](https://github.com/thelounge/thelounge/pull/3798) by [@richrd](https://github.com/richrd))
- Render images in canvas before upload to remove EXIF data ([#3764](https://github.com/thelounge/thelounge/pull/3764) by [@xPaw](https://github.com/xPaw))

### Changed

- Disable link prefetching for urls with no schema specified ([#4014](https://github.com/thelounge/thelounge/pull/4014) by [@xPaw](https://github.com/xPaw))
- Disable settings sync for browser notifications and notification sound ([#4028](https://github.com/thelounge/thelounge/pull/4028) by [@xPaw](https://github.com/xPaw))
- Make usernames case-insensitive when logging in ([#3918](https://github.com/thelounge/thelounge/pull/3918) by [@ashwinikammar](https://github.com/ashwinikammar))
- Separate active sessions section ([#3817](https://github.com/thelounge/thelounge/pull/3817) by [@xPaw](https://github.com/xPaw))
- Add `role=group` to status messages setting ([#3790](https://github.com/thelounge/thelounge/pull/3790) by [@xPaw](https://github.com/xPaw))
- Filter user loading at startup for "advanced" LDAP ([#3871](https://github.com/thelounge/thelounge/pull/3871) by [@ebardie](https://github.com/ebardie))
- Reconnects now use exponential backoff
- Update production dependencies to their latest versions:
  - `uuid` ([#3791](https://github.com/thelounge/thelounge/pull/3791), [#3837](https://github.com/thelounge/thelounge/pull/3837), [#3890](https://github.com/thelounge/thelounge/pull/3890), [#3919](https://github.com/thelounge/thelounge/pull/3919), [#3957](https://github.com/thelounge/thelounge/pull/3957), [#4004](https://github.com/thelounge/thelounge/pull/4004))
  - `yarn` ([#3792](https://github.com/thelounge/thelounge/pull/3792), [#3800](https://github.com/thelounge/thelounge/pull/3800))
  - `file-type` ([#3801](https://github.com/thelounge/thelounge/pull/3801), [#3896](https://github.com/thelounge/thelounge/pull/3896), [#3909](https://github.com/thelounge/thelounge/pull/3909), [#3920](https://github.com/thelounge/thelounge/pull/3920), [#3934](https://github.com/thelounge/thelounge/pull/3934), [#3940](https://github.com/thelounge/thelounge/pull/3940))
  - `commander` ([#3807](https://github.com/thelounge/thelounge/pull/3807), [#3992](https://github.com/thelounge/thelounge/pull/3992))
  - `got` ([#3829](https://github.com/thelounge/thelounge/pull/3829), [#3869](https://github.com/thelounge/thelounge/pull/3869), [#3898](https://github.com/thelounge/thelounge/pull/3898), [#3905](https://github.com/thelounge/thelounge/pull/3905), [#3932](https://github.com/thelounge/thelounge/pull/3932), [#3935](https://github.com/thelounge/thelounge/pull/3935), [#3972](https://github.com/thelounge/thelounge/pull/3972), [#3988](https://github.com/thelounge/thelounge/pull/3988))
  - `irc-framework` ([#3838](https://github.com/thelounge/thelounge/pull/3838), [#3984](https://github.com/thelounge/thelounge/pull/3984))
  - `chalk` ([#3839](https://github.com/thelounge/thelounge/pull/3839))
  - `semver` ([#3843](https://github.com/thelounge/thelounge/pull/3843), [#3863](https://github.com/thelounge/thelounge/pull/3863))
  - `web-push` ([#3904](https://github.com/thelounge/thelounge/pull/3904))
  - `linkify-it` ([#3917](https://github.com/thelounge/thelounge/pull/3917))
  - `sqlite3` ([#3886](https://github.com/thelounge/thelounge/pull/3886))
  - `ldapjs` ([#3931](https://github.com/thelounge/thelounge/pull/3931), [#3996](https://github.com/thelounge/thelounge/pull/3996))
  - `tlds` ([#4015](https://github.com/thelounge/thelounge/pull/4015))

### Fixed

- Fix sending unhandled numerics to target channel ([#3789](https://github.com/thelounge/thelounge/pull/3789) by [@xPaw](https://github.com/xPaw))
- Fix up first argument not being used as part message ([#3808](https://github.com/thelounge/thelounge/pull/3808) by [@xPaw](https://github.com/xPaw))
- Pass in client manager object in update checker ([#3797](https://github.com/thelounge/thelounge/pull/3797) by [@xPaw](https://github.com/xPaw))
- Do not handle navigation keybinds in inputs if not empty ([#3814](https://github.com/thelounge/thelounge/pull/3814) by [@xPaw](https://github.com/xPaw))
- Fix body overscroll and overflow on iOS Safari ([#3828](https://github.com/thelounge/thelounge/pull/3828) by [@stevenengler](https://github.com/stevenengler))
- Fix off-by-one color error in webmanifest ([#3867](https://github.com/thelounge/thelounge/pull/3867) by [@maxpoulin64](https://github.com/maxpoulin64))
- Support multiple arguments in eventbus emit ([#3885](https://github.com/thelounge/thelounge/pull/3885) by [@xPaw](https://github.com/xPaw))
- Fix msg id order when loading from sqlite ([#3888](https://github.com/thelounge/thelounge/pull/3888) by [@xPaw](https://github.com/xPaw))
- Reply to the server if that's where CTCP VERSION originated ([#3906](https://github.com/thelounge/thelounge/pull/3906) by [@xPaw](https://github.com/xPaw))
- Fix date marker not displaying sometimes ([#3978](https://github.com/thelounge/thelounge/pull/3978) by [@xPaw](https://github.com/xPaw))
- Allow changing network name in private mode with lockNetwork ([#3977](https://github.com/thelounge/thelounge/pull/3977) by [@xPaw](https://github.com/xPaw))
- Fix upload tokens expiring while uploading when TL is proxied ([#3986](https://github.com/thelounge/thelounge/pull/3986) by [@xPaw](https://github.com/xPaw))
- Refresh notification permission state when push is enabled ([#3987](https://github.com/thelounge/thelounge/pull/3987) by [@xPaw](https://github.com/xPaw))
- Fix mode message only making last nick clickable ([#4005](https://github.com/thelounge/thelounge/pull/4005) by [@xPaw](https://github.com/xPaw))
- Sync changed network name to open clients ([#4038](https://github.com/thelounge/thelounge/pull/4038) by [@xPaw](https://github.com/xPaw))
- Fix layout trashing in Chrome causing typing lag ([#3999](https://github.com/thelounge/thelounge/pull/3999) by [@xPaw](https://github.com/xPaw))
- Fixed a rare bug in `irc-framework` that caused duplicate messages

### Internals

- Optimize user list updates for quit/part/kick events ([#3857](https://github.com/thelounge/thelounge/pull/3857) by [@xPaw](https://github.com/xPaw))
- Remove "The Lounge" from connect in public ([#3816](https://github.com/thelounge/thelounge/pull/3816) by [@xPaw](https://github.com/xPaw))
- Replace all uses of `fs-extra` with native methods ([#3810](https://github.com/thelounge/thelounge/pull/3810) by [@xPaw](https://github.com/xPaw))
- Upgrade to `mocha@7` and remove `mochapack` ([#3826](https://github.com/thelounge/thelounge/pull/3826) by [@xPaw](https://github.com/xPaw))
- Remove `intersection-observer` polyfill ([#3864](https://github.com/thelounge/thelounge/pull/3864) by [@xPaw](https://github.com/xPaw))
- Safeguard nick randomizer up to allowed length ([#3870](https://github.com/thelounge/thelounge/pull/3870) by [@xPaw](https://github.com/xPaw))
- Replace vue events with our own event bus ([#3872](https://github.com/thelounge/thelounge/pull/3872) by [@xPaw](https://github.com/xPaw))
- Cleanup vue router route guards ([#3995](https://github.com/thelounge/thelounge/pull/3995) by [@xPaw](https://github.com/xPaw))
- Use lodash where possible ([#4020](https://github.com/thelounge/thelounge/pull/4020) by [@xPaw](https://github.com/xPaw))
- Replace dashes to underscores in emoji autocompletion ([#4029](https://github.com/thelounge/thelounge/pull/4029) by [@xPaw](https://github.com/xPaw))
- Changes required for vue 3 ([#3889](https://github.com/thelounge/thelounge/pull/3889) by [@timmw](https://github.com/timmw))
- Test node v14 ([#3976](https://github.com/thelounge/thelounge/pull/3976) by [@xPaw](https://github.com/xPaw))
- Update development dependencies to their latest versions.

## v4.2.0-pre.2 - 2020-07-28 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.2.0-pre.1...v4.2.0-pre.2)

This is a pre-release for v4.2.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v4.2.0-pre.1 - 2020-05-17 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.1.0...v4.2.0-pre.1)

This is a pre-release for v4.2.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v4.1.0 - 2020-03-09

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v4.0.0...v4.1.0) and [milestone](https://github.com/thelounge/thelounge/milestone/35?closed=1).

This is a minor release that fixes up some of the bugs that have made it into the 4.0.0 release.
This release adds a jump to channel switcher (a search box that can be activated with <kbd>Alt+J</kbd>).

Support for the IRCv3 [strict transport security](https://ircv3.net/specs/extensions/sts) specification has been added.
If a network sends a `sts` capability, The Lounge will automatically upgrade the connection to TLS and will stay on it.

### Added

- Jump to channel switcher ([#3594](https://github.com/thelounge/thelounge/pull/3594) by [@richrd](https://github.com/richrd))
- Implemented strict transport security (STS) for IRC networks ([#3770](https://github.com/thelounge/thelounge/pull/3770) by [@xPaw](https://github.com/xPaw))
- Add keybinds to toggle sidebar, user list, and networks ([#3660](https://github.com/thelounge/thelounge/pull/3660) by [@xPaw](https://github.com/xPaw))
- Display the original sets mode string and make nicks clickable ([#3647](https://github.com/thelounge/thelounge/pull/3647) by [@xPaw](https://github.com/xPaw))
- Show an icon for "show in active" messages ([#3670](https://github.com/thelounge/thelounge/pull/3670) by [@xPaw](https://github.com/xPaw))
- Display icon when update is available, check on server start ([#3658](https://github.com/thelounge/thelounge/pull/3658) by [@xPaw](https://github.com/xPaw))
- Switch default ports when toggling TLS ([#3645](https://github.com/thelounge/thelounge/pull/3645) by [@xPaw](https://github.com/xPaw))
- Added emojis 13.0 ([#3735](https://github.com/thelounge/thelounge/pull/3735) by [@xPaw](https://github.com/xPaw))

### Changed

- Collapse prefetch errors by default, and correctly track user toggle ([#3628](https://github.com/thelounge/thelounge/pull/3628) by [@xPaw](https://github.com/xPaw))
- Write prettier error messages for certain errors ([#3741](https://github.com/thelounge/thelounge/pull/3741) by [@RockyTV](https://github.com/RockyTV))
- Update production dependencies to their latest versions:
  - `got` ([#3630](https://github.com/thelounge/thelounge/pull/3630), [#3657](https://github.com/thelounge/thelounge/pull/3657), [#3689](https://github.com/thelounge/thelounge/pull/3689), [#3722](https://github.com/thelounge/thelounge/pull/3722), [#3734](https://github.com/thelounge/thelounge/pull/3734), [#3743](https://github.com/thelounge/thelounge/pull/3743))
  - `commander` ([#3675](https://github.com/thelounge/thelounge/pull/3675))
  - `mime-types` ([#3674](https://github.com/thelounge/thelounge/pull/3674))
  - `file-type` ([#3678](https://github.com/thelounge/thelounge/pull/3678), [#3683](https://github.com/thelounge/thelounge/pull/3683), [#3698](https://github.com/thelounge/thelounge/pull/3698), [#3713](https://github.com/thelounge/thelounge/pull/3713), [#3739](https://github.com/thelounge/thelounge/pull/3739), [#3755](https://github.com/thelounge/thelounge/pull/3755), [#3776](https://github.com/thelounge/thelounge/pull/3776))
  - `uuid` ([#3704](https://github.com/thelounge/thelounge/pull/3704), [#3777](https://github.com/thelounge/thelounge/pull/3777), [#3780](https://github.com/thelounge/thelounge/pull/3780))
  - `semver` ([#3733](https://github.com/thelounge/thelounge/pull/3733), [#3754](https://github.com/thelounge/thelounge/pull/3754))
  - `yarn` ([#3742](https://github.com/thelounge/thelounge/pull/3742))
  - `irc-framework` ([#3782](https://github.com/thelounge/thelounge/pull/3782))

### Fixed

- Change sqlite parallelize to serialize when loading messages ([#3762](https://github.com/thelounge/thelounge/pull/3762) by [@xPaw](https://github.com/xPaw))
- Fix url in useragent when fetching releases from github ([#3654](https://github.com/thelounge/thelounge/pull/3654) by [@xPaw](https://github.com/xPaw))
- Ignore echoed ctcp requests that aren't targeted at us ([#3656](https://github.com/thelounge/thelounge/pull/3656) by [@xPaw](https://github.com/xPaw))
- Fix active styles on footer buttons ([#3659](https://github.com/thelounge/thelounge/pull/3659) by [@xPaw](https://github.com/xPaw))
- Check that usernameInput ref exists ([#3662](https://github.com/thelounge/thelounge/pull/3662) by [@xPaw](https://github.com/xPaw))
- Open last channel in the list when creating a network ([#3703](https://github.com/thelounge/thelounge/pull/3703) by [@xPaw](https://github.com/xPaw))
- Trigger autocompletion only after whitespace ([#3696](https://github.com/thelounge/thelounge/pull/3696), [#3718](https://github.com/thelounge/thelounge/pull/3718) by [@xPaw](https://github.com/xPaw))
- Fix settings update when unknown theme is stored ([#3682](https://github.com/thelounge/thelounge/pull/3682) by [@xPaw](https://github.com/xPaw))
- Ignore Alt+letter keybinds when focused in chat input ([#3720](https://github.com/thelounge/thelounge/pull/3720) by [@xPaw](https://github.com/xPaw))
- Fix escape key handling ([#3721](https://github.com/thelounge/thelounge/pull/3721) by [@xPaw](https://github.com/xPaw))
- Fix DOMRect coordinates in Safari ([#3723](https://github.com/thelounge/thelounge/pull/3723) by [@xPaw](https://github.com/xPaw))
- Wrap stdout parsing from yarn into try/catch ([#3753](https://github.com/thelounge/thelounge/pull/3753) by [@xPaw](https://github.com/xPaw))
- Fix incorrectly updating unread counter for 'show in active' messages ([#3765](https://github.com/thelounge/thelounge/pull/3765) by [@xPaw](https://github.com/xPaw))
- Improve wav audio detection ([#3781](https://github.com/thelounge/thelounge/pull/3781) by [@xPaw](https://github.com/xPaw))
- Fix not being able to uninstall packages ([#3783](https://github.com/thelounge/thelounge/pull/3783) by [@xPaw](https://github.com/xPaw))

### Documentation

In the main repository:

- Link to official docs for stable releases ([#3651](https://github.com/thelounge/thelounge/pull/3651) by [@xPaw](https://github.com/xPaw))
- Add an explanation why push notifications are not supported on iOS ([#3779](https://github.com/thelounge/thelounge/pull/3779) by [@xPaw](https://github.com/xPaw))

On the [website repository](https://github.com/thelounge/thelounge.github.io):

- Only run GA code on the main domain ([`4d070c7`](https://github.com/thelounge/thelounge.github.io/commit/4d070c75f4226212d7742f586e00a562ac70c4a6) by [@xPaw](https://github.com/xPaw))
- Update yarn link ([`84343c2`](https://github.com/thelounge/thelounge.github.io/commit/84343c2fb37edfd8f281fae6ba3609cca79dfbbe) by [@xPaw](https://github.com/xPaw))
- Remove dead links ([`8a1d8ea`](https://github.com/thelounge/thelounge.github.io/commit/8a1d8ea7f79103cd6b97da4de47fc2e617214309) by [@xPaw](https://github.com/xPaw))
- Float anchor link to the right on mobile ([`f2c3c89`](https://github.com/thelounge/thelounge.github.io/commit/f2c3c891d6fb362aa6a021cb8d023250b2d2b23d) by [@xPaw](https://github.com/xPaw))
- Add a note about localhost ([`ceb8d4b`](https://github.com/thelounge/thelounge.github.io/commit/ceb8d4bccb0f47a4571d00751005b185481e6fd2) by [@xPaw](https://github.com/xPaw))
- Remove mentions of playback module as its not maintained ([`a867830`](https://github.com/thelounge/thelounge.github.io/commit/a8678301375c751a1860f7dcff9fddc32c642aa2) by [@xPaw](https://github.com/xPaw))

### Internals

- Add maskable icon purpose in webmanifest ([#3744](https://github.com/thelounge/thelounge/pull/3744) by [@xPaw](https://github.com/xPaw), [#3793](https://github.com/thelounge/thelounge/pull/3793) by [@NotWoods](https://github.com/NotWoods))
- Turn off webpack hints ([#3650](https://github.com/thelounge/thelounge/pull/3650) by [@xPaw](https://github.com/xPaw))
- Remove cyclical dependency in router<->webpush ([#3663](https://github.com/thelounge/thelounge/pull/3663) by [@xPaw](https://github.com/xPaw))
- Remove the only use of Vue.filter ([#3681](https://github.com/thelounge/thelounge/pull/3681) by [@xPaw](https://github.com/xPaw))
- Load styles from vue components, fix hot reload ([#3684](https://github.com/thelounge/thelounge/pull/3684) by [@xPaw](https://github.com/xPaw))
- Remove `child-src` from CSP, add `base-uri 'none'` ([#3676](https://github.com/thelounge/thelounge/pull/3676) by [@xPaw](https://github.com/xPaw))
- Disallow some invalid characters in nicknames ([#3715](https://github.com/thelounge/thelounge/pull/3715) by [@xPaw](https://github.com/xPaw))
- Increase buffer size for active and scrolled down channels ([#3728](https://github.com/thelounge/thelounge/pull/3728) by [@xPaw](https://github.com/xPaw))
- Use hostname from notice if available ([#3711](https://github.com/thelounge/thelounge/pull/3711) by [@xPaw](https://github.com/xPaw))
- Small fixes to user list search ([#3730](https://github.com/thelounge/thelounge/pull/3730) by [@xPaw](https://github.com/xPaw))
- Fix increasing test timeout on github actions ([#3752](https://github.com/thelounge/thelounge/pull/3752) by [@xPaw](https://github.com/xPaw))
- Add support for webirc secure option ([#3712](https://github.com/thelounge/thelounge/pull/3712) by [@xPaw](https://github.com/xPaw))
- Unprefix setname cap ([#3767](https://github.com/thelounge/thelounge/pull/3767) by [@xPaw](https://github.com/xPaw))
- NetworkForm.vue: clarify autoconnect command help text ([#3649](https://github.com/thelounge/thelounge/pull/3649) by [@Mikaela](https://github.com/Mikaela))
- Update development dependencies to their latest versions:
  - `eslint-config-prettier` ([#3639](https://github.com/thelounge/thelounge/pull/3639), [#3738](https://github.com/thelounge/thelounge/pull/3738))
  - `stylelint` ([#3641](https://github.com/thelounge/thelounge/pull/3641), [#3694](https://github.com/thelounge/thelounge/pull/3694), [#3750](https://github.com/thelounge/thelounge/pull/3750), [#3758](https://github.com/thelounge/thelounge/pull/3758))
  - `sinon` ([#3624](https://github.com/thelounge/thelounge/pull/3624), [#3687](https://github.com/thelounge/thelounge/pull/3687), [#3707](https://github.com/thelounge/thelounge/pull/3707), [#3727](https://github.com/thelounge/thelounge/pull/3727), [#3774](https://github.com/thelounge/thelounge/pull/3774))
  - `webpack` ([#3642](https://github.com/thelounge/thelounge/pull/3642), [#3760](https://github.com/thelounge/thelounge/pull/3760))
  - `babel-plugin-istanbul` ([#3643](https://github.com/thelounge/thelounge/pull/3643))
  - `eslint-plugin-vue` ([#3640](https://github.com/thelounge/thelounge/pull/3640), [#3763](https://github.com/thelounge/thelounge/pull/3763))
  - `nyc` ([#3644](https://github.com/thelounge/thelounge/pull/3644))
  - `css-loader` ([#3665](https://github.com/thelounge/thelounge/pull/3665), [#3685](https://github.com/thelounge/thelounge/pull/3685))
  - `husky` ([#3688](https://github.com/thelounge/thelounge/pull/3688), [#3706](https://github.com/thelounge/thelounge/pull/3706), [#3724](https://github.com/thelounge/thelounge/pull/3724), [#3757](https://github.com/thelounge/thelounge/pull/3757))
  - `@babel/core` ([#3693](https://github.com/thelounge/thelounge/pull/3693), [#3705](https://github.com/thelounge/thelounge/pull/3705), [#3737](https://github.com/thelounge/thelounge/pull/3737))
  - `@babel/preset-env` ([#3693](https://github.com/thelounge/thelounge/pull/3693), [#3705](https://github.com/thelounge/thelounge/pull/3705), [#3737](https://github.com/thelounge/thelounge/pull/3737))
  - `dayjs` ([#3686](https://github.com/thelounge/thelounge/pull/3686), [#3749](https://github.com/thelounge/thelounge/pull/3749))
  - `@vue/server-test-utils` ([#3708](https://github.com/thelounge/thelounge/pull/3708))
  - `@vue/test-utils` ([#3708](https://github.com/thelounge/thelounge/pull/3708))
  - `vue-router` ([#3708](https://github.com/thelounge/thelounge/pull/3708))
  - `mousetrap` ([#3725](https://github.com/thelounge/thelounge/pull/3725))
  - `@fortawesome/fontawesome-free` ([#3748](https://github.com/thelounge/thelounge/pull/3748))
  - `stylelint-config-standard` ([#3751](https://github.com/thelounge/thelounge/pull/3751))
  - `vue-loader` ([#3759](https://github.com/thelounge/thelounge/pull/3759))
  - `webpack-cli` ([#3761](https://github.com/thelounge/thelounge/pull/3761))

## v4.1.0-rc.1 - 2020-02-27 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.0.0...v4.1.0-rc.1)

This is a release candidate (RC) for v4.1.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v4.0.0 - 2019-12-31

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v3.3.0...v4.0.0) and [milestone](https://github.com/thelounge/thelounge/milestone/34?closed=1).

This release finishes our work of porting the client codebase to the Vue.js framework,
completely removing jQuery and handlebars.

We are marking this release as a major update due to the sheer amount of internal code changes,
and it is impossible to predict what could have been broken as a result.

The minimum required Node.js version has been bumped up to 10.15.  
If you are a theme author or have CSS tweaks, [refer to the upgrade guide](https://thelounge.chat/docs/guides/upgrade)
to see which changes have been made.

Before upgrading, make sure The Lounge does not report any warnings or deprecations in the console.

### Added

- Allow configuring base url for uploads ([#3485](https://github.com/thelounge/thelounge/pull/3485) by [@xPaw](https://github.com/xPaw))
- Add message type for plugins ([#3471](https://github.com/thelounge/thelounge/pull/3471) by [@MiniDigger](https://github.com/MiniDigger))
- Add file size to link preview ([#2821](https://github.com/thelounge/thelounge/pull/2821) by [@Raqbit](https://github.com/Raqbit))
- Enable some user commands for LDAP ([#3489](https://github.com/thelounge/thelounge/pull/3489) by [@xPaw](https://github.com/xPaw))
- Show which channels have drafts in the network list ([#3533](https://github.com/thelounge/thelounge/pull/3533) by [@richrd](https://github.com/richrd))
- Add Unicode 12.1 emojis ([#3539](https://github.com/thelounge/thelounge/pull/3539) by [@xPaw](https://github.com/xPaw))
- Automatically load new packages and themes ([#3579](https://github.com/thelounge/thelounge/pull/3579) by [@xPaw](https://github.com/xPaw))
- Add preview for `text/plain` urls ([#3606](https://github.com/thelounge/thelounge/pull/3606) by [@xPaw](https://github.com/xPaw))
- Add `previous-source` class to messages with same sender ([#3534](https://github.com/thelounge/thelounge/pull/3534) by [@richrd](https://github.com/richrd))
- Improve RTL text support ([#3345](https://github.com/thelounge/thelounge/pull/3345) by [@Jay2k1](https://github.com/Jay2k1))

### Changed

- Complete porting The Lounge client to the Vue.js framework ([#3524](https://github.com/thelounge/thelounge/pull/3524) by [@xPaw](https://github.com/xPaw))
- Make client `awayMessage` a client setting ([#3549](https://github.com/thelounge/thelounge/pull/3549) by [@xPaw](https://github.com/xPaw))
- Send 100 actual messages when requesting history with hidden or condensed status messages ([#3603](https://github.com/thelounge/thelounge/pull/3603) by [@xPaw](https://github.com/xPaw))
- Update production dependencies to their latest versions:
  - `irc-framework` ([#3480](https://github.com/thelounge/thelounge/pull/3480), [#3496](https://github.com/thelounge/thelounge/pull/3496), [#3501](https://github.com/thelounge/thelounge/pull/3501), [#3605](https://github.com/thelounge/thelounge/pull/3605))
  - `file-type` ([#3487](https://github.com/thelounge/thelounge/pull/3487), [#3610](https://github.com/thelounge/thelounge/pull/3610), [#3612](https://github.com/thelounge/thelounge/pull/3612))
  - `commander` ([#3488](https://github.com/thelounge/thelounge/pull/3488), [#3512](https://github.com/thelounge/thelounge/pull/3512))
  - `chalk` ([#3509](https://github.com/thelounge/thelounge/pull/3509))
  - `mime-types` ([#3513](https://github.com/thelounge/thelounge/pull/3513))
  - `ldapjs` ([#3519](https://github.com/thelounge/thelounge/pull/3519), [#3562](https://github.com/thelounge/thelounge/pull/3562), [#3587](https://github.com/thelounge/thelounge/pull/3587))
  - `yarn` ([#3525](https://github.com/thelounge/thelounge/pull/3525), [#3547](https://github.com/thelounge/thelounge/pull/3547), [#3573](https://github.com/thelounge/thelounge/pull/3573))
  - `cheerio` ([#3530](https://github.com/thelounge/thelounge/pull/3530))
  - `web-push` ([#3545](https://github.com/thelounge/thelounge/pull/3545), [#3556](https://github.com/thelounge/thelounge/pull/3556))
  - `got` ([#3544](https://github.com/thelounge/thelounge/pull/3544), [#3563](https://github.com/thelounge/thelounge/pull/3563), [#3575](https://github.com/thelounge/thelounge/pull/3575), [#3607](https://github.com/thelounge/thelounge/pull/3607))
  - `tlds` ([#3552](https://github.com/thelounge/thelounge/pull/3552))
  - `sqlite3` ([#3554](https://github.com/thelounge/thelounge/pull/3554))
  - `semver` ([#3584](https://github.com/thelounge/thelounge/pull/3584), [#3598](https://github.com/thelounge/thelounge/pull/3598), [#3601](https://github.com/thelounge/thelounge/pull/3601))
  - `ua-parser-js` ([#3611](https://github.com/thelounge/thelounge/pull/3611))

### Removed

- Remove away messages from channels ([#3494](https://github.com/thelounge/thelounge/pull/3494) by [@xPaw](https://github.com/xPaw))
- Remove `UsernameFiltered` and fix colored mentions ([`9b9c547`](https://github.com/thelounge/thelounge/commit/9b9c547e8cf29759ac3e8b0427cec9eb62ba57e4) by [@xPaw](https://github.com/xPaw))
- Remove user/pass support from `irc://`, support multiple channels ([`83f3fe7`](https://github.com/thelounge/thelounge/commit/83f3fe772ae1c3ad479c78d8cba35af627e9d743) by [@xPaw](https://github.com/xPaw))

### Fixed

- Disable protocol register button if lockNetwork is enabled ([#3571](https://github.com/thelounge/thelounge/pull/3571) by [@xPaw](https://github.com/xPaw))
- Disable copy hack in Firefox ([#3486](https://github.com/thelounge/thelounge/pull/3486) by [@xPaw](https://github.com/xPaw))
- Load existing users on startup when LDAP is enabled ([#3482](https://github.com/thelounge/thelounge/pull/3482) by [@xPaw](https://github.com/xPaw))
- Fix potential issue of history not loading when `showInActive` is the first message ([#3490](https://github.com/thelounge/thelounge/pull/3490) by [@xPaw](https://github.com/xPaw))
- Ignore unknown settings ([#3531](https://github.com/thelounge/thelounge/pull/3531) by [@xPaw](https://github.com/xPaw))
- Do not compute `filteredUsers` if there's no search input ([#3536](https://github.com/thelounge/thelounge/pull/3536) by [@xPaw](https://github.com/xPaw))
- Fix spacing in kick reason ([#3537](https://github.com/thelounge/thelounge/pull/3537) by [@xPaw](https://github.com/xPaw))
- Fix sidebar not opening when The Lounge is open in a background tab ([#3546](https://github.com/thelounge/thelounge/pull/3546) by [@xPaw](https://github.com/xPaw))
- Apply user theme as soon as possible on page load ([#3555](https://github.com/thelounge/thelounge/pull/3555) by [@xPaw](https://github.com/xPaw))
- Fix video element overflowing in Chrome ([#3561](https://github.com/thelounge/thelounge/pull/3561) by [@richrd](https://github.com/richrd))
- Provide fake `$HOME` env to Yarn commands ([#3578](https://github.com/thelounge/thelounge/pull/3578) by [@xPaw](https://github.com/xPaw))
- Assign `preview.thumb` only after it is processed ([#3577](https://github.com/thelounge/thelounge/pull/3577) by [@xPaw](https://github.com/xPaw))
- Fix "premature close" on link previews ([#3557](https://github.com/thelounge/thelounge/pull/3557) by [@xPaw](https://github.com/xPaw))
- Hide awaymessage/highlights settings in public mode ([#3588](https://github.com/thelounge/thelounge/pull/3588) by [@xPaw](https://github.com/xPaw))
- Fix keep nick setting nick to undefined on socket close ([#3593](https://github.com/thelounge/thelounge/pull/3593) by [@xPaw](https://github.com/xPaw))
- Fix format of IPv6 URI ([#3597](https://github.com/thelounge/thelounge/pull/3597) by [@bepvte](https://github.com/bepvte))
- Optimize user file updates ([#3589](https://github.com/thelounge/thelounge/pull/3589) by [@xPaw](https://github.com/xPaw))
- Improve link preview loading ([`c2ed3fa`](https://github.com/thelounge/thelounge/commit/c2ed3fae56ddf32a443f4b6abf2b95c21638641a) by [@xPaw](https://github.com/xPaw))
- Replace `confirm()` with context menu ([`90ec37c`](https://github.com/thelounge/thelounge/commit/90ec37ce82e047e06beac310d0d0347cdd84371f) by [@xPaw](https://github.com/xPaw))
- Fix uri handling and add tests ([`ec85372`](https://github.com/thelounge/thelounge/commit/ec85372132fae1d52f54a78f392a861fd30b630e) by [@xPaw](https://github.com/xPaw))
- Hide auto completion menu when channel changes ([`57ba119`](https://github.com/thelounge/thelounge/commit/57ba119edb284c3a22878be60e661519bae236bb) by [@xPaw](https://github.com/xPaw))
- Display a badge when built in development mode ([`c70d0fb`](https://github.com/thelounge/thelounge/commit/c70d0fb2244fc4e8d251626c918dd543265eab04) by [@xPaw](https://github.com/xPaw))
- Replace control codes with a space (instead of just removing) ([#3638](https://github.com/thelounge/thelounge/pull/3638) by [@xPaw](https://github.com/xPaw))
- Check if there are any packages installed in the `upgrade` command ([#3632](https://github.com/thelounge/thelounge/pull/3632) by [@xPaw](https://github.com/xPaw))

### Documentation

On the [website repository](https://github.com/thelounge/thelounge.github.io):

- Add `baseUrl` configuration ([`bfc79f0`](https://github.com/thelounge/thelounge.github.io/commit/bfc79f098c9c985a2e6cf7f69c9303ea52ea51cf) by [@xPaw](https://github.com/xPaw))
- Make nginx compression a link to html5 boilerplate config ([`1ab6c77`](https://github.com/thelounge/thelounge.github.io/commit/1ab6c777ba58b9e19d831b841223d6bccd7ccfb0) by [@xPaw](https://github.com/xPaw))
- Make the navbar sticky ([`3df0c6c`](https://github.com/thelounge/thelounge.github.io/commit/3df0c6ccb8ddf8e7cc596fcd089f9b7f5237b7b1), [`5d09a7f`](https://github.com/thelounge/thelounge.github.io/commit/5d09a7f3549241b3bf9800346debda4b9975c148) by [@xPaw](https://github.com/xPaw))
- Add powered by Netlify link in footer ([`78b72a9`](https://github.com/thelounge/thelounge.github.io/commit/78b72a98c4b2fef259b7ea3772bb5c5440a96d57) by [@xPaw](https://github.com/xPaw))
- Add custom CSS for hiding message input bar per channel ([`f2cba0b`](https://github.com/thelounge/thelounge.github.io/commit/f2cba0b00bf78a9ee806809a9acba458c6749a25) by [@gunnvaldr](https://github.com/gunnvaldr))

### Internals

- Improvements to network connections on startup ([#3483](https://github.com/thelounge/thelounge/pull/3483) by [@xPaw](https://github.com/xPaw))
- Use postcss to optimize css ([#3449](https://github.com/thelounge/thelounge/pull/3449) by [@xPaw](https://github.com/xPaw))
- Import primer-tooltips css ([#3493](https://github.com/thelounge/thelounge/pull/3493) by [@xPaw](https://github.com/xPaw))
- Print package versions on startup ([#3498](https://github.com/thelounge/thelounge/pull/3498) by [@MiniDigger](https://github.com/MiniDigger))
- Add webpack hot module reloading for development ([#3502](https://github.com/thelounge/thelounge/pull/3502) by [@xPaw](https://github.com/xPaw))
- Remove transition from context menu items ([#3532](https://github.com/thelounge/thelounge/pull/3532) by [@xPaw](https://github.com/xPaw))
- Create release github action workflow ([#3521](https://github.com/thelounge/thelounge/pull/3521) by [@xPaw](https://github.com/xPaw))
- Increase test timeout due to unpredictable I/O on CI services ([#3538](https://github.com/thelounge/thelounge/pull/3538) by [@xPaw](https://github.com/xPaw))
- Remove \uFE0F emoji variant from emoji name map ([#3434](https://github.com/thelounge/thelounge/pull/3434) by [@xPaw](https://github.com/xPaw))
- Remove code that aided upgrade to v3 ([#3548](https://github.com/thelounge/thelounge/pull/3548) by [@xPaw](https://github.com/xPaw))
- Refactor some CSS styling ([#3553](https://github.com/thelounge/thelounge/pull/3553) by [@richrd](https://github.com/richrd))
- Fix up css refactor ([#3566](https://github.com/thelounge/thelounge/pull/3566) by [@xPaw](https://github.com/xPaw))
- Remove unnecessary selectors ([#3572](https://github.com/thelounge/thelounge/pull/3572) by [@xPaw](https://github.com/xPaw))
- Remove bootstrap.css, use flexbox ([#3574](https://github.com/thelounge/thelounge/pull/3574) by [@xPaw](https://github.com/xPaw))
- Use data-type attribute on .msg ([#3586](https://github.com/thelounge/thelounge/pull/3586) by [@xPaw](https://github.com/xPaw))
- Use Set() for condensed types ([#3600](https://github.com/thelounge/thelounge/pull/3600) by [@xPaw](https://github.com/xPaw))
- Relocate not-secure and not-connected classes and make sure channel exists in jumpToChannel ([#3608](https://github.com/thelounge/thelounge/pull/3608) by [@richrd](https://github.com/richrd))
- Pretend to be facebook and twitter bots in link prefetcher ([#3602](https://github.com/thelounge/thelounge/pull/3602) by [@xPaw](https://github.com/xPaw))
- Remove querySelector in topic edit, fix save button style ([#3609](https://github.com/thelounge/thelounge/pull/3609) by [@xPaw](https://github.com/xPaw))
- Update development dependencies to their latest versions:
  - `eslint` ([#3476](https://github.com/thelounge/thelounge/pull/3476), [#3527](https://github.com/thelounge/thelounge/pull/3527), [#3540](https://github.com/thelounge/thelounge/pull/3540), [#3543](https://github.com/thelounge/thelounge/pull/3543), [#3619](https://github.com/thelounge/thelounge/pull/3619))
  - `eslint-config-prettier` ([#3477](https://github.com/thelounge/thelounge/pull/3477), [#3520](https://github.com/thelounge/thelounge/pull/3520), [#3528](https://github.com/thelounge/thelounge/pull/3528))
  - `vue-loader` ([#3492](https://github.com/thelounge/thelounge/pull/3492), [#3622](https://github.com/thelounge/thelounge/pull/3622))
  - `webpack-cli` ([#3491](https://github.com/thelounge/thelounge/pull/3491))
  - `eslint-plugin-vue` ([#3508](https://github.com/thelounge/thelounge/pull/3508), [#3514](https://github.com/thelounge/thelounge/pull/3514))
  - `pretty-quick` ([#3507](https://github.com/thelounge/thelounge/pull/3507))
  - `mochapack` ([#3505](https://github.com/thelounge/thelounge/pull/3505), [#3510](https://github.com/thelounge/thelounge/pull/3510), [#3516](https://github.com/thelounge/thelounge/pull/3516), [#3541](https://github.com/thelounge/thelounge/pull/3541), [#3560](https://github.com/thelounge/thelounge/pull/3560))
  - `copy-webpack-plugin` ([#3504](https://github.com/thelounge/thelounge/pull/3504), [#3581](https://github.com/thelounge/thelounge/pull/3581))
  - `@babel/core` ([#3503](https://github.com/thelounge/thelounge/pull/3503), [#3526](https://github.com/thelounge/thelounge/pull/3526), [#3558](https://github.com/thelounge/thelounge/pull/3558), [#3616](https://github.com/thelounge/thelounge/pull/3616))
  - `@babel/preset-env` ([#3503](https://github.com/thelounge/thelounge/pull/3503), [#3526](https://github.com/thelounge/thelounge/pull/3526), [#3558](https://github.com/thelounge/thelounge/pull/3558), [#3565](https://github.com/thelounge/thelounge/pull/3565), [#3616](https://github.com/thelounge/thelounge/pull/3616))
  - `prettier` ([#3506](https://github.com/thelounge/thelounge/pull/3506), [#3511](https://github.com/thelounge/thelounge/pull/3511))
  - `stylelint` ([#3517](https://github.com/thelounge/thelounge/pull/3517))
  - `husky` ([#3529](https://github.com/thelounge/thelounge/pull/3529))
  - `@vue/server-test-utils` ([#3542](https://github.com/thelounge/thelounge/pull/3542))
  - `@vue/test-utils` ([#3542](https://github.com/thelounge/thelounge/pull/3542))
  - `css-loader` ([#3559](https://github.com/thelounge/thelounge/pull/3559), [#3582](https://github.com/thelounge/thelounge/pull/3582), [#3617](https://github.com/thelounge/thelounge/pull/3617))
  - `@fortawesome/fontawesome-free` ([#3580](https://github.com/thelounge/thelounge/pull/3580))
  - `vue` ([#3583](https://github.com/thelounge/thelounge/pull/3583))
  - `vue-server-renderer` ([#3583](https://github.com/thelounge/thelounge/pull/3583))
  - `vue-template-compiler` ([#3583](https://github.com/thelounge/thelounge/pull/3583))
  - `textcomplete` ([#3621](https://github.com/thelounge/thelounge/pull/3621))
  - `webpack` ([#3623](https://github.com/thelounge/thelounge/pull/3623))
  - `dayjs` ([#3618](https://github.com/thelounge/thelounge/pull/3618))
  - `mini-css-extract-plugin` ([#3620](https://github.com/thelounge/thelounge/pull/3620))

## v4.0.0-rc.1 - 2019-12-21 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v4.0.0-pre.1...v4.0.0-rc.1)

This is a release candidate (RC) for v4.0.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v4.0.0-pre.1 - 2019-12-14 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.4.0-pre.1...v4.0.0-pre.1)

This is a pre-release for v4.0.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.4.0-pre.1 - 2019-11-26 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.3.0...v3.4.0-pre.1)

This is a pre-release for v3.4.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.3.0 - 2019-10-28

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v3.2.0...v3.3.0) and [milestone](https://github.com/thelounge/thelounge/milestone/33?closed=1).

This is a minor release aimed at mostly fixing bugs and increasing stability.

**This release bumps required Node.js version to at least 10.16.3 or higher.**
We suggest updating to Node.js v12, which is the latest LTS version.

Feature wise, there are a couple of things that have been added.
If you reconnect to a network and the nick you want is in use,
The Lounge will now attempt to regain your original nick if it sees that nick quit the network.

The `/join` command will now prefix channel names if there is no prefix. For example,
you can execute `/join thelounge`, and client will automatically turn that into `#thelounge`
_(first prefix from CHANTYPES is taken)_.

We have been working heavily on porting the client code base to the Vue.js framework,
and hope to have it ready for release soon™.

### Added

- Implement keep nick when client gets "nick in use" on connection ([#3404](https://github.com/thelounge/thelounge/pull/3404) by [@xPaw](https://github.com/xPaw))
- Add public files for plugins ([#3432](https://github.com/thelounge/thelounge/pull/3432) by [@McInkay](https://github.com/McInkay))
- Set correct file owner for created user files and warn about it ([#3416](https://github.com/thelounge/thelounge/pull/3416) by [@xPaw](https://github.com/xPaw))
- Prefix channel before join ([#3438](https://github.com/thelounge/thelounge/pull/3438) by [@FryDay](https://github.com/FryDay))

### Fixed

- Allow tab completion in middle of input ([#3437](https://github.com/thelounge/thelounge/pull/3437) by [@FryDay](https://github.com/FryDay))
- Fix condensed messages closing when a new status message is added ([#3435](https://github.com/thelounge/thelounge/pull/3435) by [@FryDay](https://github.com/FryDay))
- Synchronize user list correctly on reconnection ([#3453](https://github.com/thelounge/thelounge/pull/3453) by [@xPaw](https://github.com/xPaw))
- Synchronize open channel on client on reconnection ([#3461](https://github.com/thelounge/thelounge/pull/3461) by [@xPaw](https://github.com/xPaw))
- Fix history not loading in certain cases after reconnect ([#3460](https://github.com/thelounge/thelounge/pull/3460) by [@xPaw](https://github.com/xPaw))
- Do not print "no packages" warning when opening help on client ([#3458](https://github.com/thelounge/thelounge/pull/3458) by [@xPaw](https://github.com/xPaw))
- Fix uploader being initialized more than once ([#3467](https://github.com/thelounge/thelounge/pull/3467) by [@xPaw](https://github.com/xPaw))

### Changed

- Increase contrast of headers in windows ([#3451](https://github.com/thelounge/thelounge/pull/3451) by [@xPaw](https://github.com/xPaw))
- Use default cursor for active channels ([#3364](https://github.com/thelounge/thelounge/pull/3364) by [@xPaw](https://github.com/xPaw))
- Update context and auto complete menu styles ([#3466](https://github.com/thelounge/thelounge/pull/3466) by [@xPaw](https://github.com/xPaw))
- Update production dependencies to their latest versions:
  - `sqlite3` ([#3367](https://github.com/thelounge/thelounge/pull/3367))
  - `file-type` ([#3370](https://github.com/thelounge/thelounge/pull/3370), [#3389](https://github.com/thelounge/thelounge/pull/3389), [#3468](https://github.com/thelounge/thelounge/pull/3468))
  - `uuid` ([#3374](https://github.com/thelounge/thelounge/pull/3374))
  - `commander` ([#3384](https://github.com/thelounge/thelounge/pull/3384), [#3422](https://github.com/thelounge/thelounge/pull/3422))
  - `socket.io` ([#3408](https://github.com/thelounge/thelounge/pull/3408))
  - `web-push` ([#3424](https://github.com/thelounge/thelounge/pull/3424), [#3472](https://github.com/thelounge/thelounge/pull/3472))
  - `yarn` ([#3426](https://github.com/thelounge/thelounge/pull/3426), [#3441](https://github.com/thelounge/thelounge/pull/3441))

### Internals

- Add `data-current-channel` to `#chat-container` ([#3366](https://github.com/thelounge/thelounge/pull/3366) by [@gunnvaldr](https://github.com/gunnvaldr))
- Some fixes in file uploading ([#3382](https://github.com/thelounge/thelounge/pull/3382) by [@xPaw](https://github.com/xPaw))
- Add GitHub actions for CI ([#3393](https://github.com/thelounge/thelounge/pull/3393) by [@xPaw](https://github.com/xPaw))
- Bump minimum node version to v10 ([#3392](https://github.com/thelounge/thelounge/pull/3392) by [@xPaw](https://github.com/xPaw))
- Print error and stacktrace when package fails to load ([#3406](https://github.com/thelounge/thelounge/pull/3406) by [@xPaw](https://github.com/xPaw))
- Let OS generate a port in link prefetch tests ([#3436](https://github.com/thelounge/thelounge/pull/3436) by [@xPaw](https://github.com/xPaw))
- Bump ecmaVersion to 2018 ([#3465](https://github.com/thelounge/thelounge/pull/3465) by [@xPaw](https://github.com/xPaw))
- Extract updated packages from pull request body ([#3455](https://github.com/thelounge/thelounge/pull/3455) by [@xPaw](https://github.com/xPaw))
- Hide user loaded message in tests ([#3473](https://github.com/thelounge/thelounge/pull/3473) by [@xPaw](https://github.com/xPaw))
- Update development dependencies to their latest versions:
  - `husky` ([#3368](https://github.com/thelounge/thelounge/pull/3368), [#3386](https://github.com/thelounge/thelounge/pull/3386), [#3425](https://github.com/thelounge/thelounge/pull/3425), [#3447](https://github.com/thelounge/thelounge/pull/3447))
  - `eslint` ([#3371](https://github.com/thelounge/thelounge/pull/3371), [#3379](https://github.com/thelounge/thelounge/pull/3379), [#3385](https://github.com/thelounge/thelounge/pull/3385), [#3401](https://github.com/thelounge/thelounge/pull/3401), [#3427](https://github.com/thelounge/thelounge/pull/3427))
  - `webpack` ([#3365](https://github.com/thelounge/thelounge/pull/3365), [#3383](https://github.com/thelounge/thelounge/pull/3383), [#3400](https://github.com/thelounge/thelounge/pull/3400), [#3417](https://github.com/thelounge/thelounge/pull/3417), [#3445](https://github.com/thelounge/thelounge/pull/3445), [#3452](https://github.com/thelounge/thelounge/pull/3452))
  - `webpack-cli` ([#3369](https://github.com/thelounge/thelounge/pull/3369), [#3394](https://github.com/thelounge/thelounge/pull/3394), [#3405](https://github.com/thelounge/thelounge/pull/3405))
  - `mochapack` ([#3377](https://github.com/thelounge/thelounge/pull/3377), [#3411](https://github.com/thelounge/thelounge/pull/3411))
  - `eslint-config-prettier` ([#3375](https://github.com/thelounge/thelounge/pull/3375), [#3388](https://github.com/thelounge/thelounge/pull/3388), [#3397](https://github.com/thelounge/thelounge/pull/3397), [#3440](https://github.com/thelounge/thelounge/pull/3440))
  - `@fortawesome/fontawesome-free` ([#3378](https://github.com/thelounge/thelounge/pull/3378), [#3407](https://github.com/thelounge/thelounge/pull/3407), [#3413](https://github.com/thelounge/thelounge/pull/3413))
  - `sinon` ([#3387](https://github.com/thelounge/thelounge/pull/3387), [#3412](https://github.com/thelounge/thelounge/pull/3412))
  - `@babel/core` ([#3395](https://github.com/thelounge/thelounge/pull/3395), [#3414](https://github.com/thelounge/thelounge/pull/3414), [#3442](https://github.com/thelounge/thelounge/pull/3442))
  - `@babel/preset-env` ([#3395](https://github.com/thelounge/thelounge/pull/3395), [#3414](https://github.com/thelounge/thelounge/pull/3414), [#3442](https://github.com/thelounge/thelounge/pull/3442))
  - `stylelint` ([#3402](https://github.com/thelounge/thelounge/pull/3402), [#3443](https://github.com/thelounge/thelounge/pull/3443))
  - `stylelint-config-standard` ([#3403](https://github.com/thelounge/thelounge/pull/3403))
  - `socket.io-client` ([#3408](https://github.com/thelounge/thelounge/pull/3408))
  - `vuedraggable` ([#3410](https://github.com/thelounge/thelounge/pull/3410), [#3431](https://github.com/thelounge/thelounge/pull/3431))
  - `mocha` ([#3428](https://github.com/thelounge/thelounge/pull/3428), [#3464](https://github.com/thelounge/thelounge/pull/3464))
  - `pretty-quick` ([#3448](https://github.com/thelounge/thelounge/pull/3448))

## v3.3.0-rc.2 - 2019-10-23 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.3.0-rc.1...v3.3.0-rc.2)

This is a release candidate (RC) for v3.3.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.3.0-rc.1 - 2019-10-21 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.2.0...v3.3.0-rc.1)

This is a release candidate (RC) for v3.3.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.2.0 - 2019-08-19

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v3.1.1...v3.2.0) and [milestone](https://github.com/thelounge/thelounge/milestone/32?closed=1).

This is a minor release that fixes some bugs. There are not many directly user facing changes in this release,
but the biggest one is the ability to edit channel topic by double clicking it (or using the edit topic option in the context menu).

<p align="center">
  <img alt="Edit channel topic by double clicking it" src="https://user-images.githubusercontent.com/613331/62932560-0915a380-bdc9-11e9-975b-416189e1d79e.gif">
</p>

We have switched to using [Prettier](https://prettier.io/) for code formatting,
which hopefully makes it easier for other developers to contribute.

### Added

- Add functionality to edit channel topic from the user interface ([#3349](https://github.com/thelounge/thelounge/pull/3349) by [@ollipa](https://github.com/ollipa))
- Add check for outdated packages, and show on the help screen. ([#2760](https://github.com/thelounge/thelounge/pull/2760) by [@McInkay](https://github.com/McInkay))
- Allow themes to change theme-color ([#3326](https://github.com/thelounge/thelounge/pull/3326) by [@xPaw](https://github.com/xPaw))
- Add keybind for cycling to the next unread window ([#3359](https://github.com/thelounge/thelounge/pull/3359) by [@plett](https://github.com/plett))
- Send service worker fetch errors to client ([#3329](https://github.com/thelounge/thelounge/pull/3329) by [@xPaw](https://github.com/xPaw))
- Verify reverse DNS when looking up hostnames for webirc ([#3294](https://github.com/thelounge/thelounge/pull/3294) by [@xPaw](https://github.com/xPaw))

### Changed

- Improve raw messages ([#3310](https://github.com/thelounge/thelounge/pull/3310) by [@xPaw](https://github.com/xPaw))
- Update production dependencies to their latest versions:
  - `yarn` ([#3300](https://github.com/thelounge/thelounge/pull/3300))
  - `linkify-it` ([#3298](https://github.com/thelounge/thelounge/pull/3298))
  - `lodash` ([#3317](https://github.com/thelounge/thelounge/pull/3317))
  - `file-type` ([#3334](https://github.com/thelounge/thelounge/pull/3334))
  - `semver` ([#3330](https://github.com/thelounge/thelounge/pull/3330))
  - `package-json` ([#3327](https://github.com/thelounge/thelounge/pull/3327))
  - `commander` ([#3360](https://github.com/thelounge/thelounge/pull/3360))

### Fixed

- Correctly parse numbers when passed in CLI ([#3296](https://github.com/thelounge/thelounge/pull/3296) by [@xPaw](https://github.com/xPaw))
- Fix channel sorting to work across clients on Vue ([#3299](https://github.com/thelounge/thelounge/pull/3299) by [@xPaw](https://github.com/xPaw))
- A better way of disabling sorting on touch devices ([#3297](https://github.com/thelounge/thelounge/pull/3297) by [@xPaw](https://github.com/xPaw))
- Merge network/channel objects when reconnecting to keep object references ([#3305](https://github.com/thelounge/thelounge/pull/3305) by [@xPaw](https://github.com/xPaw))
- Add custom focus outlines for inputs and green buttons ([#1873](https://github.com/thelounge/thelounge/pull/1873) by [@astorije](https://github.com/astorije))
- Fix channel list not working on some touch devices ([#3320](https://github.com/thelounge/thelounge/pull/3320) by [@xPaw](https://github.com/xPaw))
- Parse target group for sent messages when echo-message is not enabled ([#3339](https://github.com/thelounge/thelounge/pull/3339) by [@xPaw](https://github.com/xPaw))
- Fix formatting hotkeys on non english locales ([#3343](https://github.com/thelounge/thelounge/pull/3343) by [@xPaw](https://github.com/xPaw))
- Handle upload token requesting in a better way ([#3335](https://github.com/thelounge/thelounge/pull/3335) by [@xPaw](https://github.com/xPaw))
- Make `/raw` actually write to network as-is ([#3352](https://github.com/thelounge/thelounge/pull/3352) by [@xPaw](https://github.com/xPaw))
- Open list channel on data updates ([#3347](https://github.com/thelounge/thelounge/pull/3347) by [@xPaw](https://github.com/xPaw))
- Display an error on unknown command ([#3361](https://github.com/thelounge/thelounge/pull/3361) by [@xPaw](https://github.com/xPaw))

### Internals

- Set up Prettier on HTML, JSON, Markdown, and YAML files ([#3060](https://github.com/thelounge/thelounge/pull/3060) by [@astorije](https://github.com/astorije))
- Set up prettier for JS/Vue files ([#3312](https://github.com/thelounge/thelounge/pull/3312) by [@McInkay](https://github.com/McInkay))
- Store ip and language in a separate object in user file ([#3307](https://github.com/thelounge/thelounge/pull/3307) by [@xPaw](https://github.com/xPaw))
- Disable io cookie ([#3342](https://github.com/thelounge/thelounge/pull/3342) by [@xPaw](https://github.com/xPaw))
- Update development dependencies to their latest versions:
  - `webpack-cli` ([#3304](https://github.com/thelounge/thelounge/pull/3304))
  - `mini-css-extract-plugin` ([#3308](https://github.com/thelounge/thelounge/pull/3308))
  - `mochapack` ([#3306](https://github.com/thelounge/thelounge/pull/3306), [#3340](https://github.com/thelounge/thelounge/pull/3340))
  - `vue-loader` ([#3314](https://github.com/thelounge/thelounge/pull/3314))
  - `husky` ([#3315](https://github.com/thelounge/thelounge/pull/3315), [#3337](https://github.com/thelounge/thelounge/pull/3337), [#3356](https://github.com/thelounge/thelounge/pull/3356))
  - `mocha` ([#3316](https://github.com/thelounge/thelounge/pull/3316))
  - `webpack` ([#3311](https://github.com/thelounge/thelounge/pull/3311), [#3328](https://github.com/thelounge/thelounge/pull/3328))
  - `eslint-config-prettier` ([#3319](https://github.com/thelounge/thelounge/pull/3319))
  - `eslint` ([#3321](https://github.com/thelounge/thelounge/pull/3321))
  - `babel-plugin-istanbul` ([#3323](https://github.com/thelounge/thelounge/pull/3323))
  - `@fortawesome/fontawesome-free` ([#3336](https://github.com/thelounge/thelounge/pull/3336), [#3341](https://github.com/thelounge/thelounge/pull/3341))
  - `copy-webpack-plugin` ([#3333](https://github.com/thelounge/thelounge/pull/3333))
  - `sinon` ([#3355](https://github.com/thelounge/thelounge/pull/3355))
  - `textcomplete` ([#3353](https://github.com/thelounge/thelounge/pull/3353))

## v3.2.0-rc.2 - 2019-08-13 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.2.0-rc.1...v3.2.0-rc.2)

This is a release candidate (RC) for v3.2.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.2.0-rc.1 - 2019-08-04 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.1.1...v3.2.0-rc.1)

This is a release candidate (RC) for v3.2.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.1.1 - 2019-07-11

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.1.0...v3.1.1)

Minor release to fix an issue where v3.1.0 fails to install on Linux/macOS using npm cli.

## v3.1.0 - 2019-07-11

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v3.0.1...v3.1.0) and [milestone](https://github.com/thelounge/thelounge/milestone/30?closed=1).

This is the first release that includes a largely rewritten frontend, which is built on top of the Vue.js framework!
We have started slowly transitioning the frontend to use Vue.js, which allows us to structure the code in a better fashion
and to remove all the hacks related to keeping the state in the DOM using jQuery data attributes.
This paves the road for future support of client customization and a plugin system.

While this release is mostly related to the rewrite, there are many user facing changes and improvements in this release!

### Added

- Added scroll to bottom button
- Put channel errors and unhandled numerics to relevant channel if it exists ([#3079](https://github.com/thelounge/thelounge/pull/3079) by [@xPaw](https://github.com/xPaw))
- Set scrollbar properties for Firefox 64+ ([#2974](https://github.com/thelounge/thelounge/pull/2974) by [@xPaw](https://github.com/xPaw))
- Display a broken link icon and red text color when not joined on a channel ([#3082](https://github.com/thelounge/thelounge/pull/3082) by [@astorije](https://github.com/astorije))
- Print a warning for invalid keys in config file or cli arguments ([#3100](https://github.com/thelounge/thelounge/pull/3100), [#3286](https://github.com/thelounge/thelounge/pull/3286) by [@xPaw](https://github.com/xPaw))
- Add support for `/kill` ([#3123](https://github.com/thelounge/thelounge/pull/3123) by [@kramerc](https://github.com/kramerc))
- Display current channel mode on /mode command ([#3109](https://github.com/thelounge/thelounge/pull/3109) by [@xPaw](https://github.com/xPaw))
- Send SETNAME command if user edits realname field ([#3107](https://github.com/thelounge/thelounge/pull/3107) by [@xPaw](https://github.com/xPaw))
- Implement invite list ([#3176](https://github.com/thelounge/thelounge/pull/3176) by [@xPaw](https://github.com/xPaw))
- Add server config api ([#2761](https://github.com/thelounge/thelounge/pull/2761) by [@McInkay](https://github.com/McInkay))
- Add aria-label on link preview toggle button ([#3116](https://github.com/thelounge/thelounge/pull/3116) by [@xPaw](https://github.com/xPaw))
- Add support for command plugins ([#2757](https://github.com/thelounge/thelounge/pull/2757), [#3281](https://github.com/thelounge/thelounge/pull/3281) by [@McInkay](https://github.com/McInkay))

### Changed

- Only active channel is rendered in DOM instead of them all. ([#1270](https://github.com/thelounge/thelounge/pull/1270))
- Input is no longer global (each channel gets its own input field). ([#706](https://github.com/thelounge/thelounge/pull/706))
- Input history is also per-channel now. ([#2791](https://github.com/thelounge/thelounge/pull/2791))
- Collapsing a network stays in active channel (and the active channel is still visible in the list)
- Collapsed networks still show channels with highlights. ([#2223](https://github.com/thelounge/thelounge/pull/2223))
- Client commands are refactored and `/join` can assume current channel. ([#2004](https://github.com/thelounge/thelounge/pull/2004)) ([#2281](https://github.com/thelounge/thelounge/pull/2281)) ([#2266](https://github.com/thelounge/thelounge/pull/2266))
- Channel `/list` persists on page reloads. ([#2249](https://github.com/thelounge/thelounge/pull/2249))
- Message parser now returns Vue elements (via createElement) instead of raw html content (no more manual escaping!)
- Message parser now actually accepts `CHANTYPES` and `PREFIX` from network. ([#443](https://github.com/thelounge/thelounge/pull/443))
- Hidden status messages are no longer rendered in DOM. ([#813](https://github.com/thelounge/thelounge/pull/813))
- Channel state is synchronised to the client (and is displayed). ([#2245](https://github.com/thelounge/thelounge/pull/2245))
- Chat input is no longer disabled when disconnected (still can't submit though)
- All channels user lists are cleared when disconnected from the network
- New utility function to update window title, notified state, favicon consistently. Which fixes titles or favicon sometimes not updating, e.g. on channel part. ([#2746](https://github.com/thelounge/thelounge/pull/2746)). ([#1311](https://github.com/thelounge/thelounge/pull/1311))
- `<>` and `*` around nicks have been moved to DOM so copying is consistent. ([#2801](https://github.com/thelounge/thelounge/pull/2801))
- Added `***` before actions when copying (e.g. topic set, joins, etc), and dashes around nick for notices.
- Removed `jquery-ui` in favor of Sortable.js. ([#932](https://github.com/thelounge/thelounge/pull/932))
- Image too big error is now handled by `auto expand media` setting, while other errors are handled by `auto expand websites` option. ([#2800](https://github.com/thelounge/thelounge/pull/2800))
- Custom highlights are now synced to the server and highlight code works on the server, this means that push notifications work for custom highlights, and they get synced across clients correctly.
- PageDown/PageUp now scroll natively without manually calculating and animating the offset.
- Sending long lines will now try splitting input into multiple lines on word boundaries.
- Images can now be pasted (Ctrl-v) and automatically uploaded ([#3226](https://github.com/thelounge/thelounge/pull/3226) by [@SwayUser](https://github.com/SwayUser))
- Bump minimum node version to 8 LTS ([#3004](https://github.com/thelounge/thelounge/pull/3004) by [@xPaw](https://github.com/xPaw))
- Use github's emoji data (support unicode 12) ([#3251](https://github.com/thelounge/thelounge/pull/3251) by [@xPaw](https://github.com/xPaw))
- Let the user know a CTCP request was sent ([#3019](https://github.com/thelounge/thelounge/pull/3019) by [@Zarthus](https://github.com/Zarthus))
- Extend custom highlight regex ([#3073](https://github.com/thelounge/thelounge/pull/3073) by [@Jay2k1](https://github.com/Jay2k1))
- Change condensed summary hover to an underline ([#3145](https://github.com/thelounge/thelounge/pull/3145) by [@xPaw](https://github.com/xPaw))
- Change styling when dragging channels. ([#3114](https://github.com/thelounge/thelounge/pull/3114) by [@xPaw](https://github.com/xPaw))
- Update production dependencies to their latest versions:
  - `package-json` ([#3007](https://github.com/thelounge/thelounge/pull/3007), [#3115](https://github.com/thelounge/thelounge/pull/3115), [#3142](https://github.com/thelounge/thelounge/pull/3142), [#3156](https://github.com/thelounge/thelounge/pull/3156), [#3254](https://github.com/thelounge/thelounge/pull/3254))
  - `mime-types` ([#3050](https://github.com/thelounge/thelounge/pull/3050), [#3181](https://github.com/thelounge/thelounge/pull/3181))
  - `file-type` ([#3069](https://github.com/thelounge/thelounge/pull/3069), [#3103](https://github.com/thelounge/thelounge/pull/3103), [#3159](https://github.com/thelounge/thelounge/pull/3159), [#3169](https://github.com/thelounge/thelounge/pull/3169), [#3198](https://github.com/thelounge/thelounge/pull/3198), [#3232](https://github.com/thelounge/thelounge/pull/3232), [#3255](https://github.com/thelounge/thelounge/pull/3255), [#3285](https://github.com/thelounge/thelounge/pull/3285))
  - `read-chunk` ([#3106](https://github.com/thelounge/thelounge/pull/3106), [#3158](https://github.com/thelounge/thelounge/pull/3158))
  - `filenamify` ([#3110](https://github.com/thelounge/thelounge/pull/3110), [#3157](https://github.com/thelounge/thelounge/pull/3157), [#3242](https://github.com/thelounge/thelounge/pull/3242))
  - `yarn` ([#3149](https://github.com/thelounge/thelounge/pull/3149), [#3210](https://github.com/thelounge/thelounge/pull/3210))
  - `semver` ([#3148](https://github.com/thelounge/thelounge/pull/3148), [#3231](https://github.com/thelounge/thelounge/pull/3231), [#3240](https://github.com/thelounge/thelounge/pull/3240), [#3270](https://github.com/thelounge/thelounge/pull/3270), [#3274](https://github.com/thelounge/thelounge/pull/3274))
  - `busboy` ([#3163](https://github.com/thelounge/thelounge/pull/3163))
  - `commander` ([#3162](https://github.com/thelounge/thelounge/pull/3162))
  - `irc-framework` ([#3201](https://github.com/thelounge/thelounge/pull/3201), [#3272](https://github.com/thelounge/thelounge/pull/3272))
  - `sqlite3` ([#3205](https://github.com/thelounge/thelounge/pull/3205), [#3213](https://github.com/thelounge/thelounge/pull/3213), [#3257](https://github.com/thelounge/thelounge/pull/3257))
  - `fs-extra` ([#3215](https://github.com/thelounge/thelounge/pull/3215), [#3222](https://github.com/thelounge/thelounge/pull/3222), [#3273](https://github.com/thelounge/thelounge/pull/3273))
  - `web-push` ([#3214](https://github.com/thelounge/thelounge/pull/3214), [#3223](https://github.com/thelounge/thelounge/pull/3223))
  - `express` ([#3225](https://github.com/thelounge/thelounge/pull/3225), [#3238](https://github.com/thelounge/thelounge/pull/3238))
  - `ua-parser-js` ([#3249](https://github.com/thelounge/thelounge/pull/3249))
  - `lodash` ([#3289](https://github.com/thelounge/thelounge/pull/3289))

### Fixed

- Fix copying text in Firefox around image previews ([#3044](https://github.com/thelounge/thelounge/pull/3044) by [@xPaw](https://github.com/xPaw))
- Fix (dis)connect icons in context menu being reverse of what they should be ([#3093](https://github.com/thelounge/thelounge/pull/3093) by [@xPaw](https://github.com/xPaw))
- Sanitize user and real names ([#3108](https://github.com/thelounge/thelounge/pull/3108) by [@xPaw](https://github.com/xPaw))
- Force no-cache on service-worker and sourcemap files ([#3137](https://github.com/thelounge/thelounge/pull/3137) by [@xPaw](https://github.com/xPaw))
- Handle redirected requests correctly in service worker ([#3136](https://github.com/thelounge/thelounge/pull/3136) by [@xPaw](https://github.com/xPaw))
- Fix file uploading when lounge is proxied in a subfolder ([#3258](https://github.com/thelounge/thelounge/pull/3258) by [@xPaw](https://github.com/xPaw))
- Only prepend text with 'Notice: ' if it's the nick it's from ([#3259](https://github.com/thelounge/thelounge/pull/3259) by [@emersonveenstra](https://github.com/emersonveenstra))
- Make sure unhandled command has params ([#3276](https://github.com/thelounge/thelounge/pull/3276) by [@xPaw](https://github.com/xPaw))
- [Updated ldapjs](https://github.com/thelounge/node-ldapjs) to support Node v10+ ([node-ldapjs#497](https://github.com/joyent/node-ldapjs/pull/497) by [@acappella2017](https://github.com/acappella2017))

### Documentation

In the main repository:

- help.tpl: Fix typo (ommitted -> omitted) ([#3077](https://github.com/thelounge/thelounge/pull/3077) by [@Zarthus](https://github.com/Zarthus))
- Spelling fix for manual disconnect message ([#3125](https://github.com/thelounge/thelounge/pull/3125) by [@MaxLeiter](https://github.com/MaxLeiter))
- Print a warning when running as root ([#3235](https://github.com/thelounge/thelounge/pull/3235) by [@xPaw](https://github.com/xPaw))
- Remove incorrect lowest node version from readme (#3217) ([`0967fa2`](https://github.com/thelounge/thelounge/commit/0967fa26cf8d30abd5e3fb27b91803a59876a6a7) by [@McInkay](https://github.com/McInkay))
- Add a message about experimental API ([#3279](https://github.com/thelounge/thelounge/pull/3279) by [@xPaw](https://github.com/xPaw))
- Change unable to load sqlite3 message ([#3280](https://github.com/thelounge/thelounge/pull/3280) by [@xPaw](https://github.com/xPaw))

On the [website repository](https://github.com/thelounge/thelounge.github.io):

- Updated non-functioning CSS for "Thinner User List" ([#204](https://github.com/thelounge/thelounge.github.io/pull/204) by [@theoneandonlyewok](https://github.com/theoneandonlyewok))
- Remove CSS snippet to hide messages from a specific user, now replaced with `/ignore` ([#203](https://github.com/thelounge/thelounge.github.io/pull/203) by [@xnaas](https://github.com/xnaas))
- Display page title dynamically to avoid confusing bots that search for metadata ([#205](https://github.com/thelounge/thelounge.github.io/pull/205) by [@astorije](https://github.com/astorije))
- Add page descriptions ([#164](https://github.com/thelounge/thelounge.github.io/pull/164) by [@xPaw](https://github.com/xPaw))
- Add a guide about ZNC (#206) ([`ae48ead`](https://github.com/thelounge/thelounge.github.io/commit/ae48ead17d512dc6f59ce28d8eba0ca762bdf6dc) by [@brunnre8](https://github.com/brunnre8))
- Add a link to our Twitter in the header ([#210](https://github.com/thelounge/thelounge.github.io/pull/210) by [@astorije](https://github.com/astorije))
- add warning about using the correct user to usage.md (#211) ([`3668a1c`](https://github.com/thelounge/thelounge.github.io/commit/3668a1c2f02ba5eedf8b6745c753174b7cdc03a5) by [@brunnre8](https://github.com/brunnre8))
- Add config API docs (#212) ([`6e46b2c`](https://github.com/thelounge/thelounge.github.io/commit/6e46b2cfded1a415f710ccba47a38052e57129a5) by [@McInkay](https://github.com/McInkay))
- Fix version command ([`25f42d1`](https://github.com/thelounge/thelounge.github.io/commit/25f42d167d1a90a4522e621919676789f8e7adda) by [@xPaw](https://github.com/xPaw))
- Add note about using sudo for the deb package (#208) ([`965379e`](https://github.com/thelounge/thelounge.github.io/commit/965379e05487a398c16652d6a8fa9036ee31b2f3) by [@Jay2k1](https://github.com/Jay2k1))
- Add docs about client_max_body_size ([#213](https://github.com/thelounge/thelounge.github.io/pull/213) by [@xPaw](https://github.com/xPaw))

### Internals

- Change build priority order in Travis ([#3045](https://github.com/thelounge/thelounge/pull/3045) by [@xPaw](https://github.com/xPaw))
- Move closing brackets on a new line in Vue files ([#3083](https://github.com/thelounge/thelounge/pull/3083) by [@astorije](https://github.com/astorije))
- Use Vue to show/hide insecure/disconnected icons instead of CSS ([#3088](https://github.com/thelounge/thelounge/pull/3088) by [@astorije](https://github.com/astorije))
- Use async/await in service worker, do not wait for cache for successful requests ([#3111](https://github.com/thelounge/thelounge/pull/3111) by [@xPaw](https://github.com/xPaw))
- Move favicon.ico to the root folder ([#3126](https://github.com/thelounge/thelounge/pull/3126) by [@xPaw](https://github.com/xPaw))
- Re-implement file uploading with old school multipart forms ([#3037](https://github.com/thelounge/thelounge/pull/3037) by [@xPaw](https://github.com/xPaw))
- Hide unknown key warning in mergeConfig test ([#3133](https://github.com/thelounge/thelounge/pull/3133) by [@xPaw](https://github.com/xPaw))
- Replace mocha-webpack with mochapack, and remove browser test setup that we never used ([#3150](https://github.com/thelounge/thelounge/pull/3150) by [@astorije](https://github.com/astorije))
- Replace `request` with `got` ([#3179](https://github.com/thelounge/thelounge/pull/3179) by [@xPaw](https://github.com/xPaw))
- Change upload abort error message ([#3236](https://github.com/thelounge/thelounge/pull/3236) by [@xPaw](https://github.com/xPaw))
- Add extra socket/server error event handlers ([#3250](https://github.com/thelounge/thelounge/pull/3250) by [@xPaw](https://github.com/xPaw))
- Move query to msg, fix #3049 ([#3138](https://github.com/thelounge/thelounge/pull/3138) by [@Dominent](https://github.com/Dominent))
- Update development dependencies to their latest versions:
  - `@fortawesome/fontawesome-free` ([#3048](https://github.com/thelounge/thelounge/pull/3048), [#3129](https://github.com/thelounge/thelounge/pull/3129), [#3202](https://github.com/thelounge/thelounge/pull/3202), [#3246](https://github.com/thelounge/thelounge/pull/3246))
  - `nyc` ([#3051](https://github.com/thelounge/thelounge/pull/3051), [#3178](https://github.com/thelounge/thelounge/pull/3178), [#3196](https://github.com/thelounge/thelounge/pull/3196))
  - `webpack` ([#3053](https://github.com/thelounge/thelounge/pull/3053), [#3065](https://github.com/thelounge/thelounge/pull/3065), [#3091](https://github.com/thelounge/thelounge/pull/3091), [#3171](https://github.com/thelounge/thelounge/pull/3171), [#3207](https://github.com/thelounge/thelounge/pull/3207), [#3228](https://github.com/thelounge/thelounge/pull/3228), [#3230](https://github.com/thelounge/thelounge/pull/3230), [#3245](https://github.com/thelounge/thelounge/pull/3245), [#3256](https://github.com/thelounge/thelounge/pull/3256), [#3264](https://github.com/thelounge/thelounge/pull/3264), [#3275](https://github.com/thelounge/thelounge/pull/3275))
  - `eslint` ([#3054](https://github.com/thelounge/thelounge/pull/3054), [#3068](https://github.com/thelounge/thelounge/pull/3068), [#3095](https://github.com/thelounge/thelounge/pull/3095), [#3101](https://github.com/thelounge/thelounge/pull/3101), [#3119](https://github.com/thelounge/thelounge/pull/3119), [#3127](https://github.com/thelounge/thelounge/pull/3127), [#3155](https://github.com/thelounge/thelounge/pull/3155), [#3266](https://github.com/thelounge/thelounge/pull/3266))
  - `eslint-plugin-vue` ([#3057](https://github.com/thelounge/thelounge/pull/3057), [#3066](https://github.com/thelounge/thelounge/pull/3066))
  - `@babel/core` ([#3055](https://github.com/thelounge/thelounge/pull/3055), [#3277](https://github.com/thelounge/thelounge/pull/3277))
  - `babel-plugin-istanbul` ([#3061](https://github.com/thelounge/thelounge/pull/3061), [#3177](https://github.com/thelounge/thelounge/pull/3177), [#3186](https://github.com/thelounge/thelounge/pull/3186), [#3195](https://github.com/thelounge/thelounge/pull/3195))
  - `sinon` ([#3067](https://github.com/thelounge/thelounge/pull/3067), [#3090](https://github.com/thelounge/thelounge/pull/3090), [#3098](https://github.com/thelounge/thelounge/pull/3098), [#3134](https://github.com/thelounge/thelounge/pull/3134), [#3151](https://github.com/thelounge/thelounge/pull/3151), [#3180](https://github.com/thelounge/thelounge/pull/3180))
  - `vue-loader` ([#3071](https://github.com/thelounge/thelounge/pull/3071), [#3074](https://github.com/thelounge/thelounge/pull/3074), [#3092](https://github.com/thelounge/thelounge/pull/3092))
  - `copy-webpack-plugin` ([#3075](https://github.com/thelounge/thelounge/pull/3075), [#3112](https://github.com/thelounge/thelounge/pull/3112), [#3141](https://github.com/thelounge/thelounge/pull/3141), [#3187](https://github.com/thelounge/thelounge/pull/3187))
  - `vue` ([#3078](https://github.com/thelounge/thelounge/pull/3078), [#3094](https://github.com/thelounge/thelounge/pull/3094), [#3118](https://github.com/thelounge/thelounge/pull/3118), [#3131](https://github.com/thelounge/thelounge/pull/3131))
  - `mocha` ([#3072](https://github.com/thelounge/thelounge/pull/3072), [#3164](https://github.com/thelounge/thelounge/pull/3164), [#3165](https://github.com/thelounge/thelounge/pull/3165), [#3170](https://github.com/thelounge/thelounge/pull/3170), [#3182](https://github.com/thelounge/thelounge/pull/3182))
  - `vuedraggable` ([#3081](https://github.com/thelounge/thelounge/pull/3081), [#3096](https://github.com/thelounge/thelounge/pull/3096), [#3102](https://github.com/thelounge/thelounge/pull/3102), [#3135](https://github.com/thelounge/thelounge/pull/3135), [#3143](https://github.com/thelounge/thelounge/pull/3143), [#3227](https://github.com/thelounge/thelounge/pull/3227), [#3267](https://github.com/thelounge/thelounge/pull/3267))
  - `mousetrap` ([#3099](https://github.com/thelounge/thelounge/pull/3099))
  - `emoji-regex` ([#3104](https://github.com/thelounge/thelounge/pull/3104))
  - `webpack-cli` ([#3120](https://github.com/thelounge/thelounge/pull/3120), [#3183](https://github.com/thelounge/thelounge/pull/3183), [#3199](https://github.com/thelounge/thelounge/pull/3199), [#3247](https://github.com/thelounge/thelounge/pull/3247), [#3252](https://github.com/thelounge/thelounge/pull/3252), [#3268](https://github.com/thelounge/thelounge/pull/3268))
  - `handlebars` ([#3124](https://github.com/thelounge/thelounge/pull/3124), [#3175](https://github.com/thelounge/thelounge/pull/3175))
  - `mochapack` ([#3153](https://github.com/thelounge/thelounge/pull/3153))
  - `html-minifier` ([#3160](https://github.com/thelounge/thelounge/pull/3160))
  - `jquery` ([#3167](https://github.com/thelounge/thelounge/pull/3167), [#3194](https://github.com/thelounge/thelounge/pull/3194))
  - `mini-css-extract-plugin` ([#3166](https://github.com/thelounge/thelounge/pull/3166), [#3239](https://github.com/thelounge/thelounge/pull/3239))
  - `stylelint-config-standard` ([#3174](https://github.com/thelounge/thelounge/pull/3174))
  - `stylelint` ([#3173](https://github.com/thelounge/thelounge/pull/3173), [#3248](https://github.com/thelounge/thelounge/pull/3248))
  - `intersection-observer` ([#3188](https://github.com/thelounge/thelounge/pull/3188), [#3212](https://github.com/thelounge/thelounge/pull/3212))
  - `babel-loader` ([#3216](https://github.com/thelounge/thelounge/pull/3216))

## v3.1.0-rc.1 - 2019-07-05 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.1.0-pre.3...v3.1.0-rc.1)

This is a release candidate (RC) for v3.1.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.1.0-pre.3 - 2019-06-28 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.1.0-pre.2...v3.1.0-pre.3)

This is a pre-release for v3.1.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.1.0-pre.2 - 2019-05-28 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.1.0-pre.1...v3.1.0-pre.2)

This is a pre-release for v3.1.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.1.0-pre.1 - 2019-05-11 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.0.1...v3.1.0-pre.1)

This is a pre-release for v3.1.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.0.1 - 2019-02-11

This patch release fixes a few small things that made it to the previous release.

It includes fixes for issues related to: reconnecting when a nickname is already in use, unnecessary highlights on invites, the auto-expandable message input, channels starting with `&` or `+`, the `/disconnect` command, and file uploads. Additionnally, `part` messages for the current user are now logged.

A more comprehensive list of changes is available below.

### Changed

- Update production dependencies to their latest versions:
  - `file-type` ([#2939](https://github.com/thelounge/thelounge/pull/2939), [#3000](https://github.com/thelounge/thelounge/pull/3000))
  - `chalk` ([#2957](https://github.com/thelounge/thelounge/pull/2957))
  - `yarn` ([#2965](https://github.com/thelounge/thelounge/pull/2965))
  - `socketio-file-upload` ([#3001](https://github.com/thelounge/thelounge/pull/3001))
  - `irc-framework` ([#3040](https://github.com/thelounge/thelounge/pull/3040))

### Fixed

- Always emit `part` message (required for logging) ([#2989](https://github.com/thelounge/thelounge/pull/2989) by [@xPaw](https://github.com/xPaw))
- Fix `line-height` to match height in input ([#2995](https://github.com/thelounge/thelounge/pull/2995) by [@xPaw](https://github.com/xPaw))
- Fix incorrect 404 error for files with unknown file type ([#3010](https://github.com/thelounge/thelounge/pull/3010) by [@xPaw](https://github.com/xPaw))
- Fix up link insertion after uploads to be saner ([#3011](https://github.com/thelounge/thelounge/pull/3011) by [@xPaw](https://github.com/xPaw))
- Do not get highlight on invites ([#3031](https://github.com/thelounge/thelounge/pull/3031) by [@creesch](https://github.com/creesch))
- Allow forcing /disconnect to stop reconnection timer from running ([#3034](https://github.com/thelounge/thelounge/pull/3034) by [@xPaw](https://github.com/xPaw))
- Fix up textarea growing to avoid rounding issues in Chrome ([#3033](https://github.com/thelounge/thelounge/pull/3033) by [@xPaw](https://github.com/xPaw))

### Documentation

In the main repository:

- Do not report the (renamed) Renovate bot as a contributor ([#2997](https://github.com/thelounge/thelounge/pull/2997) by [@astorije](https://github.com/astorije))
- Add `webirc` key and commas in configuration file examples to make them more understandable ([#3008](https://github.com/thelounge/thelounge/pull/3008) by [@xPaw](https://github.com/xPaw))

On the [website repository](https://github.com/thelounge/thelounge.github.io):

- Use new URL for `ansible-thelounge` ([#196](https://github.com/thelounge/thelounge.github.io/pull/196) by [@astorije](https://github.com/astorije))
- Add a link to a blog post in the Community page ([#195](https://github.com/thelounge/thelounge.github.io/pull/195) by [@astorije](https://github.com/astorije))
- Simplify Caddy reverse proxy example by using `transparent` shorthand ([#197](https://github.com/thelounge/thelounge.github.io/pull/197) by [@MarkOtzen](https://github.com/MarkOtzen))
- Place config update comment in noteblock for visual clarity. ([#198](https://github.com/thelounge/thelounge.github.io/pull/198) by [@EntityReborn](https://github.com/EntityReborn))
- Regenerate config ([`78ada86`](https://github.com/thelounge/thelounge.github.io/commit/78ada860206376116fcdda13e9c09399e811bfde) by [@xPaw](https://github.com/xPaw))
- Add title to iframe ([`7c4d0d2`](https://github.com/thelounge/thelounge.github.io/commit/7c4d0d279a686a6db9c0352a0f7c8f002a7678b0) by [@xPaw](https://github.com/xPaw))
- Apply `word-break` to `<code>` only on small screens ([#202](https://github.com/thelounge/thelounge.github.io/pull/202) by [@xPaw](https://github.com/xPaw))

### Internals

- Use `require.resolve` for yarn ([#2993](https://github.com/thelounge/thelounge/pull/2993) by [@xPaw](https://github.com/xPaw))
- Keep using npm to clean up dist-tags after a stable release ([#2999](https://github.com/thelounge/thelounge/pull/2999) by [@astorije](https://github.com/astorije))
- Bump Travis to use Node 10 LTS for Windows, OSX, and production builds ([#3003](https://github.com/thelounge/thelounge/pull/3003) by [@xPaw](https://github.com/xPaw))
- Make sure the editorconfig indent size applies to all file formats ([#3022](https://github.com/thelounge/thelounge/pull/3022) by [@astorije](https://github.com/astorije))
- Update development dependencies to their latest versions:
  - `@babel/preset-env` ([#2942](https://github.com/thelounge/thelounge/pull/2942))
  - `moment` ([#2991](https://github.com/thelounge/thelounge/pull/2991))
  - `primer-tooltips` ([#2962](https://github.com/thelounge/thelounge/pull/2962), [#3001](https://github.com/thelounge/thelounge/pull/3001))
  - `emoji-regex` ([#2941](https://github.com/thelounge/thelounge/pull/2941))
  - `handlebars-loader` ([#2938](https://github.com/thelounge/thelounge/pull/2938), [#3001](https://github.com/thelounge/thelounge/pull/3001))
  - `@fortawesome/fontawesome-free` ([#2944](https://github.com/thelounge/thelounge/pull/2944), [#3006](https://github.com/thelounge/thelounge/pull/3006), [#3016](https://github.com/thelounge/thelounge/pull/3016))
  - `sinon` ([#2986](https://github.com/thelounge/thelounge/pull/2986))
  - `babel-loader` ([#2954](https://github.com/thelounge/thelounge/pull/2954))
  - `webpack-cli` ([#2951](https://github.com/thelounge/thelounge/pull/2951), [#3030](https://github.com/thelounge/thelounge/pull/3030))
  - `eslint` ([#2947](https://github.com/thelounge/thelounge/pull/2947), [#3015](https://github.com/thelounge/thelounge/pull/3015))
  - `stylelint` ([#3001](https://github.com/thelounge/thelounge/pull/3001))
  - `webpack` ([#3001](https://github.com/thelounge/thelounge/pull/3001), [#3028](https://github.com/thelounge/thelounge/pull/3028), [#3036](https://github.com/thelounge/thelounge/pull/3036))
  - `nyc` ([#3029](https://github.com/thelounge/thelounge/pull/3029))
  - `handlebars` ([#3038](https://github.com/thelounge/thelounge/pull/3038))

## v3.0.0 - 2019-01-27

For more details, [see the full changelog](https://github.com/thelounge/thelounge/compare/v2.7.1...v3.0.0) and [milestone](https://github.com/thelounge/thelounge/milestone/28?closed=1).

Almost a year in the making, 1500+ commits, 650+ merged PRs, and 30+ contributors, The Lounge v3.0.0 really is the release of all the superlatives. It ships some of our most-upvoted and longest-awaited feature requests, with significant improvements all across the board, and a brand new documentation website.

_**TL;DR:** If you are only looking for a simple list of **breaking changes** before we jump onto a shortlist of the top changes below, we now have an [upgrade guide](https://thelounge.chat/docs/guides/upgrade). You can also try [our demo](https://demo.thelounge.chat) to see and test the new features._

We rewrote [our entire documentation](https://thelounge.chat/docs) from scratch to better reflect the full capabilities of The Lounge. The website is now mobile-friendly, has a search feature, detailed pages about installation, usage, and configuration, and a list of guides to make The Lounge effortless to set up to your needs.

The first thing you might notice is how the overall UI has changed. We extracted [Crypto](https://github.com/thelounge/thelounge-theme-crypto) and [Zenburn](https://github.com/thelounge/thelounge-theme-zenburn) into dedicated themes to only ship our default and updated theme, and Morning, the dark version of our default theme. Our logo made its way to the client and its notification-aware favicons. Speaking of notifications, the browser window title now contains the number of unread notifications you have received:

<p align="center">
  <img width="257" alt="Browser tab with notification favicon and number of unread messages in title" src="https://user-images.githubusercontent.com/113730/51792350-ca4a3400-217d-11e9-9d29-549a6c1c7877.png">
</p>

One of the most notable additions of this release is the ability to **reload messages from history** (previous conversations and channels) between restarts of The Lounge. This bridges a significant and long-standing gap with other traditional IRC clients, and creates an opportunity for more advanced features (such as a search capability). See the [corresponding configuration option](https://thelounge.chat/docs/configuration#messagestorage) for more details.

The Lounge now lets you **upload files**! Once [enabled in your configuration file](https://thelounge.chat/docs/configuration#fileupload), you can directly upload files and images from the UI:

<p align="center">
  <img width="169" alt="Paperclip icon in the message input, with tooltip saying Upload file" src="https://user-images.githubusercontent.com/113730/51368149-0b768000-1abc-11e9-8638-21ccd500a8d1.png">
  <br>
  <em>To upload a file, use the icon in the message input, or simply drag-and-drop it on the UI.</em>
</p>

A new set of commands gives you the ability to **ignore users** based on nickname or hostmask: `/ignore`, `/unignore`, and `/ignorelist`.

<p align="center">
  <img width="145" alt="New context menu action: List ignored users" src="https://user-images.githubusercontent.com/113730/51492120-abfbc700-1d7e-11e9-89ac-879396b52fcc.png"> <img width="300" alt="Ignored users list with 1 ignored hostmask" src="https://user-images.githubusercontent.com/113730/51492121-abfbc700-1d7e-11e9-8115-7906f36952b2.png">
  <br>
  <em>List ignored users directly from the UI using the context menu on networks</em>
</p>

📂 The **channel list** packs a lot of improvements:

- It is now possible to **collapse channels/direct messages** under a given network:

<p align="center">
  <img alt="Collapse networks in the channel list by clicking the caret icon on the left of the network name" src="https://user-images.githubusercontent.com/113730/51504567-b5515780-1daf-11e9-81f5-a87c5c05ffb2.gif">
</p>

- New **keyboard shortcuts** have been added to easily navigate between lobbies. A list of all available shortcuts can be found in the Help window of the client.

- You can now **edit existing networks** from the UI. Most changes will take effect after the next reconnection, but editing the network name will go into effect immediately.

<p align="center">
  <img height="125" alt="" src="https://user-images.githubusercontent.com/113730/51505116-b59f2200-1db2-11e9-943e-fe3529866bfa.png"> <img height="125" alt="" src="https://user-images.githubusercontent.com/113730/51505117-b59f2200-1db2-11e9-9e70-edc5583644f0.png">
  <br>
  <em>To edit a network, click the according action in the network context menu</em>
</p>

- You can also **disconnect and re-connect** directly from the network context menu. Disconnected networks will stay disconnected upon restarts of the server.

- Networks now reflect their **connection and security status**. For a network to be considered secure, it has to use a valid and trusted TLS certificate (trusted by your Node.js installation) or to be connected to localhost.

<p align="center">
  <img width="212" alt="If you are disconnected from the network, the channel list will display a broken link icon" src="https://user-images.githubusercontent.com/113730/51589595-7c030f80-1eb5-11e9-913a-3a5cea93f25e.png"><br><img width="212" alt="If the connection is not secure, the channel list will display a warning icon" src="https://user-images.githubusercontent.com/113730/51589678-b2408f00-1eb5-11e9-83ab-3decd9c81847.png">
</p>

- When joining a new channel, it is now added to the list in **alphabetical order**. You can still sort channels yourself by dragging them around.

- The channel list can now be **hidden on desktop devices**.

🌍 **Links previews** have also been improved:

- They gained an **expand button** if the title or description text is truncated:

<p align="center">
  <img alt="Previews can be expanded using the More/Less button" src="https://user-images.githubusercontent.com/113730/51792561-cd92ef00-2180-11e9-9574-f96cd55e29a5.gif">
</p>

- Your browser language is now passed onto the server of the URL being fetched so that previews can be **displayed in your language** (depending on remote server support).

- Any error occuring while pre-fetching a URL (e.g. request failure or max size exceeded) will be displayed on the interface. More details can be seen by expanding the preview.

<p align="center">
  <img width="431" alt="Example of an error occurring when pre-fetching a URL" src="https://user-images.githubusercontent.com/113730/51727895-1ab97880-203c-11e9-9ada-373a62c52c13.png">
</p>

💬 The **message input** also gets a few improvements:

- You can now easily wrap text with quotes, brackets, parentheses, etc. by selecting characters then hitting the corresponding key:

<p align="center">
  <img alt="Auto-complete closing characters by selecting text in the message input and hitting the corresponding key" src="https://user-images.githubusercontent.com/113730/51504871-3bba6900-1db1-11e9-8fcc-3b475978e1b0.gif">
</p>

- The input bar no longer aggressively steals the keyboard focus. This change makes it possible to tab through focusable/clickable elements in the UI. Typing or pasting text (using <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>V</kbd>) anywhere when nothing is in focus will however automatically set the focus to the input bar.

⚙️ Here are a few new things you may notice in the **client settings** window:

- Some settings may now be hidden behind the new "Advanced settings" checkbox:

<p align="center">
  <img width="163" alt="Advanced settings checkbox" src="https://user-images.githubusercontent.com/113730/51515573-2f9acf80-1de2-11e9-88a8-07f8ab43a5ea.png">
</p>

- You can now (optionally) **synchronize client settings** across all your devices:

<p align="center">
  <img width="450" alt="Client settings can be synchronized across devices" src="https://user-images.githubusercontent.com/113730/51514816-691e0b80-1ddf-11e9-887c-118216627ca1.png">
</p>

- You can also instruct your device to open all URLs starting with `irc://` using The Lounge:

<p align="center">
  <img width="450" alt="Button in the Settings: Open irc:// URLs with The Lounge" src="https://user-images.githubusercontent.com/113730/51514874-97035000-1ddf-11e9-80ba-8c09c87fd634.png">
</p>

🖥 Administrators handling the server and using the CLI will notice a few changes:

- Text log format has been modified to improve formatting and consistency with other IRC software. The `logs.format` and `logs.timezone` settings have been removed. The Lounge now logs timestamps using a format of `YYYY-MM-DD HH:mm:ss` (which used to be the default value) in UTC timezone. These are some of the breaking changes we have documented in our [upgrade guide](https://thelounge.chat/docs/guides/upgrade).

- The inline documentation of the configuration file that gets generated at `~/.thelounge/config.js` has been entirely rewritten. It can also be found in a rich-format on [the configuration documentation](https://thelounge.chat/docs/configuration).

- The `thelounge install` command now allows you to install a **specific version**, such as `thelounge install thelounge-theme-solarized@1.0.0`.

- A new command, `thelounge update`, has been added to **update all installed packages and themes** at once.

- Message logging is now enabled for LDAP users.

💎 Other notable changes:

- Visibility of the password fields can now be toggled using the eye icon:

<p align="center">
  <img alt="Control password field visibility by clicking on the eye icon" src="https://user-images.githubusercontent.com/113730/51728791-6a4d7380-203f-11e9-9bd8-c91b2453477d.gif">
</p>

- If you are operator in a channel, the user context menu now lets you voice/devoice and op/deop users:

<p align="center">
  <img width="225" alt="User context menu showing actions to revoke operator and give voice to a user" src="https://user-images.githubusercontent.com/113730/51729015-3a52a000-2040-11e9-9fba-e5808eece3d1.png">
</p>

- MOTDs in network windows have been improved to correctly display ASCII art:

<p align="center">
  <img width="300" alt="screen shot 2019-01-25 at 01 28 28" src="https://user-images.githubusercontent.com/113730/51729170-94ebfc00-2040-11e9-9441-616d845c866c.png">
</p>

- The `/whowas` command is now supported and its response is displayed in a direct message window.

- It is now possible to include randomly-generated numbers into the default nickname on page load, using percent signs (`%`). For example, this helps avoiding nick collisions in public mode. See the [configuration option](https://thelounge.chat/docs/configuration#defaults).

- URL detection in messages now supports links without protocol or `www.` prefixes (if the top-level domain is valid) and has been improved overall by switching to [a better library](https://markdown-it.github.io/linkify-it/).

- Accessibility of the interface has been improved throughout the interface. If you are an assistive technology user and encounter accessibility issues, we encourage you to [open an issue on GitHub](https://github.com/thelounge/thelounge/issues/new) to help us identifying and resolving them.

- Among other improvements to CTCP handling, the network window now reports when someone is making a CTCP request against your nickname:

<p align="center">
  <img width="370" alt="screen shot 2019-01-26 at 02 13 28" src="https://user-images.githubusercontent.com/113730/51783985-5aea2b00-2110-11e9-8ed3-92c2a8e18d40.png">
</p>

This concludes the highlights of this release, but there is a lot more to it: new and improved features, security fixes, etc., of which you will find a more comprehensive list below.

So much work has happened in the last year, result of the hard work of so many contributors that we are incredibly thankful for. We hope you will love The Lounge v3. ❤️

_One more thing: we started [an Open Collective](https://opencollective.com/thelounge) a few months back, where recurring and one-time donations are welcome, should you wish to help us financially. Among other things, it allows us to assemble and ship free sticker packs, so [make sure to grab yours](https://goo.gl/forms/f5usqAEp5DWoeXC92)!_

### Added

- Enable logging for LDAP users ([#2098](https://github.com/thelounge/thelounge/pull/2098) by [@keegan](https://github.com/keegan))
- Let user know someone is making a CTCP request against their nick ([#1930](https://github.com/thelounge/thelounge/pull/1930) by [@astorije](https://github.com/astorije))
- Add log role to message container ([#1907](https://github.com/thelounge/thelounge/pull/1907) by [@xPaw](https://github.com/xPaw))
- Add ability to collapse networks in the channel list ([#1867](https://github.com/thelounge/thelounge/pull/1867), [#2225](https://github.com/thelounge/thelounge/pull/2225), [#2195](https://github.com/thelounge/thelounge/pull/2195) by [@McInkay](https://github.com/McInkay), [#2298](https://github.com/thelounge/thelounge/pull/2298), [#2399](https://github.com/thelounge/thelounge/pull/2399), [#2530](https://github.com/thelounge/thelounge/pull/2530) by [@xPaw](https://github.com/xPaw), [#2305](https://github.com/thelounge/thelounge/pull/2305) by [@astorije](https://github.com/astorije), [#2388](https://github.com/thelounge/thelounge/pull/2388) by [@Raqbit](https://github.com/Raqbit))
- Add install command support for package version ([#2161](https://github.com/thelounge/thelounge/pull/2161) by [@realies](https://github.com/realies))
- Add support for reloading messages using SQLite logging ([#1839](https://github.com/thelounge/thelounge/pull/1839), [#2188](https://github.com/thelounge/thelounge/pull/2188), [#2190](https://github.com/thelounge/thelounge/pull/2190), [#2222](https://github.com/thelounge/thelounge/pull/2222), [#2391](https://github.com/thelounge/thelounge/pull/2391), [#2546](https://github.com/thelounge/thelounge/pull/2546) by [@xPaw](https://github.com/xPaw), [#2541](https://github.com/thelounge/thelounge/pull/2541) by [@astorije](https://github.com/astorije))
- Optional syncing of client settings ([#1851](https://github.com/thelounge/thelounge/pull/1851) by [@creesch](https://github.com/creesch))
- Add advanced toggle and hide certain settings by default ([#1860](https://github.com/thelounge/thelounge/pull/1860) by [@McInkay](https://github.com/McInkay))
- Allow hiding channel list on desktop ([#2212](https://github.com/thelounge/thelounge/pull/2212), [#2235](https://github.com/thelounge/thelounge/pull/2235), [#2601](https://github.com/thelounge/thelounge/pull/2601), [#2854](https://github.com/thelounge/thelounge/pull/2854) by [@xPaw](https://github.com/xPaw), [#2246](https://github.com/thelounge/thelounge/pull/2246) by [@astorije](https://github.com/astorije), [#2785](https://github.com/thelounge/thelounge/pull/2785) by [@williamboman](https://github.com/williamboman))
- Add keybinds for cycling through networks/lobbies ([#2206](https://github.com/thelounge/thelounge/pull/2206) by [@ESWAT](https://github.com/ESWAT))
- Autocomplete bracket and quote characters like in a modern IDE ([#2275](https://github.com/thelounge/thelounge/pull/2275) by [@xPaw](https://github.com/xPaw))
- Add auto-prepend behavior for unprefixed channel names ([#2289](https://github.com/thelounge/thelounge/pull/2289) by [@lol768](https://github.com/lol768))
- Add `?channels=x,y,z` alias for `?join=x,y,z` ([#2290](https://github.com/thelounge/thelounge/pull/2290) by [@lol768](https://github.com/lol768))
- Allow editing networks via UI ([#2229](https://github.com/thelounge/thelounge/pull/2229) by [@xPaw](https://github.com/xPaw))
- Add `op` and `voice` to the user context menu ([#2355](https://github.com/thelounge/thelounge/pull/2355) by [@Jay2k1](https://github.com/Jay2k1))
- Add `upgrade` CLI command for themes and packages ([#2380](https://github.com/thelounge/thelounge/pull/2380) by [@jake-walker](https://github.com/jake-walker))
- Add support for `/ignore`, `/unignore` and `/ignorelist` commands ([#2197](https://github.com/thelounge/thelounge/pull/2197) by [@RockyTV](https://github.com/RockyTV))
- Add password visibility toggle feature ([#2429](https://github.com/thelounge/thelounge/pull/2429) by [@c-ciobanu](https://github.com/c-ciobanu))
- Allow connecting/disconnecting from networks in UI ([#2114](https://github.com/thelounge/thelounge/pull/2114) by [@MaxLeiter](https://github.com/MaxLeiter))
- Add alert count to title ([#2496](https://github.com/thelounge/thelounge/pull/2496) by [@Jay2k1](https://github.com/Jay2k1), [#2558](https://github.com/thelounge/thelounge/pull/2558) by [@xPaw](https://github.com/xPaw))
- Display visual feedback on self away/back ([#2523](https://github.com/thelounge/thelounge/pull/2523) by [@Jay2k1](https://github.com/Jay2k1))
- WHOWAS support ([#2554](https://github.com/thelounge/thelounge/pull/2554) by [@Jay2k1](https://github.com/Jay2k1))
- Add "User information" (`whois`) support to the sidebar context menu ([#2587](https://github.com/thelounge/thelounge/pull/2587) by [@aspotton](https://github.com/aspotton))
- Implement `irc://` and `ircs://` protocol handlers ([#2571](https://github.com/thelounge/thelounge/pull/2571) by [@xPaw](https://github.com/xPaw))
- Add file uploading support ([#2552](https://github.com/thelounge/thelounge/pull/2552) by [@MaxLeiter](https://github.com/MaxLeiter), [#2743](https://github.com/thelounge/thelounge/pull/2743), [#2744](https://github.com/thelounge/thelounge/pull/2744), [#2748](https://github.com/thelounge/thelounge/pull/2748),
  [#2749](https://github.com/thelounge/thelounge/pull/2749), [#2851](https://github.com/thelounge/thelounge/pull/2851), [#2985](https://github.com/thelounge/thelounge/pull/2985) by [@xPaw](https://github.com/xPaw), [#2983](https://github.com/thelounge/thelounge/pull/2983) by [@astorije](https://github.com/astorije))

### Changed

- Turn channel list into an accessible tablist ([#1915](https://github.com/thelounge/thelounge/pull/1915), [#2079](https://github.com/thelounge/thelounge/pull/2079), [#2828](https://github.com/thelounge/thelounge/pull/2828), [#2830](https://github.com/thelounge/thelounge/pull/2830), [#2840](https://github.com/thelounge/thelounge/pull/2840) by [@xPaw](https://github.com/xPaw))
- Render MOTD with a single message ([#2059](https://github.com/thelounge/thelounge/pull/2059) by [@xPaw](https://github.com/xPaw))
- Show error if image is greater than max prefetch size ([#1919](https://github.com/thelounge/thelounge/pull/1919) by [@McInkay](https://github.com/McInkay))
- Improve monospace formatting in messages ([#2031](https://github.com/thelounge/thelounge/pull/2031) by [@astorije](https://github.com/astorije))
- Switch default home location to `~/.thelounge` ([#1734](https://github.com/thelounge/thelounge/pull/1734) by [@astorije](https://github.com/astorije))
- Report server errors when preview fetch fails ([#2036](https://github.com/thelounge/thelounge/pull/2036) by [@xPaw](https://github.com/xPaw))
- Relay client's preferred language in link preview requests ([#1918](https://github.com/thelounge/thelounge/pull/1918) by [@williamboman](https://github.com/williamboman))
- Allow generating random numbers in nick on page load ([#2090](https://github.com/thelounge/thelounge/pull/2090) by [@xPaw](https://github.com/xPaw))
- Word prefetch errors differently ([#2101](https://github.com/thelounge/thelounge/pull/2101) by [@xPaw](https://github.com/xPaw))
- Log socket close error if any ([#2108](https://github.com/thelounge/thelounge/pull/2108) by [@xPaw](https://github.com/xPaw))
- Add autocompleted names to private chats ([#1669](https://github.com/thelounge/thelounge/pull/1669) by [@edbrannin](https://github.com/edbrannin))
- Change <kbd>ctrl</kbd>/<kbd>command</kbd> <kbd>up</kbd>/<kbd>down</kbd> to <kbd>alt</kbd>/<kbd>option</kbd> <kbd>up</kbd>/<kbd>down</kbd> to align with other apps ([#2133](https://github.com/thelounge/thelounge/pull/2133) by [@McInkay](https://github.com/McInkay))
- Move the user list client code to its own file and make it possible to navigate with keyboard ([#1842](https://github.com/thelounge/thelounge/pull/1842) by [@astorije](https://github.com/astorije))
- Make code blocks more readable in darker themes ([#2135](https://github.com/thelounge/thelounge/pull/2135) by [@williamboman](https://github.com/williamboman))
- Center loading screen and add logo ([#1668](https://github.com/thelounge/thelounge/pull/1668) by [@xPaw](https://github.com/xPaw))
- Try to find `og:video` and `og:audio` on html pages ([#1838](https://github.com/thelounge/thelounge/pull/1838) by [@xPaw](https://github.com/xPaw))
- Scroll to joined/activated channel ([#2166](https://github.com/thelounge/thelounge/pull/2166) by [@dgw](https://github.com/dgw))
- Upgrade to Font Awesome 5 ([#2194](https://github.com/thelounge/thelounge/pull/2194), [#2205](https://github.com/thelounge/thelounge/pull/2205) by [@xPaw](https://github.com/xPaw))
- Convert the entire viewport to use flexbox ([#2185](https://github.com/thelounge/thelounge/pull/2185) by [@xPaw](https://github.com/xPaw))
- Insert channel/user in alphabetical position into channel list ([#2152](https://github.com/thelounge/thelounge/pull/2152) by [@McInkay](https://github.com/McInkay))
- Use undate library to handle modifier keys ([#2210](https://github.com/thelounge/thelounge/pull/2210) by [@xPaw](https://github.com/xPaw))
- Add logo to the sign in page ([#2199](https://github.com/thelounge/thelounge/pull/2199) by [@astorije](https://github.com/astorije))
- Do not aggressively focus input when clicking anywhere and handle typing out of focus ([#2215](https://github.com/thelounge/thelounge/pull/2215), [#2242](https://github.com/thelounge/thelounge/pull/2242), [#2258](https://github.com/thelounge/thelounge/pull/2258), [#2416](https://github.com/thelounge/thelounge/pull/2416), [#2414](https://github.com/thelounge/thelounge/pull/2414), [#2536](https://github.com/thelounge/thelounge/pull/2536) by [@xPaw](https://github.com/xPaw))
- Improve accessibility for emoji ([#2186](https://github.com/thelounge/thelounge/pull/2186) by [@MaxLeiter](https://github.com/MaxLeiter))
- Do not condense actions that are performed by or related to the user ([#2268](https://github.com/thelounge/thelounge/pull/2268) by [@xPaw](https://github.com/xPaw))
- Reduce lightness of low contrast nick colors to reach AA level of WCAG 2.0 ([#2282](https://github.com/thelounge/thelounge/pull/2282) by [@astorije](https://github.com/astorije))
- Reduce top margins in Settings/Help/etc. ([#2321](https://github.com/thelounge/thelounge/pull/2321) by [@MaxLeiter](https://github.com/MaxLeiter))
- Improve UI of previews ([#2272](https://github.com/thelounge/thelounge/pull/2272), [#2349](https://github.com/thelounge/thelounge/pull/2349) by [@astorije](https://github.com/astorije))
- Extract Crypto and Zenburn from the core codebase, rename "Example" theme, fallback to default theme when a theme is unavailable ([#2328](https://github.com/thelounge/thelounge/pull/2328) by [@astorije](https://github.com/astorije))
- Update placeholder rules for modern browsers ([#2356](https://github.com/thelounge/thelounge/pull/2356) by [@xPaw](https://github.com/xPaw))
- Add project version in outputs that mention source SHA ([#2361](https://github.com/thelounge/thelounge/pull/2361) by [@astorije](https://github.com/astorije))
- Remove header border on non-chat windows and reduce top margin a bit more ([#2368](https://github.com/thelounge/thelounge/pull/2368) by [@astorije](https://github.com/astorije))
- Make "Show older messages" style consistent with other buttons ([#2369](https://github.com/thelounge/thelounge/pull/2369) by [@astorije](https://github.com/astorije))
- Count quits as parts in condensed messages to reduce information density ([#2386](https://github.com/thelounge/thelounge/pull/2386), [#2383](https://github.com/thelounge/thelounge/pull/2383), [#2392](https://github.com/thelounge/thelounge/pull/2392) by [@xPaw](https://github.com/xPaw))
- Favicons, favicons everywhere ([#2009](https://github.com/thelounge/thelounge/pull/2009), [#2540](https://github.com/thelounge/thelounge/pull/2540) by [@astorije](https://github.com/astorije), [#2431](https://github.com/thelounge/thelounge/pull/2431) by [@xPaw](https://github.com/xPaw), [#2755](https://github.com/thelounge/thelounge/pull/2755) by [@McInkay](https://github.com/McInkay))
- Show a ghost placeholder when dragging channels ([#2405](https://github.com/thelounge/thelounge/pull/2405) by [@xPaw](https://github.com/xPaw))
- Use overscroll-behavior ([#2413](https://github.com/thelounge/thelounge/pull/2413) by [@xPaw](https://github.com/xPaw))
- Switch to `linkify-it` for URL detection in messages ([#2397](https://github.com/thelounge/thelounge/pull/2397) by [@xPaw](https://github.com/xPaw))
- Add asterisk in front of nick in action lines ([#2488](https://github.com/thelounge/thelounge/pull/2488) by [@Jay2k1](https://github.com/Jay2k1))
- Put list items in network context menu together ([#2494](https://github.com/thelounge/thelounge/pull/2494) by [@xPaw](https://github.com/xPaw))
- Do not write topic on join to logs ([#2508](https://github.com/thelounge/thelounge/pull/2508) by [@xPaw](https://github.com/xPaw))
- Make CTCP requests/responses increase unread counter ([#2510](https://github.com/thelounge/thelounge/pull/2510) by [@Jay2k1](https://github.com/Jay2k1))
- De-duplicate link fetching to one request at once ([#2538](https://github.com/thelounge/thelounge/pull/2538) by [@xPaw](https://github.com/xPaw))
- Improve formatting of text logs ([#2501](https://github.com/thelounge/thelounge/pull/2501) by [@Jay2k1](https://github.com/Jay2k1))
- Target more modern browsers in babel ([#2565](https://github.com/thelounge/thelounge/pull/2565) by [@xPaw](https://github.com/xPaw))
- Make context menus accessible with keyboard ([#2377](https://github.com/thelounge/thelounge/pull/2377) by [@xPaw](https://github.com/xPaw))
- Revamp default theme a bit ([#2315](https://github.com/thelounge/thelounge/pull/2315) by [@astorije](https://github.com/astorije))
- Also send away notices to query windows ([#2576](https://github.com/thelounge/thelounge/pull/2576) by [@xPaw](https://github.com/xPaw))
- Replace current red-text highlight with a full background-color highlight ([#2526](https://github.com/thelounge/thelounge/pull/2526), [#2585](https://github.com/thelounge/thelounge/pull/2585), [#2622](https://github.com/thelounge/thelounge/pull/2622) by [@astorije](https://github.com/astorije))
- Warn if config owner does not match process UID ([#2570](https://github.com/thelounge/thelounge/pull/2570) by [@xPaw](https://github.com/xPaw))
- Improve MOTD styling ([#2633](https://github.com/thelounge/thelounge/pull/2633) by [@astorije](https://github.com/astorije), [#2653](https://github.com/thelounge/thelounge/pull/2653) by [@xPaw](https://github.com/xPaw), [#2657](https://github.com/thelounge/thelounge/pull/2657) by [@MiniDigger](https://github.com/MiniDigger))
- Make user list section titles sticky on scroll, improve contrasts for accessibility, use CSS variables ([#2643](https://github.com/thelounge/thelounge/pull/2643) by [@astorije](https://github.com/astorije))
- Network-first service worker caches ([#2515](https://github.com/thelounge/thelounge/pull/2515) by [@xPaw](https://github.com/xPaw))
- Add `X-Purpose` header to link prefetcher ([#2695](https://github.com/thelounge/thelounge/pull/2695) by [@RockyTV](https://github.com/RockyTV))
- Keep timestamps aligned when using a font with variable-width numbers ([#2683](https://github.com/thelounge/thelounge/pull/2683) by [@ivan](https://github.com/ivan))
- Improve confirmation box wording for network removal in client ([#2715](https://github.com/thelounge/thelounge/pull/2715) by [@fnutt](https://github.com/fnutt))
- Remember disconnected networks between server restarts ([#2718](https://github.com/thelounge/thelounge/pull/2718) by [@xPaw](https://github.com/xPaw))
- Update emoji data for Emoji v11 ([#2735](https://github.com/thelounge/thelounge/pull/2735) by [@xPaw](https://github.com/xPaw))
- Enable underlines on links ([#2618](https://github.com/thelounge/thelounge/pull/2618), [#2790](https://github.com/thelounge/thelounge/pull/2790), [#2817](https://github.com/thelounge/thelounge/pull/2817) by [@xPaw](https://github.com/xPaw))
- Use `Date.toISOString` for logging ([#2787](https://github.com/thelounge/thelounge/pull/2787) by [@xPaw](https://github.com/xPaw))
- Add logging to all code paths in LDAP auth ([#2930](https://github.com/thelounge/thelounge/pull/2930) by [@xPaw](https://github.com/xPaw))
- Update production dependencies to their latest versions:
  - `irc-framework` ([#2097](https://github.com/thelounge/thelounge/pull/2097), [#2575](https://github.com/thelounge/thelounge/pull/2575), [#2648](https://github.com/thelounge/thelounge/pull/2648), [#2826](https://github.com/thelounge/thelounge/pull/2826), [#2981](https://github.com/thelounge/thelounge/pull/2981))
  - `web-push` ([#2112](https://github.com/thelounge/thelounge/pull/2112), [#2459](https://github.com/thelounge/thelounge/pull/2459), [#2579](https://github.com/thelounge/thelounge/pull/2579), [#2782](https://github.com/thelounge/thelounge/pull/2782))
  - `yarn` ([#2123](https://github.com/thelounge/thelounge/pull/2123), [#2126](https://github.com/thelounge/thelounge/pull/2126), [#2358](https://github.com/thelounge/thelounge/pull/2358), [#2465](https://github.com/thelounge/thelounge/pull/2465), [#2679](https://github.com/thelounge/thelounge/pull/2679), [#2688](https://github.com/thelounge/thelounge/pull/2688), [#2808](https://github.com/thelounge/thelounge/pull/2808), [#2885](https://github.com/thelounge/thelounge/pull/2885))
  - `chalk` ([#2156](https://github.com/thelounge/thelounge/pull/2156), [#2365](https://github.com/thelounge/thelounge/pull/2365))
  - `commander` ([#2169](https://github.com/thelounge/thelounge/pull/2169), [#2253](https://github.com/thelounge/thelounge/pull/2253), [#2606](https://github.com/thelounge/thelounge/pull/2606), [#2689](https://github.com/thelounge/thelounge/pull/2689), [#2694](https://github.com/thelounge/thelounge/pull/2694), [#2762](https://github.com/thelounge/thelounge/pull/2762), [#2836](https://github.com/thelounge/thelounge/pull/2836))
  - `request` ([#2202](https://github.com/thelounge/thelounge/pull/2202), [#2454](https://github.com/thelounge/thelounge/pull/2454), [#2698](https://github.com/thelounge/thelounge/pull/2698))
  - `sqlite3` ([#2238](https://github.com/thelounge/thelounge/pull/2238), [#2584](https://github.com/thelounge/thelounge/pull/2584), [#2651](https://github.com/thelounge/thelounge/pull/2651), [#2863](https://github.com/thelounge/thelounge/pull/2863), [#2894](https://github.com/thelounge/thelounge/pull/2894), [#2972](https://github.com/thelounge/thelounge/pull/2972))
  - `express` ([#2241](https://github.com/thelounge/thelounge/pull/2241), [#2844](https://github.com/thelounge/thelounge/pull/2844))
  - `socket.io` and `socketio-file-upload` ([#2310](https://github.com/thelounge/thelounge/pull/2310), [#2456](https://github.com/thelounge/thelounge/pull/2456), [#2911](https://github.com/thelounge/thelounge/pull/2911)),
    [#2832](https://github.com/thelounge/thelounge/pull/2832), [#2868](https://github.com/thelounge/thelounge/pull/2868))
  - `lodash` ([#2384](https://github.com/thelounge/thelounge/pull/2384), [#2772](https://github.com/thelounge/thelounge/pull/2772))
  - `fs-extra` ([#2410](https://github.com/thelounge/thelounge/pull/2410), [#2450](https://github.com/thelounge/thelounge/pull/2450), [#2654](https://github.com/thelounge/thelounge/pull/2654), [#2893](https://github.com/thelounge/thelounge/pull/2893))
  - `ua-parser-js` ([#2422](https://github.com/thelounge/thelounge/pull/2422), [#2873](https://github.com/thelounge/thelounge/pull/2873))
  - `package-json` ([#2461](https://github.com/thelounge/thelounge/pull/2461))
  - `filenamify` ([#2555](https://github.com/thelounge/thelounge/pull/2555))
  - `uuid` ([#2596](https://github.com/thelounge/thelounge/pull/2596), [#2605](https://github.com/thelounge/thelounge/pull/2605))
  - `mime-types` ([#2659](https://github.com/thelounge/thelounge/pull/2659), [#2722](https://github.com/thelounge/thelounge/pull/2722), [#2857](https://github.com/thelounge/thelounge/pull/2857))
  - `semver` ([#2703](https://github.com/thelounge/thelounge/pull/2703), [#2843](https://github.com/thelounge/thelounge/pull/2843), [#2871](https://github.com/thelounge/thelounge/pull/2871))
  - `file-type` ([#2833](https://github.com/thelounge/thelounge/pull/2833), [#2861](https://github.com/thelounge/thelounge/pull/2861), [#2878](https://github.com/thelounge/thelounge/pull/2878), [#2897](https://github.com/thelounge/thelounge/pull/2897), [#2914](https://github.com/thelounge/thelounge/pull/2914))
  - `linkify-it` ([#2908](https://github.com/thelounge/thelounge/pull/2908))

### Deprecated

- Warn about old config folder ([#2144](https://github.com/thelounge/thelounge/pull/2144) by [@xPaw](https://github.com/xPaw))

### Removed

- Switch to Node v6 as the minimal supported version ([#1727](https://github.com/thelounge/thelounge/pull/1727) by [@astorije](https://github.com/astorije), [#2907](https://github.com/thelounge/thelounge/pull/2907) by [@xPaw](https://github.com/xPaw))
- Remove autoload deprecation notice ([#1728](https://github.com/thelounge/thelounge/pull/1728) by [@astorije](https://github.com/astorije))
- Remove deprecated support for `debug` as a boolean in the configuration file ([#1729](https://github.com/thelounge/thelounge/pull/1729) by [@astorije](https://github.com/astorije))
- Remove deprecated support for the `--home` option and `$LOUNGE_HOME` environment variable ([#1733](https://github.com/thelounge/thelounge/pull/1733) by [@astorije](https://github.com/astorije))
- Get rid of `Object.assign` polyfill ([#1760](https://github.com/thelounge/thelounge/pull/1760) by [@astorije](https://github.com/astorije))
- Remove deprecated options for `thelounge start` ([#1834](https://github.com/thelounge/thelounge/pull/1834) by [@astorije](https://github.com/astorije))
- Remove session token hash conversion ([#1966](https://github.com/thelounge/thelounge/pull/1966) by [@xPaw](https://github.com/xPaw))
- Remove deprecated support for CSS filenames in theme configuration ([#1730](https://github.com/thelounge/thelounge/pull/1730) by [@astorije](https://github.com/astorije))
- Remove support for the `lounge` CLI (which was replaced with `thelounge`) ([#2077](https://github.com/thelounge/thelounge/pull/2077) by [@astorije](https://github.com/astorije))
- Remove `thelounge config` from the CLI ([#2196](https://github.com/thelounge/thelounge/pull/2196) by [@astorije](https://github.com/astorije))
- Remove nick editor ([#2337](https://github.com/thelounge/thelounge/pull/2337) by [@xPaw](https://github.com/xPaw))
- Remove ability to change date format and timezone ([#2506](https://github.com/thelounge/thelounge/pull/2506) by [@xPaw](https://github.com/xPaw))

### Fixed

- Fix CTCP commands always sent upper-case ([#1927](https://github.com/thelounge/thelounge/pull/1927) by [@astorije](https://github.com/astorije))
- Rewrite CTCP handling ([#1928](https://github.com/thelounge/thelounge/pull/1928) by [@xPaw](https://github.com/xPaw))
- Send empty banlist error to lobby for channels user is not in ([#2095](https://github.com/thelounge/thelounge/pull/2095) by [@xPaw](https://github.com/xPaw))
- Change `wsEngine` to `ws` ([#2099](https://github.com/thelounge/thelounge/pull/2099) by [@xPaw](https://github.com/xPaw))
- Fix `log.warn` in LDAP ([#2106](https://github.com/thelounge/thelounge/pull/2106) by [@xPaw](https://github.com/xPaw))
- Always correctly trigger sticky scroll on `.chat` container ([#2107](https://github.com/thelounge/thelounge/pull/2107) by [@xPaw](https://github.com/xPaw))
- Fix "rendering..." getting stuck on first connection ([#2109](https://github.com/thelounge/thelounge/pull/2109) by [@xPaw](https://github.com/xPaw))
- Change "Leave" button tooltip to correspond with right click context menu ([#2115](https://github.com/thelounge/thelounge/pull/2115) by [@fnutt](https://github.com/fnutt))
- Revert "Allow scaling the page" ([#2122](https://github.com/thelounge/thelounge/pull/2122) by [@astorije](https://github.com/astorije))
- Set channel state to joined when channel already exists ([#2142](https://github.com/thelounge/thelounge/pull/2142) by [@xPaw](https://github.com/xPaw))
- Do not crash when user file can not be read or written ([#2143](https://github.com/thelounge/thelounge/pull/2143) by [@xPaw](https://github.com/xPaw))
- Cleanup chat/userlist to use flexbox, fix a couple of bugs ([#2150](https://github.com/thelounge/thelounge/pull/2150), [#2160](https://github.com/thelounge/thelounge/pull/2160) by [@xPaw](https://github.com/xPaw))
- Fix default ECDH curve for better compatibility ([#2159](https://github.com/thelounge/thelounge/pull/2159), [#2163](https://github.com/thelounge/thelounge/pull/2163) by [@xPaw](https://github.com/xPaw))
- Do not listen to touch events until client is initialized ([#2158](https://github.com/thelounge/thelounge/pull/2158) by [@xPaw](https://github.com/xPaw))
- Normalize unicode URLs in link prefetcher ([#2171](https://github.com/thelounge/thelounge/pull/2171) by [@xPaw](https://github.com/xPaw))
- Fix background color when hovering users in user list (darker themes) ([#2172](https://github.com/thelounge/thelounge/pull/2172) by [@williamboman](https://github.com/williamboman))
- Always hide horizontal overflow in chat ([#2177](https://github.com/thelounge/thelounge/pull/2177) by [@xPaw](https://github.com/xPaw))
- Do not include colon in push message for actions ([#2179](https://github.com/thelounge/thelounge/pull/2179) by [@xPaw](https://github.com/xPaw))
- Do not crash when `awayMessage` is set but IRC connection does not exist ([#2181](https://github.com/thelounge/thelounge/pull/2181) by [@xPaw](https://github.com/xPaw))
- Remove `contain` as it's causing rendering issues ([#2182](https://github.com/thelounge/thelounge/pull/2182) by [@xPaw](https://github.com/xPaw))
- Allow overriding arrays in config, warn about incorrect types ([#2189](https://github.com/thelounge/thelounge/pull/2189) by [@xPaw](https://github.com/xPaw))
- Don't access `Notification` if the browser does not support it ([#2192](https://github.com/thelounge/thelounge/pull/2192) by [@creesch](https://github.com/creesch))
- Do not repaint theme on page load ([#2213](https://github.com/thelounge/thelounge/pull/2213) by [@xPaw](https://github.com/xPaw))
- Fix some URLs not being sent as-is to the client ([#2217](https://github.com/thelounge/thelounge/pull/2217) by [@xPaw](https://github.com/xPaw))
- Send hexip in ident responses ([#2237](https://github.com/thelounge/thelounge/pull/2237) by [@xPaw](https://github.com/xPaw))
- Rework how unread marker is moved when status messages are hidden ([#2236](https://github.com/thelounge/thelounge/pull/2236) by [@xPaw](https://github.com/xPaw))
- Fix incorrect spelling ([#2243](https://github.com/thelounge/thelounge/pull/2243) by [@birkof](https://github.com/birkof))
- Support strikethrough and underline at same time ([#2248](https://github.com/thelounge/thelounge/pull/2248) by [@MaxLeiter](https://github.com/MaxLeiter))
- Render video and audio previews only after `canplay` event fires ([#2251](https://github.com/thelounge/thelounge/pull/2251) by [@xPaw](https://github.com/xPaw))
- Stop propagation, prevent input history call when `alt` is involved ([#2262](https://github.com/thelounge/thelounge/pull/2262) by [@realies](https://github.com/realies))
- Scroll channel list only when using keybinds ([#2259](https://github.com/thelounge/thelounge/pull/2259) by [@xPaw](https://github.com/xPaw))
- Fix order in oidentd file ([#2273](https://github.com/thelounge/thelounge/pull/2273) by [@xPaw](https://github.com/xPaw))
- Hide autocompletion menu when input is submitted ([#2284](https://github.com/thelounge/thelounge/pull/2284) by [@xPaw](https://github.com/xPaw))
- Send `Accept` header when fetching links ([#2287](https://github.com/thelounge/thelounge/pull/2287) by [@xPaw](https://github.com/xPaw))
- Fix/Improve some nick fallbacks ([#2297](https://github.com/thelounge/thelounge/pull/2297) by [@astorije](https://github.com/astorije))
- Remove left padding from sidebar in example theme ([#2309](https://github.com/thelounge/thelounge/pull/2309) by [@xPaw](https://github.com/xPaw))
- Fix line-height showing scrollbar on mobile ([#2331](https://github.com/thelounge/thelounge/pull/2331) by [@xPaw](https://github.com/xPaw))
- Prevent `undefined` OS version in session list ([#2340](https://github.com/thelounge/thelounge/pull/2340) by [@dgw](https://github.com/dgw))
- Enable sync on empty local storage, force sync, sync on both load and reconnect ([#2317](https://github.com/thelounge/thelounge/pull/2317) by [@creesch](https://github.com/creesch), [#2544](https://github.com/thelounge/thelounge/pull/2544) by [@xPaw](https://github.com/xPaw))
- Fix nicks with special characters being colored incorrectly in messages ([#2363](https://github.com/thelounge/thelounge/pull/2363) by [@xPaw](https://github.com/xPaw))
- Quick-fix tooltips not being loaded by Webpack ([#2367](https://github.com/thelounge/thelounge/pull/2367) by [@astorije](https://github.com/astorije))
- Fix user list scroll area expanding behind the message input on mobile ([#2364](https://github.com/thelounge/thelounge/pull/2364) by [@astorije](https://github.com/astorije))
- Fix your own nick in auto completion ([#2381](https://github.com/thelounge/thelounge/pull/2381) by [@xPaw](https://github.com/xPaw))
- Make a separate function to execute yarn commands; fallback to global yarn ([#2385](https://github.com/thelounge/thelounge/pull/2385) by [@xPaw](https://github.com/xPaw))
- Fix join channel UI moving when sorting channels ([#2404](https://github.com/thelounge/thelounge/pull/2404) by [@xPaw](https://github.com/xPaw))
- Fix CSS issues in Microsoft Edge ([#2409](https://github.com/thelounge/thelounge/pull/2409) by [@xPaw](https://github.com/xPaw))
- Add prefix to channels from connect window ([#2378](https://github.com/thelounge/thelounge/pull/2378) by [@xPaw](https://github.com/xPaw))
- Specify `parseInt` base in `respondToIdent` ([#2439](https://github.com/thelounge/thelounge/pull/2439) by [@xPaw](https://github.com/xPaw))
- Pointer cursor hovering nicks in user list ([#2445](https://github.com/thelounge/thelounge/pull/2445) by [@MaxLeiter](https://github.com/MaxLeiter))
- Show connect window when last network is removed ([#2480](https://github.com/thelounge/thelounge/pull/2480) by [@xPaw](https://github.com/xPaw))
- Fix being unable to click channel link in chan after being kicked ([#2482](https://github.com/thelounge/thelounge/pull/2482) by [@Jay2k1](https://github.com/Jay2k1))
- Prevent long lobby names pushing badges out of sidebar ([#2503](https://github.com/thelounge/thelounge/pull/2503) by [@dgw](https://github.com/dgw))
- Do not mark your nick changes as self in each channel ([#2505](https://github.com/thelounge/thelounge/pull/2505) by [@xPaw](https://github.com/xPaw))
- If a preview fails to load, remove the link from msg object ([#2504](https://github.com/thelounge/thelounge/pull/2504) by [@xPaw](https://github.com/xPaw))
- Fix `/away` not setting you away ([#2524](https://github.com/thelounge/thelounge/pull/2524) by [@xPaw](https://github.com/xPaw))
- Use `http:` for protocol-less URLs ([#2532](https://github.com/thelounge/thelounge/pull/2532) by [@benharri](https://github.com/benharri))
- Fix word boundary in the custom highlights regex not matching unicode ([#2534](https://github.com/thelounge/thelounge/pull/2534) by [@McInkay](https://github.com/McInkay))
- Fix multiple `<title>` tags being concatenated ([#2543](https://github.com/thelounge/thelounge/pull/2543) by [@xPaw](https://github.com/xPaw))
- Synchronize number of highlighted messages to client ([#2547](https://github.com/thelounge/thelounge/pull/2547) by [@xPaw](https://github.com/xPaw))
- Log notices as correct sender when it will be shown in active window ([#2550](https://github.com/thelounge/thelounge/pull/2550) by [@xPaw](https://github.com/xPaw))
- Do not remove date marker when loading history if date changes ([#2567](https://github.com/thelounge/thelounge/pull/2567) by [@xPaw](https://github.com/xPaw))
- Reset highlights on self messages; update title when other client opens a channel ([#2580](https://github.com/thelounge/thelounge/pull/2580) by [@xPaw](https://github.com/xPaw))
- Fix text not having enough space in `<select>` with some fonts ([#2548](https://github.com/thelounge/thelounge/pull/2548) by [@xPaw](https://github.com/xPaw))
- Name close button text on channels "Leave" and keep "Close" for other types ([#2593](https://github.com/thelounge/thelounge/pull/2593) by [@MaxLeiter](https://github.com/MaxLeiter))
- Disable username auto-capitalization on login form input field ([#2617](https://github.com/thelounge/thelounge/pull/2617) by [@fnutt](https://github.com/fnutt))
- Make user list state consistent on mobile and desktop ([#2599](https://github.com/thelounge/thelounge/pull/2599) by [@xPaw](https://github.com/xPaw))
- Fix incorrect target in connect/disconnect context menu ([#2626](https://github.com/thelounge/thelounge/pull/2626) by [@xPaw](https://github.com/xPaw))
- Stop handling CTCP messages if the sender/target is ignored ([#2609](https://github.com/thelounge/thelounge/pull/2609) by [@RockyTV](https://github.com/RockyTV))
- Fix disabling autocomplete and fix completing special channels ([#2630](https://github.com/thelounge/thelounge/pull/2630) by [@xPaw](https://github.com/xPaw))
- Remove extra closing tag ([#2639](https://github.com/thelounge/thelounge/pull/2639) by [@xPaw](https://github.com/xPaw))
- Do not write `/list` messages to logs ([#2637](https://github.com/thelounge/thelounge/pull/2637) by [@xPaw](https://github.com/xPaw))
- Fix ignore list resetting on server restart ([#2640](https://github.com/thelounge/thelounge/pull/2640) by [@xPaw](https://github.com/xPaw))
- Change alert sound from OGG to WAV ([#2655](https://github.com/thelounge/thelounge/pull/2655) by [@realies](https://github.com/realies))
- Fix IRC modifiers not working with caps lock ([#2677](https://github.com/thelounge/thelounge/pull/2677) by [@xPaw](https://github.com/xPaw))
- Fix bugs with URL overrides in Connect window ([#2702](https://github.com/thelounge/thelounge/pull/2702) by [@astorije](https://github.com/astorije))
- Hide `Native App` settings section when no items are available ([#2705](https://github.com/thelounge/thelounge/pull/2705) by [@MaxLeiter](https://github.com/MaxLeiter))
- Fix displaying away message multiple times in query windows ([#2721](https://github.com/thelounge/thelounge/pull/2721) by [@xPaw](https://github.com/xPaw))
- Make sure data is an object ([#2730](https://github.com/thelounge/thelounge/pull/2730) by [@xPaw](https://github.com/xPaw))
- Drop `spdy` module in favor of native `https` module ([#2732](https://github.com/thelounge/thelounge/pull/2732) by [@xPaw](https://github.com/xPaw))
- Enforce lobby to be the 0th channel when sorting ([#2733](https://github.com/thelounge/thelounge/pull/2733) by [@xPaw](https://github.com/xPaw))
- Add `try`/`catch` to `localStorage` methods ([#2701](https://github.com/thelounge/thelounge/pull/2701) by [@adamus1red](https://github.com/adamus1red))
- Fix passwords not being saved in Firefox ([#2741](https://github.com/thelounge/thelounge/pull/2741) by [@xPaw](https://github.com/xPaw))
- Add 3 commands that were missing on client autocomplete ([#2756](https://github.com/thelounge/thelounge/pull/2756) by [@McInkay](https://github.com/McInkay))
- Fix fullscreen mode for videos ([#2775](https://github.com/thelounge/thelounge/pull/2775) by [@richrd](https://github.com/richrd))
- Fix issues in regards to ignoring your own nickname ([#2795](https://github.com/thelounge/thelounge/pull/2795) by [@xPaw](https://github.com/xPaw))
- Fix extra padding in condensed messages on mobile ([#2798](https://github.com/thelounge/thelounge/pull/2798) by [@xPaw](https://github.com/xPaw))
- Fix stored image previews not being dereferenced ([#2824](https://github.com/thelounge/thelounge/pull/2824) by [@xPaw](https://github.com/xPaw))
- Make sure registered command is actually a function ([#2848](https://github.com/thelounge/thelounge/pull/2848) by [@xPaw](https://github.com/xPaw))
- Use `hasOwnProperty` when checking for webirc ([#2849](https://github.com/thelounge/thelounge/pull/2849) by [@xPaw](https://github.com/xPaw))
- Hard limit nicks to 100 characters, add maxlength on connect inputs ([#2858](https://github.com/thelounge/thelounge/pull/2858) by [@xPaw](https://github.com/xPaw))
- Fix timing issue crashing on `undefined` when setting `openChannel` ([#2859](https://github.com/thelounge/thelounge/pull/2859) by [@xPaw](https://github.com/xPaw))
- Serve requests from cache when server responds with non 2xx response ([#2973](https://github.com/thelounge/thelounge/pull/2973) by [@xPaw](https://github.com/xPaw))
- Add fallback IP address for unix sockets ([#2967](https://github.com/thelounge/thelounge/pull/2967) by [@xPaw](https://github.com/xPaw))
- Don't fallback to `host` in identd server ([#2958](https://github.com/thelounge/thelounge/pull/2958) by [@xPaw](https://github.com/xPaw))
- Fix `.active` styles incorrectly applying to hovered users in userlist ([#2975](https://github.com/thelounge/thelounge/pull/2975) by [@xPaw](https://github.com/xPaw))
- Empty storage directory after destroying all channels ([#2937](https://github.com/thelounge/thelounge/pull/2937) by [@xPaw](https://github.com/xPaw))
- Add an extra check for setting names ([#2977](https://github.com/thelounge/thelounge/pull/2977) by [@xPaw](https://github.com/xPaw))
- Fix highlight styles not applying to notices and actions ([#2980](https://github.com/thelounge/thelounge/pull/2980) by [@xPaw](https://github.com/xPaw))
- Set yarn cache folder in the packages folder ([#2979](https://github.com/thelounge/thelounge/pull/2979) by [@xPaw](https://github.com/xPaw))

### Security

- Sync network status and security to client UI ([#2049](https://github.com/thelounge/thelounge/pull/2049) by [@xPaw](https://github.com/xPaw))
- Consider localhost connections secure ([#2081](https://github.com/thelounge/thelounge/pull/2081) by [@xPaw](https://github.com/xPaw))
- Ignore events on the server if incorrect data is supplied ([#2088](https://github.com/thelounge/thelounge/pull/2088) by [@xPaw](https://github.com/xPaw))
- Allow setting `rejectUnauthorized` per network ([#2075](https://github.com/thelounge/thelounge/pull/2075), [#2154](https://github.com/thelounge/thelounge/pull/2154) by [@xPaw](https://github.com/xPaw))
- Print failed login attempts to console ([#2247](https://github.com/thelounge/thelounge/pull/2247) by [@xPaw](https://github.com/xPaw))
- Empty local storage on sign out and move the sign out button to the settings ([#2254](https://github.com/thelounge/thelounge/pull/2254) by [@astorije](https://github.com/astorije))
- Use `attr()` on user-controlled data ([#2398](https://github.com/thelounge/thelounge/pull/2398), [#2406](https://github.com/thelounge/thelounge/pull/2406) by [@xPaw](https://github.com/xPaw))

### Documentation

In the main repository:

- Replace reference to website with new URL ([#1980](https://github.com/thelounge/thelounge/pull/1980) by [@astorije](https://github.com/astorije))
- Improve the README ([#2003](https://github.com/thelounge/thelounge/pull/2003), [#2085](https://github.com/thelounge/thelounge/pull/2085), [#2086](https://github.com/thelounge/thelounge/pull/2086), [#2121](https://github.com/thelounge/thelounge/pull/2121), [#2891](https://github.com/thelounge/thelounge/pull/2891) by [@astorije](https://github.com/astorije), [#2535](https://github.com/thelounge/thelounge/pull/2535), [#2737](https://github.com/thelounge/thelounge/pull/2737), [#2883](https://github.com/thelounge/thelounge/pull/2883), [#2890](https://github.com/thelounge/thelounge/pull/2890), [#2902](https://github.com/thelounge/thelounge/pull/2902) by [@xPaw](https://github.com/xPaw))
- Switch from npm to yarn ([#1987](https://github.com/thelounge/thelounge/pull/1987) by [@xPaw](https://github.com/xPaw), [#2664](https://github.com/thelounge/thelounge/pull/2664) by [@fnutt](https://github.com/fnutt), [#2303](https://github.com/thelounge/thelounge/pull/2303) by [@benharri](https://github.com/benharri))
- Back to `help wanted` label ([#2102](https://github.com/thelounge/thelounge/pull/2102) by [@xPaw](https://github.com/xPaw))
- Remove `mailto:` part of security email address ([#2201](https://github.com/thelounge/thelounge/pull/2201) by [@astorije](https://github.com/astorije))
- Improve readability and styling of shortcut keys in the Help section ([#2221](https://github.com/thelounge/thelounge/pull/2221) by [@astorije](https://github.com/astorije))
- Fix typo in CTCP request ([#2255](https://github.com/thelounge/thelounge/pull/2255) by [@MaxLeiter](https://github.com/MaxLeiter))
- Create issue templates ([#2274](https://github.com/thelounge/thelounge/pull/2274) by [@xPaw](https://github.com/xPaw), [#2604](https://github.com/thelounge/thelounge/pull/2604) by [@Zarthus](https://github.com/Zarthus))
- Document npm's `--unsafe-perm` option ([#2379](https://github.com/thelounge/thelounge/pull/2379) by [@xPaw](https://github.com/xPaw))
- Move GitHub-related files to `.github` folder ([#2603](https://github.com/thelounge/thelounge/pull/2603), [#2608](https://github.com/thelounge/thelounge/pull/2608) by [@Zarthus](https://github.com/Zarthus), [#2621](https://github.com/thelounge/thelounge/pull/2621) by [@richrd](https://github.com/richrd))
- Clarify `/topic` command in the Help page when sent without a new topic ([#2595](https://github.com/thelounge/thelounge/pull/2595) by [@joandrsn](https://github.com/joandrsn))
- Improve inline documentation of config defaults and use it to generate website counterpart ([#2645](https://github.com/thelounge/thelounge/pull/2645) by [@astorije](https://github.com/astorije), [#2882](https://github.com/thelounge/thelounge/pull/2882), [#2901](https://github.com/thelounge/thelounge/pull/2901) by [@xPaw](https://github.com/xPaw), [#2915](https://github.com/thelounge/thelounge/pull/2915) by [@MaxLeiter](https://github.com/MaxLeiter))
- Only generate entries for commits/PRs that do not already exist in the CHANGELOG upon re-generation ([#2961](https://github.com/thelounge/thelounge/pull/2961) by [@astorije](https://github.com/astorije))
- List website contributors as well when generating changelog entries ([#2970](https://github.com/thelounge/thelounge/pull/2970) by [@astorije](https://github.com/astorije))
- Make sure the changelog page is selectable, e.g. for copy-pasting commands ([#2984](https://github.com/thelounge/thelounge/pull/2984) by [@astorije](https://github.com/astorije))

On the [website repository](https://github.com/thelounge/thelounge.github.io):

- Create CNAME ([`c8cfda5`](https://github.com/thelounge/thelounge.github.io/commit/c8cfda5a31aa16e47a0a316ed15b0bf024b6b297) by [@xPaw](https://github.com/xPaw))
- Re-name "User support" header ([#77](https://github.com/thelounge/thelounge.github.io/pull/77) by [@MaxLeiter](https://github.com/MaxLeiter))
- Set up Gemfile and fix GitHub star counter ([#78](https://github.com/thelounge/thelounge.github.io/pull/78) by [@astorije](https://github.com/astorije))
- Add all assets related to the logos ([#76](https://github.com/thelounge/thelounge.github.io/pull/76) by [@astorije](https://github.com/astorije), [#79](https://github.com/thelounge/thelounge.github.io/pull/79), ([#80](https://github.com/thelounge/thelounge.github.io/pull/80) by [@Mandihamza](https://github.com/Mandihamza))
- Upgrade jQuery from v2.1.1 to v3.3.1 ([#88](https://github.com/thelounge/thelounge.github.io/pull/88) by [@astorije](https://github.com/astorije))
- Enable code formatting in titles and increase a bit code font size ([#89](https://github.com/thelounge/thelounge.github.io/pull/89) by [@astorije](https://github.com/astorije))
- Set HTML `lang` attribute to help screen readers ([#90](https://github.com/thelounge/thelounge.github.io/pull/90) by [@astorije](https://github.com/astorije))
- Switch `redcarpet` engine to `kramdown` ([#91](https://github.com/thelounge/thelounge.github.io/pull/91) by [@astorije](https://github.com/astorije))
- Add new logo as favicon, remove redundant link tags, add and rename favicon assets ([#98](https://github.com/thelounge/thelounge.github.io/pull/98) by [@astorije](https://github.com/astorije))
- Update dependencies to suppress a GitHub security warning, and pin their version ([#93](https://github.com/thelounge/thelounge.github.io/pull/93) by [@astorije](https://github.com/astorije))
- Improve markup, reduce height of navbar, use GitHub logo, add a link to themes ([#95](https://github.com/thelounge/thelounge.github.io/pull/95) by [@astorije](https://github.com/astorije))
- Remove various unnecessary pieces of the website/documentation ([#94](https://github.com/thelounge/thelounge.github.io/pull/94) by [@astorije](https://github.com/astorije))
- Add anchor links to `h2` and `h3` headers ([#99](https://github.com/thelounge/thelounge.github.io/pull/99) by [@astorije](https://github.com/astorije))
- Upgrade Font Awesome from 4 to 5 ([#100](https://github.com/thelounge/thelounge.github.io/pull/100) by [@astorije](https://github.com/astorije))
- Update Bootstrap to be able to use collapsible components (for navigation) and minify it ([#102](https://github.com/thelounge/thelounge.github.io/pull/102) by [@astorije](https://github.com/astorije))
- Search feature ([#101](https://github.com/thelounge/thelounge.github.io/pull/101) by [@astorije](https://github.com/astorije), [#185](https://github.com/thelounge/thelounge.github.io/pull/185) by [@xPaw](https://github.com/xPaw))
- Make `16px` favicon sharper ([#105](https://github.com/thelounge/thelounge.github.io/pull/105) by [@xPaw](https://github.com/xPaw))
- Add security headers ([#107](https://github.com/thelounge/thelounge.github.io/pull/107) by [@xPaw](https://github.com/xPaw))
- Use Muli font for the site ([#106](https://github.com/thelounge/thelounge.github.io/pull/106) by [@xPaw](https://github.com/xPaw))
- Rewrite install docs ([#104](https://github.com/thelounge/thelounge.github.io/pull/104) by [@astorije](https://github.com/astorije), [#191](https://github.com/thelounge/thelounge.github.io/pull/191) by [@GewoonYorick](https://github.com/GewoonYorick))
- Update configuration doc with the config generated from the main repo (to master) ([#109](https://github.com/thelounge/thelounge.github.io/pull/109), [`abc0aba`](https://github.com/thelounge/thelounge.github.io/commit/abc0aba03b3d562c163b1a3eff0ee0195f7935ef) by [@xPaw](https://github.com/xPaw), [#184](https://github.com/thelounge/thelounge.github.io/pull/184) by [@MaxLeiter](https://github.com/MaxLeiter))
- Use apt to install on Debian/Ubuntu ([#110](https://github.com/thelounge/thelounge.github.io/pull/110) by [@benharri](https://github.com/benharri))
- Structure doc navigation, use Netlify for redirects ([#111](https://github.com/thelounge/thelounge.github.io/pull/111), [#127](https://github.com/thelounge/thelounge.github.io/pull/127) by [@astorije](https://github.com/astorije), [`7d292de`](https://github.com/thelounge/thelounge.github.io/commit/7d292de970303f257e8304179a6affa8d0de4fb9), [#181](https://github.com/thelounge/thelounge.github.io/pull/181) by [@xPaw](https://github.com/xPaw))
- Prevent font flashing ([#112](https://github.com/thelounge/thelounge.github.io/pull/112) by [@astorije](https://github.com/astorije))
- Make demo link a bigger target ([#114](https://github.com/thelounge/thelounge.github.io/pull/114) by [@xPaw](https://github.com/xPaw))
- Create `robots.txt` ([#115](https://github.com/thelounge/thelounge.github.io/pull/115) by [@xPaw](https://github.com/xPaw))
- Set up the stage for upcoming guides ([#117](https://github.com/thelounge/thelounge.github.io/pull/117) by [@astorije](https://github.com/astorije))
- Re-write documentation about server usage (and replace `--home` with `THELOUNGE_HOME`) ([#116](https://github.com/thelounge/thelounge.github.io/pull/116) by [@astorije](https://github.com/astorije), [`3435c87`](https://github.com/thelounge/thelounge.github.io/commit/3435c87b9937ce3153607915f4dcfb6dffd13f53), [`3ff6d09`](https://github.com/thelounge/thelounge.github.io/commit/3ff6d091e082457ac5e5f9816d415e4dc346da61), [#141](https://github.com/thelounge/thelounge.github.io/pull/141) by [@xPaw](https://github.com/xPaw))
- Add syntax highlighting ([#120](https://github.com/thelounge/thelounge.github.io/pull/120) by [@astorije](https://github.com/astorije))
- Document user management in The Lounge ([#118](https://github.com/thelounge/thelounge.github.io/pull/118) by [@astorije](https://github.com/astorije))
- Add a guide about reverse proxies ([#119](https://github.com/thelounge/thelounge.github.io/pull/119) by [@astorije](https://github.com/astorije), [#182](https://github.com/thelounge/thelounge.github.io/pull/182), [#186](https://github.com/thelounge/thelounge.github.io/pull/186), [#189](https://github.com/thelounge/thelounge.github.io/pull/189) by [@xPaw](https://github.com/xPaw))
- Add a guide about HTTPS using the built-in server ([#121](https://github.com/thelounge/thelounge.github.io/pull/121) by [@astorije](https://github.com/astorije))
- Add a guide about URL overrides ([#123](https://github.com/thelounge/thelounge.github.io/pull/123) by [@astorije](https://github.com/astorije))
- Add an introduction page for the doc ([#126](https://github.com/thelounge/thelounge.github.io/pull/126) by [@astorije](https://github.com/astorije))
- Add a very high-level overview of CTCP in guides ([#122](https://github.com/thelounge/thelounge.github.io/pull/122) by [@astorije](https://github.com/astorije), [#194](https://github.com/thelounge/thelounge.github.io/pull/194) by [@Jay2k1](https://github.com/Jay2k1))
- Update features on main page to be the same as main repo README ([#113](https://github.com/thelounge/thelounge.github.io/pull/113) by [@xPaw](https://github.com/xPaw))
- Move theme authoring information to new doc structure ([#128](https://github.com/thelounge/thelounge.github.io/pull/128) by [@astorije](https://github.com/astorije))
- Add preload to HSTS ([#129](https://github.com/thelounge/thelounge.github.io/pull/129) by [@xPaw](https://github.com/xPaw))
- Fixes ([#130](https://github.com/thelounge/thelounge.github.io/pull/130) by [@astorije](https://github.com/astorije))
- Add a guide for custom CSS ([#125](https://github.com/thelounge/thelounge.github.io/pull/125) by [@astorije](https://github.com/astorije))
- API reference ([#131](https://github.com/thelounge/thelounge.github.io/pull/131) by [@astorije](https://github.com/astorije))
- Add a table of contents where necessary ([#132](https://github.com/thelounge/thelounge.github.io/pull/132) by [@astorije](https://github.com/astorije))
- Do not markdownify titles as it wraps them in paragraph ([#133](https://github.com/thelounge/thelounge.github.io/pull/133) by [@astorije](https://github.com/astorije))
- Add an "Edit this page" button to docs pages ([#134](https://github.com/thelounge/thelounge.github.io/pull/134) by [@astorije](https://github.com/astorije))
- Make internal links extension-less and fix a few links ([#135](https://github.com/thelounge/thelounge.github.io/pull/135) by [@astorije](https://github.com/astorije))
- Add an upgrade guide and extract abbreviations into a shared file ([#136](https://github.com/thelounge/thelounge.github.io/pull/136) by [@astorije](https://github.com/astorije), [`52df65c`](https://github.com/thelounge/thelounge.github.io/commit/52df65c85adba44b502cdaac9dfee14ef2f7acc6) by [@xPaw](https://github.com/xPaw))
- Update the index page to not contain npm only instructions, add screenshot, and update colors to match branding ([#137](https://github.com/thelounge/thelounge.github.io/pull/137) by [@astorije](https://github.com/astorije))
- App screenshot ([`8020290`](https://github.com/thelounge/thelounge.github.io/commit/8020290d79db2b86317fff5131efe7f282f8172f), [`d10cf1f`](https://github.com/thelounge/thelounge.github.io/commit/d10cf1fc9844c69e8cdd81b1cdcb680603594f25) by [@xPaw](https://github.com/xPaw))
- Make footer more readable, change text, remove Twitter button (#142) ([`2c6c137`](https://github.com/thelounge/thelounge.github.io/commit/2c6c1374344537b4ccfdac37a7b1527882ce5908) by [@xPaw](https://github.com/xPaw))
- Make navigation usable on mobile ([#139](https://github.com/thelounge/thelounge.github.io/pull/139) by [@astorije](https://github.com/astorije))
- Fix `ldapFilter` overflowing on mobile ([#151](https://github.com/thelounge/thelounge.github.io/pull/151) by [@xPaw](https://github.com/xPaw))
- Remove leftover images ([#154](https://github.com/thelounge/thelounge.github.io/pull/154) by [@astorije](https://github.com/astorije))
- Set some `meta` tags ([#152](https://github.com/thelounge/thelounge.github.io/pull/152) by [@xPaw](https://github.com/xPaw))
- Improve links on alerts ([#157](https://github.com/thelounge/thelounge.github.io/pull/157) by [@astorije](https://github.com/astorije))
- Replace `~` with `${THELOUNGE_HOME}` in upgrade guide ([#155](https://github.com/thelounge/thelounge.github.io/pull/155) by [@astorije](https://github.com/astorije))
- Load search data asynchronously ([#159](https://github.com/thelounge/thelounge.github.io/pull/159) by [@xPaw](https://github.com/xPaw))
- Use `page.description` if available ([#161](https://github.com/thelounge/thelounge.github.io/pull/161) by [@xPaw](https://github.com/xPaw))
- Replace `bootstrap.js` with vanilla JS ([#144](https://github.com/thelounge/thelounge.github.io/pull/144) by [@xPaw](https://github.com/xPaw))
- Use SVG icons ([#162](https://github.com/thelounge/thelounge.github.io/pull/162) by [@xPaw](https://github.com/xPaw))
- Add a Community page ([#138](https://github.com/thelounge/thelounge.github.io/pull/138) by [@astorije](https://github.com/astorije))
- Mark guides/API links active when in sub pages ([#163](https://github.com/thelounge/thelounge.github.io/pull/163) by [@xPaw](https://github.com/xPaw))
- Use SVG logos for app stores ([#166](https://github.com/thelounge/thelounge.github.io/pull/166) by [@xPaw](https://github.com/xPaw))
- Align footer button with the text, remove deprecated `iframe` attributes ([#160](https://github.com/thelounge/thelounge.github.io/pull/160) by [@xPaw](https://github.com/xPaw))
- Community: Add an IRC channel for Scandinavian countries ([#171](https://github.com/thelounge/thelounge.github.io/pull/171) by [@astorije](https://github.com/astorije))
- Allow page to be scaled ([#170](https://github.com/thelounge/thelounge.github.io/pull/170) by [@xPaw](https://github.com/xPaw))
- Prevent redirect from `/docs` to `/docs/` ([#169](https://github.com/thelounge/thelounge.github.io/pull/169) by [@astorije](https://github.com/astorije))
- Fix sitemap, docs redirect, extension hackery, active style in navbar, etc. ([#173](https://github.com/thelounge/thelounge.github.io/pull/173) by [@astorije](https://github.com/astorije))
- Warn about API instability ([#174](https://github.com/thelounge/thelounge.github.io/pull/174) by [@xPaw](https://github.com/xPaw))
- Kill the Heroku docs ([#143](https://github.com/thelounge/thelounge.github.io/pull/143), [#177](https://github.com/thelounge/thelounge.github.io/pull/177) by [@astorije](https://github.com/astorije))
- Fix `/docs` highlighted as active incorrectly ([#178](https://github.com/thelounge/thelounge.github.io/pull/178) by [@xPaw](https://github.com/xPaw))
- Do not link to language-specific URL of Yarn to let them redirect to the correct language ([#180](https://github.com/thelounge/thelounge.github.io/pull/180) by [@astorije](https://github.com/astorije))
- Disallow robots in non-production ([#175](https://github.com/thelounge/thelounge.github.io/pull/175) by [@xPaw](https://github.com/xPaw))
- Add very minimal Google Analytics script ([#187](https://github.com/thelounge/thelounge.github.io/pull/187), [#188](https://github.com/thelounge/thelounge.github.io/pull/188), [`2f83b05`](https://github.com/thelounge/thelounge.github.io/commit/2f83b052746f7981359aa431e5d95b7bd1e84c92) by [@xPaw](https://github.com/xPaw))
- Don't add canonical tag for 404 pages ([#190](https://github.com/thelounge/thelounge.github.io/pull/190) by [@xPaw](https://github.com/xPaw))
- Add guide "Identify users with identd or oident" ([#192](https://github.com/thelounge/thelounge.github.io/pull/192) by [@xPaw](https://github.com/xPaw))

### Internals

- Skip scripts folder from test coverage ([#2076](https://github.com/thelounge/thelounge/pull/2076) by [@xPaw](https://github.com/xPaw))
- Enable `no-var` rule ([#1962](https://github.com/thelounge/thelounge/pull/1962), [#2078](https://github.com/thelounge/thelounge/pull/2078) by [@xPaw](https://github.com/xPaw))
- Deal with npm's `dist-tag` at Travis deploy time ([#2080](https://github.com/thelounge/thelounge/pull/2080) by [@astorije](https://github.com/astorije))
- Enforce `padding-line-between-statements` ([#1920](https://github.com/thelounge/thelounge/pull/1920) by [@xPaw](https://github.com/xPaw))
- Instrument client code before running tests ([#1726](https://github.com/thelounge/thelounge/pull/1726) by [@astorije](https://github.com/astorije))
- Do not publish Webpack config for test env ([#2087](https://github.com/thelounge/thelounge/pull/2087) by [@astorije](https://github.com/astorije))
- Change `isOpInChannel` to allow multiple different user roles ([#1864](https://github.com/thelounge/thelounge/pull/1864) by [@McInkay](https://github.com/McInkay))
- Update all links to thelounge repository ([#2091](https://github.com/thelounge/thelounge/pull/2091) by [@xPaw](https://github.com/xPaw))
- Remove `isRegistered` ([#2082](https://github.com/thelounge/thelounge/pull/2082) by [@xPaw](https://github.com/xPaw))
- Use Yarn in the PR-test script ([#2093](https://github.com/thelounge/thelounge/pull/2093) by [@astorije](https://github.com/astorije))
- Use `document.body` when wrapping it in a jQuery object ([#2110](https://github.com/thelounge/thelounge/pull/2110) by [@xPaw](https://github.com/xPaw))
- Enable in-browser run of client testing ([#2094](https://github.com/thelounge/thelounge/pull/2094) by [@astorije](https://github.com/astorije))
- Refactor channel titles to use flexbox ([#2113](https://github.com/thelounge/thelounge/pull/2113), [#2140](https://github.com/thelounge/thelounge/pull/2140) by [@xPaw](https://github.com/xPaw))
- Remove unintentionally included `lodash` in client build ([#2132](https://github.com/thelounge/thelounge/pull/2132) by [@xPaw](https://github.com/xPaw))
- Increase test timeout on CI ([#2134](https://github.com/thelounge/thelounge/pull/2134) by [@xPaw](https://github.com/xPaw))
- Replace `colors.js` with `chalk` ([#2145](https://github.com/thelounge/thelounge/pull/2145) by [@xPaw](https://github.com/xPaw))
- Remove `setMaxListeners` ([#2164](https://github.com/thelounge/thelounge/pull/2164) by [@xPaw](https://github.com/xPaw))
- Cleanup sidebar to use flexbox ([#2149](https://github.com/thelounge/thelounge/pull/2149) by [@xPaw](https://github.com/xPaw))
- Optimized notification dot state ([#2170](https://github.com/thelounge/thelounge/pull/2170) by [@xPaw](https://github.com/xPaw))
- Ignore order of preview results in unicode link tests ([#2175](https://github.com/thelounge/thelounge/pull/2175) by [@astorije](https://github.com/astorije))
- Try to fix SQLite test failing on CI randomly ([#2180](https://github.com/thelounge/thelounge/pull/2180) by [@xPaw](https://github.com/xPaw))
- Enforce object literal shorthand syntax with ESLint ([#2073](https://github.com/thelounge/thelounge/pull/2073) by [@astorije](https://github.com/astorije))
- Fix `yarn coverage` script on Windows ([#2252](https://github.com/thelounge/thelounge/pull/2252) by [@astorije](https://github.com/astorije))
- Bind formatting hotkeys on input element ([#2263](https://github.com/thelounge/thelounge/pull/2263) by [@xPaw](https://github.com/xPaw))
- Enforce consistent quotes around properties with ESLint ([#2285](https://github.com/thelounge/thelounge/pull/2285) by [@xPaw](https://github.com/xPaw))
- Fix lint and test issues on master ([#2292](https://github.com/thelounge/thelounge/pull/2292) by [@xPaw](https://github.com/xPaw))
- Remove Node.js v9, add v10 and v11 to the Travis CI matrix ([#2296](https://github.com/thelounge/thelounge/pull/2296), [#2792](https://github.com/thelounge/thelounge/pull/2792), [#2387](https://github.com/thelounge/thelounge/pull/2387), [#2877](https://github.com/thelounge/thelounge/pull/2877), [#2312](https://github.com/thelounge/thelounge/pull/2312) by [@astorije](https://github.com/astorije))
- Reimplement input history ([#2286](https://github.com/thelounge/thelounge/pull/2286) by [@xPaw](https://github.com/xPaw), [#2314](https://github.com/thelounge/thelounge/pull/2314) by [@astorije](https://github.com/astorije))
- Pull context menu code out of `lounge.js` and make it more generic ([#1878](https://github.com/thelounge/thelounge/pull/1878) by [@McInkay](https://github.com/McInkay))
- Replace pseudo-element gradient fade with mask-image ([#2270](https://github.com/thelounge/thelounge/pull/2270) by [@xPaw](https://github.com/xPaw))
- Upgrade to Webpack 4 ([#2117](https://github.com/thelounge/thelounge/pull/2117) by [@xPaw](https://github.com/xPaw))
- Replace client IDs with GUIDs ([#2344](https://github.com/thelounge/thelounge/pull/2344) by [@xPaw](https://github.com/xPaw))
- Remove network IDs and use UUIDs everywhere ([#2390](https://github.com/thelounge/thelounge/pull/2390) by [@xPaw](https://github.com/xPaw))
- Use per-client channel and message IDs ([#2396](https://github.com/thelounge/thelounge/pull/2396) by [@xPaw](https://github.com/xPaw))
- Minor optimization in style parser ([#2408](https://github.com/thelounge/thelounge/pull/2408), [#2428](https://github.com/thelounge/thelounge/pull/2428) by [@xPaw](https://github.com/xPaw))
- Use new Font Awesome package ([#2420](https://github.com/thelounge/thelounge/pull/2420) by [@xPaw](https://github.com/xPaw))
- Configure Renovate ([#2437](https://github.com/thelounge/thelounge/pull/2437) by [@renovate](https://github.com/apps/renovate))
- Update Travis and Renovate configs ([#2466](https://github.com/thelounge/thelounge/pull/2466) by [@xPaw](https://github.com/xPaw))
- Refactor `userLog` to be the same as SQLite logger ([#2366](https://github.com/thelounge/thelounge/pull/2366), [#2670](https://github.com/thelounge/thelounge/pull/2670), [#2764](https://github.com/thelounge/thelounge/pull/2764) by [@xPaw](https://github.com/xPaw))
- Remove `URIjs` ([#2471](https://github.com/thelounge/thelounge/pull/2471) by [@xPaw](https://github.com/xPaw))
- Fix mouse cursor on user list ([#2487](https://github.com/thelounge/thelounge/pull/2487) by [@astorije](https://github.com/astorije))
- Minify handlebars templates ([#2498](https://github.com/thelounge/thelounge/pull/2498) by [@xPaw](https://github.com/xPaw), [#2502](https://github.com/thelounge/thelounge/pull/2502) by [@dgw](https://github.com/dgw), [#2539](https://github.com/thelounge/thelounge/pull/2539) by [@astorije](https://github.com/astorije))
- Remove `log` from `global` ([#2563](https://github.com/thelounge/thelounge/pull/2563), [#2569](https://github.com/thelounge/thelounge/pull/2569) by [@xPaw](https://github.com/xPaw))
- Move `.nyc_output` folder out of root ([#2564](https://github.com/thelounge/thelounge/pull/2564) by [@xPaw](https://github.com/xPaw))
- Update `no-confusing-error` ESLint rule to allow parenthesis ([#2592](https://github.com/thelounge/thelounge/pull/2592) by [@MaxLeiter](https://github.com/MaxLeiter))
- Increase delay between links to remove random test failure ([#2624](https://github.com/thelounge/thelounge/pull/2624) by [@xPaw](https://github.com/xPaw))
- Refactor `getHumanDate()` to accept a timestamp; avoids possible test failure; more accurate log times ([#2669](https://github.com/thelounge/thelounge/pull/2669) by [@MaxLeiter](https://github.com/MaxLeiter))
- Use a new npmjs token and secure entries to publish through Travis ([#2716](https://github.com/thelounge/thelounge/pull/2716), [#2876](https://github.com/thelounge/thelounge/pull/2876) by [@astorije](https://github.com/astorije))
- Fix stack traces in client tests ([#2751](https://github.com/thelounge/thelounge/pull/2751) by [@xPaw](https://github.com/xPaw))
- Remove moment locales from build ([#2788](https://github.com/thelounge/thelounge/pull/2788) by [@xPaw](https://github.com/xPaw))
- Upgrade `yarn.lock` before final release ([#2799](https://github.com/thelounge/thelounge/pull/2799) by [@xPaw](https://github.com/xPaw))
- Enable Windows and macOS builds on Travis, remove AppVeyor ([#2850](https://github.com/thelounge/thelounge/pull/2850) by [@xPaw](https://github.com/xPaw))
- Fix config generator script comment ([#2881](https://github.com/thelounge/thelounge/pull/2881) by [@astorije](https://github.com/astorije))
- Rename `manifest.json` to `thelounge.webmanifest` ([#2895](https://github.com/thelounge/thelounge/pull/2895) by [@xPaw](https://github.com/xPaw))
- Move `primer-tooltips` and `moment` to `devDependencies` ([#2906](https://github.com/thelounge/thelounge/pull/2906) by [@xPaw](https://github.com/xPaw))
- Make links in generated config relative ([#2913](https://github.com/thelounge/thelounge/pull/2913) by [@xPaw](https://github.com/xPaw))
- Update changelog generator script ([#2786](https://github.com/thelounge/thelounge/pull/2786) by [@xPaw](https://github.com/xPaw))
- Relax identd checks to make it more compatible ([#2959](https://github.com/thelounge/thelounge/pull/2959) by [@xPaw](https://github.com/xPaw))
- Catch LDAP bind error and search warning log messages in ldap tests ([#2955](https://github.com/thelounge/thelounge/pull/2955) by [](https://github.com/moundahiwale))
- Update development dependencies to their latest versions:
  - `stylelint` ([#2069](https://github.com/thelounge/thelounge/pull/2069), [#2089](https://github.com/thelounge/thelounge/pull/2089), [#2092](https://github.com/thelounge/thelounge/pull/2092), [#2220](https://github.com/thelounge/thelounge/pull/2220), [#2228](https://github.com/thelounge/thelounge/pull/2228), [#2323](https://github.com/thelounge/thelounge/pull/2323), [#2458](https://github.com/thelounge/thelounge/pull/2458), [#2561](https://github.com/thelounge/thelounge/pull/2561), [#2676](https://github.com/thelounge/thelounge/pull/2676), [#2707](https://github.com/thelounge/thelounge/pull/2707), [#2810](https://github.com/thelounge/thelounge/pull/2810), [#2880](https://github.com/thelounge/thelounge/pull/2880), [#2909](https://github.com/thelounge/thelounge/pull/2909))
  - `eslint` ([#2084](https://github.com/thelounge/thelounge/pull/2084), [#2146](https://github.com/thelounge/thelounge/pull/2146), [#2244](https://github.com/thelounge/thelounge/pull/2244), [#2271](https://github.com/thelounge/thelounge/pull/2271), [#2582](https://github.com/thelounge/thelounge/pull/2582), [#2590](https://github.com/thelounge/thelounge/pull/2590), [#2632](https://github.com/thelounge/thelounge/pull/2632), [#2667](https://github.com/thelounge/thelounge/pull/2667), [#2690](https://github.com/thelounge/thelounge/pull/2690), [#2704](https://github.com/thelounge/thelounge/pull/2704), [#2736](https://github.com/thelounge/thelounge/pull/2736), [#2778](https://github.com/thelounge/thelounge/pull/2778), [#2812](https://github.com/thelounge/thelounge/pull/2812), [#2847](https://github.com/thelounge/thelounge/pull/2847), [#2875](https://github.com/thelounge/thelounge/pull/2875), [#2923](https://github.com/thelounge/thelounge/pull/2923))
  - `copy-webpack-plugin` ([#2111](https://github.com/thelounge/thelounge/pull/2111), [#2139](https://github.com/thelounge/thelounge/pull/2139), [#2183](https://github.com/thelounge/thelounge/pull/2183), [#2594](https://github.com/thelounge/thelounge/pull/2594), [#2841](https://github.com/thelounge/thelounge/pull/2841), [#2856](https://github.com/thelounge/thelounge/pull/2856), [#2886](https://github.com/thelounge/thelounge/pull/2886))
  - `graphql-request` ([#2105](https://github.com/thelounge/thelounge/pull/2105), [#2136](https://github.com/thelounge/thelounge/pull/2136), [#2394](https://github.com/thelounge/thelounge/pull/2394), [#2423](https://github.com/thelounge/thelounge/pull/2423), [#2674](https://github.com/thelounge/thelounge/pull/2674), [#2685](https://github.com/thelounge/thelounge/pull/2685), [#2693](https://github.com/thelounge/thelounge/pull/2693), [#2697](https://github.com/thelounge/thelounge/pull/2697))
  - `textcomplete` ([#2131](https://github.com/thelounge/thelounge/pull/2131), [#2283](https://github.com/thelounge/thelounge/pull/2283), [#2320](https://github.com/thelounge/thelounge/pull/2320))
  - `stylelint-config-standard` ([#2137](https://github.com/thelounge/thelounge/pull/2137))
  - `moment` ([#2147](https://github.com/thelounge/thelounge/pull/2147), [#2319](https://github.com/thelounge/thelounge/pull/2319), [#2357](https://github.com/thelounge/thelounge/pull/2357), [#2493](https://github.com/thelounge/thelounge/pull/2493), [#2931](https://github.com/thelounge/thelounge/pull/2931))
  - `mocha` ([#2155](https://github.com/thelounge/thelounge/pull/2155), [#2165](https://github.com/thelounge/thelounge/pull/2165), [#2168](https://github.com/thelounge/thelounge/pull/2168), [#2280](https://github.com/thelounge/thelounge/pull/2280), [#2354](https://github.com/thelounge/thelounge/pull/2354), [#2373](https://github.com/thelounge/thelounge/pull/2373), [#2451](https://github.com/thelounge/thelounge/pull/2451))
  - `nyc` ([#2208](https://github.com/thelounge/thelounge/pull/2208), [#2374](https://github.com/thelounge/thelounge/pull/2374), [#2430](https://github.com/thelounge/thelounge/pull/2430), [#2433](https://github.com/thelounge/thelounge/pull/2433), [#2452](https://github.com/thelounge/thelounge/pull/2452), [#2492](https://github.com/thelounge/thelounge/pull/2492), [#2509](https://github.com/thelounge/thelounge/pull/2509), [#2725](https://github.com/thelounge/thelounge/pull/2725), [#2852](https://github.com/thelounge/thelounge/pull/2852))
  - `primer-tooltips` ([#2265](https://github.com/thelounge/thelounge/pull/2265), [#2453](https://github.com/thelounge/thelounge/pull/2453), [#2557](https://github.com/thelounge/thelounge/pull/2557), [#2610](https://github.com/thelounge/thelounge/pull/2610), [#2681](https://github.com/thelounge/thelounge/pull/2681), [#2866](https://github.com/thelounge/thelounge/pull/2866), [#2899](https://github.com/thelounge/thelounge/pull/2899))
  - `sinon` ([#2269](https://github.com/thelounge/thelounge/pull/2269), [#2335](https://github.com/thelounge/thelounge/pull/2335), [#2401](https://github.com/thelounge/thelounge/pull/2401), [#2407](https://github.com/thelounge/thelounge/pull/2407), [#2412](https://github.com/thelounge/thelounge/pull/2412), [#2427](https://github.com/thelounge/thelounge/pull/2427), [#2455](https://github.com/thelounge/thelounge/pull/2455), [#2464](https://github.com/thelounge/thelounge/pull/2464), [#2517](https://github.com/thelounge/thelounge/pull/2517), [#2542](https://github.com/thelounge/thelounge/pull/2542), [#2588](https://github.com/thelounge/thelounge/pull/2588), [#2612](https://github.com/thelounge/thelounge/pull/2612), [#2623](https://github.com/thelounge/thelounge/pull/2623), [#2628](https://github.com/thelounge/thelounge/pull/2628), [#2668](https://github.com/thelounge/thelounge/pull/2668), [#2696](https://github.com/thelounge/thelounge/pull/2696), [#2752](https://github.com/thelounge/thelounge/pull/2752), [#2773](https://github.com/thelounge/thelounge/pull/2773), [#2776](https://github.com/thelounge/thelounge/pull/2776), [#2780](https://github.com/thelounge/thelounge/pull/2780), [#2825](https://github.com/thelounge/thelounge/pull/2825), [#2853](https://github.com/thelounge/thelounge/pull/2853), [#2870](https://github.com/thelounge/thelounge/pull/2870), [#2887](https://github.com/thelounge/thelounge/pull/2887), [#2925](https://github.com/thelounge/thelounge/pull/2925), [#2927](https://github.com/thelounge/thelounge/pull/2927))
  - `istanbul-instrumenter-loader` ([#2307](https://github.com/thelounge/thelounge/pull/2307))
  - `socket.io-client` ([#2311](https://github.com/thelounge/thelounge/pull/2311), [#2457](https://github.com/thelounge/thelounge/pull/2457))
  - `webpack-dev-server` ([#2338](https://github.com/thelounge/thelounge/pull/2338), [#2339](https://github.com/thelounge/thelounge/pull/2339), [#2415](https://github.com/thelounge/thelounge/pull/2415), [#2671](https://github.com/thelounge/thelounge/pull/2671), [#2720](https://github.com/thelounge/thelounge/pull/2720), [#2731](https://github.com/thelounge/thelounge/pull/2731), [#2759](https://github.com/thelounge/thelounge/pull/2759), [#2802](https://github.com/thelounge/thelounge/pull/2802), [#2864](https://github.com/thelounge/thelounge/pull/2864), [#2945](https://github.com/thelounge/thelounge/pull/2945))
  - `undate` ([#2371](https://github.com/thelounge/thelounge/pull/2371))
  - `webpack` ([#2370](https://github.com/thelounge/thelounge/pull/2370), [#2421](https://github.com/thelounge/thelounge/pull/2421), [#2460](https://github.com/thelounge/thelounge/pull/2460), [#2467](https://github.com/thelounge/thelounge/pull/2467), [#2475](https://github.com/thelounge/thelounge/pull/2475), [#2476](https://github.com/thelounge/thelounge/pull/2476), [#2483](https://github.com/thelounge/thelounge/pull/2483), [#2484](https://github.com/thelounge/thelounge/pull/2484), [#2514](https://github.com/thelounge/thelounge/pull/2514), [#2518](https://github.com/thelounge/thelounge/pull/2518), [#2528](https://github.com/thelounge/thelounge/pull/2528), [#2586](https://github.com/thelounge/thelounge/pull/2586), [#2598](https://github.com/thelounge/thelounge/pull/2598), [#2615](https://github.com/thelounge/thelounge/pull/2615), [#2619](https://github.com/thelounge/thelounge/pull/2619), [#2641](https://github.com/thelounge/thelounge/pull/2641), [#2652](https://github.com/thelounge/thelounge/pull/2652), [#2672](https://github.com/thelounge/thelounge/pull/2672), [#2678](https://github.com/thelounge/thelounge/pull/2678), [#2686](https://github.com/thelounge/thelounge/pull/2686), [#2692](https://github.com/thelounge/thelounge/pull/2692), [#2709](https://github.com/thelounge/thelounge/pull/2709), [#2713](https://github.com/thelounge/thelounge/pull/2713), [#2745](https://github.com/thelounge/thelounge/pull/2745), [#2766](https://github.com/thelounge/thelounge/pull/2766), [#2774](https://github.com/thelounge/thelounge/pull/2774), [#2777](https://github.com/thelounge/thelounge/pull/2777), [#2781](https://github.com/thelounge/thelounge/pull/2781), [#2803](https://github.com/thelounge/thelounge/pull/2803), [#2805](https://github.com/thelounge/thelounge/pull/2805), [#2807](https://github.com/thelounge/thelounge/pull/2807), [#2855](https://github.com/thelounge/thelounge/pull/2855), [#2860](https://github.com/thelounge/thelounge/pull/2860), [#2867](https://github.com/thelounge/thelounge/pull/2867), [#2869](https://github.com/thelounge/thelounge/pull/2869), [#2888](https://github.com/thelounge/thelounge/pull/2888), [#2898](https://github.com/thelounge/thelounge/pull/2898), [#2905](https://github.com/thelounge/thelounge/pull/2905), [#2917](https://github.com/thelounge/thelounge/pull/2917), [#2919](https://github.com/thelounge/thelounge/pull/2919))
  - `webpack-cli` ([#2376](https://github.com/thelounge/thelounge/pull/2376), [#2402](https://github.com/thelounge/thelounge/pull/2402), [#2425](https://github.com/thelounge/thelounge/pull/2425), [#2463](https://github.com/thelounge/thelounge/pull/2463), [#2495](https://github.com/thelounge/thelounge/pull/2495), [#2497](https://github.com/thelounge/thelounge/pull/2497), [#2512](https://github.com/thelounge/thelounge/pull/2512), [#2520](https://github.com/thelounge/thelounge/pull/2520), [#2551](https://github.com/thelounge/thelounge/pull/2551), [#2553](https://github.com/thelounge/thelounge/pull/2553), [#2559](https://github.com/thelounge/thelounge/pull/2559), [#2662](https://github.com/thelounge/thelounge/pull/2662), [#2796](https://github.com/thelounge/thelounge/pull/2796), [#2815](https://github.com/thelounge/thelounge/pull/2815))
  - `npm-run-all` ([#2426](https://github.com/thelounge/thelounge/pull/2426), [#2904](https://github.com/thelounge/thelounge/pull/2904))
  - `@fortawesome/fontawesome-free` ([#2481](https://github.com/thelounge/thelounge/pull/2481), [#2577](https://github.com/thelounge/thelounge/pull/2577), [#2658](https://github.com/thelounge/thelounge/pull/2658), [#2673](https://github.com/thelounge/thelounge/pull/2673), [#2724](https://github.com/thelounge/thelounge/pull/2724), [#2729](https://github.com/thelounge/thelounge/pull/2729), [#2835](https://github.com/thelounge/thelounge/pull/2835), [#2845](https://github.com/thelounge/thelounge/pull/2845), [#2874](https://github.com/thelounge/thelounge/pull/2874), [#2889](https://github.com/thelounge/thelounge/pull/2889), [#2922](https://github.com/thelounge/thelounge/pull/2922), [#2929](https://github.com/thelounge/thelounge/pull/2929))
  - `mousetrap` ([#2500](https://github.com/thelounge/thelounge/pull/2500))
  - `emoji-regex` ([#2531](https://github.com/thelounge/thelounge/pull/2531), [#2734](https://github.com/thelounge/thelounge/pull/2734))
  - `html-minifier` ([#2589](https://github.com/thelounge/thelounge/pull/2589), [#2611](https://github.com/thelounge/thelounge/pull/2611), [#2646](https://github.com/thelounge/thelounge/pull/2646), [#2708](https://github.com/thelounge/thelounge/pull/2708), [#2872](https://github.com/thelounge/thelounge/pull/2872))
  - `mini-css-extract-plugin` ([#2607](https://github.com/thelounge/thelounge/pull/2607), [#2710](https://github.com/thelounge/thelounge/pull/2710), [#2784](https://github.com/thelounge/thelounge/pull/2784), [#2842](https://github.com/thelounge/thelounge/pull/2842), [#2903](https://github.com/thelounge/thelounge/pull/2903), [#2920](https://github.com/thelounge/thelounge/pull/2920))
  - `babel-loader` ([#2620](https://github.com/thelounge/thelounge/pull/2620), [#2727](https://github.com/thelounge/thelounge/pull/2727), [#2740](https://github.com/thelounge/thelounge/pull/2740), [#2742](https://github.com/thelounge/thelounge/pull/2742), [#2811](https://github.com/thelounge/thelounge/pull/2811))
  - `mocha-loader` ([#2723](https://github.com/thelounge/thelounge/pull/2723))
  - `handlebars` ([#2750](https://github.com/thelounge/thelounge/pull/2750))
  - `@babel/core` ([#2768](https://github.com/thelounge/thelounge/pull/2768), [#2813](https://github.com/thelounge/thelounge/pull/2813), [#2932](https://github.com/thelounge/thelounge/pull/2932))
  - `chai` ([#2809](https://github.com/thelounge/thelounge/pull/2809))
  - `intersection-observer` ([#2862](https://github.com/thelounge/thelounge/pull/2862))

## v3.0.0-rc.6 - 2019-01-15 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.0.0-rc.5...v3.0.0-rc.6)

This is a release candidate (RC) for v3.0.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.0.0-rc.5 - 2018-11-21 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.0.0-rc.4...v3.0.0-rc.5)

This is a release candidate (RC) for v3.0.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.0.0-rc.4 - 2018-10-26 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.0.0-rc.3...v3.0.0-rc.4)

This is a release candidate (RC) for v3.0.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.0.0-rc.3 - 2018-10-10 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.0.0-rc.2...v3.0.0-rc.3)

This is a release candidate (RC) for v3.0.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.0.0-rc.2 - 2018-10-08 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.0.0-rc.1...v3.0.0-rc.2)

This is a release candidate (RC) for v3.0.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.0.0-rc.1 - 2018-09-20 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.0.0-pre.8...v3.0.0-rc.1)

This is a release candidate (RC) for v3.0.0 to ensure maximum stability for public release.
Bugs may be fixed, but no further features will be added until the next stable version.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.0.0-pre.8 - 2018-08-25 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.0.0-pre.7...v3.0.0-pre.8)

This is a pre-release for v3.0.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
yarn global add thelounge@next
```

## v3.0.0-pre.7 - 2018-06-19 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.0.0-pre.6...v3.0.0-pre.7)

This is a pre-release for v3.0.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

## v3.0.0-pre.6 - 2018-05-26 [Pre-release]

[See the full changelog](https://github.com/thelounge/thelounge/compare/v3.0.0-pre.5...v3.0.0-pre.6)

This is a pre-release for v3.0.0 to offer latest changes without having to wait for a stable release.
At this stage, features may still be added or modified until the first release candidate for this version gets released.

Please refer to the commit list given above for a complete list of changes, or wait for the stable release to get a thoroughly prepared change log entry.

As with all pre-releases, this version requires explicit use of the `next` tag to be installed:

```sh
npm install -g thelounge@next
```

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

- Link and color nicks mentioned in messages ([#1709](https://github.com/thelounge/thelounge/pull/1709), [#1758](https://github.com/thelounge/thelounge/pull/1758) by [@MaxLeiter](https://github.com/MaxLeiter), [#1779](https://github.com/thelounge/thelounge/pull/1779), [#1901](https://github.com/thelounge/thelounge/pull/1901) by [@xPaw](https://github.com/xPaw))
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
- Enable `no-console` and `no-alert` ESLint rules ([#1538](https://github.com/thelounge/thelounge/pull/1538) by [@astorije](https://github.com/astorije))
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
- Consolidate version numbers throughout all interfaces ([#592](https://github.com/thelounge/thelounge/pull/592) by [@williamboman](https://github.com/williamboman))
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

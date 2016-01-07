0.53.0 / 2016-01-07
===================

[See the full changelog](https://github.com/erming/shout/compare/v0.52.0...v0.53.0)

* Added a Dockerfile ([PR #477](https://github.com/erming/shout/pull/477) by [@bencevans](https://github.com/bencevans))
* Fixed a bug preventing logging on channels that contain slashes ([PR #519](https://github.com/erming/shout/pull/519) by [@lyra833](https://github.com/lyra833))
* Added missing `grunt-cli` as a required development dependencies ([PR #522](https://github.com/erming/shout/pull/522) by [@williamboman](https://github.com/williamboman))
* Added [@floogulinc](https://github.com/floogulinc) as a project maintainer
* Added consistent coding style enforcement using `ESLint` ([PR #504](https://github.com/erming/shout/pull/504) by [@williamboman](https://github.com/williamboman), [PR #547](https://github.com/erming/shout/pull/547) by [@JocelynDelalande](https://github.com/JocelynDelalande))
* Added an `.editorconfig` file ([PR #526](https://github.com/erming/shout/pull/526) by [@williamboman](https://github.com/williamboman))
* Added a size limit for image previews ([PR #503](https://github.com/erming/shout/pull/503) by [@olivierlambert](https://github.com/olivierlambert), [issue #500](https://github.com/erming/shout/issues/500))
* Fixed the development setup command ([PR #536](https://github.com/erming/shout/pull/536) by [@jancborchardt](https://github.com/jancborchardt), [issue #535](https://github.com/erming/shout/issues/535))
* Improved the [CONTRIBUTING.md](https://github.com/erming/shout/blob/master/CONTRIBUTING.md) file regarding rebasing ([PR #548](https://github.com/erming/shout/pull/548) by [@JocelynDelalande](https://github.com/JocelynDelalande))
*	Made channel names in chat clickable to let users join them ([PR #385](https://github.com/erming/shout/pull/385) by [@AmShaegar13](https://github.com/AmShaegar13), [issue #361](https://github.com/erming/shout/issues/361))

0.52.0 / ???
============

???

0.51.2 / 2015-09-18
==================

* Fix XSS vulnerability (thanks @ohaal)

0.51.1 / 2015-04-29
===================

* Increase process.setMaxListeners to prevent link preview to cause a crash

0.51.0 / 2015-04-16
==================

 * Added 'Crypto' theme by @aynik
 * Link preview now ignores links from localhost
 * Added 'displayNetwork' setting

0.49.3 / 2015-01-04
===================

 * Fully expand chat when userlist is hidden
 * Remove vertical whitespace in chat windows
 * Support @mention

0.49.2 / 2015-01-04
===================

 * Fix crash on broken links

0.49.1 / 2015-01-04
===================

 * Fix undefined content-type (link plugin)

0.49.0 / 2014-12-23
===================

 * Replaced superagent with request
 * Solves a problem where some links would crash the server

0.48.0 / 2014-12-12
===================

  * Fetch max 1 link per message
  * Fix '/me' message color
  * Periodically hide older messages for inactive channels
  * Only confirm exit in public mode
  * Added '/ns' NickServ and '/cs' ChanServ shortcuts

0.47.0 / 2014-11-19
===================

  * Shout now supports fullscreen on iOS

0.46.0 / 2014-11-14
===================

  * Fix commands being removed from user.json
  * Added dynamic title
  * Turn off input autocomplete

0.45.5 / 2014-11-05
===================

  * Minor bugfixes

0.45.4 / 2014-11-05
===================

  * Added username input
  * Added 'morning' theme by @rikukissa

0.45.3 / 2014-10-27
===================

  * Remove password argument from add command
  * Support MIRC style terminators
	* Fix edit command
  * Fix URLs preventing proper closure of bold and color tags
  * Send NOTICE messages to the correct channel

0.45.2 / 2014-10-16
===================

  * Fix crash on failed TLS connect
  * Hide mode from badge count

0.45.0 / 2014-10-14
===================

  * Added identd daemon
  * Remember user networks and channels on restart
  * Show link thumbnails
  * Pull link description from meta tags
  * Allow binding to local IP via `--bind <ip>`
  * Change 'users/' folder structure
  * Change 'logs/' location

0.44.0 / 2014-10-11
===================

  * Added text color
  * Added 'prefetch' option
  * Added drag-and-drop tolerance
  * Always show right toggle

0.43.1 / 2014-10-09
===================

  * Disable login button on authentication
  * Fix 'shout edit' command

0.43.0 / 2014-10-08
===================

  * Smarter nick completion
  * Prevent multiple logins
  * Fix highlight checking by lower-casing everything
  * Allow relative '--home' path

0.42.0 / 2014-10-04
===================

  * Split users by mode in the sidebar
  * Show user mode in channel

0.41.1 / 2014-10-03
===================

  * Now installs properly on Windows

0.41.0 / 2014-10-03
===================

  * Use 'bcrypt-nodejs' package
  * No need to compile with node-gyp during install

0.40.3 / 2014-10-02
===================

  * Fix issue where actions from other users do not display

0.40.2 / 2014-10-01
===================

  * Fix existsSync

0.40.1 / 2014-10-01
===================

  * Fix config overwrite

0.40.0 / 2014-10-01
===================

  * Prevent private mode when no user exists
  * Move config to ~/.shout/

0.39.1 / 2014-09-30
===================

  * Scrolling now works correctly when loading thumbnails
  * List users on server start

0.39.0 / 2014-09-30
===================

  * Added changelog
  * Added colored nicknames (optional)

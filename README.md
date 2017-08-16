# The Lounge

Modern web IRC client designed for self-hosting.

[![#thelounge IRC channel on freenode](https://img.shields.io/badge/freenode-%23thelounge-BA68C8.svg)](https://demo.thelounge.chat/)
[![npm version](https://img.shields.io/npm/v/thelounge.svg)](https://www.npmjs.org/package/thelounge)
[![Travis CI Build Status](https://img.shields.io/travis/thelounge/lounge/master.svg?label=linux+build)](https://travis-ci.org/thelounge/lounge)
[![AppVeyor Build Status](https://img.shields.io/appveyor/ci/astorije/lounge/master.svg?label=windows+build)](https://ci.appveyor.com/project/astorije/lounge/branch/master)
[![Dependencies Status](https://img.shields.io/david/thelounge/lounge.svg)](https://david-dm.org/thelounge/lounge)

## Overview

* **Modern features brought to IRC.** Link previews, new message markers, ~~push notifications~~ [*(soon!)*](https://github.com/thelounge/lounge/pull/1124), and more bring IRC to the 21st century.
* **Always connected.** Remains connected to IRC servers while you are offline.
* **Cross platform.** It doesn't matter what OS you use, it just works wherever Node.js runs.
* **Responsive interface.** The client works smoothly on every desktop, smartphone and tablet.
* **Synchronized experience.** Always resume where you left off no matter what device.

To learn more about configuration, usage and features of The Lounge, take a look at [the website](https://thelounge.github.io).

<p align="center">
	<img src="https://user-images.githubusercontent.com/8675906/28143204-53116e8c-6719-11e7-992b-d1ba442c6c37.png" width="550">
</p>

The Lounge is the official and community-managed fork of [Shout](https://github.com/erming/shout), by [Mattias Erming](https://github.com/erming).

## Installation and usage

The Lounge requires [Node.js](https://nodejs.org/) v4 or more recent.

### Running stable releases from npm (recommended)

Run this in a terminal to install (or upgrade) the latest stable release from
[npm](https://www.npmjs.com/):

```sh
[sudo] npm install -g thelounge
```

When installation is complete, run:

```sh
lounge start
```

For more information, read the [documentation](https://thelounge.github.io/docs/), [wiki](https://github.com/thelounge/lounge/wiki), or run:

```sh
lounge --help
```

### Running from source

The following commands install and run the development version of The Lounge:

```sh
git clone https://github.com/thelounge/lounge.git
cd lounge
npm install
NODE_ENV=production npm run build
npm start
```

When installed like this, npm doesn't create a `lounge` executable. Use `npm start -- <command>` to run subcommands.

⚠️ While it is the most recent codebase, this is not production-ready! Run at
your own risk. It is also not recommended to run this as root.

## Development setup

Simply follow the instructions to run The Lounge from source above, on your own
fork.

Before submitting any change, make sure to:

- Read the [Contributing instructions](https://github.com/thelounge/lounge/blob/master/CONTRIBUTING.md#contributing)
- Run `npm test` to execute linters and test suite
- Run `npm run build` if you change or add anything in `client/js` or `client/views`

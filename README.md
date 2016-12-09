# The Lounge
<p align="center">
	<img src="https://cloud.githubusercontent.com/assets/5481612/19623041/9bbaec40-9888-11e6-9961-8f3e0493ba30.png" width="550" />
</p>

[![#thelounge IRC channel on freenode](https://img.shields.io/badge/freenode-%23thelounge-BA68C8.svg)](https://avatar.playat.ch:1000/)
[![npm version](https://img.shields.io/npm/v/thelounge.svg)](https://www.npmjs.org/package/thelounge)
[![Travis CI Build Status](https://img.shields.io/travis/thelounge/lounge/master.svg?label=linux+build)](https://travis-ci.org/thelounge/lounge)
[![AppVeyor Build Status](https://img.shields.io/appveyor/ci/astorije/lounge/master.svg?label=windows+build)](https://ci.appveyor.com/project/astorije/lounge/branch/master)
[![Dependencies Status](https://img.shields.io/david/thelounge/lounge.svg)](https://david-dm.org/thelounge/lounge)
[![Developer Dependencies Status](https://img.shields.io/david/dev/thelounge/lounge.svg)](https://david-dm.org/thelounge/lounge?type=dev)

__What is it?__

The Lounge is a web IRC client that you host on your own server.

*This is the official, community-managed fork of @erming's great initiative, the [Shout](https://github.com/erming/shout) project.*

__What features does it have?__

- Multiple user support
- Stays connected even when you close the browser
- Connect from multiple devices at once
- Responsive layout — works well on your smartphone
- _.. and more!_

__Why the fork?__

We felt that the original [Shout](https://github.com/erming/shout) project
"stagnated" a little because its original author wanted it to remain his pet
project (which is a perfectly fine thing!).

A bunch of people, excited about doing things a bit differently than the upstream
project forked it under a new name: “The Lounge”.

This fork aims to be community managed, meaning that the decisions are taken
in a collegial fashion, and that a bunch of maintainers should be able to make
the review process quicker and more streamlined.

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

The following commands install the development version of The Lounge:

```sh
git clone https://github.com/thelounge/lounge.git
cd lounge
npm install
npm start
```

A word of caution:

- While it is the most recent codebase, this is not production-ready!
- It is not recommended to run this as root. However, if you decide to do so,
  you will have to run `npm run build`.

## Development setup

Simply follow the instructions to run The Lounge from source above, on your own
fork.

Before submitting any change, make sure to:

- Read the [Contributing instructions](https://github.com/thelounge/lounge/blob/master/CONTRIBUTING.md#contributing)
- Run `npm test` to execute linters and test suite
- Run `npm run build` if you change or add anything in `client/js/libs` or `client/views`

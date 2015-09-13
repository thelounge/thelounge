[![npm version](https://img.shields.io/npm/v/shout.svg)](https://www.npmjs.org/package/shout)
[![Build Status](https://travis-ci.org/erming/shout.svg?branch=master)](https://travis-ci.org/erming/shout)
[![Dependency Status](https://david-dm.org/erming/shout.svg)](https://david-dm.org/erming/shout)

# Shout

### [Try the Demo](http://demo.shout-irc.com/)

__What is it?__  
Shout is a web IRC client that you host on your own server.

__What features does it have?__  
- Multiple user support
- Stays connected even when you close the browser
- Connect from multiple devices at once
- Responsive layout — works well on your smartphone
- _.. and more!_

## Install

```
sudo npm install -g shout
```

## Usage

When the install is complete, go ahead and run this in your terminal:

```
shout --help
```

For more information, read the [documentation](http://shout-irc.com/docs/).

## Development setup

To run the app from source, just clone the code and run this in your terminal:

```
npm install
grunt
./index.js --port 8080
```

And if you don't have [grunt](http://gruntjs.com/getting-started) installed already, just run `npm install -g grunt-cli`.

## License

Available under [the MIT license](http://mths.be/mit).

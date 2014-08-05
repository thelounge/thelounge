# Shout [![](https://badge.fury.io/js/shout.png)](https://www.npmjs.org/package/shout)

Run your IRC client on a server and access it from the web browser. This allows you to chat from multiple devices at the same time and you will stay connected to IRC even when you close your browser.

### [Try the Shout client](http://shout-irc.com:9090/)

_Some highlights:_

- [x] Multiple user support
- [x] Supports anonymous (public) or passworded connections
- [x] Works on your smartphone

## Screenshot

![](https://raw.github.com/erming/shout/master/screenshots/shout.png)  

## Install

1. Install Node.js and npm  
`sudo apt-get install nodejs-legacy npm`

2. Clone the project from GitHub  
`git clone http://github.com/erming/shout`

3. Open folder  
`cd shout/`

4. Install packages  
`sudo npm install --production`

5. Run the server  
`npm start` or `node index.js`

6. Open your browser  
`http://localhost:9000`

### Commands

These are the commands currently implemented:

- [x] /close
- [x] /connect
- [x] /deop
- [x] /devoice
- [x] /disconnect
- [x] /invite
- [x] /join
- [x] /kick
- [x] /leave
- [x] /me
- [x] /mode
- [x] /msg
- [x] /nick
- [x] /notice
- [x] /op
- [x] /part
- [x] /query
- [x] /quit
- [x] /raw
- [x] /say
- [x] /send
- [x] /server
- [x] /slap
- [x] /topic
- [x] /voice
- [x] /whois

## License

Available under [the MIT license](http://mths.be/mit).

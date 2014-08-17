# Shout [![](https://badge.fury.io/js/shout.png)](https://www.npmjs.org/package/shout)

Run your IRC client on a server and access it from the web browser. This allows you to chat from multiple devices at the same time and you will stay connected to IRC even when you close your browser.

### [Try the Shout client](http://shout-irc.com:9000/)

## Install

```
sudo npm install -g shout
```

## Usage

When the install is complete, go ahead and start the server:

```
shout
```

For more information:
```
shout --help
```

## Screenshot

![](https://raw.github.com/erming/shout/master/screenshots/shout.png)

## Configuration

Open your `config.json` file and edit:

__port__  
The default port to be used.  
You can override this by running `shout --port 80`

__public__  
Set to either `true|false`.  
When set to `false`, a login will be required for connecting users.

## Commands

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

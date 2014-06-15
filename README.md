## shout

Run your IRC client on a server and access it from the web browser. This gives you a persistent connection and allows you to chat from multiple devices at the same time.

### Screenshot

![](https://raw.github.com/erming/shout/master/shout.png)  

And also..  
[Mobile interface](https://www.dropbox.com/s/snpxgi3w7zaijmm/shout-mobile.png)

## Install

1. Install Node.js and NPM  
`sudo apt-get -y install nodejs npm`

2. Clone the project from GitHub  
`git clone http://github.com/erming/shout`

3. Open folder  
`cd shout/`

4. Install Node packages  
`npm install`

5. Run the server  
`npm start` or `node index.js`

6. Open your browser  
`http://localhost:9000`

### Commands

These are the commands currently implemented:
- [x] /ame
- [x] /amsg
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
- [x] /partall
- [x] /query
- [x] /quit
- [x] /raw
- [x] /say
- [x] /send
- [x] /server
- [x] /slap
- [x] /topic
- [x] /voice
- [x] /whoami
- [x] /whois

## Events

Using [Socket.IO](http://socket.io/)  
Events sent from the __server__ to the __browser__:
```javascript
// Event: "join"
// Sent when joining a new channel/query.
socket.emit("join", {
  id: 0,
  chan: {
    id: 0,
    name: "",
    type: "",
    network: "",
    count: 0,
    messages: [],
    users: [],
  }
});

// Event: "messages"
// Sent after the server receives a "fetch" request from client.
socket.emit("messages", {
  id: 0,
  msg: []
});

// Event: "msg"
// Sent when receiving a message.
socket.emit("msg", {
  id: 0,
  msg: {
    time: "",
    type: "",
    from: "",
    text: "",
  }
});

// Event: "networks"
// Sent upon connecting to the server.
socket.emit("networks", {
  networks: [{
    id: 0,
    host: "",
    nick: "",
    channels: [],
  }]
});

// Event: "part"
// Sent when leaving a channel/query.
socket.emit("part", {
  id: 0
});

// Event: "users"
// Sent whenever the list of users changes.
socket.emit("users", {
  id: 0,
  users: [{
    mode: "",
    name: "",
  }]
});
```

## License

Available under [the MIT license](http://mths.be/mit).

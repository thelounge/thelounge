## Chat
Run your IRC client on a server and access it from the web browser. This gives you a persistent connection and allows you to chat from multiple devices at the same time.

### Commands
These are the commands currently implemented:
- `/connect`
- `/deop`
- `/devoice`
- `/disconnect`
- `/join`
- `/kick`
- `/leave`
- `/mode`
- `/msg`
- `/nick`
- `/op`
- `/part`
- `/query`
- `/quit`
- `/server`
- `/topic`
- `/voice`
- `/whois`

## Install

1. Install Node.js and NPM  
`sudo apt-get -y install nodejs npm`

2. Clone the project from GitHub  
`git clone --recursive http://github.com/erming/chat`

3. Open folder  
`cd chat/`

4. Install Node packages  
`npm install`

5. Run the server  
`npm start` or `nodejs index.js`

6. Open your browser  
`http://localhost:9000`

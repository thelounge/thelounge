"use strict";

const pkg = require("../package.json");
var _ = require("lodash");
var path = require("path");
var os = require("os");
var fs = require("fs");
var net = require("net");
var bcrypt = require("bcrypt-nodejs");
require('string.prototype.at')

var Helper = {
	config: null,
	expandHome: expandHome,
	getUserConfigPath: getUserConfigPath,
	getUserLogsPath: getUserLogsPath,
	setHome: setHome,
	getVersion: getVersion,
	getGitCommit: getGitCommit,
	ip2hex: ip2hex,
	forceUTF8: forceUTF8,
	parseIrcLine: parseIrcLine,

	password: {
		hash: passwordHash,
		compare: passwordCompare,
		requiresUpdate: passwordRequiresUpdate,
	},
};

module.exports = Helper;

Helper.config = require(path.resolve(path.join(
	__dirname,
	"..",
	"defaults",
	"config.js"
)));

function getVersion() {
	const gitCommit = getGitCommit();
	return gitCommit ? `source (${gitCommit})` : `v${pkg.version}`;
}

let _gitCommit;
function getGitCommit() {
	if (_gitCommit !== undefined) {
		return _gitCommit;
	}
	try {
		_gitCommit = require("child_process")
			.execSync("git rev-parse --short HEAD 2> /dev/null") // Returns hash of current commit
			.toString()
			.trim();
		return _gitCommit;
	} catch (e) {
		// Not a git repository or git is not installed
		_gitCommit = null;
		return null;
	}
}

function setHome(homePath) {
	this.HOME = expandHome(homePath || "~/.lounge");
	this.CONFIG_PATH = path.join(this.HOME, "config.js");
	this.USERS_PATH = path.join(this.HOME, "users");

	// Reload config from new home location
	if (fs.existsSync(this.CONFIG_PATH)) {
		var userConfig = require(this.CONFIG_PATH);
		this.config = _.extend(this.config, userConfig);
	}

	// TODO: Remove in future release
	if (this.config.debug === true) {
		log.warn("debug option is now an object, see defaults file for more information.");
		this.config.debug = {ircFramework: true};
	}
}

function getUserConfigPath(name) {
	return path.join(this.USERS_PATH, name + ".json");
}

function getUserLogsPath(name, network) {
	return path.join(this.HOME, "logs", name, network);
}

function ip2hex(address) {
	// no ipv6 support
	if (!net.isIPv4(address)) {
		return "00000000";
	}

	return address.split(".").map(function(octet) {
		var hex = parseInt(octet, 10).toString(16);

		if (hex.length === 1) {
			hex = "0" + hex;
		}

		return hex;
	}).join("");
}

function expandHome(shortenedPath) {
	var home;

	if (os.homedir) {
		home = os.homedir();
	}

	if (!home) {
		home = process.env.HOME || "";
	}

	home = home.replace("$", "$$$$");

	return path.resolve(shortenedPath.replace(/^~($|\/|\\)/, home + "$1"));
}

function passwordRequiresUpdate(password) {
	return bcrypt.getRounds(password) !== 11;
}

function passwordHash(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(11));
}

function passwordCompare(password, expected) {
	return bcrypt.compareSync(password, expected);
}

function forceUTF8(text){
    var max= text.length;
    var buf=''
    var changed=false
    var debug = 0
    if(debug){
        console.log("chr1   :"+createBinaryString(text.codePointAt(0)))
        console.log("chr2   :"+createBinaryString(text.codePointAt(1)))
        console.log("chr3   :"+createBinaryString(text.codePointAt(2)))
        console.log("chr4   :"+createBinaryString(text.codePointAt(3)))
        
        
        var char1 = ((parseInt('00111111',2) & text.codePointAt(0) ) << 6)
        console.log("code1  :"+createBinaryString(char1))
        var char2 = (parseInt('00111111',2) & text.codePointAt(1) ) 
        console.log("code2  :"+createBinaryString(char2))
        var char3 = (parseInt('00111111',2) & text.codePointAt(2) ) 
        console.log("code3  :"+createBinaryString(char3))
        var char4 = (parseInt('00111111',2) & text.codePointAt(3) ) 
        console.log("code3  :"+createBinaryString(char4))
    }


    for(var i=0;i<max;i++){
            var c1=text.at(i);
            var c2=text.at(i+1);
            var c3=text.at(i+2);
            var c4=text.at(i+3);
            if(c1.codePointAt(0)>=parseInt('11000000',2) && c1.codePointAt(0)<=parseInt('11011111',2) && //char 1
                c2.codePointAt(0)>=parseInt('10000000',2) && c2.codePointAt(0)<=parseInt('10111111',2) //char 2
                ){ // probably error code in 2 bytes
                buf+=String.fromCodePoint(
                    ((parseInt('00111111',2) & c1.codePointAt(0) ) << 6) + 
                    (parseInt('00111111',2) & c2.codePointAt(0) ) 
                    )
                i=i+1;//merge character
                if(debug){
                    console.log("test1  :"+createBinaryString(((parseInt('00111111',2) & c1.codePointAt(0) ) << 6) ))
                    console.log("test2  :"+createBinaryString((parseInt('00111111',2) & c2.codePointAt(0) ) ))
                }
                changed=true
            }else if(c1.codePointAt(0)>=parseInt('11100000',2) && c1.codePointAt(0)<=parseInt('11101111',2) && //char 1
                    c2.codePointAt(0)>=parseInt('10000000',2) && c2.codePointAt(0)<=parseInt('10111111',2) && //char 2
                    c3.codePointAt(0)>=parseInt('10000000',2) && c3.codePointAt(0)<=parseInt('10111111',2)){ //char 3
                buf+=String.fromCodePoint(
                    ((parseInt('00011111',2) & c1.codePointAt(0) ) << 12) + //char1
                    ((parseInt('00111111',2) & c2.codePointAt(0) ) << 6) + //char2
                    (parseInt('00111111',2) & c3.codePointAt(0) ) //char 3
                    )// error code in 3 bytes
                i=i+2;//merge character
                if(debug){
                    console.log("test1  :"+createBinaryString(((parseInt('00011111',2) & c1.codePointAt(0) ) << 12)))
                    console.log("test2  :"+createBinaryString(((parseInt('00111111',2) & c2.codePointAt(0) ) << 6)))
                    console.log("test3  :"+createBinaryString((parseInt('00111111',2) & c3.codePointAt(0) )))
                }
                changed=true
            }else if(c1.codePointAt(0)>=parseInt('11110000',2) && c1.codePointAt(0)<=parseInt('11110111',2) && //char 1
                    c2.codePointAt(0)>=parseInt('10000000',2) && c2.codePointAt(0)<=parseInt('10111111',2) && //char 2
                    c3.codePointAt(0)>=parseInt('10000000',2) && c3.codePointAt(0)<=parseInt('10111111',2) && //char 3
                    c4.codePointAt(0)>=parseInt('10000000',2) && c4.codePointAt(0)<=parseInt('10111111',2)){ //char 4
                buf+=String.fromCodePoint(
                    ((parseInt('00001111',2) & c1.codePointAt(0) ) << 18) + //char1
                    ((parseInt('00111111',2) & c2.codePointAt(0) ) << 12) + //char2
                    ((parseInt('00111111',2) & c3.codePointAt(0) ) << 6) + //char3
                    (parseInt('00111111',2) & c4.codePointAt(0) ) //char 4
                    )// error code in 4 bytes
                i=i+3;//merge character
                if(debug){
                    console.log("test1  :"+createBinaryString(((parseInt('00011111',2) & c1.codePointAt(0) ) << 18)))
                    console.log("test2  :"+createBinaryString(((parseInt('00111111',2) & c2.codePointAt(0) ) << 12)))
                    console.log("test3  :"+createBinaryString(((parseInt('00111111',2) & c3.codePointAt(0) ) << 6)))
                    console.log("test4  :"+createBinaryString((parseInt('00111111',2) & c4.codePointAt(0) )))
                }
                changed=true
            }else if(c1.codePointAt(0)>=parseInt('11000000',2) && c1.codePointAt(0)<=parseInt('11011111',2) && //char 1
                c2.codePointAt(0)>=parseInt('110000000',2) && c2.codePointAt(0)<=parseInt('110111111',2) //char 2 9 bits?
                ){ // probably error code char 2 with 9 bits
                buf+=c1
                i=i+1;//merge character
                if(debug){
                    console.log("test1  :"+createBinaryString(((parseInt('00111111',2) & c1.codePointAt(0) ) << 6) ))
                    console.log("test2  :"+createBinaryString((parseInt('00111111',2) & c2.codePointAt(0) ) ))
                }
                changed=true
            }else{ // no miscode
                if(c1.codePointAt(0)>=parseInt('1111111111111111',2) && //char 1
                    c2.codePointAt(0)>=parseInt('11111111',2)  //char 2
                    ){ // 32 bit unicode
                        buf+=c1
                        i=i+1
                    }else{ //16 bit unicode
                        buf+=c1
                    }
                }
            }

    if(changed){
        buf=forceUTF8(buf) //recode again to fix multiple miscodings
    }
    return buf
}
function createBinaryString (nMask) {
  // nMask must be between -2147483648 and 2147483647
  for (var nFlag = 0, nShifted = nMask, sMask = ""; nFlag < 32;
       nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
  return sMask;
}
/**
 * The regex that parses a line of data from the IRCd
 * Deviates from the RFC a little to support the '/' character now used in some
 * IRCds
 */
var parse_regex = /^(?:@([^ ]+) )?(?::((?:(?:([^\s!@]+)(?:!([^\s@]+))?)@)?(\S+)) )?((?:[a-zA-Z]+)|(?:[0-9]{3}))(?: ([^:].*?))?(?: :(.*))?$/i;

function parseIrcLine(line) {
    var msg;
    var tags = Object.create(null);
    var msg_obj;

    // Parse the complete line, removing any carriage returns
    msg = parse_regex.exec(line.replace(/^\r+|\r+$/, ''));

    if (!msg) {
        // The line was not parsed correctly, must be malformed
        return;
    }

    // Extract any tags (msg[1])
    if (msg[1]) {
        msg[1].split(';').forEach(function(tag) {
            var parts = tag.split('=');
            tags[parts[0].toLowerCase()] = typeof parts[1] === 'undefined' ?
                true :
                parts[1];
        });
    }

    // Nick value will be in the prefix slot if a full user mask is not used
    msg_obj = {
        tags:       tags,
        prefix:     msg[2],
        nick:       msg[3] || msg[2],
        ident:      msg[4] || '',
        hostname:   msg[5] || '',
        command:    msg[6],
        params:     msg[7] ? msg[7].split(/ +/) : []
    };

    // Add the trailing param to the params list
    if (typeof msg[8] !== 'undefined') {
        msg_obj.params.push(msg[8].trimRight());
    }

    return msg_obj;
}
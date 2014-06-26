var _       = require("lodash");
var connect = require("connect");

module.exports = Shout;

/**
 * @class
 */
function Shout() {
	this.listen();
}

/**
 * @public
 */
Shout.prototype.listen = function() {
	var http = connect()
		.use(connect.static("client"))
		.listen(9000);
};

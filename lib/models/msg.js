var _ = require("lodash");
var moment = require("moment");

module.exports = Msg;

function Msg(attr) {
	_.merge(this, _.extend({
		time: moment().format("HH:mm"),
		type: "",
		from: "",
		text: "",
	}, attr));
};

const bcrypt = require("bcryptjs");

module.exports = {
	password: {
		hash(password) {
			return bcrypt.hashSync(password, bcrypt.genSaltSync(11));
		},
		compare(password, expected) {
			return bcrypt.compare(password, expected);
		},
		requiresUpdate(password) {
			return bcrypt.getRounds(password) !== 11;
		},
	},
};

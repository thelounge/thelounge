"use strict";

function findNames(text, users) {
	const result = [];
	let index = 0;
	users.forEach((nick) => {
		index = text.indexOf(nick, index);
		result.push({
			start: index,
			end: index + nick.length,
			nick: nick,
		});
	});
	return result;
}

module.exports = findNames;

"use strict";

function anyIntersection(a, b) {
	return a.start <= b.start && b.start < a.end ||
		a.start < b.end && b.end <= a.end ||
		b.start <= a.start && a.start < b.end ||
		b.start < a.end && a.end <= b.end;
}

module.exports = anyIntersection;

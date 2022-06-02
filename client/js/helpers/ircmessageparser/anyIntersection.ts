// Return true if any section of "a" or "b" parts (defined by their start/end

import {Part} from "./merge";

// markers) intersect each other, false otherwise.
function anyIntersection(a: Part, b: Part) {
	return (
		(a.start <= b.start && b.start < a.end) ||
		(a.start < b.end && b.end <= a.end) ||
		(b.start <= a.start && a.start < b.end) ||
		(b.start < a.end && a.end <= b.end)
	);
}

export default anyIntersection;

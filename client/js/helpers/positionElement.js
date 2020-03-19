"use strict";

// Set the absolute position of an element to x,y optionally anchoring
// it by it's right and/or bottom edge (defaults to left, top)
export default (element, x, y, hAnchor, vAnchor) => {
	const elementWidth = element.offsetWidth;
	const elementHeight = element.offsetHeight;

	const offset = {
		left: x - (hAnchor === "right" ? elementWidth : 0),
		top: y - (vAnchor === "bottom" ? elementHeight : 0),
	};

	// If the offset would place the element out of viewport, move it back in
	if (offset.left < 0) {
		offset.left = 0;
	}

	if (offset.top < 0) {
		offset.top = 0;
	}

	if (window.innerWidth - offset.left < elementWidth) {
		offset.left = window.innerWidth - elementWidth;
	}

	if (window.innerHeight - offset.top < elementHeight) {
		offset.top = window.innerHeight - elementHeight;
	}

	element.style.left = offset.left + "px";
	element.style.top = offset.top + "px";
};

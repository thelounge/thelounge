"use strict";

module.exports = function(chat) {
	const selection = window.getSelection();

	// If selection does not span multiple elements, do nothing
	if (selection.anchorNode === selection.focusNode) {
		return;
	}

	const range = selection.getRangeAt(0);
	const documentFragment = range.cloneContents();
	const div = document.createElement("div");

	div.id = "js-copy-hack";
	div.appendChild(documentFragment);
	chat.appendChild(div);

	selection.selectAllChildren(div);

	window.setTimeout(() => {
		chat.removeChild(div);
		selection.removeAllRanges();
		selection.addRange(range);
	}, 0);
};

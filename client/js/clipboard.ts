export default function (chat: HTMLDivElement) {
	// Disable in Firefox as it already copies flex text correctly
	// Check if InstallTrigger exists as a property on window (Firefox-specific)
	if ("InstallTrigger" in window) {
		return;
	}

	const selection = window.getSelection();

	if (!selection) {
		return;
	}

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
}

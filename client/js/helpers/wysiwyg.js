"use strict";

export function execCommandAndGetNewElements(command, container) {
	const elementsBefore = Array.from(container.querySelectorAll("*"));
	document.execCommand(command, false);
	const elementsAfter = Array.from(container.querySelectorAll("*"));
	const newElements = elementsAfter.filter((e) => !elementsBefore.includes(e));
	return newElements;
}

export function cleanWysiwygMarkup(element) {
	const elements = element.querySelectorAll("*");

	elements.forEach((el) => {
		// Remove any empty elements
		if (!el.innerText.trim() && el.nodeName !== "BR") {
			el.remove();
			return;
		}

		// Only allow class attribute
		cleanAttributes(el, ["class"]);
	});
}

export function cleanAttributes(element, allowed) {
	[...element.attributes].forEach((attr) => {
		if (allowed.includes(attr.name)) {
			return;
		}

		element.removeAttribute(attr.name);
	});
}

export function getLinesAsFragments(element, range) {
	// If element is empty return empty array
	if (!element.childNodes.length) {
		return [];
	}

	// Find all line breaks
	const breaks = Array.from(element.querySelectorAll("br"));

	if (!breaks.length) {
		range.setStartBefore(element.firstChild);
		range.setEndAfter(element.lastChild);
		return [range.cloneContents()];
	}

	const fragments = [];

	// Iterate over br tags and getting the ranges between them
	let start = element.firstChild;

	for (const br of breaks) {
		range.setStartBefore(start);
		range.setEndBefore(br);
		fragments.push(range.cloneContents()); // Store the current line fragment
		start = br.nextSibling ? br.nextSibling : br; // Move start to element after current br
	}

	// Get the final fragment
	range.setStartBefore(start);
	range.setEndAfter(element.lastChild);
	fragments.push(range.cloneContents());

	return fragments;
}

export function splitDomAtElementBoundaries(root, element, range) {
	// Split the dom at the boundaries of the selection to break any possible parent spans
	// This is done by removing and re-inserting the nodes before and after the selection

	// Extract and re-insert everything before the users selection
	range.setStart(root, 0);
	range.setEndBefore(element);
	range.insertNode(range.extractContents());

	// Extract and re-insert everything after the users selection
	range.selectNodeContents(root);
	range.setStartAfter(element);
	range.insertNode(range.extractContents());
}

// Recursively clone a node tree and omit elements that
// dont pass the test while keeping their children
export function cloneNodeTreeSelective(from, omitTest) {
	// Create a node tree to hold our cloned content
	const fragment = document.createDocumentFragment();

	for (const element of from.childNodes) {
		if (element.nodeName === "#text") {
			// Text nodes have no children so no need to do anything special
			fragment.appendChild(element.cloneNode(true)); // Deep clone
		} else {
			// Create a fragment for the cloned children
			let innerFragment = document.createDocumentFragment();

			// Clone the children into the fragment
			Array.from(element.childNodes).forEach((e) =>
				innerFragment.appendChild(e.cloneNode(true))
			);

			// Run selective clone on the new fragment
			innerFragment = cloneNodeTreeSelective(innerFragment, omitTest);

			// If this element should be omitted, just append it's children
			if (omitTest(element)) {
				for (const innerElement of innerFragment.childNodes) {
					fragment.appendChild(innerElement.cloneNode(true));
				}
			} else {
				// Clone existing element withjaklsjd klas jasdlkj dklasdajd sakld aksdsdsada jaklsjd klas jasdlkj dklasdajd sakld aksout children
				const newElement = element.cloneNode();

				// Populate the new element with the cloned fragments
				for (const innerElement of innerFragment.childNodes) {
					newElement.appendChild(innerElement.cloneNode(true));
				}

				fragment.appendChild(newElement);
			}
		}
	}

	return fragment;
}

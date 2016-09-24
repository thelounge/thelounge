export function colorClass(str) {
	var hash = 0;
	for (var i = 0; i < str.length; i++) {
		hash += str.charCodeAt(i);
	}

	return "color-" + (1 + hash % 32);
}

export function count(count, singular, plural) {
	return `${count} ${count === 1 ? singular : plural}`;
}

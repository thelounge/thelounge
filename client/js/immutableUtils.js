export function setIn(obj, selectors, value) {
	return updateIn(obj, selectors, () => value);
}

export function updateIn(obj, [selector, ...rest], fn) {
	return {
		...obj,
		[selector]:
			rest.length
				? updateIn(obj[selector], rest, fn)
				: fn(obj[selector])
	};
}

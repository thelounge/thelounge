const modules = import.meta.glob("./*.vue", {eager: true}) as Record<string, {default: any}>;

export default Object.fromEntries(
	Object.entries(modules).map(([path, mod]) => [
		"message-" + path.slice(2, -4),
		mod.default,
	])
);

export default (count: number) => {
	const suffixes = [
		{divisor: 1, suffix: ""},
		{divisor: 1000, suffix: "k"},
		{divisor: 1000000, suffix: "m"},
	];

	const {divisor, suffix} =
		suffixes[Math.min(suffixes.length - 1, Math.floor(Math.log10(count) / 3))];

	return String(Math.ceil((count / divisor) * 10) / 10).concat(suffix);
};

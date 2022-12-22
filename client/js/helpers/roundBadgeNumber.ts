export default (count: number) => {
	if (count < 1000) {
		return count.toString();
	}

	const suffixes = ["", "k", "M"];
	const magnitudeIndex = Math.min(Math.floor(Math.log10(count) / 3), suffixes.length - 1);
	const magnitude = 1000 ** magnitudeIndex;
	const roundedCount = (count / magnitude).toFixed(1);
	return roundedCount + suffixes[magnitudeIndex];
};

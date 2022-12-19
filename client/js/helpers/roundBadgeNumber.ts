export default (count: number) => {
	if (count < 1000) {
		return count.toString();
	}

	if (count >= 1000 && count < 1000000) {
		return (count / 1000).toFixed(2).slice(0, -1) + "k";
	}

	if (count >= 1000000) {
		return (count / 1000000).toFixed(2).slice(0, -1) + "m";
	}
};

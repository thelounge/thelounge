export default (count: number) => {
	if (count < 1000) {
		return count.toString();
	}

	return (count / 1000).toFixed(2).slice(0, -1) + "k";
};

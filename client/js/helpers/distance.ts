function distance([x1, y1]: [number, number], [x2, y2]: [number, number]) {
	return Math.hypot(x1 - x2, y1 - y2);
}

export default distance;

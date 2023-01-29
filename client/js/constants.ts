const colorCodeMap = [
	["00", "White"],
	["01", "Black"],
	["02", "Blue"],
	["03", "Green"],
	["04", "Red"],
	["05", "Brown"],
	["06", "Magenta"],
	["07", "Orange"],
	["08", "Yellow"],
	["09", "Light Green"],
	["10", "Cyan"],
	["11", "Light Cyan"],
	["12", "Light Blue"],
	["13", "Pink"],
	["14", "Grey"],
	["15", "Light Grey"],
];

const timeFormats = {
	msgDefault: "HH:mm",
	msgWithSeconds: "HH:mm:ss",
	msg12h: "hh:mm A",
	msg12hWithSeconds: "hh:mm:ss A",
};

export default {
	colorCodeMap,
	commands: [] as string[],
	timeFormats,
	// Same value as media query in CSS that forces sidebars to become overlays
	mobileViewportPixels: 768,
};

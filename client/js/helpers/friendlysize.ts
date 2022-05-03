"use strict";

const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB"];

export default (size) => {
	// Loosely inspired from https://stackoverflow.com/a/18650828/1935861
	const i = size > 0 ? Math.floor(Math.log(size) / Math.log(1024)) : 0;
	const fixedSize = parseFloat((size / Math.pow(1024, i)).toFixed(1));
	return `${fixedSize} ${sizes[i]}`;
};

import colors from "chalk";
import read from "read";

function timestamp() {
	const datetime = new Date().toISOString().split(".")[0].replace("T", " ");

	return colors.dim(datetime);
}

const log = {
	/* eslint-disable no-console */
	error(...args: string[]) {
		console.error(timestamp(), colors.red("[ERROR]"), ...args);
	},
	warn(...args: string[]) {
		console.error(timestamp(), colors.yellow("[WARN]"), ...args);
	},
	info(...args: string[]) {
		console.log(timestamp(), colors.blue("[INFO]"), ...args);
	},
	debug(...args: string[]) {
		console.log(timestamp(), colors.green("[DEBUG]"), ...args);
	},
	raw(...args: string[]) {
		console.log(...args);
	},
	/* eslint-enable no-console */

	prompt(
		options: {prompt?: string; default?: string; text: string; silent?: boolean},
		callback: (error, result, isDefault) => void
	): void {
		options.prompt = [timestamp(), colors.cyan("[PROMPT]"), options.text].join(" ");
		read(options, callback);
	},
};

export default log;

import colors from "chalk";
import {read} from "read";

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

	async prompt(options: {
		prompt?: string;
		default?: string;
		text: string;
		silent?: boolean;
	}): Promise<string> {
		const promptText = [timestamp(), colors.cyan("[PROMPT]"), options.text].join(" ");
		const result = await read({
			default: options.default,
			prompt: promptText,
			silent: options.silent,
		});
		return String(result);
	},
};

export default log;

import {styleText} from "util";

type Style = Parameters<typeof styleText>[0];

function style(format: Style) {
	return (text: string | number) => styleText(format, String(text));
}

const colors = {
	bold: Object.assign(style("bold"), {
		red: style(["bold", "red"]),
	}),
	dim: style("dim"),
	red: style("red"),
	green: style("green"),
	yellow: style("yellow"),
	blue: style("blue"),
	cyan: style("cyan"),
};

export default colors;

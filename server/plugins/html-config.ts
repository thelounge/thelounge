import Config from "../config";
import packages from "./packages/index";

function escapeAttr(str: string): string {
	return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

export function injectServerConfig(html: string): string {
	const theme = escapeAttr(Config.values.theme);
	const themeColor = escapeAttr(Config.values.themeColor);
	const stylesheets = packages.getStylesheets();

	const themeLink = `<link id="theme" rel="stylesheet" href="themes/${theme}.css" data-server-theme="${theme}">`;
	const packageLinks = stylesheets
		.map((css) => `\t<link rel="stylesheet" href="packages/${escapeAttr(css)}">`)
		.join("\n");

	return html
		.replace("<!--thelounge-theme-->", themeLink)
		.replace(/<!--thelounge-themecolor-->/g, themeColor)
		.replace("<!--thelounge-packages-->", packageLinks)
		.replace("<!--thelounge-bodyclass-->", Config.values.public ? "public" : "")
		.replace(
			"<!--thelounge-transports-->",
			escapeAttr(JSON.stringify(Config.values.transports))
		);
}

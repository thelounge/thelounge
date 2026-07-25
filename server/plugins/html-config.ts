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

	// Inject theme/package CSS after Vite's styles so theme overrides take effect
	const headInsert = [themeLink, packageLinks, `<style id="user-specified-css"></style>`]
		.filter(Boolean)
		.join("\n\t");

	return html
		.replace("</head>", `\t${headInsert}\n\t</head>`)
		.replace(/<!--thelounge-themecolor-->/g, themeColor)
		.replace("<!--thelounge-bodyclass-->", Config.values.public ? "public" : "")
		.replace(
			"<!--thelounge-transports-->",
			escapeAttr(JSON.stringify(Config.values.transports))
		);
}

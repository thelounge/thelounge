import LinkifyIt, {Match} from "linkify-it";
import {Part} from "./merge";

export type LinkPart = Part & {
	link: string;
};

type OurMatch = Match & {
	noschema?: boolean;
};

LinkifyIt.prototype.normalize = function normalize(match: OurMatch) {
	if (!match.schema) {
		match.schema = "http:";
		match.url = "http://" + match.url;
		match.noschema = true;
	}

	if (match.schema === "//") {
		match.schema = "http:";
		match.url = "http:" + match.url;
		match.noschema = true;
	}

	if (match.schema === "mailto:" && !/^mailto:/i.test(match.url)) {
		match.url = "mailto:" + match.url;
	}
};

import tlds from "tlds";
const linkify = LinkifyIt().tlds(tlds).tlds("onion", true);

// Known schemes to detect in text
const commonSchemes = [
	"sftp",
	"smb",
	"file",
	"irc",
	"ircs",
	"svn",
	"git",
	"steam",
	"mumble",
	"ts3server",
	"svn+ssh",
	"ssh",
	"gopher",
	"gemini",
];

for (const schema of commonSchemes) {
	linkify.add(schema + ":", "http:");
}

function findLinks(text: string) {
	const matches = linkify.match(text) as OurMatch[];

	if (!matches) {
		return [];
	}

	return matches.map(returnUrl);
}

function findLinksWithSchema(text: string) {
	const matches = linkify.match(text) as OurMatch[];

	if (!matches) {
		return [];
	}

	return matches.filter((url) => !url.noschema).map(returnUrl);
}

function returnUrl(url: OurMatch): LinkPart {
	return {
		start: url.index,
		end: url.lastIndex,
		link: url.url,
	};
}

export {findLinks, findLinksWithSchema};

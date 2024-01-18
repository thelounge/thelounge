import LinkifyIt, {Match} from "linkify-it";
import tlds from "tlds";

export type NoSchemaMatch = Match & {
	noschema: boolean;
};

export type LinkPart = {
	start: number;
	end: number;
	link: string;
};

const webplus_scheme_chars = /^[a-z]+:/i;

LinkifyIt.prototype.normalize = function normalize(match: NoSchemaMatch) {
	match.noschema = false;

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

	if (match.schema === "web+") {
		match.schema = "web+" + match.url.slice(4).match(webplus_scheme_chars)![0];
	}

	if (match.schema === "mailto:" && !/^mailto:/i.test(match.url)) {
		match.url = "mailto:" + match.url;
	}
};

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

linkify.add("web+", {
	validate(text: string, pos: number, self: LinkifyIt.LinkifyIt) {
		const tail = text.slice(pos);

		if (webplus_scheme_chars.test(tail)) {
			const offset = tail.match(webplus_scheme_chars)![0].length;
			const result = self.testSchemaAt(text, "http:", pos + offset);

			if (result === 0) {
				return 0;
			}

			return offset + result;
		}

		return 0;
	},
});

export function findLinks(text: string) {
	const matches = linkify.match(text) as NoSchemaMatch[];

	if (!matches) {
		return [];
	}

	return matches.map(makeLinkPart);
}

export function findLinksWithSchema(text: string) {
	const matches = linkify.match(text) as NoSchemaMatch[];

	if (!matches) {
		return [];
	}

	return matches.filter((url) => !url.noschema).map(makeLinkPart);
}

function makeLinkPart(url: NoSchemaMatch): LinkPart {
	return {
		start: url.index,
		end: url.lastIndex,
		link: url.url,
	};
}

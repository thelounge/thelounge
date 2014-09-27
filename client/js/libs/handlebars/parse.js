function escape(text) {
	var e = {
		"<": "&lt;",
		">": "&gt;",
		"'": "&#39;"
	};
	return text.replace(/[<>']/g, function (c) {
		return e[c];
	});
}

Handlebars.registerHelper(
	"parse", function(text) {
		text = uri(text);
		text = wraplong(text);
		return text;
	}
);

function uri(text) {
	var urls = [];
	text = URI.withinString(text, function(url) {
		urls.push(url);
		return "$(" + (urls.length - 1) + ")";
	});
	text = escape(text);
	for (var i in urls) {
		var url = escape(urls[i]);
		var replace = url;
		if (url.indexOf("javascript:") !== 0) {
			replace = "<a href='" + url.replace(/^www/, "//www") + "' target='_blank'>" + url + "</a>";
		}
		text = text.replace(
			"$(" + i + ")", replace
		);
	}
	return text;
}

function wraplong(text) {
	var wrap = false;
	var split = text.split(" ");
	for (var i in split) {
		if (split[i].length > 40) {
			wrap = true;
		}
	}
	if (wrap) {
		return "<i class='wrap'>" + text + "</i>";
	} else {
		return text;
	}
}

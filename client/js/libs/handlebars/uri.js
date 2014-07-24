function escape(text) {
	var e = {
		"<": "&lt;",
		">": "&gt;"
	};
	return text.replace(/[<>]/g, function (c) {
		return e[c];
	});
}

Handlebars.registerHelper(
	"uri", function(text) {
		var urls = [];
		text = URI.withinString(text, function(url) {
			urls.push(url);
			return "$(" + (urls.length - 1) + ")";
		});
		text = escape(text);
		for (var i in urls) {
			var url = escape(urls[i]);
			text = text.replace(
				"$(" + i + ")",
				"<a href='" + url.replace(/^www/, "//www") + "' target='_blank'>" + url + "</a>"
			);
		}
		return text;
	}
);

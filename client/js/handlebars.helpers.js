Handlebars.registerHelper(
	"slice", function(items, block) {
		var limit = block.hash.limit;
		var rows = [];
		items.forEach(function(i) {
			rows.push(block.fn(i));
		});
		var html = "";
		var hide = rows
			.slice(0, Math.max(0, rows.length - limit))
			.join("");
		if (hide != "") {
			html = "<script type='text/html' class='hidden'>" + hide + "</script>";
		}
		html += rows.slice(-limit).join("");
		return html;
	}
);

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
		text = escape(text);
		return URI.withinString(text, function(url) {
			return "<a href='" + url.replace(/^www/, "//www") + "' target='_blank'>" + url + "</a>";
		});
	}
);

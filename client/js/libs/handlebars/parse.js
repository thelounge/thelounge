Handlebars.registerHelper(
	"parse", function(text) {
		var wrap = wraplong(text);
		text = escape(text);
		text = colors(text);
		text = uri(text);
		if (wrap) {
			return "<i class='wrap'>" + text + "</i>";
		} else {
			return text;
		}
	}
);

function wraplong(text) {
	var wrap = false;
	var split = text.split(" ");
	for (var i in split) {
		if (split[i].length > 40) {
			wrap = true;
		}
	}
	return wrap;
}

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

function uri(text) {
	return URI.withinString(text, function(url, start, end, source) {
		if (url.indexOf("javascript:") === 0) {
			return url;
		}
		var split = url.split("<");
		url = "<a href='" + split[0].replace(/^www/, "//www") + "' target='_blank'>" + split[0] + "</a>";
		if (split[1]) {
			url += "<" + split[1];
		}
		return url;
	});
}

var regex = {
	color: /\003([0-9]{1,2})[,]?([0-9]{1,2})?([^\003]+)/,
	styles: [
        [/\002([^\002]+)(\002)?/, ["<b>", "</b>"]],
        [/\037([^\037]+)(\037)?/, ["<u>", "</u>"]],
    ]
};
function colors(text) {
	if (!text) {
		return text;
	}
    if (regex.color.test(text)) {
    	var match, bg;
        while (match = regex.color.exec(text)) {
            var color = "color-" + match[1];
            if (match[2]) {
            	bg = match[2];
            }
            if (bg) {
           		color += " bg-" + bg;
           	}
            var text = text.replace(
            	match[0],
            	"<span class='" + color + "'>" + match[3] + "</span>"
            );
        }
    }
    for (var i in regex.styles) {
        var pattern = regex.styles[i][0];
        var style = regex.styles[i][1];
        if (pattern.test(text)) {
        	var match;
            while (match = pattern.exec(text)) {
                text = text.replace(match[0], style[0] + match[1] + style[1]);
            }
        }
    }
    return text;
}

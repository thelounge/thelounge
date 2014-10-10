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
	return URI.withinString(text, function(url) {
		if (url.indexOf("javascript:") !== 0) {
			console.log(url);
			return "<a href='" + url.replace(/^www/, "//www") + "' target='_blank'>" + url + "</a>";
		} else {
			return url;
		}
	});
}

function colors(text) {
	if (!text) {
		return text;
	}
    var regex = /\003([0-9]{1,2})[,]?([0-9]{1,2})?([^\003]+)/;
    if (regex.test(text)) {
    	var match;
        while (match = regex.exec(text)) {
            var color = "color-" + match[1];
            var bg = match[2];
            if (bg) {
           		color += " bg-" + bg;
           	}
            var text = text.replace(
            	match[0],
            	"<span class='" + color + "'>" + match[3] + "</span>"
            );
        }
    }
    var styles = [
        [/\002([^\002]+)(\002)?/, ["<b>", "</b>"]],
        [/\037([^\037]+)(\037)?/, ["<u>", "</u>"]],
    ];
    for (var i in styles) {
        var regex = styles[i][0];
        var style = styles[i][1];
        if (regex.test(text)) {
        	var match;
            while (match = regex.exec(text)) {
                text = text.replace(match[0], style[0] + match[1] + style[1]);
            }
        }
    }
    return text;
}

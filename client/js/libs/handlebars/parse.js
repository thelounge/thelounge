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
		if (split.length > 1) {
			url += "<" + split.slice(1).join("<");
		}
		return url;
	});
}


/**
 * MIRC compliant colour and style parser
 * Unfortuanately this is a non trivial operation
 * See this branch for source and tests
 * https://github.com/megawac/irc-style-parser/tree/shout
 */
var styleCheck_Re = /[\x00-\x1F]/,
    back_re = /^([0-9]{1,2})(,([0-9]{1,2}))?/,
    colourKey = "\x03",
    // breaks all open styles ^O (\x0F)
    styleBreak = "\x0F";


function styleTemplate(settings) {
    return "<span class='" + settings.style + "'>" + settings.text + "</span>";
}

var styles = [
    ["normal", "\x00", ""], ["underline", "\x1F"],
    ["bold", "\x02"], ["italic", "\x1D"]
].map(function(style) {
    var escaped = encodeURI(style[1]).replace("%", "\\x");
    return {
        name: style[0],
        style: style[2] != null ? style[2] : "irc-" + style[0],
        key: style[1],
        keyregex: new RegExp(escaped + "(.*?)(" + escaped + "|$)")
    };
});

function colors(line) {
    // http://www.mirc.com/colors.html
    // http://www.aviran.org/stripremove-irc-client-control-characters/
    // https://github.com/perl6/mu/blob/master/examples/rules/Grammar-IRC.pm
    // regexs are cruel to parse this thing

    // already done?
    if (!styleCheck_Re.test(line)) return line;

    // split up by the irc style break character ^O
    if (line.indexOf(styleBreak) >= 0) {
        return line.split(styleBreak).map(colors).join("");
    }

    var result = line;
    var parseArr = result.split(colourKey);
    var text, match, colour, background = "";
    for (var i = 0; i < parseArr.length; i++) {
        text = parseArr[i];
        match = text.match(back_re);
        if (!match) {
            // ^C (no colour) ending. Escape current colour and carry on
            background = "";
            continue;
        }
		colour = "irc-fg" + +match[1];
		// set the background colour
		if (match[3]) {
			background = " irc-bg" + +match[3];
		}
        // update the parsed text result
        result = result.replace(colourKey + text, styleTemplate({
            style: colour + background,
            text: text.slice(match[0].length)
        }));
    }

    // Matching styles (italics/bold/underline)
    // if only colours were this easy...
    styles.forEach(function(style) {
        if (result.indexOf(style.key) < 0) return;
        result = result.replace(style.keyregex, function(match, text) {
            return styleTemplate({
                "style": style.style,
                "text": text
            });
        });
    });

    return result;
}

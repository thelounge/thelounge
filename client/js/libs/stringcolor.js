/*!
 * stringcolor
 * Generate a consistent color from any string.
 *
 * Source:
 * https://github.com/erming/stringcolor
 *
 * Version 0.2.0
 */
(function($) {
	/**
	 * Generate hex color code from a string.
	 *
	 * @param {String} string
	 */
	$.stringcolor = function(string) {
		return "#" + stringcolor(string);
	};

	/**
	 * Set one or more CSS properties for the set of matched elements.
	 *
	 * @param {String|Array} property
	 * @param {String} string
	 */
	$.fn.stringcolor = function(property, string) {
		if (!property || !string) {
			throw new Error("$(selector).string_to_color() takes 2 arguments");
		}
		return this.each(function() {
			var props = [].concat(property);
			var $this = $(this);
			$.map(props, function(p) {
				$this.css(p, $.stringcolor(string));
			});
		});
	};
})(jQuery);

/*!
 * Name: string_to_color
 * Author: Brandon Corbin [code@icorbin.com]
 * Website: http://icorbin.com
 */
function string_to_color(str) {
	// Generate a Hash for the String
	var hash = function(word) {
		var h = 0;
		for (var i = 0; i < word.length; i++) {
			h = word.charCodeAt(i) + ((h << 5) - h);
		}
		return h;
	};

	// Change the darkness or lightness
	var shade = function(color, prc) {
		var num = parseInt(color, 16),
		    amt = Math.round(2.55 * prc),
		    R = (num >> 16) + amt,
		    G = (num >> 8 & 0x00FF) + amt,
		    B = (num & 0x0000FF) + amt;
		return (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
			(G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
			(B < 255 ? B < 1 ? 0 : B : 255))
			.toString(16)
			.slice(1);
	};

	// Convert init to an RGBA
	var int_to_rgba = function(i) {
		var color = ((i >> 24) & 0xFF).toString(16) +
			((i >> 16) & 0xFF).toString(16) +
			((i >> 8) & 0xFF).toString(16) +
			(i & 0xFF).toString(16);
		return color;
	};

	return shade(
		int_to_rgba(hash(str)),
		-10
	);
}

var cache = {};
function stringcolor(str) {
	return cache[str] = cache[str] || string_to_color(str);
}

/*!
 * inputHistory
 * https://github.com/erming/inputHistory
 *
 * Copyright (c) 2014 Mattias Erming <mattias@mattiaserming.com>
 * Licensed under the MIT License.
 *
 * Version 0.1.1
 */

(function($) {
	$.fn.inputHistory = function(options) {
		var settings = $.extend({
			history: [],
			submit: false,
		}, options);
		
		var self = this;
		if (self.size() > 1) {
			return self.each(function() {
				$(this).inputHistory(options);
			});
		}
		
		self.data('history', settings.history.concat(['']));
		
		var i = 0;
		self.on('keydown', function(e) {
			var history = self.data('history');
			var key = e.which;
			switch (key) {
			
			case 13: // Enter
				if (self.val() != '') {
					i = history.length;
					history[i - 1] = self.val();
					history.push('');
				}
				if (settings.submit) {
					self.parents('form').eq(0).submit();
				}
				self.val('');
				break;
			
			case 38: // Up
			case 40: // Down
				history[i] = self.val();
				if (key == 38 && i != 0) {
					i--;
				} else if (key == 40 && i < history.length - 1) {
					i++;
				}
				self.val(history[i]);
				break;
			
			default:
				return;
			
			}
			
			return false;
		});
		
		return this;
	}
})(jQuery);

/*!
 * scrollGlue
 * https://github.com/erming/scrollGlue
 *
 * Copyright (c) 2014 Mattias Erming <mattias@mattiaserming.com>
 * Licensed under the MIT License.
 *
 * Version 0.2.1
 */

(function($) {
	$.fn.scrollGlue = function(options) {
		var settings = $.extend({
			speed: 0
		}, options);

		var self = this;
		if (self.size() > 1) {
			return self.each(function() {
				$(this).scrollGlue(options);
			});
		}

		$(window).on('resize', function() {
			self.finish();
		});

		var sticky = false;
		self.on('scroll', function() {
			sticky = self.isScrollAtBottom();
		});
		self.trigger('scroll');
		self.on('append', function() {
			if (sticky) {
				self.scrollToBottom(settings.speed);
			}
		});

		return this;
	};

	var append = $.fn.append;
	$.fn.append = function() {
		return append.apply(this, arguments).trigger('append');
	};
	
	var prepend = $.fn.prepend;
	$.fn.prepend = function() {
		return prepend.apply(this, arguments).trigger('append');
	};

	var html = $.fn.html;
	$.fn.html = function(string) {
		var result = html.apply(this, arguments);
		if (typeof string !== 'undefined') {
			this.trigger('append');
		}
		return result;
	};
	
	$.fn.scrollToBottom = function(speed) {
		return this.each(function() {
			$(this).finish().animate({scrollTop: this.scrollHeight}, speed || 0);
		});
	};

	$.fn.isScrollAtBottom = function() {
		if ((this.scrollTop() + this.outerHeight() + 1) >= this.prop('scrollHeight')) {
			return true;
		}
	};
})(jQuery);

/*!
 * tabComplete
 * https://github.com/erming/tabComplete
 *
 * Copyright (c) 2014 Mattias Erming <mattias@mattiaserming.com>
 * Licensed under the MIT License.
 *
 * Version 0.2.2
 */

(function($) {
	$.fn.tabComplete = function(options) {
		var settings = $.extend({
			after: '',
			caseSensitive: false,
			list: [],
		}, options);
		
		var self = this;
		if (self.size() > 1) {
			return self.each(function() {
				$(this).tabComplete(options);
			});
		}
		
		// Keep the list stored in the DOM via jQuery.data()
		self.data('list', settings.list);
		
		var match = [];
		self.on('keydown', function(e) {
			var key = e.which;
			if (key != 9) {
				match = [];
				return;
			}
			
			var text = self.val().trim().split(' ');
			var last = text.splice(-1)[0];
			
			if (!match.length) {
				match = $.grep(self.data('list'), function(w) {
					var l = last;
					if (l == '') {
						return;
					}
					if (!settings.caseSensitive) {
						l = l.toLowerCase();
						w = w.toLowerCase();
					}
					return w.indexOf(l) == 0;
				});
			}
			
			var i = match.indexOf(last) + 1;
			if (i == match.length) {
				i = 0;
			}
			
			if (match.length) {
				text.push(match[i]);
				self.val(text.join(' ') + settings.after);
			}
			
			return false;
		});
		
		return this;
	};
})(jQuery);

/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
		} catch(e) {
			return;
		}

		try {
			// If we can't parse the cookie, ignore it, it's unusable.
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write
		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== undefined) {
			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return true;
		}
		return false;
	};

}));

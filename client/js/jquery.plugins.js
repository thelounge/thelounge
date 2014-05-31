/*!
 * stickyscroll
 * https://github.com/erming/stickyscroll
 *
 * Copyright (c) 2014 Mattias Erming <mattias@mattiaserming.com>
 * Licensed under the MIT License.
 *
 * Version 1.3.1
 */
(function($) {
	$.fn.sticky = function(options) {
		var settings = $.extend({
			disableManualScroll: false,
			overflow: 'auto',
			scrollToBottom: true,
			speed: 0
		}, options);
		
		var self = this;
		if (self.size() > 1) {
			return self.each(function() {
				$(this).sticky(options);
			});
		}
		
		self.css('overflow-y', settings.overflow);
		self.css('-webkit-overflow-scrolling', 'touch');
		if (settings.scrollToBottom) {
			self.scrollToBottom();
		}
		
		var resizeTimer;
		var resizing = false;
		$(window).on('resize', function() {
			self.finish();
			
			// This will prevent the scroll event from triggering
			// while resizing the browser.
			resizing = true;
			
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function() {
				resizing = false;
			}, 100);
			
			if (sticky) {
				self.scrollToBottom();
			}
		});
		
		var scrollTimer;
		var sticky = true;
		self.on('scroll', function() {
			if (settings.disableManualScroll) {
				self.scrollToBottom();
			} else if (!resizing) {
				clearTimeout(scrollTimer);
				scrollTimer = setTimeout(function() {
					sticky = self.isScrollAtBottom();
				}, 50);
			}
		});
		self.trigger('scroll');
		self.on('prepend append', function() {
			if (sticky) {
				self.scrollToBottom(settings.speed);
			}
		});
		
		return this;
	};
	
	// Normally, these functions won't trigger any events.
	// Lets override them.
	var events = ['prepend', 'append'];
	$.each(events, function(i, e) {
		var fn = $.fn[e];
		$.fn[e] = function() {
			return fn.apply(this, arguments).trigger(e);
		};
	});
	
	$.fn.isScrollAtBottom = function() {
		if ((this.scrollTop() + this.outerHeight() + 1) >= this.prop('scrollHeight')) {
			return true;
		}
	};
	
	$.fn.scrollToBottom = function(speed) {
		return this.each(function() {
			$(this).finish().animate({scrollTop: this.scrollHeight}, speed || 0);
		});
	};
})(jQuery);

/*!
 * tabComplete
 * Lightweight tab completion for <input> and <textarea>
 *
 * Source:
 * https://github.com/erming/tabComplete
 *
 * Copyright (c) 2014 Mattias Erming <mattias@mattiaserming.com>
 * Licensed under the MIT License.
 *
 * Version 1.1.1
 */
(function($) {
	var keys = {
		tab: 9,
		up: 38,
		down: 40
	};
	
	$.fn.tabComplete = function(args, options) {
		if (this.length > 1) {
			return this.each(function() {
				$(this).tabComplete(args, options);
			});
		}
		
		// Only enable the plugin on <input> and <textarea> elements.
		var tag = this.prop("tagName");
		if (tag != "INPUT" && tag != "TEXTAREA") {
			return;
		}
		
		// Set default options.
		options = $.extend({
			after: "",
			arrowKeys: tag == "INPUT" ? true : false,
			caseSensitive: false,
			hint: true,
			minLength: 1,
			onTabComplete: $.noop
		}, options);
		
		// Unbind namespace.
		// This allows us to override the plugin if necessary.
		this.unbind(".tabComplete");
		
		var self = this;
		var i = -1;
		var words = [];
		var last = "";
		
		this.on("input.tabComplete", function(e) {
			var input = self.val();
			var word = input.split(/ |\n/).pop();
			
			if (!word) {
				i = -1;
				words = [];
				last = "";
			} else if (typeof args === "function") {
				// If the user supplies a function, invoke it
				// and keep the result.
				words = args(word);
			} else {
				// Otherwise, call the .match() function.
				words = match(args, word, options.caseSensitive);
			}
			
			// Emit the number of matching words with the 'match' event.
			self.trigger("match", words.length);
			
			if (options.hint) {
				if (word.length >= options.minLength && words.length) {
					hint.call(self, words[0]);
				} else {
					// Clear hinting.
					// This call is needed when using backspace.
					hint.call(self, "");
				}
			}
		});
		
		this.on("keydown.tabComplete", function(e) {
			var key = e.which;
			if (key == keys.tab || (options.arrowKeys && (key == keys.up || key == keys.down))) { 
				// Don't lose focus on tab click.
				e.preventDefault();
				
				// Iterate the matches with tab and the up and down keys by incrementing
				// or decrementing the 'i' variable.
				if (key != keys.up) {
					i++;
				} else {
					if (i == -1) return;
					if (i == 0) {
						// Jump to the last word.
						i = words.length - 1;
					} else {
						i--;
					}
				}
					
				// Get next match.
				var word = words[i % words.length];
				if (!word) {
					return;
				}
				
				var input = self.val().trim();
				last = last || input.split(/ |\n/).pop();
				
				if (last.length < options.minLength) {
					return;
				}
				
				self.val(
					input.substr(0, input.lastIndexOf(last))
							+ word
							+ options.after
				);
				
				// Remember the word until next time.
				last = word;
				
				// Trigger callback.
				options.onTabComplete(last);
				
				// Trigger the 'tabComplete' event on a successful complete.
				self.trigger("tabComplete", last);
				
				if (options.hint) {
					// Turn off any additional hinting.
					hint.call(self, "");
				}
			}
		});
		
		if (options.hint) {
			// If enabled, turn on hinting.
			hint.call(this, "");
		}
		
		return this;
	}
	
	// Simple matching.
	// Filter the array and return the items that begins with `word`.
	function match(array, word, caseSensitive) {
		return $.grep(
			array,
			function(w) {
				if (caseSensitive) {
					return !w.indexOf(word);
				} else {
					return !w.toLowerCase().indexOf(word.toLowerCase());
				}
			}
		);
	}

	// Input hinting.
	// This works by creating a copy of the input and placing it behind
	// the real input.
	function hint(word) {
		var input = this;
		var clone = input.prev(".hint");
		
		input.css({
			backgroundColor: "transparent",
			position: "relative",
		});
		
		// Lets create a clone of the input if it does
		// not already exist.
		if (!clone.length) {
			input.wrap(
				$("<div>").css({position: "relative"})
			);
			clone = input
				.clone()
				.attr("tabindex", -1)
				.removeAttr("id name placeholder")
				.addClass("hint")
				.insertBefore(input);
			clone.css({
				position: "absolute",
			});
		}
		
		var hint = "";
		if (typeof word !== "undefined") {
			var text = input.val();
			hint = text + word.substr(text.split(/ |\n/).pop().length);
		}
		
		clone.val(hint);
	}
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

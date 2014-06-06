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
 * tabcomplete
 * Lightweight tab completion for inputs and textareas
 *
 * Source:
 * https://github.com/erming/tabcomplete
 *
 * Copyright (c) 2014 Mattias Erming <mattias@mattiaserming.com>
 * Licensed under the MIT License.
 *
 * Version 1.3.1
 */
(function($) {
	var keys = {
		backspace: 8,
		tab: 9,
		up: 38,
		down: 40
	};
	
	$.fn.tab = // Alias
	$.fn.tabcomplete = function(args, options) {
		if (this.length > 1) {
			return this.each(function() {
				$(this).tabcomplete(args, options);
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
			hint: "placeholder",
			minLength: 1
		}, options);
		
		// Remove any leftovers.
		// This allows us to override the plugin if necessary.
		this.unbind(".tabcomplete");
		this.prev(".hint").remove();
		
		var self = this;
		var backspace = false;
		var i = -1;
		var words = [];
		var last = "";
		
		var hint = $.noop;
		
		// Determine what type of hinting to use.
		switch (options.hint) {
		case "placeholder":
			hint = placeholder;
			break;
		
		case "select":
			hint = select;
			break;
		}
		
		this.on("input.tabcomplete", function() {
			var input = self.val();
			var word = input.split(/ |\n/).pop();
			
			// Reset iteration.
			i = -1;
			last = "";
			words = [];
			
			// Check for matches if the current word is the last word.
			if (self[0].selectionStart == input.length
				&& word.length) {
				if (typeof args === "function") {
					// If the user supplies a function, invoke it
					// and keep the result.
					words = args(word);
				} else {
					// Otherwise, call the .match() function.
					words = match(word, args, options.caseSensitive);
				}
				
				// Append 'after' to each word.
				if (options.after) {
					words = $.map(words, function(w) { return w + options.after; });
				}
			}
			
			// Emit the number of matching words with the 'match' event.
			self.trigger("match", words.length);
			
			if (options.hint) {
				if (!(options.hint == "select" && backspace) && word.length >= options.minLength) {
					// Show hint.
					hint.call(self, words[0]);
				} else {
					// Clear hinting.
					// This call is needed when using backspace.
					hint.call(self, "");
				}
			}
			
			if (backspace) {
				backspace = false;
			}
		});
		
		this.on("keydown.tabcomplete", function(e) {
			var key = e.which;
			if (key == keys.tab
				|| (options.arrowKeys && (key == keys.up || key == keys.down))) {
				
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
				
				var value = self.val();
				last = last || value.split(/ |\n/).pop();
				
				// Return if the 'minLength' requirement isn't met.
				if (last.length < options.minLength) {
					return;
				}
				
				// Update element with the completed text.
				var text = value.substr(0, self[0].selectionStart - last.length) + word;
				self.val(text);
				
				// Put the cursor at the end after completion.
				// This isn't strictly necessary, but solves an issue with
				// Internet Explorer.
				if (options.hint == "select") {
					self[0].selectionStart = text.length;
				}
				
				// Remember the word until next time.
				last = word;
				
				// Emit event.
				self.trigger("tabcomplete", last);
				
				if (options.hint) {
					// Turn off any additional hinting.
					hint.call(self, "");
				}
			} else if (e.which == keys.backspace) {
				// Remember that backspace was pressed. This is used
				// by the 'input' event.
				backspace = true;
				
				// Reset iteration.
				i = -1;
				last = "";
			}
		});
		
		if (options.hint) {
			// If enabled, turn on hinting.
			hint.call(this, "");
		}
		
		return this;
	}
	
	// Simple matching.
	// Filter the array and return the items that begins with 'word'.
	function match(word, array, caseSensitive) {
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

	// Show placeholder text.
	// This works by creating a copy of the input and placing it behind
	// the real input.
	function placeholder(word) {
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
			var value = input.val();
			hint = value + word.substr(value.split(/ |\n/).pop().length);
		}
		
		clone.val(hint);
	}
	
	// Hint by selecting part of the suggested word.
	function select(word) {	
		var input = this;
		var value = input.val();
		if (word) {
			input.val(
				value
				+ word.substr(value.split(/ |\n/).pop().length)
			);
			
			// Select hint.
			input[0].selectionStart = value.length;
		}
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

/*!
 * jquery-scroll-glue
 * https://github.com/erming/jquery-scroll-glue
 *
 * Copyright (c) 2014 Mattias Erming <mattias@mattiaserming.com>
 * Licensed under the MIT License.
 *
 * Version 0.1.1
 */

(function($) {
	var append = $.fn.append;
	$.fn.append = function() {
		return append.apply(this, arguments).trigger("append");
	};

	var html = $.fn.html;
	$.fn.html = function() {
		var result = html.apply(this, arguments);
		if (arguments.length) {
			// Only trigger this event when something
			// has been inserted.
			this.trigger("html");
		}
		return result;
	};

	$.fn.scrollGlue = function(options) {
		var settings = $.extend({
			animate: 0
		}, options);

		var self = this;
		if (self.size() > 1) {
			return self.each(function() {
				$(this).scrollGlue(options);
			});
		}

		var timer;
		var resizing = false;
		$(window).on("resize", function() {
			// This will prevent the scroll event from triggering
			// while resizing the window.
			resizing = true;

			clearTimeout(timer);
			timer = setTimeout(function() {
				resizing = false;
			}, 100);

			if (sticky) {
				self.scrollToBottom();
			}
		});

		var sticky = false;
		self.on("scroll", function() {
			if (!resizing) {
				sticky = self.isScrollAtBottom();
			}
		});
		self.trigger("scroll");
		self.on("append html", function() {
			if (sticky) {
				self.scrollToBottom(settings.animate);
			}
		});

		return this;
	};

	$.fn.scrollToBottom = function(animate) {
		return this.each(function() {
			$(this).finish().animate({scrollTop: this.scrollHeight}, animate || 0);
		});
	};

	$.fn.isScrollAtBottom = function() {
		if ((this.scrollTop() + this.outerHeight() + 1) >= this.prop("scrollHeight")) {
			return true;
		}
	};

	$(function() {
		// Find elements with the 'scroll-glue' attribute and
		// activate the plugin.
		$("[scroll-glue]").scrollGlue();
	});
})(jQuery);
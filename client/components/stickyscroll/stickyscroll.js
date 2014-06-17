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

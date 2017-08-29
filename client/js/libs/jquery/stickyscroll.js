import jQuery from "jquery";

(function($) {
	$.fn.unsticky = function() {
		return this.trigger("unstick.sticky").unbind(".sticky");
	};

	$.fn.sticky = function() {
		var self = this;
		var stuckToBottom = true;
		var lastStick = 0;

		var keepToBottom = function() {
			if (stuckToBottom) {
				self.scrollBottom();
			}
		};

		$(window).on("resize.sticky", keepToBottom);
		self
			.on("unstick.sticky", function() {
				$(window).off("resize.sticky", keepToBottom);
			})
			.on("scroll.sticky", function() {
				// When resizing, sometimes the browser sends a bunch of extra scroll events due to content
				// reflow, so if we resized within 250ms we can assume it's one of those. The order of said
				// events is not predictable, and scroll can happen last, so not setting stuckToBottom is
				// not enough, we have to force the scroll still.
				if (stuckToBottom && Date.now() - lastStick < 250) {
					self.scrollBottom();
				} else {
					stuckToBottom = self.isScrollBottom();
				}
			})
			.on("scrollBottom.sticky", function() {
				stuckToBottom = true;
				lastStick = Date.now();
				this.scrollTop = this.scrollHeight;
			})
			.on("keepToBottom.sticky", keepToBottom)
			.scrollBottom();

		return self;
	};

	$.fn.scrollBottom = function() {
		this.trigger("scrollBottom.sticky");
		return this;
	};

	$.fn.isScrollBottom = function() {
		var el = this[0];
		return el.scrollHeight - el.scrollTop - el.offsetHeight <= 30;
	};
})(jQuery);

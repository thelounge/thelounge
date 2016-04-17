(function($) {
	$.fn.unsticky = function() {
		return this.unbind(".sticky");
	};

	$.fn.sticky = function() {
		var self = this;
		var stuckToBottom = true;

		self
			.on("scroll.sticky", function(e) {
				stuckToBottom = self.isScrollBottom();
			})
			.on("msg.sticky", function() {
				if (stuckToBottom) {
					self.scrollBottom();
				}
			})
			.scrollBottom();

		return self;
	};

	$.fn.scrollBottom = function() {
		var el = this[0];
		this.scrollTop(el.scrollHeight);
		return this;
	};

	$.fn.isScrollBottom = function() {
		var el = this[0];
		return el.scrollHeight - el.scrollTop - el.offsetHeight <= 30;
	};
})(jQuery);

/*!
 * stickyscroll
 * https://github.com/erming/stickyscroll
 * v2.1.1
 */
(function($) {
	$.fn.sticky = function() {
		if (this.size() > 1) {
			return this.each(function() {
				$(this).sticky(options);
			});
		}
		
		var isBottom = false;
		var self = this;
		
		this.unbind(".sticky");
		this.on("beforeAppend.sticky", function() {
			isBottom = isScrollBottom.call(self);
		});
		
		this.on("afterAppend.sticky", function() {
			if (isBottom) {
				self.scrollBottom();
			}
		});
		
		var overflow = this.css("overflow-y");
		if (overflow == "visible") {
			overflow = "auto";
		}
		this.css({
			"overflow-y": overflow
		});
		
		$(window).unbind(".sticky");
		$(window).on("resize.sticky", function() {
				self.scrollBottom();
		});
		
		this.scrollBottom();
		return this;
	};

	$.fn.scrollBottom = function() {
		return this.each(function() {
			$(this).animate({scrollTop: this.scrollHeight}, 0);
		});
	};

	function isScrollBottom() {
		if ((this.scrollTop() + this.outerHeight() + 1) >= this.prop("scrollHeight")) {
			return true;
		} else {
			return false;
		}
	};

	var append = $.fn.append;
	$.fn.append = function() {
		this.trigger("beforeAppend");
		append.apply(this, arguments).trigger("afterAppend")
		return this;
	};
})(jQuery);

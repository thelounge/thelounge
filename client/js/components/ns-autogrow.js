/* global jQuery */
(function($) {
	$.fn.autogrow = function(opts) {
		var that = $(this),
			selector = that.selector,
			defaults = {
				context: $(document),
				speed: 200,
				cloneClass: "autogrowclone",
				onInitialize: true
			};
		opts = $.isPlainObject(opts) ? opts : {
			context: opts ? opts : $(document)
		};
		opts = $.extend({}, defaults, opts);
		that.each(function(i, elem) {
			var min, formMin;
			elem = $(elem);
			min = parseInt(elem.css("height"), 10) || elem.innerHeight();
			formMin = parseInt($("#form").css("height"), 10) || elem.innerHeight();
			elem.data("autogrow-form-diff", formMin - min);
			elem.data("autogrow-start-height", min);
			elem.css("height", min);
			$("#form").css("height", formMin);
		});
		opts.context.on("keyup paste", selector, resize);

		function resize(e) {
			var box = $(this),
				minHeight = box.data("autogrow-start-height") || 0,
				maxHeight = minHeight * 3,
				oldHeight = box.innerHeight(),
				newHeight = Math.min(this.scrollHeight, maxHeight);
			if (oldHeight < newHeight) { // user is typing
				// this.scrollTop = 0; // try to reduce the top of the content hiding for a second
				box.css({height: newHeight}, opts.speed);
				$("#form").css({height: newHeight + box.data("autogrow-form-diff")}, opts.speed);
				$("#windows").css({bottom: newHeight + box.data("autogrow-form-diff")}, opts.speed);
			} else if (!e || e.which === 8 || e.which === 46 || (e.ctrlKey && e.which === 88) || (!e.ctrlKey && e.which === 13)) { // user is deleting, backspacing, or cutting
				if (oldHeight > minHeight) {
					do { // reduce height until new height is less than the scrollheight
						newHeight--;
						box.css("height", newHeight);
						$("#form").css("height", newHeight + box.data("autogrow-form-diff"));
					} while (newHeight >= box[0].scrollHeight && newHeight >= minHeight);
					newHeight++; // adding one back eliminates a wiggle on deletion
					box.focus(); // Fix issue with Chrome losing focus from the textarea.
					if (newHeight < minHeight) {
						newHeight = minHeight;
					}
					box.css("height", newHeight);
					$("#form").css("height", newHeight + box.data("autogrow-form-diff"));
					$("#windows").css("bottom", newHeight + box.data("autogrow-form-diff"));
				} else { // just set to the minHeight
					box.css("height", minHeight);
					$("#form").css("height", minHeight + box.data("autogrow-form-diff"));
					$("#windows").css("bottom", minHeight + box.data("autogrow-form-diff"));
				}
			}
		}
		return that;
	};
})(jQuery);

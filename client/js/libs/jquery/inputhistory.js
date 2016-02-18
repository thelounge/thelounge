var jQuery = $ = require("jquery");
/*!
 * inputhistory
 * https://github.com/erming/inputhistory
 * v0.3.1
 */
(function($) {
	$.inputhistory = {};
	$.inputhistory.defaultOptions = {
		history: [],
		preventSubmit: false
	};
	
	$.fn.history = // Alias
	$.fn.inputhistory = function(options) {
		options = $.extend(
			$.inputhistory.defaultOptions,
			options
		);
		
		var self = this;
		if (self.size() > 1) {
			return self.each(function() {
				$(this).history(options);
			});
		}
		
		var history = options.history;
		history.push("");
		
		var i = 0;
		self.on("keydown", function(e) {
			var key = e.which;
			switch (key) {
			case 13: // Enter
				if (self.val() != "") {
					i = history.length;
					history[i - 1] = self.val();
					history.push("");
					if (history[i - 1] == history[i - 2]) {
						history.splice(-2, 1);
						i--;
					}
				}
				if (!options.preventSubmit) {
					self.parents("form").eq(0).submit();
				}
				self.val("");
				break;
			
			case 38: // Up
			case 40: // Down
				// NOTICE: This is specific to The Lounge.
				if (e.ctrlKey || e.metaKey) {
					break;
				}
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
			
			e.preventDefault();
		});
		
		return this;
	}
})(jQuery);

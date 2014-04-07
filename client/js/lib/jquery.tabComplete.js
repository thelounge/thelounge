/*!
 * jquery-tab-complete
 * https://github.com/erming/jquery-tab-complete
 *
 * Copyright (c) 2014 Mattias Erming <mattias@mattiaserming.com>
 * Licensed under the MIT License.
 *
 * Version 0.1.0
 */

(function($) {
	$.fn.tabComplete = function(list) {
		var self = this;
		if (self.size() > 1) {
			return self.each(function() {
				$(this).tabComplete(list);
			});
		}
		
		var match = [];
		self.on('keydown', function(e) {
			var key = e.which;
			if (key != 9) {
				match = [];
				return;
			}
			
			var text = self.val().split(' ');
			var last = text.splice(-1)[0];
			
			if (!match.length) {
				match = $.grep(list, function(w) {
					return last != '' && w.indexOf(last) !== -1;
				});
			}
			
			var i = match.indexOf(last) + 1;
			if (i == match.length) {
				i = 0;
			}
			
			if (match.length) {
				last = match[i];
			}
			
			text.push(last);
			self.val(text.join(' '));
			return false;
		});
	};
})(jQuery);

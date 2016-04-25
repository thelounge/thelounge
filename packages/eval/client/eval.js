"use strict";

(function($) {
	var $form = $("#form");
	var $input = $("#input");

	$form.on("submit", function() {
		var code = $input.val();

		if (code.startsWith("/eval c")) {
			code = code.replace(/^.*?\s.*?\s/, "");
			$input.val(eval(code));
			return false;
		}
	});

	var events = $._data($form.get(0), "events").submit;
	events.unshift(events.pop());
}(window.jQuery));

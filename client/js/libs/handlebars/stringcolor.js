(function() {
	var cache = {};
	var luminosity = document.body.dataset.nickLuminosity === 'light' ? 'light' : 'dark';

	Handlebars.registerHelper(
		"stringcolor", function(str) {
			if (!cache[str]) {
				cache[str] = randomColor({
					seed: hashCode(str),
					luminosity: luminosity
				});
			}

			return cache[str];
		}
	);
	
	function hashCode(str) {
		var hash = 0, i = 0;

		for (; i < str.length; i++) {
			hash = ((hash << 5) - hash) + str.charCodeAt(i);
			hash |= 0;
		}
		
		return Math.abs(hash);
	}
}());

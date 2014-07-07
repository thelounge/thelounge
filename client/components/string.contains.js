//
// Check if string contains any of the supplied words.
//
// Usage:
// "".contains(a, b, ...);
//
// Returns [true|false]
//
String.prototype.contains = function() {
	var args = arguments;
	for (var i in args) {
		var str = args[i];
		if (typeof str === "string" && this.indexOf(str) > -1) {
			return true;
		}
	}
	return false;
}

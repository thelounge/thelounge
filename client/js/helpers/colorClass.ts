// Generates a string from "color-1" to "color-32" based on an input string
export default (str: string) => {
	if (!str) {
		return "";
	}

	let hash = 0;

	for (let i = 0; i < str.length; i++) {
		hash += str.charCodeAt(i);
	}

	/*
		Modulo 32 lets us be case insensitive for ascii
		due to A being ascii 65 (100 0001)
		 while a being ascii 97 (110 0001)
	*/
	return "color-" + (1 + (hash % 32)).toString();
};

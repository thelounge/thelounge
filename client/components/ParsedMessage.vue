<script>
const parse = require("../js/libs/handlebars/parse");

export default {
	name: "ParsedMessage",
	functional: true,
	props: {
		text: String,
		message: Object,
	},
	render(createElement, context) {
		if (typeof context.props.text !== "undefined") {
			return parse(createElement, context.props.text);
		}

		return parse(createElement, context.props.message.text, context.props.message);
	},
};
</script>

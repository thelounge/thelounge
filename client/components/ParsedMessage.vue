<script>
const parse = require("../js/helpers/parse");

export default {
	name: "ParsedMessage",
	functional: true,
	props: {
		text: String,
		message: Object,
		network: Object,
	},
	render(createElement, context) {
		return parse(
			createElement,
			typeof context.props.text !== "undefined"
				? context.props.text
				: context.props.message.text,
			context.props.message,
			context.props.network,
			context.parent.$root
		);
	},
};
</script>

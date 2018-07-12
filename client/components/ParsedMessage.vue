<script>
const parse = require("../js/libs/handlebars/parse");

export default {
	name: "ParsedMessage",
	functional: true,
	props: {
		message: Object,
	},
	render(createElement, context) {
		return parse(context.props.message.text, context.props.message, createElement);
	},
};
</script>

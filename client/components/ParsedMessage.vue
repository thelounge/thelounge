<script>
const parse = require("../js/libs/handlebars/parse");

export default {
    functional: true,
	name: "ParsedMessage",
	props: {
		message: Object,
	},
	render(createElement, context) {
		return parse(context.props.message.text, context.props.message.users, createElement);
	},
};
</script>

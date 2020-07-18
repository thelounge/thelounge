<script>
import parse from "../js/helpers/parse";

export default {
	name: "ParsedMessage",
	functional: true,
	props: {
		text: String,
		message: Object,
		network: Object,
	},
	render(context) {
		return parse(
			typeof context.text !== "undefined" ? context.text : context.message.text,
			context.message,
			context.network
		);
	},
};
</script>

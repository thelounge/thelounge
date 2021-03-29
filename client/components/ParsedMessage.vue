<script>
import parse from "../js/helpers/parse";
export default {
	name: "ParsedMessage",
	props: {
		text: String,
		message: Object,
		network: Object,
	},
	setup(props) {
		return () =>
			parse(
				typeof props.text !== "undefined" ? props.text : props.message.text,
				props.message,
				props.network
			);
	},
};
</script>

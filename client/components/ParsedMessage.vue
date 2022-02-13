<script>
import {h} from "vue";
import parse from "../js/helpers/parse";

export default {
	name: "ParsedMessage",
	functional: true,
	props: {
		text: String,
		message: Object,
		network: Object,
	},
	render() {
		return parse(
			h,
			typeof this.text !== "undefined" ? this.text : this.message.text,
			this.message,
			this.network
		);
	},
};
</script>

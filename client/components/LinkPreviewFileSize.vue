<template>
	<span class="preview-size">({{ previewSize }})</span>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import friendlysize from "../js/helpers/friendlysize";

export default defineComponent({
	name: "LinkPreviewFileSize",
	props: {
		size: {type: Number, required: true},
	},
	setup(props) {
		const previewSize = friendlysize(props.size);

		return {
			previewSize,
		};
	},
});
</script>

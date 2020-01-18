<template>
	<span class="preview-size">({{ previewSize }})</span>
</template>

<script>
import friendlysize from "../js/helpers/friendlysize";

export default {
	name: "LinkPreviewFileSize",
	props: {
		size: Number,
	},
	computed: {
		previewSize() {
			return friendlysize(this.size);
		},
	},
};
</script>

<template>
	<span class="preview-size">({{ previewSize }})</span>
</template>

<style scoped>
.preview-size {
	margin-left: 5px;
	user-select: none;
}
</style>
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

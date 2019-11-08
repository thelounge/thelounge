<template>
	<span class="preview-size">({{ previewSize }})</span>
</template>

<script>
const constants = require("../js/constants");

export default {
	name: "LinkPreviewFileSize",
	props: {
		size: Number,
	},
	computed: {
		previewSize() {
			let size = this.size;

			// Threshold for SI units
			const thresh = 1024;

			let u = 0;

			do {
				size /= thresh;
				++u;
			} while (size >= thresh && u < constants.sizeUnits.length - 1);

			const displaySize = size.toFixed(1);
			const unit = constants.sizeUnits[u];

			return `${displaySize} ${unit}`;
		},
	},
};
</script>

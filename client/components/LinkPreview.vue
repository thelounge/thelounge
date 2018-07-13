<template>
	<div
		v-if="link.shown"
		v-show="link.canDisplay"
		ref="container"
		class="preview">
		<div
			ref="content"
			:class="['toggle-content', 'toggle-type-' + link.type, { opened: isContentShown }]">
			<template v-if="link.type === 'link'">
				<a
					v-if="link.thumb"
					:href="link.link"
					class="toggle-thumbnail"
					target="_blank"
					rel="noopener">
					<img
						:src="link.thumb"
						decoding="async"
						alt=""
						class="thumb"
						@error="onThumbnailError"
						@abort="onThumbnailError"
						@load="onPreviewReady">
				</a>
				<div class="toggle-text">
					<div class="head">
						<div class="overflowable">
							<a
								:href="link.link"
								:title="link.head"
								target="_blank"
								rel="noopener">{{ link.head }}</a>
						</div>

						<button
							v-if="showMoreButton"
							:aria-expanded="isContentShown"
							:aria-label="moreButtonLabel"
							class="more"
							@click="onMoreClick"
						><span class="more-caret"/></button>
					</div>

					<div class="body overflowable">
						<a
							:href="link.link"
							:title="link.body"
							target="_blank"
							rel="noopener">{{ link.body }}</a>
					</div>
				</div>
			</template>
			<template v-else-if="link.type === 'image'">
				<a
					:href="link.link"
					class="toggle-thumbnail"
					target="_blank"
					rel="noopener">
					<img
						:src="link.thumb"
						decoding="async"
						alt=""
						@load="onPreviewReady">
				</a>
			</template>
			<template v-else-if="link.type === 'video'">
				<video
					preload="metadata"
					controls
					@canplay="onPreviewReady">
					<source
						:src="link.media"
						:type="link.mediaType">
				</video>
			</template>
			<template v-else-if="link.type === 'audio'">
				<audio
					controls
					preload="metadata"
					@canplay="onPreviewReady">
					<source
						:src="link.media"
						:type="link.mediaType">
				</audio>
			</template>
			<template v-else-if="link.type === 'error'">
				<em v-if="link.error === 'image-too-big'">
					This image is larger than {{ link.maxSize | friendlysize }} and cannot be
					previewed.
					<a
						:href="link.link"
						target="_blank"
						rel="noopener">Click here</a>
					to open it in a new window.
				</em>
				<template v-else-if="link.error === 'message'">
					<div>
						<em>
							A preview could not be loaded.
							<a
								:href="link.link"
								target="_blank"
								rel="noopener">Click here</a>
							to open it in a new window.
						</em>
						<br>
						<pre class="prefetch-error">{{ link.message }}</pre>
					</div>

					<button
						:aria-expanded="isContentShown"
						:aria-label="moreButtonLabel"
						class="more"
						@click="onMoreClick"
					><span class="more-caret"/></button>
				</template>
			</template>
		</div>
	</div>
</template>

<script>
export default {
	name: "LinkPreview",
	props: {
		link: Object,
		keepScrollPosition: Function,
	},
	data() {
		return {
			showMoreButton: false,
			isContentShown: false,
		};
	},
	computed: {
		moreButtonLabel() {
			return this.isContentShown ? "Less" : "More";
		},
	},
	watch: {
		"link.type"() {
			this.onPreviewUpdate();
		},
	},
	mounted() {
		// Don't display previews while they are loading on the server
		if (this.link.type === "loading") {
			return;
		}

		this.onPreviewUpdate();
	},
	destroyed() {
		// Let this preview go through load/canplay events again,
		// Otherwise the browser can cause a resize on video elements
		this.link.canDisplay = false;
	},
	methods: {
		onPreviewUpdate() {
			// Error don't have any media to render
			if (this.link.type === "error") {
				this.onPreviewReady();
			}

			// If link doesn't have a thumbnail, render it
			if (this.link.type === "link" && !this.link.thumb) {
				this.onPreviewReady();
			}
		},
		onPreviewReady() {
			const options = require("../js/options");
			this.$set(this.link, "canDisplay", options.shouldOpenMessagePreview(this.link.type));

			this.keepScrollPosition();

			if (this.link.type !== "link") {
				return;
			}

			this.$nextTick(() => {
				if (!this.$refs.content) {
					return;
				}

				this.showMoreButton = this.$refs.content.offsetWidth >= this.$refs.container.offsetWidth;
			});
		},
		onThumbnailError() {
			// If thumbnail fails to load, hide it and show the preview without it
			this.link.thumb = "";
			this.onPreviewReady();
		},
		onMoreClick() {
			this.isContentShown = !this.isContentShown;
		},
	},
};
</script>

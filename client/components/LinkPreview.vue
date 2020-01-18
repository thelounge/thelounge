<template>
	<div
		v-if="link.shown"
		v-show="link.sourceLoaded || link.type === 'link'"
		ref="container"
		class="preview"
		dir="ltr"
	>
		<div
			ref="content"
			:class="['toggle-content', 'toggle-type-' + link.type, {opened: isContentShown}]"
		>
			<template v-if="link.type === 'link'">
				<a
					v-if="link.thumb"
					v-show="link.sourceLoaded"
					:href="link.link"
					:class="toggleThumbnail"
					:style="blurStyle"
					target="_blank"
					rel="noopener"
					@click="onThumbnailClick"
				>
					<img
						:src="link.thumb"
						decoding="async"
						alt=""
						class="thumb"
						@error="onThumbnailError"
						@abort="onThumbnailError"
						@load="onPreviewReady"
					/>
				</a>
				<div class="toggle-text" dir="auto">
					<div class="head">
						<div class="overflowable">
							<a
								:href="link.link"
								:title="link.head"
								target="_blank"
								rel="noopener"
								>{{ link.head }}</a
							>
						</div>

						<button
							v-if="showMoreButton"
							:aria-expanded="isContentShown"
							:aria-label="moreButtonLabel"
							dir="auto"
							class="more"
							@click="onMoreClick"
						>
							<span class="more-caret" />
						</button>
					</div>

					<div class="body overflowable">
						<a :href="link.link" :title="link.body" target="_blank" rel="noopener">{{
							link.body
						}}</a>
					</div>
				</div>
			</template>
			<template v-else-if="link.type === 'image'">
				<a
					:href="link.link"
					:style="containerStyle"
					:class="toggleThumbnail"
					target="_blank"
					rel="noopener"
					@click="onThumbnailClick"
				>
					<img
						v-show="link.sourceLoaded"
						:src="link.thumb"
						:style="imageStyle"
						decoding="async"
						alt=""
						@load="onPreviewReady"
					/>
				</a>
			</template>
			<template v-else-if="link.type === 'video'">
				<video
					v-show="link.sourceLoaded"
					preload="metadata"
					controls
					:class="{unBlurOnHover: unBlurOnHover}"
					:style="!fullScreen && !playing && blurStyle"
					@fullscreenchange="onPreviewFullscreenChange"
					@webkitfullscreenchange="onPreviewFullscreenChange"
					@mozfullscreenchange="onPreviewFullscreenChange"
					@msfullscreenchange="onPreviewFullscreenChange"
					@pause="onPreviewPause"
					@play="onPreviewPlay"
					@canplay="onPreviewReady"
				>
					<source :src="link.media" :type="link.mediaType" />
				</video>
			</template>
			<template v-else-if="link.type === 'audio'">
				<audio
					v-show="link.sourceLoaded"
					controls
					preload="metadata"
					@canplay="onPreviewReady"
				>
					<source :src="link.media" :type="link.mediaType" />
				</audio>
			</template>
			<template v-else-if="link.type === 'error'">
				<em v-if="link.error === 'image-too-big'">
					This image is larger than {{ imageMaxSize }} and cannot be previewed.
					<a :href="link.link" target="_blank" rel="noopener">Click here</a>
					to open it in a new window.
				</em>
				<template v-else-if="link.error === 'message'">
					<div>
						<em>
							A preview could not be loaded.
							<a :href="link.link" target="_blank" rel="noopener">Click here</a>
							to open it in a new window.
						</em>
						<br />
						<pre class="prefetch-error">{{ link.message }}</pre>
					</div>

					<button
						:aria-expanded="isContentShown"
						:aria-label="moreButtonLabel"
						class="more"
						@click="onMoreClick"
					>
						<span class="more-caret" />
					</button>
				</template>
			</template>
		</div>
	</div>
</template>

<script>
import friendlysize from "../js/helpers/friendlysize";
import constants from "../js/constants";

const {exifOrientations} = constants;

export default {
	name: "LinkPreview",
	props: {
		link: Object,
		keepScrollPosition: Function,
		previewConf: Object,
	},
	data() {
		return {
			containerWidth: "100%",
			showMoreButton: false,
			isContentShown: false,
			imageSize: null,
			playing: false,
			fullScreen: false,
		};
	},
	computed: {
		orientation() {
			if (!this.link) {
				return exifOrientations[1];
			}

			const orientation = Math.trunc(this.link.orientation - 1);

			if (orientation >= exifOrientations.length || isNaN(orientation)) {
				return exifOrientations[1];
			}

			return exifOrientations[orientation];
		},
		moreButtonLabel() {
			return this.isContentShown ? "Less" : "More";
		},
		blurStyle() {
			const {blur} = this.previewConf;
			return blur && `filter: blur(${blur}px); -webkit-filter: blur(${blur}px);`;
		},
		unBlurOnHover() {
			const {blur, unBlurOnHover} = this.previewConf;
			return blur && unBlurOnHover;
		},
		toggleThumbnail() {
			const ret = {
				"toggle-thumbnail": true,
				unBlurOnHover: this.unBlurOnHover,
			};
			return ret;
		},
		imageMaxSize() {
			if (!this.link.maxSize) {
				return;
			}

			return friendlysize(this.link.maxSize);
		},
		maxWidth() {
			if (this.link.type === "link" && this.link.thumb) {
				return "96px";
			}

			return this.containerWidth;
		},
		maxHeight() {
			if (this.link.type === "link" && this.link.thumb) {
				return "54px";
			}

			return "128px";
		},
		imageStyle() {
			let translateY = "0",
				translateX = "0",
				scaleX = 1,
				scaleY = 1;
			let maxWidth;
			let maxHeight;
			const {rot, flipped} = this.orientation;
			const flip = flipped ? -1 : 1;

			switch (rot) {
				case 90:
					translateY = flipped ? "0" : "-100%";
					maxWidth = this.maxHeight;
					maxHeight = this.maxWidth;
					scaleY *= flip;
					break;
				case 270:
					translateX = "-100%";
					translateY = flipped ? "100%" : "0";
					maxWidth = this.maxHeight;
					maxHeight = this.maxWidth;
					scaleY *= flip;
					break;
				case 180:
					translateX = flipped ? "0" : "-100%";
					translateY = "-100%";
					maxWidth = this.maxWidth;
					maxHeight = this.maxHeight;
					scaleX *= flip;
					break;
				default:
					translateX = flipped ? "100%" : "0";
					maxWidth = this.maxWidth;
					maxHeight = this.maxHeight;
					scaleX *= flip;
			}

			const style = `
			max-width: ${maxWidth};
			max-height: ${maxHeight};
			transform-origin: top left;
			transform: rotate(${this.orientation.rot}deg) translate(${translateX}, ${translateY}) scale(${scaleX}, ${scaleY});
			`;
			return style;
		},
		containerStyle() {
			if (!this.imageSize) {
				return this.blurStyle;
			}

			let width, height;
			const {rot} = this.orientation;

			if (rot === 90 || rot === 270) {
				width = this.imageSize.height;
				height = this.imageSize.width;
			} else {
				width = this.imageSize.width;
				height = this.imageSize.height;
			}

			return `
				width: ${width}px;
				height: ${height}px;
        ${this.blurStyle ? this.blurStyle : ''}
			`;
		},
	},
	watch: {
		"link.type"() {
			this.updateShownState();
			this.onPreviewUpdate();
		},
	},
	created() {
		this.updateShownState();
	},
	mounted() {
		this.$root.$on("resize", this.handleResize);
		this.onPreviewUpdate();
	},
	beforeDestroy() {
		this.$root.$off("resize", this.handleResize);
	},
	destroyed() {
		// Let this preview go through load/canplay events again,
		// Otherwise the browser can cause a resize on video elements
		this.link.sourceLoaded = false;
	},
	methods: {
		onPreviewUpdate() {
			// Don't display previews while they are loading on the server
			if (this.link.type === "loading") {
				return;
			}

			// Error does not have any media to render
			if (this.link.type === "error") {
				this.onPreviewReady();
			}

			// If link doesn't have a thumbnail, render it
			if (this.link.type === "link") {
				this.handleResize();
				this.keepScrollPosition();
			}
		},
		onPreviewReady(ev) {
			this.$set(this.link, "sourceLoaded", true);

			this.keepScrollPosition();

			if (this.link.type === "link") {
				this.handleResize();
			}

			if (ev) {
				this.$nextTick(() => this.calculateImageSize(ev.target));
			} else {
				this.calculateImageSize();
			}
		},
		calculateImageSize(img) {
			this.containerWidth = this.$refs.container
				? `${this.$refs.container.offsetWidth}px`
				: "100%";

			if (!img) {
				this.imageSize = null;
				return;
			}

			this.imageSize = {
				width: img.offsetWidth,
				height: img.offsetHeight,
			};
		},
		onPreviewPause() {
			this.playing = false;
		},
		onPreviewPlay() {
			this.playing = true;
		},
		onPreviewFullscreenChange() {
			this.fullScreen = !this.fullScreen;
		},
		onThumbnailError() {
			// If thumbnail fails to load, hide it and show the preview without it
			this.link.thumb = "";
			this.onPreviewReady();
		},
		onThumbnailClick(e) {
			e.preventDefault();

			const imageViewer = this.$root.$refs.app.$refs.imageViewer;
			imageViewer.link = this.link;
		},
		onMoreClick() {
			this.isContentShown = !this.isContentShown;
			this.keepScrollPosition();
		},
		handleResize() {
			this.$nextTick(() => {
				if (!this.$refs.content) {
					return;
				}

				this.containerWidth = this.$refs.container.offsetWidth;
				this.showMoreButton =
					this.$refs.content.offsetWidth >= this.$refs.container.offsetWidth;
			});
		},
		updateShownState() {
			// User has manually toggled the preview, do not apply default
			if (this.link.shown !== null) {
				return;
			}

			let defaultState = false;

			switch (this.link.type) {
				case "error":
					// Collapse all errors by default unless its a message about image being too big
					if (this.link.error === "image-too-big") {
						defaultState = this.$store.state.settings.media;
					}

					break;

				case "link":
					defaultState = this.$store.state.settings.links;
					break;

				default:
					defaultState = this.$store.state.settings.media;
			}

			this.link.shown = defaultState;
		},
	},
};
</script>

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
			:class="[
				'toggle-content',
				'toggle-type-' + link.type,
				{opened: isContentShown, 'with-filename': link.filename},
			]"
		>
			<template v-if="link.type === 'link'">
				<a
					v-if="link.thumb"
					v-show="link.sourceLoaded"
					:href="link.link"
					class="toggle-thumbnail"
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
					:title="link.filename"
					:class="['toggle-thumbnail', {'wide-view': useWideImageView}]"
					target="_blank"
					rel="noopener"
					@click="onThumbnailClick"
				>
					<div v-if="link.filename" class="image-filename">
						<span class="inner-image-filename">
							{{ link.filename }}
						</span>
					</div>
					<img
						v-show="link.sourceLoaded"
						ref="image"
						:src="link.thumb"
						decoding="async"
						alt=""
						@load="onPreviewReady"
					/>
				</a>
			</template>
			<template v-else-if="link.type === 'video'">
				<span v-if="link.filename" class="video-filename">{{ link.filename }}</span>
				<video
					v-show="link.sourceLoaded"
					preload="metadata"
					controls
					@canplay="onPreviewReady"
				>
					<source :src="link.media" :type="link.mediaType" />
				</video>
			</template>
			<template v-else-if="link.type === 'audio'">
				<div>
					<a
						v-if="link.filename"
						:href="link.link"
						:title="link.filename"
						target="_blank"
						rel="noopener"
						class="audio-filename"
					>
						<span class="inner-audio-filename">
							{{ link.filename }}
						</span>
					</a>
					<audio
						v-show="link.sourceLoaded"
						controls
						preload="metadata"
						@canplay="onPreviewReady"
					>
						<source :src="link.media" :type="link.mediaType" />
					</audio>
				</div>
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

<script lang="ts">
import {
	computed,
	defineComponent,
	inject,
	nextTick,
	onBeforeUnmount,
	onMounted,
	onUnmounted,
	PropType,
	ref,
	watch,
} from "vue";
import {onBeforeRouteUpdate} from "vue-router";
import eventbus from "../js/eventbus";
import friendlysize from "../js/helpers/friendlysize";
import {useStore} from "../js/store";
import type {ClientChan, ClientLinkPreview} from "../js/types";
import {imageViewerKey} from "./App.vue";

export default defineComponent({
	name: "LinkPreview",
	props: {
		link: {
			type: Object as PropType<ClientLinkPreview>,
			required: true,
		},
		keepScrollPosition: {
			type: Function as PropType<() => void>,
			required: true,
		},
		channel: {type: Object as PropType<ClientChan>, required: true},
	},
	setup(props) {
		const store = useStore();

		const showMoreButton = ref(false);
		const isContentShown = ref(false);
		const useWideImageView = ref(false);
		const imageViewer = inject(imageViewerKey);
		const image = ref(null);

		onBeforeRouteUpdate((to, from, next) => {
			// cancel the navigation if the user is trying to close the image viewer
			if (imageViewer?.value?.link) {
				imageViewer.value.closeViewer();
				return next(false);
			}

			next();
		});

		const content = ref<HTMLDivElement | null>(null);
		const container = ref<HTMLDivElement | null>(null);

		const moreButtonLabel = computed(() => {
			return isContentShown.value ? "Less" : "More";
		});

		const imageMaxSize = computed(() => {
			if (!props.link.maxSize) {
				return;
			}

			return friendlysize(props.link.maxSize);
		});

		const handleResize = () => {
			nextTick(() => {
				if (!content.value || !container.value) {
					return;
				}

				showMoreButton.value = content.value.offsetWidth >= container.value.offsetWidth;
			}).catch((e) => {
				// eslint-disable-next-line no-console
				console.error("Error in LinkPreview.handleResize", e);
			});
		};

		const onPreviewReady = () => {
			props.link.sourceLoaded = true;

			props.keepScrollPosition();

			if (props.link.type === "link") {
				handleResize();
			}
		};

		const updateWideImageViewDecision = () => {
			if (window.innerWidth < 480) {
				// Mobile
				useWideImageView.value =
					(image.value && image.value.naturalWidth / image.value.naturalHeight <= 1.34) ||
					false; // aspect ratio around 4:3 and slimmer
			} else {
				// Desktop
				useWideImageView.value =
					(image.value && image.value.naturalWidth / image.value.naturalHeight <= 1.6) ||
					false; // aspect ratio 16:10 and slimmer
			}
		};

		const onPreviewUpdate = () => {
			// Don't display previews while they are loading on the server
			if (props.link.type === "loading") {
				return;
			}

			// Error does not have any media to render
			if (props.link.type === "error") {
				onPreviewReady();
			}

			// If link doesn't have a thumbnail, render it
			if (props.link.type === "link") {
				handleResize();
				props.keepScrollPosition();
			}

			updateWideImageViewDecision();
		};

		const onThumbnailError = () => {
			// If thumbnail fails to load, hide it and show the preview without it
			props.link.thumb = "";
			onPreviewReady();
		};

		const onThumbnailClick = (e: MouseEvent) => {
			e.preventDefault();

			if (!imageViewer?.value) {
				return;
			}

			imageViewer.value.channel = props.channel;
			imageViewer.value.link = props.link;
		};

		const onMoreClick = () => {
			isContentShown.value = !isContentShown.value;
			props.keepScrollPosition();
		};

		const updateShownState = () => {
			// User has manually toggled the preview, do not apply default
			if (props.link.shown !== null) {
				return;
			}

			let defaultState = false;

			switch (props.link.type) {
				case "error":
					// Collapse all errors by default unless its a message about image being too big
					if (props.link.error === "image-too-big") {
						defaultState = store.state.settings.media;
					}

					break;

				case "link":
					defaultState = store.state.settings.links;
					break;

				default:
					defaultState = store.state.settings.media;
			}

			props.link.shown = defaultState;
		};

		updateShownState();

		watch(
			() => props.link.type,
			() => {
				updateShownState();
				onPreviewUpdate();
			}
		);

		onMounted(() => {
			eventbus.on("resize", handleResize);

			onPreviewUpdate();
		});

		onBeforeUnmount(() => {
			eventbus.off("resize", handleResize);
		});

		onUnmounted(() => {
			// Let this preview go through load/canplay events again,
			// Otherwise the browser can cause a resize on video elements
			props.link.sourceLoaded = false;
		});

		return {
			moreButtonLabel,
			imageMaxSize,
			onThumbnailClick,
			onThumbnailError,
			onMoreClick,
			onPreviewReady,
			onPreviewUpdate,
			showMoreButton,
			isContentShown,
			useWideImageView,
			image,
			content,
			container,
			updateWideImageViewDecision,
		};
	},
});
</script>

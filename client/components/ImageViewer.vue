<template>
	<div
		id="image-viewer"
		ref="viewer"
		:class="{opened: link !== null}"
		@wheel="onMouseWheel"
		@touchstart.passive="onTouchStart"
		@click="onClick"
	>
		<template v-if="link !== null">
			<button class="close-btn" aria-label="Close"></button>

			<button
				v-if="previousImage"
				class="previous-image-btn"
				aria-label="Previous image"
				@click.stop="previous"
			></button>
			<button
				v-if="nextImage"
				class="next-image-btn"
				aria-label="Next image"
				@click.stop="next"
			></button>

			<a class="open-btn" :href="link.link" target="_blank" rel="noopener"></a>

			<img
				ref="image"
				:src="link.thumb"
				alt=""
				:style="computeImageStyles"
				@load="onImageLoad"
				@mousedown="onImageMouseDown"
				@touchstart.passive="onImageTouchStart"
			/>
		</template>
	</div>
</template>

<script lang="ts">
import Mousetrap from "mousetrap";
import {computed, defineComponent, ref, watch} from "vue";
import {onBeforeRouteLeave, onBeforeRouteUpdate} from "vue-router";
import eventbus from "../js/eventbus";
import {ClientChan, ClientMessage, ClientLinkPreview} from "../js/types";

export default defineComponent({
	name: "ImageViewer",
	setup() {
		const viewer = ref<HTMLDivElement>();
		const image = ref<HTMLImageElement>();

		const link = ref<ClientLinkPreview | null>(null);
		const previousImage = ref<ClientLinkPreview | null>();
		const nextImage = ref<ClientLinkPreview | null>();
		const channel = ref<ClientChan | null>();

		const position = ref<{
			x: number;
			y: number;
		}>({
			x: 0,
			y: 0,
		});

		const transform = ref<{
			scale: number;
			x: number;
			y: number;
		}>({
			scale: 1,
			x: 0,
			y: 0,
		});

		const computeImageStyles = computed(() => {
			// Sub pixels may cause the image to blur in certain browsers
			// round it down to prevent that
			const transformX = Math.floor(transform.value.x);
			const transformY = Math.floor(transform.value.y);

			return {
				left: `${position.value.x}px`,
				top: `${position.value.y}px`,
				transform: `translate3d(${transformX}px, ${transformY}px, 0) scale3d(${transform.value.scale}, ${transform.value.scale}, 1)`,
			};
		});

		const closeViewer = () => {
			if (link.value === null) {
				return;
			}

			channel.value = null;
			previousImage.value = null;
			nextImage.value = null;
			link.value = null;
		};

		const setPrevNextImages = () => {
			if (!channel.value || !link.value) {
				return null;
			}

			const links = channel.value.messages
				.map((msg) => msg.previews)
				.flat()
				.filter((preview) => preview.thumb);

			const currentIndex = links.indexOf(link.value);

			previousImage.value = links[currentIndex - 1] || null;
			nextImage.value = links[currentIndex + 1] || null;
		};

		const previous = () => {
			if (previousImage.value) {
				link.value = previousImage.value;
			}
		};

		const next = () => {
			if (nextImage.value) {
				link.value = nextImage.value;
			}
		};

		const prepareImage = () => {
			const viewerEl = viewer.value;
			const imageEl = image.value;

			if (!viewerEl || !imageEl) {
				return;
			}

			const width = viewerEl.offsetWidth;
			const height = viewerEl.offsetHeight;
			const scale = Math.min(1, width / imageEl.width, height / imageEl.height);

			position.value.x = Math.floor(-image.value!.naturalWidth / 2);
			position.value.y = Math.floor(-image.value!.naturalHeight / 2);
			transform.value.scale = Math.max(scale, 0.1);
			transform.value.x = width / 2;
			transform.value.y = height / 2;
		};

		const onImageLoad = () => {
			prepareImage();
		};

		const calculateZoomShift = (newScale: number, x: number, y: number, oldScale: number) => {
			if (!image.value || !viewer.value) {
				return;
			}

			const imageWidth = image.value.width;
			const centerX = viewer.value.offsetWidth / 2;
			const centerY = viewer.value.offsetHeight / 2;

			return {
				x:
					centerX -
					((centerX - (y - (imageWidth * x) / 2)) / x) * newScale +
					(imageWidth * newScale) / 2,
				y:
					centerY -
					((centerY - (oldScale - (imageWidth * x) / 2)) / x) * newScale +
					(imageWidth * newScale) / 2,
			};
		};

		const correctPosition = () => {
			const imageEl = image.value;
			const viewerEl = viewer.value;

			if (!imageEl || !viewerEl) {
				return;
			}

			const widthScaled = imageEl.width * transform.value.scale;
			const heightScaled = imageEl.height * transform.value.scale;
			const containerWidth = viewerEl.offsetWidth;
			const containerHeight = viewerEl.offsetHeight;

			if (widthScaled < containerWidth) {
				transform.value.x = containerWidth / 2;
			} else if (transform.value.x - widthScaled / 2 > 0) {
				transform.value.x = widthScaled / 2;
			} else if (transform.value.x + widthScaled / 2 < containerWidth) {
				transform.value.x = containerWidth - widthScaled / 2;
			}

			if (heightScaled < containerHeight) {
				transform.value.y = containerHeight / 2;
			} else if (transform.value.y - heightScaled / 2 > 0) {
				transform.value.y = heightScaled / 2;
			} else if (transform.value.y + heightScaled / 2 < containerHeight) {
				transform.value.y = containerHeight - heightScaled / 2;
			}
		};

		// Reduce multiple touch points into a single x/y/scale
		const reduceTouches = (touches: TouchList) => {
			let totalX = 0;
			let totalY = 0;
			let totalScale = 0;

			for (let i = 0; i < touches.length; i++) {
				const x = touches[i].clientX;
				const y = touches[i].clientY;

				totalX += x;
				totalY += y;

				for (let i2 = 0; i2 < touches.length; i2++) {
					if (i !== i2) {
						const x2 = touches[i2].clientX;
						const y2 = touches[i2].clientY;
						totalScale += Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2));
					}
				}
			}

			if (totalScale === 0) {
				totalScale = 1;
			}

			return {
				x: totalX / touches.length,
				y: totalY / touches.length,
				scale: totalScale / touches.length,
			};
		};

		const onTouchStart = (e: TouchEvent) => {
			// prevent sidebar touchstart event, we don't want to interact with sidebar while in image viewer
			e.stopImmediatePropagation();
		};

		// Touch image manipulation:
		// 1. Move around by dragging it with one finger
		// 2. Change image scale by using two fingers
		const onImageTouchStart = (e: TouchEvent) => {
			const img = image.value;
			let touch = reduceTouches(e.touches);
			let currentTouches = e.touches;
			let touchEndFingers = 0;

			const currentTransform = {
				x: touch.x,
				y: touch.y,
				scale: touch.scale,
			};

			const startTransform = {
				x: transform.value.x,
				y: transform.value.y,
				scale: transform.value.scale,
			};

			const touchMove = (moveEvent) => {
				touch = reduceTouches(moveEvent.touches);

				if (currentTouches.length !== moveEvent.touches.length) {
					currentTransform.x = touch.x;
					currentTransform.y = touch.y;
					currentTransform.scale = touch.scale;
					startTransform.x = transform.value.x;
					startTransform.y = transform.value.y;
					startTransform.scale = transform.value.scale;
				}

				const deltaX = touch.x - currentTransform.x;
				const deltaY = touch.y - currentTransform.y;
				const deltaScale = touch.scale / currentTransform.scale;
				currentTouches = moveEvent.touches;
				touchEndFingers = 0;

				const newScale = Math.min(3, Math.max(0.1, startTransform.scale * deltaScale));

				const fixedPosition = calculateZoomShift(
					newScale,
					startTransform.scale,
					startTransform.x,
					startTransform.y
				);

				if (!fixedPosition) {
					return;
				}

				transform.value.x = fixedPosition.x + deltaX;
				transform.value.y = fixedPosition.y + deltaY;
				transform.value.scale = newScale;
				correctPosition();
			};

			const touchEnd = (endEvent: TouchEvent) => {
				const changedTouches = endEvent.changedTouches.length;

				if (currentTouches.length > changedTouches + touchEndFingers) {
					touchEndFingers += changedTouches;
					return;
				}

				// todo: this is swipe to close, but it's not working very well due to unfinished delta calculation
				/* if (
					transform.value.scale <= 1 &&
					endEvent.changedTouches[0].clientY - startTransform.y <= -70
				) {
					return this.closeViewer();
				}*/

				correctPosition();

				img?.removeEventListener("touchmove", touchMove);
				img?.removeEventListener("touchend", touchEnd);
			};

			img?.addEventListener("touchmove", touchMove, {passive: true});
			img?.addEventListener("touchend", touchEnd, {passive: true});
		};

		// Image mouse manipulation:
		// 1. Mouse wheel scrolling will zoom in and out
		// 2. If image is zoomed in, simply dragging it will move it around
		const onImageMouseDown = (e: MouseEvent) => {
			// todo: ignore if in touch event currently?

			// only left mouse
			// TODO: e.buttons?
			if (e.which !== 1) {
				return;
			}

			e.stopPropagation();
			e.preventDefault();

			const viewerEl = viewer.value;
			const imageEl = image.value;

			if (!viewerEl || !imageEl) {
				return;
			}

			const startX = e.clientX;
			const startY = e.clientY;
			const startTransformX = transform.value.x;
			const startTransformY = transform.value.y;
			const widthScaled = imageEl.width * transform.value.scale;
			const heightScaled = imageEl.height * transform.value.scale;
			const containerWidth = viewerEl.offsetWidth;
			const containerHeight = viewerEl.offsetHeight;
			const centerX = transform.value.x - widthScaled / 2;
			const centerY = transform.value.y - heightScaled / 2;
			let movedDistance = 0;

			const mouseMove = (moveEvent: MouseEvent) => {
				moveEvent.stopPropagation();
				moveEvent.preventDefault();

				const newX = moveEvent.clientX - startX;
				const newY = moveEvent.clientY - startY;

				movedDistance = Math.max(movedDistance, Math.abs(newX), Math.abs(newY));

				if (centerX < 0 || widthScaled + centerX > containerWidth) {
					transform.value.x = startTransformX + newX;
				}

				if (centerY < 0 || heightScaled + centerY > containerHeight) {
					transform.value.y = startTransformY + newY;
				}

				correctPosition();
			};

			const mouseUp = (upEvent: MouseEvent) => {
				correctPosition();

				if (movedDistance < 2 && upEvent.button === 0) {
					closeViewer();
				}

				image.value?.removeEventListener("mousemove", mouseMove);
				image.value?.removeEventListener("mouseup", mouseUp);
			};

			image.value?.addEventListener("mousemove", mouseMove);
			image.value?.addEventListener("mouseup", mouseUp);
		};

		// If image is zoomed in, holding ctrl while scrolling will move the image up and down
		const onMouseWheel = (e: WheelEvent) => {
			// if image viewer is closing (css animation), you can still trigger mousewheel
			// TODO: Figure out a better fix for this
			if (link.value === null) {
				return;
			}

			e.preventDefault(); // TODO: Can this be passive?

			if (e.ctrlKey) {
				transform.value.y += e.deltaY;
			} else {
				const delta = e.deltaY > 0 ? 0.1 : -0.1;
				const newScale = Math.min(3, Math.max(0.1, transform.value.scale + delta));
				const fixedPosition = calculateZoomShift(
					newScale,
					transform.value.scale,
					transform.value.x,
					transform.value.y
				);

				if (!fixedPosition) {
					return;
				}

				transform.value.scale = newScale;
				transform.value.x = fixedPosition.x;
				transform.value.y = fixedPosition.y;
			}

			correctPosition();
		};

		const onClick = (e: Event) => {
			// If click triggers on the image, ignore it
			if (e.target === image.value) {
				return;
			}

			closeViewer();
		};

		watch(link, (newLink, oldLink) => {
			// TODO: history.pushState
			if (newLink === null) {
				eventbus.off("escapekey", closeViewer);
				eventbus.off("resize", correctPosition);
				Mousetrap.unbind("left");
				Mousetrap.unbind("right");
				return;
			}

			setPrevNextImages();

			if (!oldLink) {
				eventbus.on("escapekey", closeViewer);
				eventbus.on("resize", correctPosition);
				Mousetrap.bind("left", previous);
				Mousetrap.bind("right", next);
			}
		});

		return {
			link,
			channel,
			image,
			transform,
			closeViewer,
			next,
			previous,
			onImageLoad,
			onImageMouseDown,
			onMouseWheel,
			onClick,
			onTouchStart,
			previousImage,
			nextImage,
			onImageTouchStart,
			computeImageStyles,
			viewer,
		};
	},
});
</script>

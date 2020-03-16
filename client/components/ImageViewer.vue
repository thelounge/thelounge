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

<script>
import Mousetrap from "mousetrap";
import eventbus from "../js/eventbus";

export default {
	name: "ImageViewer",
	data() {
		return {
			link: null,
			previousImage: null,
			nextImage: null,
			channel: null,

			position: {
				x: 0,
				y: 0,
			},
			transform: {
				x: 0,
				y: 0,
				scale: 0,
			},
		};
	},
	computed: {
		computeImageStyles() {
			// Sub pixels may cause the image to blur in certain browsers
			// round it down to prevent that
			const transformX = Math.floor(this.transform.x);
			const transformY = Math.floor(this.transform.y);

			return {
				left: `${this.position.x}px`,
				top: `${this.position.y}px`,
				transform: `translate3d(${transformX}px, ${transformY}px, 0) scale3d(${this.transform.scale}, ${this.transform.scale}, 1)`,
			};
		},
	},
	watch: {
		link(newLink, oldLink) {
			// TODO: history.pushState
			if (newLink === null) {
				eventbus.off("escapekey", this.closeViewer);
				eventbus.off("resize", this.correctPosition);
				Mousetrap.unbind("left", this.previous);
				Mousetrap.unbind("right", this.next);
				return;
			}

			this.setPrevNextImages();

			if (!oldLink) {
				eventbus.on("escapekey", this.closeViewer);
				eventbus.on("resize", this.correctPosition);
				Mousetrap.bind("left", this.previous);
				Mousetrap.bind("right", this.next);
			}
		},
	},
	methods: {
		closeViewer() {
			if (this.link === null) {
				return;
			}

			this.channel = null;
			this.previousImage = null;
			this.nextImage = null;
			this.link = null;
		},
		setPrevNextImages() {
			if (!this.channel) {
				return null;
			}

			const links = this.channel.messages
				.map((msg) => msg.previews)
				.flat()
				.filter((preview) => preview.thumb);

			const currentIndex = links.indexOf(this.link);

			this.previousImage = links[currentIndex - 1] || null;
			this.nextImage = links[currentIndex + 1] || null;
		},
		previous() {
			if (this.previousImage) {
				this.link = this.previousImage;
			}
		},
		next() {
			if (this.nextImage) {
				this.link = this.nextImage;
			}
		},
		onImageLoad() {
			this.prepareImage();
		},
		prepareImage() {
			const viewer = this.$refs.viewer;
			const image = this.$refs.image;
			const width = viewer.offsetWidth;
			const height = viewer.offsetHeight;
			const scale = Math.min(1, width / image.width, height / image.height);

			this.position.x = Math.floor(-image.naturalWidth / 2);
			this.position.y = Math.floor(-image.naturalHeight / 2);
			this.transform.scale = Math.max(scale, 0.1);
			this.transform.x = width / 2;
			this.transform.y = height / 2;
		},
		calculateZoomShift(newScale, x, y, oldScale) {
			const imageWidth = this.$refs.image.width;
			const centerX = this.$refs.viewer.offsetWidth / 2;
			const centerY = this.$refs.viewer.offsetHeight / 2;

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
		},
		correctPosition() {
			const image = this.$refs.image;
			const widthScaled = image.width * this.transform.scale;
			const heightScaled = image.height * this.transform.scale;
			const containerWidth = this.$refs.viewer.offsetWidth;
			const containerHeight = this.$refs.viewer.offsetHeight;

			if (widthScaled < containerWidth) {
				this.transform.x = containerWidth / 2;
			} else if (this.transform.x - widthScaled / 2 > 0) {
				this.transform.x = widthScaled / 2;
			} else if (this.transform.x + widthScaled / 2 < containerWidth) {
				this.transform.x = containerWidth - widthScaled / 2;
			}

			if (heightScaled < containerHeight) {
				this.transform.y = containerHeight / 2;
			} else if (this.transform.y - heightScaled / 2 > 0) {
				this.transform.y = heightScaled / 2;
			} else if (this.transform.y + heightScaled / 2 < containerHeight) {
				this.transform.y = containerHeight - heightScaled / 2;
			}
		},
		// Reduce multiple touch points into a single x/y/scale
		reduceTouches(touches) {
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
		},
		onTouchStart(e) {
			// prevent sidebar touchstart event, we don't want to interact with sidebar while in image viewer
			e.stopImmediatePropagation();
		},
		// Touch image manipulation:
		// 1. Move around by dragging it with one finger
		// 2. Change image scale by using two fingers
		onImageTouchStart(e) {
			const image = this.$refs.image;
			let touch = this.reduceTouches(e.touches);
			let currentTouches = e.touches;
			let touchEndFingers = 0;

			const currentTransform = {
				x: touch.x,
				y: touch.y,
				scale: touch.scale,
			};

			const startTransform = {
				x: this.transform.x,
				y: this.transform.y,
				scale: this.transform.scale,
			};

			const touchMove = (moveEvent) => {
				touch = this.reduceTouches(moveEvent.touches);

				if (currentTouches.length !== moveEvent.touches.length) {
					currentTransform.x = touch.x;
					currentTransform.y = touch.y;
					currentTransform.scale = touch.scale;
					startTransform.x = this.transform.x;
					startTransform.y = this.transform.y;
					startTransform.scale = this.transform.scale;
				}

				const deltaX = touch.x - currentTransform.x;
				const deltaY = touch.y - currentTransform.y;
				const deltaScale = touch.scale / currentTransform.scale;
				currentTouches = moveEvent.touches;
				touchEndFingers = 0;

				const newScale = Math.min(3, Math.max(0.1, startTransform.scale * deltaScale));
				const fixedPosition = this.calculateZoomShift(
					newScale,
					startTransform.scale,
					startTransform.x,
					startTransform.y
				);

				this.transform.x = fixedPosition.x + deltaX;
				this.transform.y = fixedPosition.y + deltaY;
				this.transform.scale = newScale;
				this.correctPosition();
			};

			const touchEnd = (endEvent) => {
				const changedTouches = endEvent.changedTouches.length;

				if (currentTouches.length > changedTouches + touchEndFingers) {
					touchEndFingers += changedTouches;
					return;
				}

				// todo: this is swipe to close, but it's not working very well due to unfinished delta calculation
				/* if (
					this.transform.scale <= 1 &&
					endEvent.changedTouches[0].clientY - startTransform.y <= -70
				) {
					return this.closeViewer();
				}*/

				this.correctPosition();

				image.removeEventListener("touchmove", touchMove, {passive: true});
				image.removeEventListener("touchend", touchEnd, {passive: true});
			};

			image.addEventListener("touchmove", touchMove, {passive: true});
			image.addEventListener("touchend", touchEnd, {passive: true});
		},
		// Image mouse manipulation:
		// 1. Mouse wheel scrolling will zoom in and out
		// 2. If image is zoomed in, simply dragging it will move it around
		onImageMouseDown(e) {
			// todo: ignore if in touch event currently?
			// only left mouse
			if (e.which !== 1) {
				return;
			}

			e.stopPropagation();
			e.preventDefault();

			const viewer = this.$refs.viewer;
			const image = this.$refs.image;

			const startX = e.clientX;
			const startY = e.clientY;
			const startTransformX = this.transform.x;
			const startTransformY = this.transform.y;
			const widthScaled = image.width * this.transform.scale;
			const heightScaled = image.height * this.transform.scale;
			const containerWidth = viewer.offsetWidth;
			const containerHeight = viewer.offsetHeight;
			const centerX = this.transform.x - widthScaled / 2;
			const centerY = this.transform.y - heightScaled / 2;
			let movedDistance = 0;

			const mouseMove = (moveEvent) => {
				moveEvent.stopPropagation();
				moveEvent.preventDefault();

				const newX = moveEvent.clientX - startX;
				const newY = moveEvent.clientY - startY;

				movedDistance = Math.max(movedDistance, Math.abs(newX), Math.abs(newY));

				if (centerX < 0 || widthScaled + centerX > containerWidth) {
					this.transform.x = startTransformX + newX;
				}

				if (centerY < 0 || heightScaled + centerY > containerHeight) {
					this.transform.y = startTransformY + newY;
				}

				this.correctPosition();
			};

			const mouseUp = (upEvent) => {
				this.correctPosition();

				if (movedDistance < 2 && upEvent.button === 0) {
					this.closeViewer();
				}

				image.removeEventListener("mousemove", mouseMove);
				image.removeEventListener("mouseup", mouseUp);
			};

			image.addEventListener("mousemove", mouseMove);
			image.addEventListener("mouseup", mouseUp);
		},
		// If image is zoomed in, holding ctrl while scrolling will move the image up and down
		onMouseWheel(e) {
			// if image viewer is closing (css animation), you can still trigger mousewheel
			// TODO: Figure out a better fix for this
			if (this.link === null) {
				return;
			}

			e.preventDefault(); // TODO: Can this be passive?

			if (e.ctrlKey) {
				this.transform.y += e.deltaY;
			} else {
				const delta = e.deltaY > 0 ? 0.1 : -0.1;
				const newScale = Math.min(3, Math.max(0.1, this.transform.scale + delta));
				const fixedPosition = this.calculateZoomShift(
					newScale,
					this.transform.scale,
					this.transform.x,
					this.transform.y
				);
				this.transform.scale = newScale;
				this.transform.x = fixedPosition.x;
				this.transform.y = fixedPosition.y;
			}

			this.correctPosition();
		},
		onClick(e) {
			// If click triggers on the image, ignore it
			if (e.target === this.$refs.image) {
				return;
			}

			this.closeViewer();
		},
	},
};
</script>

<template>
	<div class="preview">
		<div :class="['toggle-content', 'toggle-type-' + link.type, {show: link.shown}]">
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
						class="thumb">
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
							class="more"
							aria-expanded="false"
							aria-label="More"
							data-closed-text="More"
							data-opened-text="Less"
						>
							<span class="more-caret"/>
						</button>
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
						alt="">
				</a>
			</template>
			<template v-else-if="link.type === 'video'">
				<video
					preload="metadata"
					controls>
					<source
						:src="link.media"
						:type="link.mediaType">
				</video>
			</template>
			<template v-else-if="link.type === 'audio'">
				<audio
					controls
					preload="metadata">
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
						class="more"
						aria-expanded="false"
						aria-label="More"
						data-closed-text="More"
						data-opened-text="Less"
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
	},
};
</script>

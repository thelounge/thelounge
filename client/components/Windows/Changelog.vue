<template>
	<div
		id="changelog"
		class="window"
		aria-label="Changelog">
		<div class="header">
			<button
				class="lt"
				aria-label="Toggle channel list" />
		</div>
		<div class="container">
			<a
				id="back-to-help"
				href="#"
				data-target="#help">« Help</a>

			{{#if version}}
			<h1 class="title">Release notes for {{ version }}</h1>

			{{#if changelog}}
			<h3>Introduction</h3>
			<div class="changelog-text">{{{changelog}}}</div>
			{{else}}
			<p>Unable to retrieve releases from GitHub.</p>
			<p><a
				href="https://github.com/thelounge/thelounge/releases/tag/v{{version}}"
				target="_blank"
				rel="noopener">View release notes for this version on GitHub</a></p>
			{{/if}}
			{{else}}
			<p>Loading changelog…</p>
			{{/if}}
		</div>

	</div>
</template>

<script>
export default {
	name: "Changelog",
};
</script>

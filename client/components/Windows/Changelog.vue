<template>
	<div id="changelog" class="window" aria-label="Changelog">
		<div class="header">
			<SidebarToggle />
		</div>
		<div class="container">
			<a id="back-to-help" href="#" data-target="#help" data-component="Help">« Help</a>

			<template
				v-if="
					$store.state.versionData &&
						$store.state.versionData.current &&
						$store.state.versionData.current.version
				"
			>
				<h1 class="title">
					Release notes for {{ $store.state.versionData.current.version }}
				</h1>

				<template v-if="$store.state.versionData.current.changelog">
					<h3>Introduction</h3>
					<div
						class="changelog-text"
						v-html="$store.state.versionData.current.changelog"
					></div>
				</template>
				<template v-else>
					<p>Unable to retrieve releases from GitHub.</p>
					<p>
						<a
							:href="
								`https://github.com/thelounge/thelounge/releases/tag/v${$root.serverConfiguration.version}`
							"
							target="_blank"
							rel="noopener"
							>View release notes for this version on GitHub</a
						>
					</p>
				</template>
			</template>
			<p v-else>Loading changelog…</p>
		</div>
	</div>
</template>

<script>
import SidebarToggle from "../SidebarToggle.vue";

export default {
	name: "Changelog",
	components: {
		SidebarToggle,
	},
	mounted() {
		if (!this.$store.state.versionData) {
			socket.emit("changelog");
		}
	},
};
</script>

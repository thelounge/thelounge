<template>
	<div id="changelog" class="window" aria-label="Changelog">
		<div class="header">
			<SidebarToggle />
		</div>
		<div class="container">
			<router-link id="back-to-help" to="help">« Help</router-link>

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
						ref="changelog"
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
import socket from "../../js/socket";
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

		this.patchChangelog();
	},
	updated() {
		this.patchChangelog();
	},
	methods: {
		patchChangelog() {
			if (!this.$refs.changelog) {
				return;
			}

			const links = this.$refs.changelog.querySelectorAll("a");

			for (const link of links) {
				// Make sure all links will open a new tab instead of exiting the application
				link.setAttribute("target", "_blank");

				if (link.querySelector("img")) {
					// Add required metadata to image links, to support built-in image viewer
					link.classList.add("toggle-thumbnail");
				}
			}
		},
	},
};
</script>

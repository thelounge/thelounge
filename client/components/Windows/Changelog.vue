<template>
	<div id="changelog" class="window" aria-label="Changelog">
		<div class="header">
			<SidebarToggle />
		</div>
		<div class="container">
			<router-link id="back-to-help" to="/help">« Help</router-link>

			<template
				v-if="store.state.versionData?.current && store.state.versionData?.current.version"
			>
				<h1 class="title">
					Release notes for {{ store.state.versionData.current.version }}
				</h1>

				<template v-if="store.state.versionData.current.changelog">
					<h3>Introduction</h3>
					<div
						ref="changelog"
						class="changelog-text"
						v-html="store.state.versionData.current.changelog"
					></div>
				</template>
				<template v-else>
					<p>Unable to retrieve changelog for current release from GitHub.</p>
					<p>
						<a
							v-if="store.state.serverConfiguration?.version"
							:href="`https://github.com/thelounge/thelounge/releases/tag/v${store.state.serverConfiguration?.version}`"
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

<script lang="ts">
import {defineComponent, onMounted, onUpdated, ref} from "vue";
import socket from "../../js/socket";
import {useStore} from "../../js/store";
import SidebarToggle from "../SidebarToggle.vue";

export default defineComponent({
	name: "Changelog",
	components: {
		SidebarToggle,
	},
	setup() {
		const store = useStore();
		const changelog = ref<HTMLDivElement | null>(null);

		const patchChangelog = () => {
			if (!changelog.value) {
				return;
			}

			const links = changelog.value.querySelectorAll("a");

			links.forEach((link) => {
				// Make sure all links will open a new tab instead of exiting the application
				link.setAttribute("target", "_blank");
				link.setAttribute("rel", "noopener");

				if (link.querySelector("img")) {
					// Add required metadata to image links, to support built-in image viewer
					link.classList.add("toggle-thumbnail");
				}
			});
		};

		onMounted(() => {
			if (!store.state.versionData) {
				socket.emit("changelog");
			}

			patchChangelog();
		});

		onUpdated(() => {
			patchChangelog();
		});

		return {
			store,
		};
	},
});
</script>

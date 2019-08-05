<template>
	<div id="version-checker" :class="[$store.state.versionStatus]">
		<p v-if="$store.state.versionStatus === 'loading'">
			Checking for updates...
		</p>
		<p v-if="$store.state.versionStatus === 'new-version'">
			The Lounge <b>{{ $store.state.versionData.latest.version }}</b>
			<template v-if="$store.state.versionData.latest.prerelease">
				(pre-release)
			</template>
			is now available.
			<br />

			<a :href="$store.state.versionData.latest.url" target="_blank" rel="noopener">
				Read more on GitHub
			</a>
		</p>
		<p v-if="$store.state.versionStatus === 'new-packages'">
			The Lounge is up to date, but there are out of date packages Run
			<code>thelounge upgrade</code> on the server to upgrade packages.
		</p>
		<template v-if="$store.state.versionStatus === 'up-to-date'">
			<p>
				The Lounge is up to date!
			</p>

			<button
				v-if="$store.state.versionDataExpired"
				id="check-now"
				class="btn btn-small"
				@click="checkNow"
			>
				Check now
			</button>
		</template>
		<template v-if="$store.state.versionStatus === 'error'">
			<p>
				Information about latest releases could not be retrieved.
			</p>

			<button id="check-now" class="btn btn-small" @click="checkNow">Try again</button>
		</template>
	</div>
</template>

<script>
const socket = require("../js/socket");

export default {
	name: "VersionChecker",
	data() {
		return {
			status: "loading",
		};
	},
	mounted() {
		if (!this.$store.state.versionData) {
			this.checkNow();
		}
	},
	methods: {
		checkNow() {
			this.$store.commit("versionData", null);
			this.$store.commit("versionStatus", "loading");
			socket.emit("changelog");
		},
	},
};
</script>

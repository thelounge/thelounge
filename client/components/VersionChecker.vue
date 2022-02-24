<template>
	<div id="version-checker" :class="[$store.state.versionStatus]">
		<p v-if="$store.state.versionStatus === 'loading'">Checking for updates…</p>
		<p v-if="$store.state.versionStatus === 'new-version'">
			The Lounge <b>{{ $store.state.versionData.latest.version }}</b>
			<template v-if="$store.state.versionData.latest.prerelease"> (pre-release) </template>
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
			<p>The Lounge is up to date!</p>

			<styled-button
				v-if="$store.state.versionDataExpired"
				id="check-now"
				:small="true"
				@click="checkNow"
			>
				Check now
			</styled-button>
		</template>
		<template v-if="$store.state.versionStatus === 'error'">
			<p>Information about latest release could not be retrieved.</p>

			<styled-button id="check-now" :small="true" @click="checkNow">Try again</styled-button>
		</template>
	</div>
</template>

<style scoped>
#version-checker {
	display: flex;
	align-items: center;
	padding: 10px;
	margin-bottom: 16px;
	border-radius: 2px;
	transition: color 0.2s, background-color 0.2s;
}

#version-checker p,
#version-checker button {
	margin-bottom: 0;
}

#version-checker p {
	flex: 1;
	padding-top: 6px;
	padding-bottom: 6px;
}

#version-checker::before {
	margin-left: 6px;
	margin-right: 12px;
	font-size: 1.2em;
}

#version-checker.loading {
	background-color: #d9edf7;
	color: #31708f;
}

#version-checker.loading::before {
	content: "\f253"; /* https://fontawesome.com/icons/hourglass-end?style=solid */
}

#version-checker.new-version,
#version-checker.new-packages {
	color: #8a6d3b;
	background-color: #fcf8e3;
}

#version-checker.new-version::before,
#version-checker.new-packages::before {
	content: "\f164"; /* https://fontawesome.com/icons/thumbs-up?style=solid */
}

#version-checker.error {
	color: #a94442;
	background-color: #f2dede;
}

#version-checker.error::before {
	content: "\f06a"; /* http://fontawesome.io/icon/exclamation-circle/ */
}

#version-checker.up-to-date {
	background-color: #dff0d8;
	color: #3c763d;
}

#version-checker.up-to-date::before {
	content: "\f00c"; /* http://fontawesome.io/icon/check/ */
}
</style>
<script>
import socket from "../js/socket";
import StyledButton from "./StyledButton.vue";

export default {
	name: "VersionChecker",
	components: {StyledButton},
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

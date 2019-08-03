<template>
	<div>
		<aside id="sidebar">
			<div class="scrollable-area">
				<div class="logo-container">
					<img
						:src="`img/logo-${isPublic() ? 'horizontal-' : ''}transparent-bg.svg`"
						class="logo"
						alt="The Lounge"
					/>
					<img
						:src="
							`img/logo-${isPublic() ? 'horizontal-' : ''}transparent-bg-inverted.svg`
						"
						class="logo-inverted"
						alt="The Lounge"
					/>
				</div>
				<NetworkList :networks="networks" :active-channel="activeChannel" />
			</div>
			<footer id="footer">
				<span class="tooltipped tooltipped-n tooltipped-no-touch" aria-label="Sign in"
					><button
						class="icon sign-in"
						data-target="#sign-in"
						data-component="SignIn"
						aria-label="Sign in"
						role="tab"
						aria-controls="sign-in"
						aria-selected="false"
				/></span>
				<span
					class="tooltipped tooltipped-n tooltipped-no-touch"
					aria-label="Connect to network"
					><button
						class="icon connect"
						data-target="#connect"
						data-component="Connect"
						aria-label="Connect to network"
						role="tab"
						aria-controls="connect"
						aria-selected="false"
				/></span>
				<span class="tooltipped tooltipped-n tooltipped-no-touch" aria-label="Settings"
					><button
						class="icon settings"
						data-target="#settings"
						data-component="Settings"
						aria-label="Settings"
						role="tab"
						aria-controls="settings"
						aria-selected="false"
				/></span>
				<span class="tooltipped tooltipped-n tooltipped-no-touch" aria-label="Help"
					><button
						class="icon help"
						data-target="#help"
						data-component="Help"
						aria-label="Help"
						role="tab"
						aria-controls="help"
						aria-selected="false"
				/></span>
			</footer>
		</aside>
		<div id="sidebar-overlay" @click="$root.setSidebar(false)" />
	</div>
</template>

<script>
import NetworkList from "./NetworkList.vue";

export default {
	name: "Sidebar",
	components: {
		NetworkList,
	},
	props: {
		activeChannel: Object,
		networks: Array,
	},
	methods: {
		isPublic: () => document.body.classList.contains("public"),
	},
};
</script>

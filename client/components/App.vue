<template>
	<div
		id="viewport"
		role="tablist">
		<aside id="sidebar">
			<div class="scrollable-area">
				<div class="logo-container">
					<img
						:src="'img/logo-' + ( isPublic() ? 'horizontal-' : '' ) + 'transparent-bg.svg'"
						class="logo"
						alt="The Lounge">
					<img
						:src="'img/logo-' + ( isPublic() ? 'horizontal-' : '' ) + 'transparent-bg-inverted.svg'"
						class="logo-inverted"
						alt="The Lounge">
				</div>
				<Network
					:networks="networks"
					:active-channel="activeChannel"/>
			</div>
			<footer id="footer">
				<span
					class="tooltipped tooltipped-n tooltipped-no-touch"
					aria-label="Sign in"><button
						class="icon sign-in"
						data-target="#sign-in"
						aria-label="Sign in"
						role="tab"
						aria-controls="sign-in"
						aria-selected="false"/></span>
				<span
					class="tooltipped tooltipped-n tooltipped-no-touch"
					aria-label="Connect to network"><button
						class="icon connect"
						data-target="#connect"
						aria-label="Connect to network"
						role="tab"
						aria-controls="connect"
						aria-selected="false"/></span>
				<span
					class="tooltipped tooltipped-n tooltipped-no-touch"
					aria-label="Settings"><button
						class="icon settings"
						data-target="#settings"
						aria-label="Settings"
						role="tab"
						aria-controls="settings"
						aria-selected="false"/></span>
				<span
					class="tooltipped tooltipped-n tooltipped-no-touch"
					aria-label="Help"><button
						class="icon help"
						data-target="#help"
						aria-label="Help"
						role="tab"
						aria-controls="help"
						aria-selected="false"/></span>
			</footer>
		</aside>
		<div id="sidebar-overlay"/>
		<article id="windows">
			<div
				id="chat-container"
				class="window">
				<div id="chat">
					<!--Chat v-if="activeChannel" :channel="activeChannel.channel"/-->
					<template v-for="network in networks">
						<Chat
							v-for="channel in network.channels"
							:key="channel.id"
							:channel="channel"/>
					</template>
				</div>
				<div id="connection-error"/>
				<form
					id="form"
					method="post"
					action="">
					<span id="nick"/>
					<textarea
						id="input"
						class="mousetrap"/>
					<span
						id="submit-tooltip"
						class="tooltipped tooltipped-w tooltipped-no-touch"
						aria-label="Send message">
						<button
							id="submit"
							type="submit"
							aria-label="Send message"/>
					</span>
				</form>
			</div>
			<div
				id="sign-in"
				class="window"
				role="tabpanel"
				aria-label="Sign-in"/>
			<div
				id="connect"
				class="window"
				role="tabpanel"
				aria-label="Connect"/>
			<div
				id="settings"
				class="window"
				role="tabpanel"
				aria-label="Settings"/>
			<div
				id="help"
				class="window"
				role="tabpanel"
				aria-label="Help"/>
			<div
				id="changelog"
				class="window"
				aria-label="Changelog"/>
		</article>
	</div>
</template>

<script>
import Network from "./Network.vue";
import Chat from "./Chat.vue";

export default {
	name: "App",
	components: {
		Network,
		Chat,
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

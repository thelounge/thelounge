<template>
	<div id="settings" class="window" role="tabpanel" aria-label="Channel settings">
		<div class="header">
			<SidebarToggle />
		</div>
		<form v-if="channel" class="container" @submit.prevent>
			<h1 class="title">Settings - {{ channel.name }}</h1>

			<h2>
				Status messages
				<span
					class="tooltipped tooltipped-n tooltipped-no-delay"
					aria-label="Joins, parts, kicks, nick changes, away changes, and mode changes"
				>
					<button class="extra-help" />
				</span>
			</h2>
			<div>
				<label class="opt">
					<input
						:checked="$store.state.settings.statusMessages === 'inherit'"
						type="radio"
						name="statusMessages"
						value="inherit"
					/>
					Inherit from app settings
				</label>
				<label class="opt">
					<input
						:checked="$store.state.settings.statusMessages === 'shown'"
						type="radio"
						name="statusMessages"
						value="shown"
					/>
					Show all status messages individually
				</label>
				<label class="opt">
					<input
						:checked="$store.state.settings.statusMessages === 'condensed'"
						type="radio"
						name="statusMessages"
						value="condensed"
					/>
					Condense status messages together
				</label>
				<label class="opt">
					<input
						:checked="$store.state.settings.statusMessages === 'hidden'"
						type="radio"
						name="statusMessages"
						value="hidden"
					/>
					Hide all status messages
				</label>
			</div>

			<template v-if="$store.state.serverConfiguration.prefetch">
				<h2>Link previews</h2>
				<div>
					<label class="opt">
						<input
							:checked="$store.state.settings.media"
							type="checkbox"
							name="media"
						/>
						Auto-expand media
					</label>
				</div>
				<div>
					<label class="opt">
						<input
							:checked="$store.state.settings.links"
							type="checkbox"
							name="links"
						/>
						Auto-expand websites
					</label>
				</div>
			</template>
		</form>
	</div>
</template>

<script>
import SidebarToggle from "../SidebarToggle.vue";

export default {
	name: "ChannelEdit",
	components: {
		SidebarToggle,
	},
	data() {
		return {
			channel: null,
		};
	},
	watch: {
		"$route.params.id"() {
			this.setChannel();
		},
	},
	mounted() {
		this.setChannel();
	},
	methods: {
		setChannel() {
			const channel = this.$store.getters.findChannel(Number(this.$route.params.id));
			this.channel = channel ? channel.channel : null;
		},
	},
};
</script>

<template>
	<div
		:id="'chan-' + channel.id"
		:class="[channel.type, 'chan']"
		:data-id="channel.id"
		:data-type="channel.type"
		:aria-label="channel.name"
		role="tabpanel"
	>
		<div class="header">
			<button
				class="lt"
				aria-label="Toggle channel list"/>
			<span class="title">{{ channel.name }}</span>
			<span
				:title="channel.topic"
				class="topic"
				v-html="$options.filters.parse(channel.topic)"/>
			<button
				class="menu"
				aria-label="Open the context menu"
			/>
			<span
				v-if="channel.type === 'channel'"
				class="rt-tooltip tooltipped tooltipped-w"
				aria-label="Toggle user list">
				<button
					class="rt"
					aria-label="Toggle user list"/>
			</span>
		</div>
		<div class="chat-content">
			<div class="chat">
				<div
					v-if="channel.messages.length > 0"
					class="show-more">
					<button
						:data-id="channel.id"
						class="btn"
						data-alt-text="Loading…">Show older messages</button>
				</div>
				<div
					class="messages"
					role="log"
					aria-live="polite"
					aria-relevant="additions"
				>
					<template v-for="(message, id) in channel.messages">
						<div
							v-if="shouldDisplayDateMarker(id)"
							:key="message.id + '-date'"
							:data-time="message.time"
							:aria-label="message.time | localedate"
							class="date-marker-container tooltipped tooltipped-s"
						>
							<div class="date-marker">
								<span
									:data-label="message.time | friendlydate"
									class="date-marker-text"/>
							</div>
						</div>

						<Message
							:message="message"
							:key="message.id"/>
					</template>
				</div>
			</div>
			<aside
				v-if="channel.type === 'channel'"
				class="userlist">
				<div class="count">
					<input
						type="search"
						class="search"
						aria-label="Search among the user list"
						tabindex="-1">
				</div>
				<div class="names names-filtered"/>
				<div class="names names-original"/>
			</aside>
		</div>
	</div>
</template>

<script>
import Message from "./Message.vue";

export default {
	name: "Chat",
	components: {
		Message,
	},
	props: {
		channel: Object,
	},
	methods: {
		shouldDisplayDateMarker(id) {
			const previousTime = this.channel.messages[id - 1];

			if (!previousTime) {
				return true;
			}

			const currentTime = this.channel.messages[id];

			return (new Date(previousTime.time)).getDay() !== (new Date(currentTime.time)).getDay();
		},
	},
};
</script>

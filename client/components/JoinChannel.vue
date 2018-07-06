<template>
	<form
		:id="'join-channel-' + channel.id"
		class="join-form"
		method="post"
		action=""
		autocomplete="off"
	>
		<input
			type="text"
			class="input"
			name="channel"
			placeholder="Channel"
			pattern="[^\s]+"
			maxlength="200"
			title="The channel name may not contain spaces"
			required
		>
		<input
			type="password"
			class="input"
			name="key"
			placeholder="Password (optional)"
			pattern="[^\s]+"
			maxlength="200"
			title="The channel password may not contain spaces"
			autocomplete="new-password"
		>
		<button
			type="submit"
			class="btn btn-small">Join</button>
	</form>
</template>

<script>
export default {
	name: "JoinChannel",
	props: {
		channel: Object,
	},
};
</script>

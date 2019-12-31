<template>
	<form :class="['message-search', {opened: searchOpened}]" @submit.prevent="searchMessages">
		<div class="input-wrapper">
			<input
				ref="searchInputField"
				type="text"
				name="search"
				class="input"
				placeholder="Search messages..."
				@input="setSearchInput"
				@blur="closeSearch"
			/>
		</div>
		<button
			class="search"
			type="button"
			aria-label="Search messages in this channel"
			@click.prevent="toggleSearch"
		/>
	</form>
</template>

<script>
export default {
	name: "MessageSearchForm",
	props: {
		network: Object,
		channel: Object,
	},
	data() {
		return {
			searchOpened: false,
			searchInput: "",
		};
	},
	methods: {
		setSearchInput(event) {
			this.searchInput = event.target.value;
		},
		closeSearch() {
			this.searchOpened = false;
		},
		toggleSearch(event) {
			event.preventDefault();
			this.searchOpened = !this.searchOpened;

			if (this.searchOpened) {
				this.$refs.searchInputField.focus();
			}
		},
		searchMessages(event) {
			event.preventDefault();

			if (!this.searchInput) {
				return;
			}

			this.searchOpened = false;

			this.$router.push({
				name: "SearchResults",
				params: {
					uuid: this.network.uuid,
					target: this.channel.name,
					term: this.searchInput,
				},
			});
		},
	},
};
</script>

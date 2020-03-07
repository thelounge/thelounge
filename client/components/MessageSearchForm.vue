<template>
	<form :class="['message-search', {opened: searchOpened}]" @submit.prevent="searchMessages">
		<div class="input-wrapper">
			<input
				ref="searchInputField"
				type="text"
				name="search"
				class="input"
				placeholder="Search messages…"
				@input="setSearchInput"
				@blur="closeSearch"
			/>
		</div>
		<button
			class="search"
			type="button"
			aria-label="Search messages in this channel"
			@mousedown.prevent="toggleSearch"
		/>
	</form>
</template>

<style>
form.message-search {
	display: flex;
}

form.message-search .input-wrapper {
	display: flex;
}

form.message-search button {
	display: none !important;
}

form.message-search input {
	width: 100%;
	height: auto !important;
	margin: 7px 0;
	border: 0;
	color: inherit;
	background-color: rgba(128, 128, 128, 0.15);
}

form.message-search input::placeholder {
	color: rgba(128, 128, 128, 0.4);
}

@media (min-width: 480px) {
	form.message-search input {
		min-width: 140px;
		transition: min-width 0.2s;
	}

	form.message-search input:focus {
		min-width: 220px;
	}
}

@media (max-width: 768px) {
	form.message-search .input-wrapper {
		position: absolute;
		top: 45px;
		left: 0;
		right: 0;
		z-index: 1;
		height: 0;
		transition: height 0.2s;
		overflow: hidden;
		background: var(--window-bg-color);
	}

	form.message-search .input-wrapper input {
		margin: 7px;
	}

	form.message-search.opened .input-wrapper {
		height: 50px;
	}

	form.message-search button {
		display: flex !important;
	}
}
</style>

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
		toggleSearch() {
			if (this.searchOpened) {
				this.$refs.searchInputField.blur();
				return;
			}

			this.searchOpened = true;
			this.$refs.searchInputField.focus();
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

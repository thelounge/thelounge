<template>
	<form :class="['message-search', {opened: searchOpened}]" @submit.prevent="searchMessages">
		<div class="input-wrapper">
			<input
				ref="searchInputField"
				v-model="searchInput"
				type="search"
				name="search"
				class="input"
				placeholder="Search messages…"
				@blur="closeSearch"
			/>
		</div>
		<button
			v-if="!onSearchPage"
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

form.message-search input {
	width: 100%;
	height: auto !important;
	margin: 7px 0;
	border: 0;
	color: inherit;
	background-color: #fafafa;
	appearance: none;
}

form.message-search input::placeholder {
	color: rgba(0, 0, 0, 0.35);
}

@media (min-width: 480px) {
	form.message-search input {
		min-width: 140px;
	}

	form.message-search input:focus {
		min-width: 220px;
	}
}

form.message-search .input-wrapper {
	position: absolute;
	top: 45px;
	left: 0;
	right: 0;
	z-index: 1;
	height: 0;
	overflow: hidden;
	background: var(--window-bg-color);
}

form.message-search .input-wrapper input {
	margin: 7px;
}

form.message-search.opened .input-wrapper {
	height: 50px;
}

#chat form.message-search button {
	display: flex;
	color: #607992;
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
	computed: {
		onSearchPage() {
			return this.$route.name === "SearchResults";
		},
	},
	watch: {
		"$route.query.q"() {
			this.searchInput = this.$route.query.q;
		},
	},
	mounted() {
		this.searchInput = this.$route.query.q;
		this.searchOpened = this.onSearchPage;

		if (!this.searchInput && this.searchOpened) {
			this.$refs.searchInputField.focus();
		}
	},
	methods: {
		closeSearch() {
			if (!this.onSearchPage) {
				this.searchOpened = false;
			}
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

			this.$router
				.push({
					name: "SearchResults",
					params: {
						id: this.channel.id,
					},
					query: {
						q: this.searchInput,
					},
				})
				.catch((err) => {
					if (err.name === "NavigationDuplicated") {
						// Search for the same query again
						this.$root.$emit("re-search");
					}
				});
		},
	},
};
</script>

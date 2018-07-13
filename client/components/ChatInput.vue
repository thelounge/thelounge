<template>
	<form
		id="form"
		method="post"
		action=""
		@submit.prevent="onSubmit">
		<span id="nick">{{ network.nick }}</span>
		<textarea
			id="input"
			ref="input"
			v-model="channel.pendingMessage"
			:placeholder="getInputPlaceholder(channel)"
			:aria-label="getInputPlaceholder(channel)"
			:disabled="!$root.connected"
			class="mousetrap"
			@keypress.enter.exact.prevent="onSubmit"
		/>
		<span
			v-if="$root.connected"
			id="submit-tooltip"
			class="tooltipped tooltipped-w tooltipped-no-touch"
			aria-label="Send message">
			<button
				id="submit"
				type="submit"
				aria-label="Send message"/>
		</span>
	</form>
</template>

<script>
const $ = require("jquery");
const commands = require("../js/commands/index");
const socket = require("../js/socket");
const Mousetrap = require("mousetrap");
const {wrapCursor} = require("undate");

const colorsHotkeys = {
	k: "\x03",
	b: "\x02",
	u: "\x1F",
	i: "\x1D",
	o: "\x0F",
	s: "\x1e",
	m: "\x11",
};

// Autocomplete bracket and quote characters like in a modern IDE
// For example, select `text`, press `[` key, and it becomes `[text]`
const bracketWraps = {
	'"': '"',
	"'": "'",
	"(": ")",
	"<": ">",
	"[": "]",
	"{": "}",
	"*": "*",
	"`": "`",
	"~": "~",
	"_": "_",
};

export default {
	name: "ChatInput",
	props: {
		network: Object,
		channel: Object,
	},
	watch: {
		"channel.pendingMessage"() {
			// Start by resetting height before computing as scrollHeight does not
			// decrease when deleting characters
			this.resetInputHeight();

			this.$refs.input.style.height = this.$refs.input.scrollHeight + "px";
		},
	},
	mounted() {
		if (this.$root.settings.autocomplete) {
			require("../js/autocompletion").enable(this.$refs.input);
		}

		const inputTrap = Mousetrap(this.$refs.input);

		for (const hotkey in colorsHotkeys) {
			inputTrap.bind("mod+" + hotkey, function(e) {
				// Key is lowercased because keybinds also get processed if caps lock is on
				const modifier = colorsHotkeys[e.key.toLowerCase()];

				wrapCursor(
					e.target,
					modifier,
					e.target.selectionStart === e.target.selectionEnd ? "" : modifier
				);

				return false;
			});
		}

		inputTrap.bind(Object.keys(bracketWraps), function(e) {
			if (e.target.selectionStart !== e.target.selectionEnd) {
				wrapCursor(e.target, e.key, bracketWraps[e.key]);

				return false;
			}
		});
	},
	destroyed() {
		require("../js/autocompletion").disable();
	},
	methods: {
		getInputPlaceholder(channel) {
			if (channel.type === "channel" || channel.type === "query") {
				return `Write to ${channel.name}`;
			}

			return "";
		},
		resetInputHeight() {
			this.$refs.input.style.height = this.$refs.input.style.minHeight;
		},
		onSubmit() {
			// Triggering click event opens the virtual keyboard on mobile
			// This can only be called from another interactive event (e.g. button click)
			$(this.$refs.input).trigger("click").trigger("focus");

			const target = this.channel.id;
			const text = this.channel.pendingMessage;

			if (text.length === 0) {
				return false;
			}

			this.channel.pendingMessage = "";
			this.resetInputHeight();

			if (text[0] === "/") {
				const args = text.substr(1).split(" ");
				const cmd = args.shift().toLowerCase();

				if (commands[cmd] && commands[cmd].input(args)) {
					return false;
				}
			}

			socket.emit("input", {target, text});
		},
	},
};
</script>

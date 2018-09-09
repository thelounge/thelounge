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
			:value="channel.pendingMessage"
			:placeholder="getInputPlaceholder(channel)"
			:aria-label="getInputPlaceholder(channel)"
			class="mousetrap"
			@input="setPendingMessage"
			@keypress.enter.exact.prevent="onSubmit" />
		<span
			v-if="this.$root.connected && this.$root.fileUploadEnabled"
			id="upload-tooltip"
			class="tooltipped tooltipped-w tooltipped-no-touch"
			aria-label="Upload File"
			@click="openFileUpload">
			<input
				id="upload-input"
				ref="uploadInput"
				type="file"
				multiple>
			<button
				id="upload"
				type="button"
				aria-label="Upload file" />
		</span>
		<span
			id="submit-tooltip"
			class="tooltipped tooltipped-w tooltipped-no-touch"
			aria-label="Send message">
			<button
				id="submit"
				type="submit"
				aria-label="Send message" />
		</span>
	</form>
</template>

<script>
const commands = require("../js/commands/index");
const socket = require("../js/socket");
const upload = require("../js/upload");
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
			this.setInputSize();
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

		inputTrap.bind(["up", "down"], (e, key) => {
			if (e.target.selectionStart !== e.target.selectionEnd) {
				return;
			}

			if (this.channel.inputHistoryPosition === 0) {
				this.channel.inputHistory[this.channel.inputHistoryPosition] = this.channel.pendingMessage;
			}

			if (key === "up") {
				if (this.channel.inputHistoryPosition < this.channel.inputHistory.length - 1) {
					this.channel.inputHistoryPosition++;
				}
			} else if (this.channel.inputHistoryPosition > 0) {
				this.channel.inputHistoryPosition--;
			}

			this.channel.pendingMessage = this.$refs.input.value = this.channel.inputHistory[this.channel.inputHistoryPosition];
			this.setInputSize();

			return false;
		});

		if (this.$root.fileUploadEnabled) {
			upload.initialize();
		}
	},
	destroyed() {
		require("../js/autocompletion").disable();
	},
	methods: {
		setPendingMessage(e) {
			this.channel.pendingMessage = e.target.value;
			this.channel.inputHistoryPosition = 0;
			this.setInputSize();
		},
		setInputSize() {
			this.$nextTick(() => {
				// Start by resetting height before computing as scrollHeight does not
				// decrease when deleting characters
				this.$refs.input.style.height = window.getComputedStyle(this.$refs.input).minHeight;
				this.$refs.input.style.height = this.$refs.input.scrollHeight + "px";
			});
		},
		getInputPlaceholder(channel) {
			if (channel.type === "channel" || channel.type === "query") {
				return `Write to ${channel.name}`;
			}

			return "";
		},
		onSubmit() {
			// Triggering click event opens the virtual keyboard on mobile
			// This can only be called from another interactive event (e.g. button click)
			this.$refs.input.click();
			this.$refs.input.focus();

			if (!this.$root.connected) {
				return false;
			}

			const target = this.channel.id;
			const text = this.channel.pendingMessage;

			if (text.length === 0) {
				return false;
			}

			this.channel.inputHistoryPosition = 0;
			this.channel.pendingMessage = "";
			this.$refs.input.value = "";
			this.setInputSize();

			// Store new message in history if last message isn't already equal
			if (this.channel.inputHistory[1] !== text) {
				this.channel.inputHistory.splice(1, 0, text);
			}

			if (text[0] === "/") {
				const args = text.substr(1).split(" ");
				const cmd = args.shift().toLowerCase();

				if (commands[cmd] && commands[cmd].input(args)) {
					return false;
				}
			}

			socket.emit("input", {target, text});
		},
		openFileUpload() {
			this.$refs.uploadInput.click();
		},
	},
};
</script>

<template>
	<form id="form" method="post" action="" @submit.prevent="onSubmit">
		<div class="toolbar-container" :class="{opened: showToolbar}">
			<div class="toolbar">
				<button
					class="format format-b"
					type="button"
					aria-label="Bold"
					@click="applyFormatting('bold')"
				></button>
				<button
					class="format format-u"
					type="button"
					aria-label="Underline"
					@click="applyFormatting('underline')"
				></button>
				<button
					class="format format-i"
					type="button"
					aria-label="Italic"
					@click="applyFormatting('italic')"
				></button>
				<button
					class="format format-s"
					type="button"
					aria-label="Strikethrough"
					@click="applyFormatting('strikeThrough')"
				></button>
				<button
					class="format format-m"
					type="button"
					aria-label="Monospace"
					@click="applyFormatting('monospace')"
				></button>
				<button
					class="format format-c"
					type="button"
					aria-label="Color"
					@click="applyFormatting('color')"
				></button>
				<button
					class="format format-o"
					type="button"
					aria-label="Clear formatting"
					@click="applyFormatting('removeFormat')"
				></button>
			</div>
		</div>
		<span id="upload-progressbar" />
		<span id="nick">{{ network.nick }}</span>
		<WysiwygInput
			ref="wysiwyg"
			:placeholder="getInputPlaceholder(channel)"
			@submit="onSubmit"
		/>
		<span
			id="format-tooltip"
			class="tooltipped tooltipped-w tooltipped-no-touch"
			aria-label="Text formatting"
		>
			<button
				id="format"
				type="button"
				class="chat-input-button"
				aria-label="Text formatting"
				@click="toggleToolbar"
			/>
		</span>
		<span
			v-if="$store.state.serverConfiguration.fileUpload"
			id="upload-tooltip"
			class="tooltipped tooltipped-w tooltipped-no-touch"
			aria-label="Upload file"
			@click="openFileUpload"
		>
			<input
				id="upload-input"
				ref="uploadInput"
				type="file"
				aria-labelledby="upload"
				class="chat-input-button"
				multiple
				@change="onUploadInputChange"
			/>
			<button
				id="upload"
				type="button"
				class="chat-input-button"
				aria-label="Upload file"
				:disabled="!$store.state.isConnected"
			/>
		</span>
		<span
			id="submit-tooltip"
			class="tooltipped tooltipped-w tooltipped-no-touch"
			aria-label="Send message"
		>
			<button
				id="submit"
				type="submit"
				class="chat-input-button"
				aria-label="Send message"
				:disabled="!$store.state.isConnected"
			/>
		</span>
	</form>
</template>

<style>
.toolbar button.format-b::before {
	content: "\f032"; /* https://fontawesome.io/icon/bold/ */
}
.toolbar button.format-u::before {
	content: "\f0cd"; /* https://fontawesome.io/icon/underline/ */
}
.toolbar button.format-i::before {
	content: "\f033"; /* https://fontawesome.io/icon/italic/ */
}
.toolbar button.format-s::before {
	content: "\f0cc"; /* https://fontawesome.io/icon/strikethrough/ */
}
.toolbar button.format-m::before {
	content: "\f121"; /* https://fontawesome.io/icon/code/ */
}
.toolbar button.format-c::before {
	content: "\f53f"; /* https://fontawesome.com/icons/palette?style=solid */
}
.toolbar button.format-o::before {
	content: "\f87d"; /* https://fontawesome.com/icons/remove-format?style=solid */
}
#form #format::before {
	content: "\f031"; /* https://fontawesome.io/icons/font/ */
}

#form .toolbar-container {
	position: absolute;
	top: -70px;
	left: 0;
	right: 0;
	pointer-events: none;
	display: flex;
	justify-content: center;
}

#form .toolbar-container.opened {
	display: flex;
}

#form .toolbar-container .toolbar {
	display: flex;
	background: var(--body-bg-color);
	color: var(--button-color);
	padding: 0 6px;
	border-radius: 5px;
	opacity: 0;
	transition: opacity 0.2s;
}

#form .toolbar-container.opened .toolbar {
	pointer-events: all;
	opacity: 1;
}

#form .toolbar-container .toolbar button {
	padding: 10px 9px;
}
</style>

<script>
// import autocompletion from "../js/autocompletion"; TODO
// import commands from "../js/commands/index"; TODO
import socket from "../js/socket";
import upload from "../js/upload";
import eventbus from "../js/eventbus";
import WysiwygInput from "./WysiwygInput.vue";

let autocompletionRef = null;

export default {
	name: "ChatInput",
	components: {
		WysiwygInput,
	},
	props: {
		network: Object,
		channel: Object,
	},
	data() {
		return {
			showToolbar: false,
		};
	},
	watch: {
		"channel.id"() {
			if (autocompletionRef) {
				autocompletionRef.hide();
			}

			this.closeToolbar();
		},
		"channel.pendingMessage"() {
			this.closeToolbar();
		},
	},
	mounted() {
		eventbus.on("escapekey", this.blurInput);

		/* TODO
		if (this.$store.state.settings.autocomplete) {
			autocompletionRef = autocompletion(this.$refs.input);
		}
		*/

		/* TODO
		const inputTrap = Mousetrap(this.$refs.input);

		inputTrap.bind(["up", "down"], (e, key) => {
			if (
				this.$store.state.isAutoCompleting ||
				e.target.selectionStart !== e.target.selectionEnd
			) {
				return;
			}

			const {channel} = this;

			if (channel.inputHistoryPosition === 0) {
				channel.inputHistory[channel.inputHistoryPosition] = channel.pendingMessage;
			}

			if (key === "up") {
				if (channel.inputHistoryPosition < channel.inputHistory.length - 1) {
					channel.inputHistoryPosition++;
				}
			} else if (channel.inputHistoryPosition > 0) {
				channel.inputHistoryPosition--;
			}

			channel.pendingMessage = channel.inputHistory[channel.inputHistoryPosition];
			this.$refs.input.value = channel.pendingMessage;
			this.setInputSize();

			return false;
		});
		*/

		if (this.$store.state.serverConfiguration.fileUpload) {
			upload.mounted();
		}
	},
	destroyed() {
		eventbus.off("escapekey", this.blurInput);

		if (autocompletionRef) {
			autocompletionRef.destroy();
			autocompletionRef = null;
		}

		upload.abort();
	},
	methods: {
		setPendingMessage(e) {
			this.channel.pendingMessage = e.target.value;
			this.channel.inputHistoryPosition = 0;
			this.setInputSize();
		},
		getInputPlaceholder(channel) {
			if (channel.type === "channel" || channel.type === "query") {
				return `Write to ${channel.name}`;
			}

			return "";
		},
		onSubmit(e) {
			e.preventDefault();

			if (!this.$store.state.isConnected) {
				return false;
			}

			const target = this.channel.id;
			// const content = this.$refs.wysiwyg.getHtmlContent(); TODO: use this for input history
			const lines = this.$refs.wysiwyg.getIrcLines();

			this.$refs.wysiwyg.clear();
			this.$refs.wysiwyg.focus();

			const message = lines.join("\n");
			socket.emit("input", {target, text: message});
		},

		/*
		onSubmit() {
			// Triggering click event opens the virtual keyboard on mobile
			// This can only be called from another interactive event (e.g. button click)
			this.$refs.input.click();
			this.$refs.input.focus();

			if (!this.$store.state.isConnected) {
				return false;
			}

			const target = this.channel.id;
			const text = this.channel.pendingMessage;

			if (text.length === 0) {
				return false;
			}

			if (autocompletionRef) {
				autocompletionRef.hide();
			}

			this.channel.inputHistoryPosition = 0;
			this.channel.pendingMessage = "";
			this.$refs.input.value = "";
			this.setInputSize();

			// Store new message in history if last message isn't already equal
			if (this.channel.inputHistory[1] !== text) {
				this.channel.inputHistory.splice(1, 0, text);
			}

			// Limit input history to a 100 entries
			if (this.channel.inputHistory.length > 100) {
				this.channel.inputHistory.pop();
			}

			if (text[0] === "/") {
				const args = text.substr(1).split(" ");
				const cmd = args.shift().toLowerCase();

				if (
					Object.prototype.hasOwnProperty.call(commands, cmd) &&
					commands[cmd].input(args)
				) {
					return false;
				}
			}

			socket.emit("input", {target, text});
		},
		*/
		onUploadInputChange() {
			const files = Array.from(this.$refs.uploadInput.files);
			upload.triggerUpload(files);
			this.$refs.uploadInput.value = ""; // Reset <input> element so you can upload the same file
		},
		openFileUpload() {
			this.$refs.uploadInput.click();
		},
		blurInput() {
			this.$refs.wysiwyg.blur();
		},
		closeToolbar() {
			this.showToolbar = false;
		},
		toggleToolbar() {
			this.showToolbar = !this.showToolbar;
			this.$refs.wysiwyg.focus();
		},
		applyFormatting(command) {
			this.$refs.wysiwyg.runCommand(command);
			this.closeToolbar();
			this.$refs.wysiwyg.focus();
			return false;
		},
	},
};
</script>

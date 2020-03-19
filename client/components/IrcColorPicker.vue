<template>
	<div v-if="isOpen" class="colorpicker-container overlay" @click="containerClick">
		<div
			id="context-menu"
			ref="colorPicker"
			class="colorpicker floating-container"
			tabindex="-1"
			@keydown.exact.up.stop.prevent="navigate('up')"
			@keydown.exact.down.stop.prevent="navigate('down')"
			@keydown.exact.left.stop.prevent="navigate('left')"
			@keydown.exact.right.stop.prevent="navigate('right')"
			@keydown.exact.84.stop.prevent="toggleMode()"
			@keydown.enter.prevent="submit"
		>
			<div class="colorgrid">
				<section>
					<div
						v-for="id in baseColorIds"
						:key="id"
						:class="['color', 'irc-bg' + id, {active: id === selectedColors[mode]}]"
						@click="selectColor(id)"
					></div>
				</section>
				<section>
					<div
						v-for="id in extendedColorIds"
						:key="id"
						:class="['color', 'irc-bg' + id, {active: id === selectedColors[mode]}]"
						@click="selectColor(id)"
					></div>
				</section>
			</div>
			<hr />
			<div class="tools">
				<div class="mode">
					<button
						:class="['btn', 'color-mode-fg', {'btn-cancel': mode !== 'fg'}]"
						title="Text color"
						@click.stop.prevent="setMode('fg')"
					></button>
					<button
						:class="['btn', 'color-mode-bg', {'btn-cancel': mode !== 'bg'}]"
						title="Highlight color"
						@click.stop.prevent="setMode('bg')"
					></button>
				</div>
				<div class="preview">
					<span
						:class="[
							'color',
							selectedColors['fg'] ? 'irc-fg' + selectedColors['fg'] : null,
							selectedColors['bg'] ? 'irc-bg' + selectedColors['bg'] : null,
						]"
						>preview</span
					>
				</div>
				<div class="submit">
					<button class="btn submit" @click.stop.prevent="submit"></button>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
.overlay {
	position: fixed;
	z-index: 1;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
}

.colorpicker {
	padding: 6px !important;
}

.colorpicker .colorgrid {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
}

.colorpicker .colorgrid section {
	display: grid;
	grid-template-columns: repeat(12, auto);
}

.colorpicker .colorgrid .color {
	display: inline-block;
	width: 20px;
	height: 20px;
	overflow: hidden;
	flex-shrink: 0;
	border-radius: 3px;
	margin: 1px;
	border: 1px solid rgba(0, 0, 0, 0.05);
	cursor: pointer;
}

.colorpicker .color.active {
	transform: scale(1.6);
	box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
	border: 1px solid rgba(255, 255, 255, 0.8);
}

.colorpicker .colorgrid .irc-bg99 {
	position: relative;
	background: #fff;
}

.colorpicker .colorgrid .irc-bg99::before,
.colorpicker .colorgrid .irc-bg99::after {
	content: "";
	display: block;
	width: 30px;
	border-top: 1px solid #ccc;
	transform-origin: left top;
	transform: rotate(45deg);
}

.colorpicker .colorgrid .irc-bg99::after {
	transform-origin: left top;
	position: absolute;
	bottom: 0;
	transform: rotate(-45deg);
}

.colorpicker .tools {
	margin-top: 10px;
	padding: 10px 0 4px 0;
	border-top: 1px solid #eee;
	display: flex;
	justify-content: space-between;
}

.colorpicker .tools div.mode,
.colorpicker .tools div.submit {
	width: 30%;
}

.colorpicker .tools div.submit {
	text-align: right;
}

.colorpicker .tools .preview span {
	display: inline-block;
	padding: 2px 4px;
	border-radius: 3px;
}

.colorpicker .tools button {
	margin: 0;
	padding: 3px 9px;
}

.colorpicker .tools button.btn-cancel {
	border-color: transparent;
}

.colorpicker .tools .color-mode-fg::before {
	content: "\f031"; /* https://fontawesome.com/icons/font?style=solid */
}

.colorpicker .tools .color-mode-bg::before {
	content: "\f591"; /* https://fontawesome.com/icons/highlighter?style=solid */
}

.colorpicker .tools button.submit::before {
	content: "\f00c"; /* https://fontawesome.com/icons/check?style=solid */
}
</style>

<script>
import positionElement from "../js/helpers/positionElement";

export default {
	name: "IrcColorPicker",
	data() {
		return {
			isOpen: false,
			mode: "fg",
			selectedColors: {
				fg: null,
				bg: 4,
			},
			baseColorIds: Array.from({length: 16}, (v, k) => k), // 0 - 15
			extendedColorIds: Array.from({length: 84}, (v, k) => k + 16), // 16 - 99
		};
	},
	mounted() {
		this.$root.$on("escapekey", this.close);
	},
	destroyed() {
		this.$root.$off("escapekey", this.close);
		this.close();
	},
	methods: {
		open(pos, callback) {
			this.isOpen = true;
			this.callback = callback ? callback : null;
			this.previousActiveElement = document.activeElement;

			// Position the menu and set the focus on the first item after it's size has updated
			this.$nextTick(() => {
				this.$refs.colorPicker.focus();
				positionElement(this.$refs.colorPicker, pos.x, pos.y, "left", "bottom");
			});
		},
		close() {
			// TODO: reset colors to null?
			this.mode = "fg";
			this.isOpen = false;
			this.callback = null;

			if (this.previousActiveElement) {
				this.previousActiveElement.focus();
				this.previousActiveElement = null;
			}
		},
		escape() {
			if (this.callback) {
				this.callback(false);
			}

			this.close();
		},
		selectColor(id) {
			this.selectedColors[this.mode] = id;
		},
		submit() {
			if (this.callback) {
				// Color 99 means no color, so pass null
				this.callback({
					fg: this.selectedColors.fg === 99 ? null : this.selectedColors.fg,
					bg: this.selectedColors.bg === 99 ? null : this.selectedColors.bg,
				});
			}

			this.close();
		},
		setMode(mode) {
			this.mode = mode;
		},
		toggleMode() {
			this.mode = this.mode === "fg" ? "bg" : "fg";
		},
		containerClick(event) {
			if (event.currentTarget === event.target) {
				this.close();
			}
		},
		navigate(direction) {
			const directionToDelta = {
				up: -12,
				down: 12,
				left: -1,
				right: 1,
			};

			let delta = directionToDelta[direction];
			let color = this.selectedColors[this.mode];

			// Improve vertical navigation between normal and extended
			// colors as well as warping around between top and bottom
			if (direction === "up") {
				if (color < 16) {
					delta = color < 12 ? -11 : -12;
				} else if (color >= 16 && color <= 27) {
					delta = color <= 19 ? -4 : -16;
				}
			} else if (direction === "down") {
				if (color >= 88) {
					delta = 11;
				} else if (color >= 4 && color <= 15) {
					delta = color >= 12 ? 4 : 16;
				}
			}

			const lastColor = this.extendedColorIds[this.extendedColorIds.length - 1];
			color += delta;

			if (color > lastColor) {
				color = color - lastColor;
			}

			if (color < 0) {
				color = lastColor - Math.abs(color);
			}

			this.selectedColors[this.mode] = color;
		},
	},
};
</script>

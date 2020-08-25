<template>
	<div class="settings">
		<h2>Messages</h2>
		<div>
			<label class="opt">
				<input :checked="$store.state.settings.motd" type="checkbox" name="motd" />
				Show <abbr title="Message Of The Day">MOTD</abbr>
			</label>
		</div>
		<div>
			<label class="opt">
				<input
					:checked="$store.state.settings.showSeconds"
					type="checkbox"
					name="showSeconds"
				/>
				Show seconds in timestamp
			</label>
		</div>
		<div>
			<label class="opt">
				<input
					:checked="$store.state.settings.use12hClock"
					type="checkbox"
					name="use12hClock"
				/>
				Show 12-hour timestamps
			</label>
		</div>
		<div v-if="!$store.state.serverConfiguration.public && $store.state.settings.advanced">
			<h2>Automatic away message</h2>

			<label class="opt">
				<label for="awayMessage" class="sr-only">Automatic away message</label>
				<input
					id="awayMessage"
					:value="$store.state.settings.awayMessage"
					type="text"
					name="awayMessage"
					class="input"
					placeholder="Away message if The Lounge is not open"
				/>
			</label>
		</div>
		<h2 id="label-status-messages">
			Status messages
			<span
				class="tooltipped tooltipped-n tooltipped-no-delay"
				aria-label="Joins, parts, quits, kicks, nick changes, and mode changes"
			>
				<button class="extra-help" />
			</span>
		</h2>
		<div role="group" aria-labelledby="label-status-messages">
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
		<h2>Visual Aids</h2>
		<div>
			<label class="opt">
				<input
					:checked="$store.state.settings.coloredNicks"
					type="checkbox"
					name="coloredNicks"
				/>
				Enable colored nicknames
			</label>
			<label class="opt">
				<input
					:checked="$store.state.settings.autocomplete"
					type="checkbox"
					name="autocomplete"
				/>
				Enable autocomplete
			</label>
		</div>
		<div v-if="$store.state.settings.advanced">
			<label class="opt">
				<label for="nickPostfix" class="sr-only">
					Nick autocomplete postfix (for example a comma)
				</label>
				<input
					id="nickPostfix"
					:value="$store.state.settings.nickPostfix"
					type="text"
					name="nickPostfix"
					class="input"
					placeholder="Nick autocomplete postfix (e.g. ', ')"
				/>
			</label>
		</div>

		<h2>Theme</h2>
		<div>
			<label for="theme-select" class="sr-only">Theme</label>
			<select
				id="theme-select"
				:value="$store.state.settings.theme"
				name="theme"
				class="input"
			>
				<option
					v-for="theme in $store.state.serverConfiguration.themes"
					:key="theme.name"
					:value="theme.name"
				>
					{{ theme.displayName }}
				</option>
			</select>
		</div>

		<template v-if="$store.state.serverConfiguration.prefetch">
			<h2>Link previews</h2>
			<div>
				<label class="opt">
					<input :checked="$store.state.settings.media" type="checkbox" name="media" />
					Auto-expand media
				</label>
			</div>
			<div>
				<label class="opt">
					<input :checked="$store.state.settings.links" type="checkbox" name="links" />
					Auto-expand websites
				</label>
			</div>
		</template>

		<div v-if="$store.state.settings.advanced && $store.state.serverConfiguration.fileUpload">
			<h2>File uploads</h2>
			<div>
				<label class="opt">
					<input
						:checked="$store.state.settings.uploadCanvas"
						type="checkbox"
						name="uploadCanvas"
					/>
					Attempt to remove metadata from images before uploading
					<span
						class="tooltipped tooltipped-n tooltipped-no-delay"
						aria-label="This option renders the image into a canvas element to remove metadata from the image.
This may break orientation if your browser does not support that."
					>
						<button class="extra-help" />
					</span>
				</label>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "MessageSettings",
};
</script>

<div class="header">
	<button class="lt" aria-label="Toggle channel list"></button>
</div>
<div class="container">
	{{#if current}}
		{{#if latest}}
		<a href="{{latest.url}}" target="_blank" rel="noopener" class="changelog-version changelog-version-new">
			The Lounge <b>{{latest.version}}</b>{{#if latest.prerelease}} (pre-release){{/if}} is now available.
			Click to view details on GitHub.
		</a>
		{{else if current.changelog}}
		<div class="changelog-version">
			The Lounge is up to date!
		</div>
		{{/if}}

		<h1 class="title">Release notes for {{current.version}}</h1>

		{{#if current.changelog}}
			<h3>Introduction</h3>
			<div class="changelog-text">{{{current.changelog}}}</div>
		{{else}}
			<p>Unable to retrieve releases from GitHub.</p>
			<p><a href="https://github.com/thelounge/lounge/releases/tag/{{current.version}}" target="_blank" rel="noopener">View release notes for this version on GitHub</a></p>
		{{/if}}
	{{else}}
		<p>Loading changelog…</p>
	{{/if}}
</div>

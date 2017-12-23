<div class="header">
	<button class="lt" aria-label="Toggle channel list"></button>
</div>
<div class="container">
	<a href="#" id="back-to-help" data-target="#help">« Help</a>

	{{#if current}}
		<h1 class="title">Release notes for {{current.version}}</h1>

		{{#if current.changelog}}
			<h3>Introduction</h3>
			<div class="changelog-text">{{{current.changelog}}}</div>
		{{else}}
			<p>Unable to retrieve releases from GitHub.</p>
			<p><a href="https://github.com/thelounge/lounge/releases/tag/v{{current.version}}" target="_blank" rel="noopener">View release notes for this version on GitHub</a></p>
		{{/if}}
	{{else}}
		<p>Loading changelog…</p>
	{{/if}}
</div>

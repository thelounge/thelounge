<div class="header">
	<button class="lt" aria-label="{{translate index.toggle_chan_list}}"></button></div>
<div class="container">
	<a href="#" id="back-to-help" data-target="#help">{{translate index.help.back_to_help}}</a>

	{{#if version}}
		<h1 class="title">{{translate index.help.changelog.release_notes version}}</h1>

		{{#if changelog}}
			<h3>{{translate index.help.changelog.title}}</h3>
			<div class="changelog-text">{{{changelog}}}</div>
		{{else}}
			<p>{{translate index.help.changelog.github_failure}}</p>
			<p><a href="https://github.com/thelounge/lounge/releases/tag/v{{version}}" target="_blank" rel="noopener">{translate index.help.changelog.view_on_github}}</a></p>
		{{/if}}
	{{else}}
		<p>{{translate index.help.changelog.title}}</p>
	{{/if}}
</div>

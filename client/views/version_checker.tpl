{{#equal status "loading"}}
	<p>
		Checking for updates...
	</p>
{{else equal status "new-version"}}
	<p>
		The Lounge <b>{{latest.version}}</b>{{#if latest.prerelease}} (pre-release){{/if}}
		is now available.
		<br>

		<a href="{{latest.url}}" target="_blank" rel="noopener">
			Read more on GitHub
		</a>
	</p>
{{else equal status "up-to-date"}}
	<p>
		The Lounge is up to date!
	</p>

	<button id="check-now" class="btn btn-small">Check now</button>
{{else equal status "error"}}
	<p>
		Information about latest releases could not be retrieved.
	</p>

	<button id="check-now" class="btn btn-small">Try again</button>
{{/equal}}

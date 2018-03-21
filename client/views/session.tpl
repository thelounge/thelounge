<p>
	<button
		class="btn pull-right remove-session"
		{{#unless current}}data-token="{{token}}"{{/unless}}
	>
		{{#if current}}
			Sign out
		{{else}}
			Revoke
		{{/if}}
	</button>

	<strong>{{agent}}</strong>

	<a href="https://ipinfo.io/{{ip}}" target="_blank" rel="noopener">{{ip}}</a>

{{#unless current}}
	<br>
	{{#if active}}
		<em>Currently active</em>
	{{else}}
		Last used on <time>{{localetime lastUse}}</time>
	{{/if}}
{{/unless}}
</p>

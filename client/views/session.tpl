<p>
{{#if current}}
	<strong>{{agent}}</strong>
	<a href="https://ipinfo.io/{{ip}}" target="_blank" rel="noopener">{{ip}}</a>
{{else}}
	<button class="btn pull-right remove-session" data-token="{{token}}">Disconnect</button>

	<strong>{{agent}}</strong>
	<a href="https://ipinfo.io/{{ip}}" target="_blank" rel="noopener">{{ip}}</a>
	<br>
	{{#if active}}
		<em>Currently active</em>
	{{else}}
		Last used on <time>{{localetime lastUse}}</time>
	{{/if}}
{{/if}}
</p>

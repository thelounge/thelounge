<p class="clearfix">
	{{#if id includeZero=true}}
		<button class="btn pull-right" id="connection_{{id}}" value="{{socketId}}">Disconnect</button>
	{{/if}}

	<strong>{{hostname}}</strong>
	<br>
	<a class="" href="https://geoiptool.com/?ip={{ip}}">{{ip}}</a>
	<br>
	{{userAgent}}
</p>

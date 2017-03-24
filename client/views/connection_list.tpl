<label class="opt">
	{{#if active_host}}
	<input type="checkbox" id="connection_{{id}}" value="{{socket_id}}" checked="true">
		ip: <a href="#{{socket_id}}">{{ip}}</a>, {{hostname}} (current) 
	{{else}}
	<input type="checkbox" id="connection_{{id}}" value="{{socket_id}}" checked="true">
		ip: <a href="#{{socket_id}}">{{ip}}</a>, {{hostname}} 
	{{/if}}
</label>
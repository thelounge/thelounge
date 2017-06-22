<div>
	{{> ../user_name nick=whois.nick}}
	<i class="hostmask">({{whois.user}}@{{whois.host}})</i>:
	<b>{{whois.real_name}}</b>
</div>
{{#if whois.account}}
<div>
	{{> ../user_name nick=whois.nick}}
	is logged in as <b>{{whois.account}}</b>
</div>
{{/if}}
{{#if whois.channels}}
<div>
	{{> ../user_name nick=whois.nick}}
	is on the following channels: {{{parse whois.channels}}}
</div>
{{/if}}
{{#if whois.server}}
<div>
	{{> ../user_name nick=whois.nick}}
	is connected to {{whois.server}} <i>({{whois.server_info}})</i>
</div>
{{/if}}
{{#if whois.secure}}
<div>
	{{> ../user_name nick=whois.nick}}
	is using a secure connection
</div>
{{/if}}
{{#if whois.away}}
<div>
	{{> ../user_name nick=whois.nick}}
	is away <i>({{whois.away}})</i>
</div>
{{/if}}
{{#if whois.idle}}
<div>
	{{> ../user_name nick=whois.nick}}
	has been idle since {{localetime whois.idleTime}}.
</div>
{{/if}}

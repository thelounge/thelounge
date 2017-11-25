<div>
	{{> ../user_name nick=whois.nick}}
	<i class="hostmask">({{whois.user}}@{{whois.host}})</i>
</div>
{{#if whois.actuallhost}}
<div>
	Actual host
	{{> ../user_name nick=whois.nick}}
	<i class="hostmask">({{whois.user}}@{{whois.actuallhost}})</i>
</div>
{{/if}}
{{#if whois.real_name}}
<div>
	{{> ../user_name nick=whois.nick}}'s real name is:
	<b>{{{parse whois.real_name}}}</b>
</div>
{{/if}}
{{#if whois.account}}
<div>
	{{> ../user_name nick=whois.nick}}
	is logged in as <b>{{whois.account}}</b>
</div>
{{/if}}
{{#if whois.registered_nick}}
<div>
	{{> ../user_name nick=whois.nick}}
	{{whois.registered_nick}}
</div>
{{/if}}
{{#if whois.modes}}
<div>
	{{> ../user_name nick=whois.nick}}
	{{whois.modes}}
</div>
{{/if}}
{{#if whois.special}}
<div>
	{{> ../user_name nick=whois.nick}}
	{{whois.special}}
</div>
{{/if}}
{{#if whois.operator}}
<div>
	{{> ../user_name nick=whois.nick}}
	{{whois.operator}}
</div>
{{/if}}
{{#if whois.helpop}}
<div>
	{{> ../user_name nick=whois.nick}}
	is available for help
</div>
{{/if}}
{{#if whois.bot}}
<div>
	{{> ../user_name nick=whois.nick}}
	is a bot
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
{{#if whois.logonTime}}
<div>
	{{> ../user_name nick=whois.nick}}
	connected at {{localetime whois.logonTime}}
</div>
{{/if}}
{{#if whois.idle}}
<div>
	{{> ../user_name nick=whois.nick}}
	has been idle since {{localetime whois.idleTime}}
</div>
{{/if}}

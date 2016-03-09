<div>
	<a href="#" class="user" data-name="{{whois.nickname}}">{{whois.nickname}}</a>
	<i class="hostmask">({{whois.username}}@{{whois.hostname}})</i>:
	<b>{{whois.realname}}</b>
</div>
{{#if whois.channels}}
<div>
	<a href="#" class="user" data-name="{{whois.nickname}}">{{whois.nickname}}</a>
	is on the following channels:
	{{#each whois.channels}}
		{{{parse this}}}
	{{/each}}
</div>
{{/if}}
{{#if whois.server}}
<div>
	<a href="#" class="user" data-name="{{whois.nickname}}">{{whois.nickname}}</a>
	is connected to {{whois.server}}
</div>
{{/if}}
{{#if whois.away}}
<div>
	<a href="#" class="user" data-name="{{whois.nickname}}">{{whois.nickname}}</a>
	is away <i>({{whois.away}})</i>
</div>
{{/if}}

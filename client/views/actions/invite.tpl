{{> ../user_name nick=from}}
invited
{{#if invitedYou}}
	you
{{else}}
	{{> ../user_name nick=invited}}
{{/if}}
to
{{{parse channel}}}

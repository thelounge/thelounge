{{> ../user_name from}}
invited
{{#if invitedYou}}
	you
{{else}}
	{{> ../user_name target}}
{{/if}}
to
{{{parse channel}}}

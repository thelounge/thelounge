{{> ../user_name from}}
{{translate 'client.invited.invited'}}
{{#if invitedYou}}
	{{translate 'client.invited.you'}}
{{else}}
	{{> ../user_name target}}
{{/if}}
{{translate 'client.invited.to'}}
{{{parse channel}}}

<a href="#" class="user" data-name="{{from}}">{{from}}</a>
invited
{{#if invitedYou}}
	you
{{else}}
	<a href="#" class="user" data-name="{{invited}}">{{invited}}</a>
{{/if}}
to
{{{parse channel}}}

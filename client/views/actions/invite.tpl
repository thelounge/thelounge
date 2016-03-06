<a href="#" class="user" data-name="{{from}}">{{from}}</a>
invited
{{#if invitedYou}}
	you
{{else}}
	<a href="#" class="user" data-name="{{target}}">{{target}}</a>
{{/if}}
to
{{{parse text}}}

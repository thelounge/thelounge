<form id="join-channel-{{id}}" class="join-form" method="post" action="" autocomplete="off">
	<input type="text" class="input" name="channel" placeholder="Channel" pattern="[^\s]+" maxlength="200" title="Should be a valid channel name" required>
	<input type="password" class="input" name="key" placeholder="Password (optional)" pattern="[^\s]+" title="Should be a valid channel key" maxlength="200" >
	<button type="submit" class="btn joinchan:submit" data-id="{{id}}">Join</button>
</form>

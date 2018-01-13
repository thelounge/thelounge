<form class="container" method="post" action="">
	<div class="row">
		<div class="col-xs-12">
			<h1 class="title">Sign up</h1>
		</div>
		<div class="col-xs-12">
			<label>
				Username
				<input class="input" name="user" autofocus>
			</label>
		</div>
		<div class="col-xs-12">
			<label>
				Password
				<input class="input" type="password" name="password">
			</label>
		</div>
		<div class="col-xs-12 error" style="display: none;">Sign up failed. This username is already in use or is invalid.</div>
		<div class="col-xs-12 success" style="display: none;">Successfully registered. You can now Sign in.</div>
		<div class="col-xs-12">
			<button type="submit" class="btn">Sign up</button>
			<button id="signup-signin" type="button" class="btn">Sign in</button>
		</div>
	</div>
</form>

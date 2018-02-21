<form class="container" method="post" action="">
	<div class="row">
		<div class="col-xs-12">
			<h1 class="title">{{translate index.signin.title}}</h1>
		</div>
		<div class="col-xs-12">
			<label>
				{{translate index.signin.username}}
				<input class="input" name="user" autofocus>
			</label>
		</div>
		<div class="col-xs-12">
			<label>
				{{translate index.signin.password}}
				<input class="input" type="password" name="password">
			</label>
		</div>
		<div class="col-xs-12 error" style="display: none;">{{translate index.signin.auth_failed}}.</div>
		<div class="col-xs-12">
			<button type="submit" class="btn">{{translate index.signin.signin}}</button>
		</div>
	</div>
</form>

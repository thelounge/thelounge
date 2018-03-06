<div class="header">
	<button class="lt" aria-label="Toggle channel list"></button>
</div>
<form class="container" method="post" action="" data-event="conn">
	<div class="row">
		<div class="col-sm-12">
			<h1 class="title">
				{{#if public}}The Lounge - {{/if}}
				Connect
				{{#unless displayNetwork}}
					{{#if lockNetwork}}
					to {{defaults.name}}
					{{/if}}
				{{/unless}}
			</h1>
		</div>
		{{#if displayNetwork}}
		<div>
			<div class="col-sm-12">
				<h2>Network settings</h2>
			</div>
			<div class="col-sm-3">
				<label for="connect:name">Name</label>
			</div>
			<div class="col-sm-9">
				<input class="input" id="connect:name" name="name" value="{{defaults.name}}">
			</div>
			<div class="col-sm-3">
				<label for="connect:host">Server</label>
			</div>
			<div class="col-sm-6 col-xs-8">
				<input class="input" id="connect:host" name="host" value="{{defaults.host}}" aria-label="Server address" {{#if lockNetwork}}disabled{{/if}}>
			</div>
			<div class="col-sm-3 col-xs-4">
				<div class="port">
					<input class="input" type="number" min="1" max="65535" name="port" value="{{defaults.port}}" aria-label="Server port" {{#if lockNetwork}}disabled{{/if}}>
				</div>
			</div>
			<div class="clearfix"></div>
			<div class="col-sm-9 col-sm-offset-3">
				<label class="tls">
					<input type="checkbox" name="tls" {{#if defaults.tls}}checked{{/if}} {{#if lockNetwork}}disabled{{/if}}>
					Use secure connection (TLS)
				</label>
			</div>
			<div class="col-sm-9 col-sm-offset-3">
				<label class="tls">
					<input type="checkbox" name="rejectUnauthorized" {{#if defaults.rejectUnauthorized}}checked{{/if}} {{#if lockNetwork}}disabled{{/if}}>
					Only allow trusted certificates
				</label>
			</div>
			<div class="clearfix"></div>
		</div>
		{{/if}}
		<div class="col-sm-12">
			<h2>User preferences</h2>
		</div>
		<div class="col-sm-3">
			<label for="connect:nick">Nick</label>
		</div>
		<div class="col-sm-9">
			<input class="input nick" id="connect:nick" name="nick" value="{{defaults.nick}}">
		</div>
		{{#unless useHexIp}}
		<div class="col-sm-3">
			<label for="connect:username">Username</label>
		</div>
		<div class="col-sm-9">
			<input class="input username" id="connect:username" name="username" value="{{defaults.username}}">
		</div>
		{{/unless}}
		<div class="col-sm-3">
			<label for="connect:password">Password</label>
		</div>
		<div class="col-sm-9">
			<input class="input" id="connect:password" type="password" name="password" value="{{defaults.password}}">
		</div>
		<div class="col-sm-3">
			<label for="connect:realname">Real name</label>
		</div>
		<div class="col-sm-9">
			<input class="input" id="connect:realname" name="realname" value="{{defaults.realname}}">
		</div>
		<div class="col-sm-3">
			<label for="connect:channels">Channels</label>
		</div>
		<div class="col-sm-9">
			<input class="input" id="connect:channels" name="join" value="{{defaults.join}}">
		</div>
		<div class="col-sm-9 col-sm-offset-3">
			<button type="submit" class="btn">Connect</button>
		</div>
	</div>
</form>

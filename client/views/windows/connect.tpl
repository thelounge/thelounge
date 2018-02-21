<div class="header">
	<button class="lt" aria-label="{{translate index.toggle_chan_list}}"></button></div>
</div>
<form class="container" method="post" action="" data-event="conn">
	<div class="row">
		<div class="col-sm-12">
			<h1 class="title">
				{{#if public}}The Lounge - {{/if}}
				{{translate index.connect.connect}}
				{{#unless displayNetwork}}
				{{#if lockNetwork}}
				{{translate index.connect.to}} {{defaults.name}}
				{{/if}}
				{{/unless}}
			</h1>
		</div>
		{{#if displayNetwork}}
		<div>
			<div class="col-sm-12">
				<h2>{{translate index.connect.network_settings}}</h2>
			</div>
			<div class="col-sm-3">
				<label for="connect:name">{{translate index.connect.name}}</label>
			</div>
			<div class="col-sm-9">
				<input class="input" id="connect:name" name="name" value="{{defaults.name}}">
			</div>
			<div class="col-sm-3">
				<label for="connect:host">{{translate index.connect.server}}</label>
			</div>
			<div class="col-sm-6 col-xs-8">
				<input class="input" id="connect:host" name="host" value="{{defaults.host}}" aria-label="{{translate index.connect.server_address}}" {{#if lockNetwork}}{{translate index.connect.disabled}}{{/if}}>
			</div>
			<div class="col-sm-3 col-xs-4">
				<div class="port">
					<input class="input" type="number" min="1" max="65535" name="port" value="{{defaults.port}}" aria-label="{{translate index.connect.server_port}}" {{#if lockNetwork}}{{translate index.connect.disabled}}{{/if}}>
				</div>
			</div>
			<div class="clearfix"></div>
			<div class="col-sm-9 col-sm-offset-3">
				<label class="tls">
					<input type="checkbox" name="tls" {{#if defaults.tls}}checked{{/if}} {{#if lockNetwork}}disabled{{/if}}>
					{{translate index.connect.enable_tls_ssl}}
				</label>
			</div>
			<div class="clearfix"></div>
		</div>
		{{/if}}
		<div class="col-sm-12">
			<h2>{{translate index.connect.user_preferences}}</h2>
		</div>
		<div class="col-sm-3">
			<label for="connect:nick">{{translate index.connect.nick}}</label>
		</div>
		<div class="col-sm-9">
			<input class="input nick" id="connect:nick" name="nick" value="{{defaults.nick}}">
		</div>
		{{#unless useHexIp}}
		<div class="col-sm-3">
			<label for="connect:username">{{translate index.connect.username}}</label>
		</div>
		<div class="col-sm-9">
			<input class="input username" id="connect:username" name="username" value="{{defaults.username}}">
		</div>
		{{/unless}}
		<div class="col-sm-3">
			<label for="connect:password">{{translate index.connect.password}}</label>
		</div>
		<div class="col-sm-9">
			<input class="input" id="connect:password" type="password" name="password" value="{{defaults.password}}">
		</div>
		<div class="col-sm-3">
			<label for="connect:realname">{{translate index.connect.real_name}}</label>
		</div>
		<div class="col-sm-9">
			<input class="input" id="connect:realname" name="realname" value="{{defaults.realname}}">
		</div>
		<div class="col-sm-3">
			<label for="connect:channels">{{translate index.connect.channels}}</label>
		</div>
		<div class="col-sm-9">
			<input class="input" id="connect:channels" name="join" value="{{defaults.join}}">
		</div>
		<div class="col-sm-9 col-sm-offset-3">
			<button type="submit" class="btn">{{translate index.connect.connect}}</button>
		</div>
	</div>
</form>

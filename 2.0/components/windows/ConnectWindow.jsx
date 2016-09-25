import React, { PropTypes } from 'react';

export default class ConnectWindow extends React.Component {
	render () {
		return (
			<div id="connect" className="window cmpt-connect-window">
				<div className="header">
					<button className="lt" aria-label="Toggle channel list"></button>
				</div>
				<form className="container" method="post" action="">
					<div className="row">
						<div className="col-sm-12">
							<h1 className="title">
								{/* TODO: PUT THE MISSING SNIPPET BACK */}
								Connect
							</h1>
						</div>
						{/* TODO: PUT THE MISSING SNIPPET BACK */}
						<div >
							<div className="col-sm-12">
								<h2>Network settings</h2>
							</div>
							<div className="col-sm-3">
								{/* attr: for="connect:name" */}
								<label>Name</label>
							</div>
							<div className="col-sm-9">
								{/* TODO: PUT THE MISSING SNIPPET BACK */}
								<input className="input" id="connect:name" name="name" value="" />
							</div>
							<div className="col-sm-3">
								{/* attr: for="connect:host" */}
								<label>Server</label>
							</div>
							<div className="col-sm-6 col-xs-8">
								{/* TODO: PUT THE MISSING SNIPPET BACK */}
								<input className="input" id="connect:host" name="host" value="" aria-label="Server address" />
							</div>
							<div className="col-sm-3 col-xs-4">
								<div className="port">
									{/* TODO: PUT THE MISSING SNIPPET BACK */}
									<input className="input" type="number" min="1" max="65535" name="port" value="" aria-label="Server port" />
								</div>
							</div>
							<div className="clearfix"></div>
							<div className="col-sm-3">
								{/* attr: for="connect:password" */}
								<label>Password</label>
							</div>
							<div className="col-sm-9">
								{/* TODO: PUT THE MISSING SNIPPET BACK */}
								<input className="input" id="connect:password" type="password" name="password" value="" />
							</div>
							<div className="col-sm-9 col-sm-offset-3">
								<label className="tls">
									{/* TODO: PUT THE MISSING SNIPPET BACK */}
									<input type="checkbox" name="tls" />
									Enable TLS/SSL
								</label>
							</div>
							<div className="clearfix"></div>
						</div>
						<div className="col-sm-12">
							<h2>User preferences</h2>
						</div>
						<div className="col-sm-3">
							{/* attr: for="connect:nick" */}
							<label>Nick</label>
						</div>
						<div className="col-sm-9">
							{/* TODO: PUT THE MISSING SNIPPET BACK */}
							<input className="input nick" id="connect:nick" name="nick" value="" />
						</div>
						<div className="col-sm-3">
							{/* attr: for="connect:username" */}
							<label>Username</label>
						</div>
						<div className="col-sm-9">
							{/* TODO: PUT THE MISSING SNIPPET BACK */}
							<input className="input username" id="connect:username" name="username" value="" />
						</div>
						<div className="col-sm-3">
							{/* attr: for="connect:realname" */}
							<label>Real name</label>
						</div>
						<div className="col-sm-9">
							{/* TODO: PUT THE MISSING SNIPPET BACK */}
							<input className="input" id="connect:realname" name="realname" value="" />
						</div>
						<div className="col-sm-3">
							{/* attr: for="connect:channels" */}
							<label>Channels</label>
						</div>
						<div className="col-sm-9">
							{/* TODO: PUT THE MISSING SNIPPET BACK */}
							<input className="input" id="connect:channels" name="join" value="" />
						</div>
						<div className="col-sm-9 col-sm-offset-3">
							<button type="submit" className="btn">Connect</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

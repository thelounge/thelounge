import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import socketClient from 'clientUI/socketClient';


class ConnectWindow extends React.Component {
	constructor () {
		super();
		this.state = {
			submitting: false,
			formValues: {
				// Network
				name: 'Freenode',
				host: 'chat.freenode.net',
				port: 6697,
				password: '',
				tls: true,
				// User
				nick: 'lounge-user',
				username: 'lounge-user',
				realname: 'The Lounge User',
				join: '#thelounge'
			}
		};
	}

	/** Hacky little method to update our state object */
	onChange (breadcrumb, event) {
		const type = event.target.type;
		let value;

		if (type === 'checkbox') {
			value = event.target.checked;
		} else if (type === 'number') {
			value = event.target.valueAsNumber;
		} else {
			value = event.target.value;
		}
		// We need to manually deep merge, since react doesnt
		const newState = _.extend({}, this.state);
		newState.formValues[breadcrumb] = value;
		// _.set(newState, breadcrumb, value);
		this.setState(newState);
	}

	handleSubmit (evt) {
		evt.preventDefault();
		const event = 'conn';
		this.setState({ submitting: true });
		// TODO: username?  this should dispatch
		// if (values.user) {
		// 	window.localStorage.setItem('user', values.user);
		// }
		socketClient.emit(event, this.state.formValues);
	}

	renderNetworkSettings () {
		const lockNetwork = false;

		return (
			<div>
				<div className="col-sm-12">
					<h2>Network settings</h2>
				</div>
				<div className="col-sm-3">
					<label htmlFor="connect:name">Name</label>
				</div>
				<div className="col-sm-9">
					<input
						id="connect:name"
						className="input"
						value={this.state.formValues.name}
						onChange={this.onChange.bind(this, 'name')}
					/>
				</div>
				<div className="col-sm-3">
					<label htmlFor="connect:host">Server</label>
				</div>
				<div className="col-sm-6 col-xs-8">
					<input
						id="connect:host"
						className="input"
						value={this.state.formValues.host}
						onChange={this.onChange.bind(this, 'host')}
						aria-label="Server address"
						disabled={lockNetwork}
					/>
				</div>
				<div className="col-sm-3 col-xs-4">
					<div className="port">
						<input
							id="connect:port"
							className="input"
							type="number"
							min="1"
							max="65535"
							value={this.state.formValues.port}
							onChange={this.onChange.bind(this, 'serverPort')}
							aria-label="Server port"
							disabled={lockNetwork}
						/>
					</div>
				</div>
				<div className="clearfix"></div>
				<div className="col-sm-3">
					<label htmlFor="connect:password">Password</label>
				</div>
				<div className="col-sm-9">
					<input
						id="connect:password"
						className="input"
						type="password"
						value={this.state.formValues.password}
						onChange={this.onChange.bind(this, 'password')}
					/>
				</div>
				<div className="col-sm-9 col-sm-offset-3">
					<label className="tls">
						<input
							type="checkbox"
							name="tls"
							checked={this.state.formValues.tls}
							onChange={this.onChange.bind(this, 'tls')}
							disabled={lockNetwork}
						/>
						Enable TLS/SSL
					</label>
				</div>
				<div className="clearfix"></div>
			</div>
		);
	}

	render () {
		const lockNetwork = false;
		const displayNetwork = true;
		const isPublic = false;

		return (
			<div id="connect" className="window cmpt-connect-window">
				<div className="header">
					<button className="lt" aria-label="Toggle channel list"></button>
				</div>
				<form className="container">
					<div className="row">
						<div className="col-sm-12">
							<h1 className="title">
								{ isPublic ? 'The Lounge - ' : null }
								Connect
								{ !displayNetwork && lockNetwork
									? 'to ' + this.state.network.name
									: null }
							</h1>
						</div>
						{ displayNetwork
							? this.renderNetworkSettings()
							: null
						}
						<div className="col-sm-12">
							<h2>User preferences</h2>
						</div>
						<div className="col-sm-3">
							<label htmlFor="connect:nick">Nick</label>
						</div>
						<div className="col-sm-9">
							<input
								id="connect:nick"
								className="input nick"
								value={this.state.formValues.nick}
								onChange={this.onChange.bind(this, 'nick')}
							/>
						</div>
						<div className="col-sm-3">
							<label htmlFor="connect:username">Username</label>
						</div>
						<div className="col-sm-9">
							<input
								id="connect:username"
								className="input username"
								value={this.state.formValues.username}
								onChange={this.onChange.bind(this, 'username')}
							/>
						</div>
						<div className="col-sm-3">
							<label htmlFor="connect:realname">Real name</label>
						</div>
						<div className="col-sm-9">
							<input
								id="connect:realname"
								className="input"
								value={this.state.formValues.realname}
								onChange={this.onChange.bind(this, 'realname')}
							/>
						</div>
						<div className="col-sm-3">
							<label htmlFor="connect:channels">Channels</label>
						</div>
						<div className="col-sm-9">
							<input
								id="connect:channels"
								className="input"
								value={this.state.formValues.channels}
								onChange={this.onChange.bind(this, 'channels')}
							/>
						</div>
						<div className="col-sm-9 col-sm-offset-3">
							<button
								className="btn"
								type="button"
								onClick={this.handleSubmit.bind(this)}
								disabled={this.state.submitting}
							>
								Connect
							</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

ConnectWindow.propTypes = {
	// authState: PropTypes.string.isRequired,
};


const mapStateToProps = state => ({}); // eslint-disable-line
const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(ConnectWindow);

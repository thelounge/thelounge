import React from "react";

import {colorClass, count} from "./util";

function modes(mode) {
	var modes = {
		"~": "owner",
		"&": "admin",
		"!": "admin",
		"@": "op",
		"%": "half-op",
		"+": "voice",
		"": "normal"
	};
	return modes[mode];
}

export default class UserList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {query: ""};
	}
	queryChange(e) {
		this.setState({query: e.target.value});
	}
	shouldDisplayUser(user) {
		let query = this.state.query.trim().toLowerCase();
		return query.length === 0 || user.name.toLowerCase().indexOf(query) === 0;
	}
	render() {
		let users = {};
		for (let user of this.props.users) {
			if (!(user.mode in users)) {
				users[user.mode] = [];
			}
			users[user.mode].push(
				<span
					key={user.name}
					role="button"
					className={`user ${colorClass(user.name)} ${this.shouldDisplayUser(user) ? "" : "hidden"}`}
					data-name={user.name}
				>{user.mode}{user.name}</span>
			);
		}
		return (
			<div>
				<div className={`count ${this.props.users.length === 0 ? "hidden" : ""}`}>
					<input
						className="search"
						placeholder={count(this.props.users.length, "user", "users")}
						aria-label="Search among the user list"
						value={this.state.query}
						onChange={e => this.queryChange(e)}
					/>
				</div>
				<div className="names">
					{Object.keys(users).map(mode =>
						<div key={mode} className={`user-mode ${modes(mode)}`}>
							{users[mode]}
						</div>
					)}
				</div>
			</div>
		);
	}
}


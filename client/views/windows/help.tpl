<div class="header">
	<button class="lt" aria-label="{{translate index.toggle_chan_list}}"></button></div>
</div>
<div class="container">
	<h1 class="title">{{translate index.help.title}}</h1>

	<h2>
		<small class="pull-right">
			{{version}}
			(<a href="#" id="view-changelog" data-target="#changelog">release notes</a>)
		</small>
		About The Lounge
	</h2>

	<div class="about">
		<div id="version-checker"></div>

		{{#if gitCommit}}
			<p>
				The Lounge is running from source
				(<a href="https://github.com/thelounge/lounge/tree/{{gitCommit}}" target="_blank" rel="noopener">commit <code>{{gitCommit}}</code></a>).
			</p>

			<ul>
				<li>
					Compare
					<a href="https://github.com/thelounge/lounge/compare/{{gitCommit}}...master" target="_blank" rel="noopener">between <code>{{gitCommit}}</code> and <code>master</code></a>
					to see what you are missing
				</li>
				<li>
					Compare
					<a href="https://github.com/thelounge/lounge/compare/{{version}}...{{gitCommit}}" target="_blank" rel="noopener">between <code>{{version}}</code> and <code>{{gitCommit}}</code></a>
					to see your local changes</li>
			</ul>
		{{/if}}

		<p>
			<a href="https://thelounge.chat/" target="_blank" rel="noopener" class="website-link">Website</a>
		</p>
		<p>
			<a href="https://thelounge.chat/docs/" target="_blank" rel="noopener" class="documentation-link">Documentation</a>
		</p>
		<p>
			<a href="https://github.com/thelounge/lounge/issues/new" target="_blank" rel="noopener" class="report-issue-link">Report an issue…</a>
		</p>
	</div>

	<h2>{{translate index.help.keyboard_shortcuts}}</h2>

	<div class="help-item">
		<div class="subject">
			<kbd class="key-all">Ctrl</kbd><kbd class="key-apple">⌘</kbd> + <kbd>↑</kbd> / <kbd>↓</kbd>
		</div>
		<div class="description">
			<p>{{translate index.help.switch_channels}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<kbd class="key-all">Ctrl</kbd><kbd class="key-apple">⌘</kbd> + <kbd>K</kbd>
		</div>
		<div class="description">
			<p>
				{{translate index.help.colored_text}}
			</p>
			<p>
				{{translate index.help.colored_background}}
			</p>
			<p>
				{{translate index.help.colored_docs}}
			</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<kbd class="key-all">Ctrl</kbd><kbd class="key-apple">⌘</kbd> + <kbd>B</kbd>
		</div>
		<div class="description">
			<p>{{translate index.help.bold_text}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<kbd class="key-all">Ctrl</kbd><kbd class="key-apple">⌘</kbd> + <kbd>U</kbd>
		</div>
		<div class="description">
			<p>{{translate index.help.underlined_text}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<kbd class="key-all">Ctrl</kbd><kbd class="key-apple">⌘</kbd> + <kbd>I</kbd>
		</div>
		<div class="description">
			<p>{{translate index.help.italic_text}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<kbd class="key-all">Ctrl</kbd><kbd class="key-apple">⌘</kbd> + <kbd>S</kbd>
		</div>
		<div class="description">
			<p>{{translate index.help.strikethrough_text}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<kbd class="key-all">Ctrl</kbd><kbd class="key-apple">⌘</kbd> + <kbd>M</kbd>
		</div>
		<div class="description">
			<p>{{translate index.help.monospace_text}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<kbd class="key-all">Ctrl</kbd><kbd class="key-apple">⌘</kbd> + <kbd>O</kbd>
		</div>
		<div class="description">
			<p>
			{{translate index.help.reset_formatting}}
			</p>
		</div>
	</div>

	<h2>{{translate index.help.autocompletion}}</h2>

	<p>
		{{translate index.help.autocompletion_doc}}
	</p>
	<p>
		{{translate index.help.auto}}
	</p>

	<div class="help-item">
		<div class="subject">
			<code>@</code>
		</div>
		<div class="description">
			<p>Nickname</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>#</code>
		</div>
		<div class="description">
			<p>Channel</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/</code>
		</div>
		<div class="description">
			<p>Commands (see list of commands below)</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>:</code>
		</div>
		<div class="description">
			<p>Emoji (note: requires two search characters, to avoid conflicting with common emoticons like <code>:)</code>)</p>
		</div>
	</div>

	<h2>{{translate index.help.commands}}</h2>

	<div class="help-item">
		<div class="subject">
			<code>/away [message]</code>
		</div>
		<div class="description">
			<p>{{translate index.help.away}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/back</code>
		</div>
		<div class="description">
			<p>{{translate index.help.back}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/ban nick</code>
		</div>
		<div class="description">
			<p>{{translate index.help.ban}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/banlist</code>
		</div>
		<div class="description">
			<p>{{translate index.help.banlist}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/collapse</code>
		</div>
		<div class="description">
			<p>
				Collapse all previews in the current channel (opposite of
				<code>/expand</code>)
			</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/connect host [port]</code>
		</div>
		<div class="description">
			<p>{{translate index.help.connect}}</p>
			<p>Alias: <code>/server</code></p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/ctcp target cmd [args]</code>
		</div>
		<div class="description">
			<p>{{translate index.help.ctcp}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/deop nick [...nick]</code>
		</div>
		<div class="description">
			<p>{{translate index.help.deop}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/devoice nick [...nick]</code>
		</div>
		<div class="description">
			<p>{{translate index.help.devoice}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/disconnect [message]</code>
		</div>
		<div class="description">
			<p>{{translate index.help.disconnect}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/expand</code>
		</div>
		<div class="description">
			<p>
				Expand all previews in the current channel (opposite of
				<code>/collapse</code>)
			</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/invite nick [channel]</code>
		</div>
		<div class="description">
			<p>{{translate index.help.invite}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/join channel</code>
		</div>
		<div class="description">
			<p>{{translate index.help.join}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/kick nick</code>
		</div>
		<div class="description">
			<p>{{translate index.help.kick}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/list</code>
		</div>
		<div class="description">
			<p>{{translate index.help.list}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/me message</code>
		</div>
		<div class="description">
			<p>{{translate index.help.me}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/mode flags [args]</code>
		</div>
		<div class="description">
			<p>{{translate index.help.mode}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/msg channel message</code>
		</div>
		<div class="description">
			<p>{{translate index.help.msg}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/nick newnick</code>
		</div>
		<div class="description">
			<p>{{translate index.help.nick}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/notice channel message</code>
		</div>
		<div class="description">
			<p>{{translate index.help.notice}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/op nick [...nick]</code>
		</div>
		<div class="description">
			<p>{{translate index.help.op}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/part [channel]</code>
		</div>
		<div class="description">
			<p>{{translate index.help.part}}</p>
			<p>Aliases: <code>/close</code>, <code>/leave</code></p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/rejoin</code>
		</div>
		<div class="description">
			<p>{{translate index.help.rejoin}}</p>
			<p>Alias: <code>/cycle</code></p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/query nick</code>
		</div>
		<div class="description">
			<p>{{translate index.help.query}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/quit [message]</code>
		</div>
		<div class="description">
			<p>{{translate index.help.quit}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/raw message</code>
		</div>
		<div class="description">
			<p>{{translate index.help.raw}}</p>
			<p>Aliases: <code>/quote</code>, <code>/send</code></p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/slap nick</code>
		</div>
		<div class="description">
			<p>{{translate index.help.slap}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/topic newtopic</code>
		</div>
		<div class="description">
			<p>{{translate index.help.topic}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/unban nick</code>
		</div>
		<div class="description">
			<p>{{translate index.help.unban}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/voice nick [...nick]</code>
		</div>
		<div class="description">
			<p>{{translate index.help.voice}}</p>
		</div>
	</div>

	<div class="help-item">
		<div class="subject">
			<code>/whois nick</code>
		</div>
		<div class="description">
			<p>{{translate index.help.voice}}</p>
		</div>
	</div>
</div>

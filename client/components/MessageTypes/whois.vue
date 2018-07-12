<template>
	<span class="content">
		<p>
			<Username :user="{nick: message.whois.nick}"/>
			<span v-if="message.whois.whowas"> is offline, last information:</span>
		</p>

		<dl class="whois">
			<template v-if="message.whois.account">
				<dt>Logged in as:</dt>
				<dd>{{ message.whois.account }}</dd>
			</template>

			<dt>Host mask:</dt>
			<dd class="hostmask">{{ message.whois.ident }}@{{ message.whois.hostname }}</dd>

			<template v-if="message.whois.actual_hostname">
				<dt>Actual host:</dt>
				<dd class="hostmask">
					<a
						:href="'https://ipinfo.io/' + message.whois.actual_ip"
						target="_blank"
						rel="noopener">{{ message.whois.actual_ip }}</a>
					<i v-if="message.whois.actual_hostname != message.whois.actual_ip"> ({{ message.whois.actual_hostname }})</i>
				</dd>
			</template>

			<template v-if="message.whois.real_name">
				<dt>Real name:</dt>
				<dd><ParsedMessage :text="message.whois.real_name"/></dd>
			</template>

			<template v-if="message.whois.registered_nick">
				<dt>Registered nick:</dt>
				<dd>{{ message.whois.registered_nick }}</dd>
			</template>

			<template v-if="message.whois.channels">
				<dt>Channels:</dt>
				<dd><ParsedMessage :text="message.whois.channels"/></dd>
			</template>

			<template v-if="message.whois.modes">
				<dt>Modes:</dt>
				<dd>{{ message.whois.modes }}</dd>
			</template>

			<template v-if="message.whois.special">
				<dt>Special:</dt>
				<dd>{{ message.whois.special }}</dd>
			</template>

			<template v-if="message.whois.operator">
				<dt>Operator:</dt>
				<dd>{{ message.whois.operator }}</dd>
			</template>

			<template v-if="message.whois.helpop">
				<dt>Available for help:</dt>
				<dd>Yes</dd>
			</template>

			<template v-if="message.whois.bot">
				<dt>Is a bot:</dt>
				<dd>Yes</dd>
			</template>

			<template v-if="message.whois.away">
				<dt>Away:</dt>
				<dd><ParsedMessage :text="message.whois.away"/></dd>
			</template>

			<template v-if="message.whois.secure">
				<dt>Secure connection:</dt>
				<dd>Yes</dd>
			</template>

			<template v-if="message.whois.server">
				<dt>Connected to:</dt>
				<dd>{{ message.whois.server }} <i>({{ message.whois.server_info }})</i></dd>
			</template>

			<template v-if="message.whois.logonTime">
				<dt>Connected at:</dt>
				<dd>{{ message.whois.logonTime | localetime }}</dd>
			</template>

			<template v-if="message.whois.idle">
				<dt>Idle since:</dt>
				<dd>{{ message.whois.idleTime | localetime }}</dd>
			</template>
		</dl>
	</span>
</template>

<script>
import ParsedMessage from "../ParsedMessage.vue";
import Username from "../Username.vue";

export default {
	name: "MessageTypeWhois",
	components: {
		ParsedMessage,
		Username,
	},
	props: {
		message: Object,
	},
};
</script>

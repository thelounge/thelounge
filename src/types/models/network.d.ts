import NetworkClass from "../../models/network";
import {Client as IRCClient} from "irc-framework";
import {WebIRC} from "../config";
declare global {
	export type Network = NetworkClass;

	type NetworkIrcOptions = {
		host: string;
		port: number;
		password: string;
		nick: string;
		username: string;
		gecos: string;
		tls: boolean;
		rejectUnauthorized: boolean;
		webirc: WebIRC;
		client_certificate: ClientCertificate | null;
		socks?: {
			host: string;
			port: number;
			user: string;
			pass: string;
		};
		sasl_mechanism?: string;
		account?:
			| {
					account: string;
					password: string;
			  }
			| {};
	};

	type NonNullableIRCWithOptions = NonNullable<IRCClient & {options: NetworkIrcOptions}>;

	type NetworkWithIrcFramework = Network & {
		irc: NonNullable<Network["irc"]> & {
			options: NonNullableIRCWithOptions;
		};
	};

	type NetworkStatus = {
		connected: boolean;
		secure: boolean;
	};

	type IgnoreListItem = Hostmask & {
		when?: number;
	};

	type IgnoreList = IgnoreListItem[];
}

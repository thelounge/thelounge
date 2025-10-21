import {ConfigType} from "../config";
import {OidcAuthMethod} from "./oidc";
import {AuthMethod} from "./auth";
import ClientManager from "../clientManager";
import {LocalAuthMethod} from "./local";
import {NoneAuthMethod} from "./none";
import {LdapAuthMethod} from "./ldap";

export function loadAuthMethod(config: ConfigType, clientManager: ClientManager): AuthMethod {
	if (config.public) {
		return new NoneAuthMethod(config, clientManager);
	} else if (config.ldap.enable) {
		return new LdapAuthMethod(config, clientManager);
	} else if (config.oidc?.enable) {
		return new OidcAuthMethod(config, clientManager);
	}

	return new LocalAuthMethod(config, clientManager);
}

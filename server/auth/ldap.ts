import express from "express";
import passport from "passport";
import {AuthMethod} from "./auth";
import log from "../log";

// The types package for passport-ldapauth is missing from NPM
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LdapStrategy = require("passport-ldapauth").Strategy;

export class LdapAuthMethod extends AuthMethod {
	passportStrategy() {
		const ldapConfig = this.config.ldap;
		const serverConfig: any = {
			url: ldapConfig.url,
			tlsOptions: ldapConfig.tlsOptions || {},
		};

		if (ldapConfig.baseDN) {
			serverConfig.bindDN = `${ldapConfig.primaryKey}={{username}},${ldapConfig.baseDN}`;
			serverConfig.bindCredentials = `{{password}}`;
		} else {
			serverConfig.bindDN = ldapConfig.searchDN.rootDN;
			serverConfig.bindCredentials = ldapConfig.searchDN.rootPassword;
			serverConfig.searchBase = ldapConfig.searchDN.base;
			serverConfig.searchFilter = `(&(${ldapConfig.primaryKey}={{username}})${ldapConfig.searchDN.filter})`;
			serverConfig.searchScope = ldapConfig.searchDN.scope;
		}

		// passport-ldapauth does not have TS support
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return new LdapStrategy(
			{
				server: serverConfig,
				usernameField: "username",
				passwordField: "password",
				passReqToCallback: true,
			},
			(req: express.Request, user: any, done: (error: any, user?: any) => void) => {
				const username = user.uid;

				if (!username) {
					return done(null, false);
				}

				this.clientManager.addUser(username, null, true, true);

				return done(null, {
					username: username,
				});
			}
		);
	}

	registerRoutes(app: express.Express) {
		app.get("/api/auth-config", function (_, res) {
			res.header("Cache-Control", "no-store");
			res.json({
				method: "ldap",
			});
		});

		app.post("/login", (req, res, next) => {
			passport.authenticate("ldapauth", (err: any, user: any, info: any) => {
				if (err) {
					// Log the error for debugging but don't expose details to client
					log.error(`LDAP authentication error: ${err.message}`);
					return res.status(401).send("Unauthorized");
				}

				if (!user) {
					// Authentication failed (wrong password, user not found, etc.)
					return res.status(401).send("Unauthorized");
				}

				// Authentication succeeded, establish session
				(req as any).logIn(user, (loginErr: any) => {
					if (loginErr) {
						log.error(`LDAP login error: ${loginErr.message}`);
						return res.status(401).send("Unauthorized");
					}

					return res.status(200).json({success: true});
				});
			})(req, res, next);
		});

		app.get(
			"/callback",
			passport.authenticate("ldapauth", {failureRedirect: "/login", failureMessage: true}),
			(_, res) => {
				res.redirect("/");
			}
		);
	}
}

import {Strategy as LocalStrategy, IVerifyOptions} from "passport-local";
import express from "express";
import passport from "passport";
import {AuthMethod} from "./auth";
import Helper from "../helper";
import log from "../log";
import user from "../models/user";
import colors from "chalk";
import Client from "../client";

export class LocalAuthMethod extends AuthMethod {
	passportStrategy() {
		return new LocalStrategy((username, password, done) => {
			// If no user is found, or if the client has not provided a password,
			// fail the authentication straight away
			if (!username || !password) {
				return done(new Error(`Missing username or password`));
			}

			let client: Client;

			try {
				const possibleClient = this.clientManager.loadUser(username, true);

				if (!possibleClient) {
					throw new Error(`Unknown user`);
				}

				client = possibleClient;
			} catch (e: any) {
				return done(null, false);
			}

			// If this user has no password set, fail the authentication
			if (!client.config.password) {
				log.error(
					`User ${colors.bold(
						client.name
					)} with no local password set tried to sign in. (Probably a LDAP user)`
				);

				return done(new Error(`User config incomplete`));
			}

			if (!Helper.password.compare(password, client.config.password)) {
				return done(null, false);
			}

			if (Helper.password.requiresUpdate(client.config.password)) {
				const hash = Helper.password.hash(password);

				client.setPassword(hash, (success) => {
					if (success) {
						log.info(
							`User ${colors.bold(
								client.name
							)} logged in and their hashed password has been updated to match new security requirements`
						);
					}
				});
			}

			return done(null, {
				username: username,
			});
		});
	}

	registerRoutes(app: express.Express) {
		app.get("/api/auth-config", function (_, res) {
			res.header("Cache-Control", "no-store");
			res.json({
				method: "local",
			});
		});

		app.post("/login", passport.authenticate("local"), (req, res) => {
			res.status(200).json({success: true});
		});

		app.get(
			"/callback",
			passport.authenticate("local", {failureRedirect: "/login", failureMessage: true}),
			(_, res) => {
				res.redirect("/");
			}
		);
	}
}

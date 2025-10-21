import OpenIDConnectStrategy, {Profile, VerifyCallback} from "passport-openidconnect";
import express from "express";
import passport from "passport";
import Helper from "../helper";
import {AuthMethod} from "./auth";

export class OidcAuthMethod extends AuthMethod {
	passportStrategy() {
		const oidcConfig = this.config.oidc!;
		const clientId = Helper.loadSecretValue(oidcConfig.clientIdRef, "oidc.clientIdRef");
		const clientSecret = Helper.loadSecretValue(
			oidcConfig.clientSecretRef,
			"oidc.clientSecretRef"
		);

		return new OpenIDConnectStrategy(
			{
				issuer: this.config.oidc!.issuer,
				authorizationURL: oidcConfig.authorizationUrl,
				tokenURL: oidcConfig.tokenUrl,
				userInfoURL: oidcConfig.userInfoUrl,
				clientID: clientId,
				clientSecret: clientSecret,
				callbackURL: this.callbackUrl().toString(),
				scope: ["profile"],
			},
			function (_: string, profile: Profile, cb: VerifyCallback) {
				if (!profile.username || profile.username.length === 0) {
					return cb(new Error("No username provided"));
				}

				return cb(null, profile);
			}
		);
	}

	registerRoutes(app: express.Express) {
		app.get("/api/auth-config", function (_, res) {
			res.header("Cache-Control", "no-store");
			res.json({
				method: "oidc",
			});
		});

		app.get("/login", passport.authenticate("openidconnect"), (req, res) => {
			res.status(200).json({success: true});
		});

		app.get(
			"/callback",
			passport.authenticate("openidconnect", {
				failureRedirect: "/login",
				failureMessage: true,
			}),
			(_, res) => {
				res.redirect("/");
			}
		);
	}

	private callbackUrl(): URL {
		if (!this.config.baseUrl) {
			throw new Error("baseUrl must be configured when using OIDC authentication");
		}

		return new URL("/callback", this.config.baseUrl!);
	}
}

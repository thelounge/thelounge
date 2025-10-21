import express from "express";
import passport from "passport";
import {randomBytes} from "node:crypto";
import {AuthMethod} from "./auth";

class NoneStrategy extends passport.Strategy {
	name = "none";

	authenticate(req: any, options?: any): any {
		const randomUsername = `guest_${randomBytes(8).toString("hex")}`;
		return this.success({
			username: randomUsername,
		});
	}
}

export class NoneAuthMethod extends AuthMethod {
	passportStrategy(): passport.Strategy {
		return new NoneStrategy();
	}

	registerRoutes(app: express.Express) {
		app.get("/api/auth-config", function (_, res) {
			res.header("Cache-Control", "no-store");
			res.json({
				method: "none",
			});
		});

		app.post("/login", passport.authenticate("none"), (req, res) => {
			res.status(200).json({success: true});
		});

		app.get(
			"/callback",
			passport.authenticate("none", {failureRedirect: "/login", failureMessage: true}),
			(_, res) => {
				res.redirect("/");
			}
		);
	}
}

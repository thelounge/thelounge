import express from "express";
import {ConfigType} from "../config";
import passport from "passport";
import ClientManager from "../clientManager";

export class AuthMethod {
	constructor(protected config: ConfigType, protected clientManager: ClientManager) {
		this.config = config;
		this.clientManager = clientManager;
	}

	passportStrategy(): passport.Strategy {
		throw new Error("Method not implemented.");
	}

	registerRoutes(app: express.Express) {
		throw new Error("Method not implemented.");
	}
}

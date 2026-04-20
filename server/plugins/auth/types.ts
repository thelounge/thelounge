import type ClientManager from "../../clientManager";
import type Client from "../../client";

export interface GetValidUsersParams {
	users: string[];
}

export interface AuthStartParams {
	socketId: string;
}

export interface AuthenticateParams {
	manager: ClientManager;
	client: Client | null;
	username: string;
	password: string;
}

export interface LogoutParams {
	sessionData?: Record<string, unknown>;
}

export interface DisconnectParams {
	socketId: string;
}

export interface AuthStartInfo {
	authUrl?: string;
}

export type AuthResult =
	| {success: false}
	| {success: true; username: string; sessionData?: Record<string, unknown>};

export interface LogoutInfo {
	logoutUrl?: string;
}

export interface AuthProvider {
	name: string;
	canChangePassword: boolean;

	init(): Promise<void>;
	getValidUsers(params: GetValidUsersParams): Promise<string[]>;

	authStart(params: AuthStartParams): AuthStartInfo;
	authenticate(params: AuthenticateParams): Promise<AuthResult>;
	logout(params: LogoutParams): LogoutInfo;
	disconnect(params: DisconnectParams): void;
}

import Client from "../../client";
import ClientManager from "../../clientManager";

type AuthHandler = (
	manager: ClientManager,
	client: Client,
	user: string,
	password: string,
	callback: (success: boolean) => void
) => void;

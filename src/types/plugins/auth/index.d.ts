import Client from "@src/client";
import ClientManager from "@src/clientManager";

type AuthHandler = (
	manager: ClientManager,
	client: Client,
	user: string,
	password: string,
	callback: (success: boolean) => void
) => void;

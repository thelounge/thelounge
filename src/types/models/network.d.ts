import NetworkClass from "src/models/network";

export type Network = NetworkClass;

export type NetworkStatus = {
	connected: boolean;
	secure: boolean;
};

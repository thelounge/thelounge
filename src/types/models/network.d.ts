import NetworkClass from "src/models/network";

export type Network = NetworkClass;

export type NetworkStatus = {
	connected: boolean;
	secure: boolean;
};

type IgnoreListItem = Hostmask & {
	when?: number;
};

type IgnoreList = IgnoreListItem[];

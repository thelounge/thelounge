export type SharedUser = {
	modes: string[];
	// Users in the channel have only one mode assigned
	mode: string;
	away: string;
	nick: string;
	lastMessage: number;
};

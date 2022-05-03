import Msg from "models/msg";

type Preview = {
	type: string;
	head: string;
	body: string;
	thumb: string;
	size: number;
	link: string; // Send original matched link to the client
	shown: boolean | null;
	error: undefined | any;
	message: undefined | string;
};

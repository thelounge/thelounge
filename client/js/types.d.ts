import Chan from "../../src/models/chan";
import Network from "../../src/models/network";

declare module "*.vue" {
	import Vue from "vue";
	export default Vue;
}
interface LoungeWindow extends Window {
	g_TheLoungeRemoveLoading?: () => void;
}

type ClientChan = Chan & {
	moreHistoryAvailable: boolean;
	editTopic: boolean;
};

type ClientNetwork = Network & {
	isJoinChannelShown: boolean;
};

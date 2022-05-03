declare module "*.vue" {
	import Vue from "vue";
	export default Vue;
}
interface LoungeWindow extends Window {
	g_TheLoungeRemoveLoading?: () => void;
}

type ClientChan = Chan & {
	moreHistoryAvailable: boolean;
};

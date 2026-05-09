import {store} from "../store";

export function shouldShowGeneralSettings() {
	const config = store.state.serverConfiguration;
	return !config?.public || !!config?.fileUpload;
}

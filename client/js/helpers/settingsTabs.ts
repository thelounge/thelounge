import {store} from "../store";

export function showGeneralSettings() {
	const config = store.state.serverConfiguration;
	return !config?.public || !!config?.fileUpload;
}

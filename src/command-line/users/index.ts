import config from "../../config";
import list from "./list";
import remove from "./remove";
import edit from "./edit";
import log from "../../log";

let add, reset;

const importAddAndReest = async (): Promise<void> => {
	if (!config.values.ldap.enable) {
		add = (await import("./add")).default;
		reset = (await import("./reset")).default;
	}
};

(async () => {
	await importAddAndReest();
})().catch((e: any) => {
	log.error("Unable to load plugins all command-line plugins:", e);
});

export default [list, remove, edit, add, reset];

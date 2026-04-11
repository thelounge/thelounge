import fs from "fs";
import path from "path";
import Utils from "../command-line/utils";

interface ManifestEntry {
	file: string;
	css?: string[];
	isEntry?: boolean;
}

type Manifest = Record<string, ManifestEntry>;

let cachedManifest: Manifest | null = null;

export function getManifest(): Manifest {
	if (cachedManifest) {
		return cachedManifest;
	}

	const manifestPath = path.join(
		Utils.getFileFromRelativeToRoot("public"),
		".vite",
		"manifest.json"
	);
	cachedManifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as Manifest;
	return cachedManifest;
}

export function getAssetPaths(): {js: string; css: string[]} {
	const manifest = getManifest();

	// The key is the input path relative to the Vite root (client/)
	const entry = manifest["js/vue.ts"];

	if (!entry) {
		throw new Error("Could not find entry 'js/vue.ts' in Vite manifest");
	}

	return {
		js: "/" + entry.file,
		css: (entry.css || []).map((f) => "/" + f),
	};
}

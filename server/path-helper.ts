import {fileURLToPath} from "node:url";
import {dirname} from "node:path";

export function getDirname(importMetaUrl: string): string {
	return dirname(fileURLToPath(importMetaUrl));
}

export function getFilename(importMetaUrl: string): string {
	return fileURLToPath(importMetaUrl);
}

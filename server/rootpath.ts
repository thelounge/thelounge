import path from "path";

// Resolve a path relative to the project root, accounting for source vs compiled layouts.
// In source (ts-node): server/ is 1 level deep
// In compiled (dist): dist/server/ is 2 levels deep
const rootDir =
	process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development"
		? path.resolve(__dirname, "..")
		: path.resolve(__dirname, "..", "..");

export default function fromRoot(...fileName: string[]) {
	return path.resolve(rootDir, ...fileName);
}

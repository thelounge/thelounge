export type TypingStatus = "active" | "paused" | "done";

export const VALID_TYPING_STATUSES: ReadonlySet<string> = new Set<TypingStatus>([
	"active",
	"paused",
	"done",
]);

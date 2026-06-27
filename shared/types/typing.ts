export type TypingStatus = "active" | "paused" | "done";

export const VALID_TYPING_STATUSES: ReadonlySet<TypingStatus> = new Set<TypingStatus>([
	"active",
	"paused",
	"done",
]);

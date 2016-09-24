import app from "../reducers";

describe(
	"Reducers", () => {
		it("starts empty", () => {
			let initialState = app(undefined, {});
			expect(initialState.channels).toEqual({});
			expect(initialState.networks).toEqual([]);
		});
		it("points at the loading screen", () => {
			let initialState = app(undefined, {});
			expect(initialState.activeWindowId).toEqual("loading");
		});
	}
);

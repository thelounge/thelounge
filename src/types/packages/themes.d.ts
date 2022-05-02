// TODO: move to index.d.ts when more types are added
type Module = {
	type: string;
	name: string;
};

type ThemeModule = Module & {
	themeColor: string;
	css: string;
};

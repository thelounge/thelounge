// https://vuejs.github.io/vetur/guide/setup.html#vue3
declare module "*.vue" {
	import type {DefineComponent} from "vue";
	// eslint-disable-next-line @typescript-eslint/ban-types
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

// https://vuejs.github.io/vetur/guide/setup.html#vue3
declare module "*.vue" {
	import type {DefineComponent} from "vue";
	// DefineComponent<Props, RawBindings, Data>
	// Using Record for props and bindings to allow any object shape
	const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
	export default component;
}

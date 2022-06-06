<template>
	<div ref="containerRef" :class="$props.class">
		<slot
			v-for="(item, index) of list"
			:key="item[itemKey]"
			:element="item"
			:index="index"
			name="item"
		></slot>
	</div>
</template>

<script lang="ts">
import {defineComponent, ref, PropType, watch, onUnmounted} from "vue";
import Sortable from "sortablejs";

const Props = {
	delay: {
		type: Number,
		default: 0,
		required: false,
	},
	delayOnTouchOnly: {
		type: Boolean,
		default: false,
		required: false,
	},
	touchStartThreshold: {
		type: Number,
		default: 10,
		required: false,
	},
	handle: {
		type: String,
		default: "",
		required: false,
	},
	draggable: {
		type: String,
		default: "",
		required: false,
	},
	ghostClass: {
		type: String,
		default: "",
		required: false,
	},
	dragClass: {
		type: String,
		default: "",
		required: false,
	},
	group: {
		type: String,
		default: "",
		required: false,
	},
	class: {
		type: String,
		default: "",
		required: false,
	},
	itemKey: {
		type: String,
		default: "",
		required: true,
	},
	list: {
		type: Array as PropType<any[]>,
		default: [],
		required: true,
	},
	filter: {
		type: String,
		default: "",
		required: false,
	},
};

let sortable: Sortable | undefined;

export default defineComponent({
	name: "Draggable",
	props: Props,
	emits: ["change", "choose", "unchoose"],
	setup(props, {emit}) {
		const containerRef = ref<HTMLElement | null>(null);

		watch(containerRef, (newDraggable) => {
			if (newDraggable) {
				sortable = new Sortable(newDraggable, {
					...props,

					onChoose(event) {
						emit("choose", event);
					},

					onUnchoose(event) {
						emit("unchoose", event);
					},

					onEnd(event) {
						emit("change", event);
					},
				});
			}
		});

		onUnmounted(() => {
			if (sortable) {
				sortable.destroy();
				containerRef.value = null;
			}
		});

		return {
			containerRef,
		};
	},
});
</script>

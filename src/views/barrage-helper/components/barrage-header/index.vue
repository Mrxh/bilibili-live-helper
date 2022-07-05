<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import IconPenetrate from "@/components/icon-penetrate/index.vue";
import useCommonInfo from "@/hooks/useCommonInfo";
import { getStore, setStore } from "@/stores/electron";
import { IS_TOP, IS_PENETRATE } from "@/constants";
import {
	openNewWindow,
	topWindow,
	minimizeWindow,
	closeWindow,
} from "@/utils/electron";
import type { OperateIconItem } from "@/types";

// 得到粉丝数量和人气
const { fans, popularity } = useCommonInfo();
// 是否置顶
const isTop = ref<boolean>(!!getStore(IS_TOP));
// 是否穿透
const isPenetrate = ref<boolean>(!!getStore(IS_PENETRATE));
// 操作图标列表
const operateIconList = computed((): OperateIconItem[] => [
	{
		title: "设置",
		component: "icon-settings",
		clickEvent: () => openNewWindow("/settings"),
	},
	{
		title: isPenetrate.value ? "关闭穿透" : "开启穿透",
		active: isPenetrate.value,
		component: IconPenetrate,
		clickEvent: () => {
			isPenetrate.value = !isPenetrate.value;

			setStore(IS_PENETRATE, isPenetrate.value);
		},
	},
	{
		title: isTop.value ? "取消置顶" : "置顶",
		active: isTop.value,
		component: "icon-pushpin",
		clickEvent: () => {
			isTop.value = !isTop.value;

			topWindow(isTop.value);

			setStore(IS_TOP, isTop.value);
		},
	},
	{
		title: "最小化",
		component: "icon-minus",
		clickEvent: minimizeWindow,
	},
	{
		title: "关闭",
		component: "icon-close",
		clickEvent: closeWindow,
	},
]);

onMounted(() => topWindow(isTop.value));
</script>

<template>
	<div class="barrage-helper-header">
		<ul class="up-info">
			<li><span>人气：</span>{{ popularity }}</li>
			<li><span>粉丝：</span>{{ fans }}</li>
		</ul>

		<div class="operate">
			<a-tooltip
				v-for="(item, index) in operateIconList"
				:content="item.title"
				:key="index"
			>
				<component
					:is="item.component"
					:class="{ active: item.active }"
					@click="item.clickEvent"
				/>
			</a-tooltip>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>

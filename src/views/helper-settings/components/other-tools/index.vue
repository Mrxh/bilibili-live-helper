<script setup lang="ts">
import { getStore, setStore } from "@/stores/electron";
import { TOOLS_OPEN } from "@/constants";
import { openNewWindow } from "@/utils/electron";
import type { ToolsItem } from "@/types";

const toolsList: ToolsItem[] = [
	{
		key: TOOLS_OPEN.music,
		title: "音乐助手",
		description:
			"为直播助手提供点歌功能，发送关键词 <mark>点歌 + 空格 + 歌曲名[-歌手名]</mark>，如果找到该音乐，就会将音乐列入音乐列表，如果没有点歌，将自动随机播放！如果想要切歌，发送关键词 <mark>切歌</mark>，达到设置的指定人数（默认为 3），即可切歌！",
		hash: "/music",
		isOpen: !!getStore(TOOLS_OPEN.music),
	},
	{
		key: TOOLS_OPEN.prompt,
		title: "提示助手",
		description: "通过自定义编辑该页面文案，可以更好地与观众互动！",
		hash: "/prompt",
		isOpen: !!getStore(TOOLS_OPEN.prompt),
	},
	{
		key: TOOLS_OPEN.fans,
		title: "粉丝助手",
		description:
			"可以实时查看粉丝数量的变化以及最新一期的个人作品的数据量的变化，同时粉丝数量的增长与减少都伴随着音效！",
		hash: "/fans",
		isOpen: !!getStore(TOOLS_OPEN.fans),
	},
	{
		title: "欢迎投稿",
		description:
			"如果您有什么好玩的功能或想法，可以到 github 提 <mark>issues</mark>，或者通过 <mark>关于助手页面</mark> 的联系方式联系到我，如果在我能力范围之内的话，我会尽可能帮忙实现的！",
	},
];
</script>

<template>
	<div class="other-tools">
		<a-card v-for="item in toolsList" :title="item.title" hoverable>
			<template #extra v-if="item.hash">
				<a-link @click="openNewWindow(item.hash!)">打开</a-link>
			</template>

			<div class="description" v-html="item.description"></div>

			<template #actions v-if="item.hash">
				<span>跟随直播助手开启</span>
				<a-switch
					:default-checked="item.isOpen"
					@change="(value) => setStore(item.key!, value)"
				/>
			</template>
		</a-card>
	</div>
</template>

<style scoped lang="scss">
.other-tools {
	-webkit-column-count: 2;
	-moz-column-count: 2;
	column-count: 2;
	-webkit-column-gap: 12;
	-moz-column-gap: 12;
	column-gap: 12;
	.arco-card {
		margin-bottom: 12px;

		-webkit-column-break-inside: avoid;
		-webkit-column-break-inside: avoid;
		break-inside: avoid;
		.description {
			line-height: 1.4;
		}
	}
}
</style>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAudioFiles, splitAudioSuffix } from "@/utils/nodejs";
import { getStore, setStore } from "@/stores/electron";
import { VOICE_BROADCAST, BARRAGE_SOUND } from "@/constants";

// 表格列名
const columns = [
	{
		title: "触发关键词",
		dataIndex: "keyword",
	},
	{
		title: "音效文件",
		dataIndex: "file",
	},
];
// 表格数据
const data = ref<any[]>([]);

// 读取音效文件
onMounted(() => {
	const files: string[] | undefined = getAudioFiles();

	if (files?.length) {
		for (const file of files) {
			data.value.push({
				keyword: splitAudioSuffix(file),
				file,
			});
		}
	}
});
</script>

<template>
	<ul class="voice-broadcast">
		<!-- 弹幕播报 -->
		<li>
			<div class="switch">
				<span>弹幕播报</span>
				<a-switch
					:default-checked="!!getStore(VOICE_BROADCAST.isOpen)"
					@change="(value) => setStore(VOICE_BROADCAST.isOpen, value)"
				></a-switch>
			</div>
		</li>

		<!-- 弹幕音效 -->
		<li>
			<div class="switch">
				<span>弹幕音效</span>
				<a-switch
					:default-checked="!!getStore(BARRAGE_SOUND.isOpen)"
					@change="(value) => setStore(BARRAGE_SOUND.isOpen, value)"
				></a-switch>
			</div>
			<div class="content">
				<a-table :columns="columns" :data="data" />
			</div>
		</li>
	</ul>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>

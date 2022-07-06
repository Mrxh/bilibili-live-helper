<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ipcRenderer } from "electron";
import { getStore } from "@/stores/electron";
import { UP_INFO } from "@/constants";
import { getUpNewVideoBVidApi, getUpNewVideoInfoApi } from "@/api";

// 获取视频的状态 1 成功 2 主人空间未发布任何视频 3 访问权限不足
const getVideoStatus = ref<1 | 2 | 3>(1);
// 最新一期视频信息
const videoInfo = ref<Record<string, any>>();

onMounted(async () => {
	// 获取最新视频的 bvid
	const bvidResult = await getUpNewVideoBVidApi();

	// 主人空间未发布任何视频
	if (bvidResult?.code !== 0) {
		getVideoStatus.value = 2;
		return;
	}

	// 获取最新视频的信息
	const infoResult = await getUpNewVideoInfoApi(
		bvidResult.data.list.vlist[0].bvid
	);

	console.log("infoResult", infoResult);
	// 访问权限不足
	if (infoResult?.code !== 0) {
		getVideoStatus.value = 3;
		return;
	}

	videoInfo.value = { ...infoResult.data };

	// 监听 up uid的变化，然后重新刷新窗口
	ipcRenderer.on("listen-up-info", (_, uid) => {
		if (uid === getStore(UP_INFO.uid)) return;

		window.location.reload();
	});
});
</script>

<template>
	<div class="fans-helper">{{ videoInfo?.title }}</div>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>

<script setup lang="ts">
import { ref, watch, onMounted, provide } from "vue";
import { ipcRenderer } from "electron";
import BaseOperate from "@/components/base-operate/index.vue";
import VideoInfo from "./components/video-info/index.vue";
import { getStore } from "@/stores/electron";
import { IS_PENETRATE } from "@/constants";
import { changeWidowSize, penetrateWindow } from "@/utils/electron";
import { getUpNewVideoInfoApi } from "@/api";
import emptyImage from "@/assets/img/empty.png";
import riseAudio from "@/assets/audio/rise.wav";
import reduceAudio from "@/assets/audio/reduce.wav";
import type { NewVideoInfo } from "@/types";

// 是否展开
const isExpand = ref(false);
// up 是否有视频信息，默认 有
const hasVideoInfo = ref<boolean>(true);
// 视频信息
const videoInfo = ref<NewVideoInfo>();

// 获取视频信息
const getVideoInfo = async () => {
	// 获取最新视频的信息
	const infoResult = await getUpNewVideoInfoApi();

	if (!infoResult) {
		hasVideoInfo.value = false;

		return;
	} else {
		// 旧数据
		const oldValue = videoInfo.value;
		// 新数据
		videoInfo.value = infoResult;
		// 如果是第一次，就没有动画
		if (!oldValue) return;

		(Object.keys(oldValue) as (keyof NewVideoInfo)[]).forEach((key) => {
			if (
				!isNaN(Number(oldValue[key])) &&
				oldValue[key] !== infoResult[key]
			) {
				// 获取到元素
				const element = document.querySelector(`.fans-helper-${key}`);

				// 计算出差值
				const difference = +infoResult[key] - +oldValue[key];

				// 创建一个新的 i 标签，并且写入对应的类名和内容
				const em = document.createElement("em");
				em.className = difference > 0 ? "rise" : "reduce";
				em.innerHTML =
					difference > 0 ? `+${difference}` : `${difference}`;

				// 给元素添加生成的新元素
				element?.appendChild(em);

				if (key === "fans") {
					const audio = new Audio();

					if (difference > 0) audio.src = riseAudio;
					else audio.src = reduceAudio;

					audio.oncanplaythrough = () => {
						audio.play();
					};

					audio.onended = () => {
						audio.remove();
					};
				}
				// 3.5s 后再次清除该元素
				setTimeout(() => {
					element?.removeChild(em);
				}, 3500);
			}
		});
	}
};

onMounted(() => {
	getVideoInfo();

	// 每五秒获取一下最新数据
	setInterval(() => {
		getVideoInfo();
	}, 5000);

	// 监听 up uid的变化，然后重新刷新窗口
	ipcRenderer.on("listen-up-info", () => {
		window.location.reload();
	});
});

// 监听 isExpand 的变化，更改窗口大小
watch(isExpand, (newValue) => {
	if (newValue) changeWidowSize({ width: 500, height: 286 });
	else changeWidowSize({ width: 500, height: 260 });
});

// 监听视频信息的变化，更改窗口大小
watch(
	hasVideoInfo,
	(newValue) => {
		if (newValue) changeWidowSize({ width: 500, height: 260 });
		else changeWidowSize({ width: 300, height: 400 });
	},
	{ immediate: true }
);

provide("isExpand", isExpand);
provide("videoInfo", videoInfo);
</script>

<template>
	<div class="fans-helper">
		<!-- 顶部操作图标 -->
		<div class="operate">
			<template v-if="hasVideoInfo">
				<a-tooltip :content="isExpand ? '收回' : '展开'">
					<icon-expand v-if="!isExpand" @click="isExpand = true" />

					<icon-shrink v-else @click="isExpand = false" />
				</a-tooltip>
			</template>

			<BaseOperate />
		</div>

		<!-- 主要内容 -->
		<div
			class="content"
			@mouseenter="penetrateWindow(getStore(IS_PENETRATE['/fans']!))"
			@mouseleave="penetrateWindow(false)"
		>
			<!-- 如果有视频 -->
			<template v-if="hasVideoInfo && videoInfo">
				<h2>{{ videoInfo.name }}</h2>

				<div class="up-info fans-helper-fans">
					<div class="avatar">
						<img :src="videoInfo.face" alt="avatar" />
					</div>

					{{ videoInfo.fans }}

					<em>+1</em>
				</div>

				<VideoInfo />
			</template>

			<!-- 没有视频 -->
			<div class="no-video" v-if="!hasVideoInfo">
				<img :src="emptyImage" alt="" />
				<h4>主人空间未发布任何视频或访问权限不足</h4>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>

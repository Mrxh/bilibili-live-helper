<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ipcRenderer } from "electron";
import { penetrateWindow } from "@/utils/electron";
import type { MusicInfo } from "@/types";
// 创建一个 audio 对象
const audio = new Audio();
// 当前正在播放的音乐信息
const currentMusicInfo = ref();
// 歌单列表
const songList = ref<MusicInfo[]>([]);
// 正在播报的歌单里的音乐序号
const currentBroadcast = ref<number>(1);
// 切歌列表
const cutSong = ref<number[]>([]);

onMounted(() => {
	// 初始话随机播放
	// 3778678

	// 监听点|切歌消息
	ipcRenderer.on("listen-sone-barrage", (_, barrage) => {
		const { message, uname, uid } = barrage;
		// 点歌操作
		if (message.includes("点歌")) {
			const musicName = message.replaceAll("点歌", "").trim();
			// 如果歌曲名为空，无操作
			if (!musicName) return;

			songList.value.push({ uname, musicName });
		} else {
			// 切歌操作
			cutSong.value = [...new Set([...cutSong.value, uid])];
		}
	});
});
</script>

<template>
	<div class="music-helper">
		<!-- header 顶部是用来让透明的部分可穿透 -->
		<div
			class="header"
			@mouseenter="penetrateWindow(true)"
			@mouseleave="penetrateWindow(false)"
		></div>
		<!-- 音乐图片 -->
		<a-avatar :size="75">歌曲图片</a-avatar>
		<!-- 主要内容部分 -->
		<div class="content">
			<!-- 音乐信息 -->
			<div class="music-info">
				<!-- 音乐名称 -->
				<div class="name">年少有为</div>
				<!-- 歌手 -->
				<div class="singer">李荣浩</div>
			</div>
			<!-- 切歌 -->
			<div class="cut-song">
				切歌 <span>{{ cutSong.length }}</span> / 3
			</div>
			<!-- 歌词 -->
			<div class="lyric">歌词</div>
			<!-- 点歌列表 -->
			<div class="song-list">
				<div class="has-song" v-if="songList.length">
					<a-carousel
						direction="vertical"
						show-arrow="never"
						auto-play
						@change="(value) => (currentBroadcast = value)"
					>
						<a-carousel-item v-for="item in songList">
							<em>{{ item.uname }}</em> 点了首
							<em>{{ item.musicName }}</em>
						</a-carousel-item>
					</a-carousel>

					<span>
						<em>{{ currentBroadcast }}</em> / {{ songList.length }}
					</span>
				</div>

				<div class="no-song" v-else>暂无观众姥爷点歌</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>

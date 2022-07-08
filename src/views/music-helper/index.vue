<script setup lang="ts">
import { penetrateWindow } from "@/utils/electron";
import useMusicInfo from "@/hooks/useMusicInfo";
import dayjs from "dayjs";

const {
	currentPlaySong,
	songPlayList,
	currentBroadcastIndex,
	cutSongList,
	coverElement,
} = useMusicInfo();
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
		<a-avatar :size="75">
			<span v-if="!currentPlaySong?.cover">歌曲图片</span>

			<img
				ref="coverElement"
				:src="currentPlaySong?.cover"
				:alt="currentPlaySong?.name"
				v-else
			/>
		</a-avatar>
		<!-- 主要内容部分 -->
		<div class="content">
			<template v-if="currentPlaySong">
				<!-- 音乐信息 -->
				<div class="music-info">
					<!-- 音乐名称 -->
					<div class="name">{{ currentPlaySong?.name }}</div>
					<!-- 歌手 -->
					<div class="singer">{{ currentPlaySong?.singer }}</div>
				</div>
				<!-- 切歌 -->
				<div class="cut-song">
					切歌 <span>{{ cutSongList.length }}</span> / 3
				</div>
				<!-- 歌词 -->
				<!-- <div class="lyric">{{ currentPlaySong?.lyric }}</div> -->
				<div class="lyric">我正在做歌词显示</div>
				<!-- 点歌列表 -->
				<div class="song-list">
					<div class="has-song" v-if="songPlayList.length">
						<a-carousel
							direction="vertical"
							show-arrow="never"
							auto-play
							@change="(value) => (currentBroadcastIndex = value)"
						>
							<a-carousel-item v-for="item in songPlayList">
								<em>{{ item.uname }}</em> 点了首
								<em>{{ item.musicName }}</em>
							</a-carousel-item>
						</a-carousel>

						<span>
							<em>{{ currentBroadcastIndex }}</em> /
							{{ songPlayList.length }}
						</span>
					</div>

					<div class="no-song" v-else>暂无观众姥爷点歌</div>
				</div>
			</template>

			<a-spin
				tip="初始化点歌助手，将随机播放热门歌曲"
				:size="32"
				v-else
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>

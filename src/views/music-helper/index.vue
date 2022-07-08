<script setup lang="ts">
import { penetrateWindow } from "@/utils/electron";
import useMusicInfo from "@/hooks/useMusicInfo";

const {
	currentPlaySong,
	songPlayList,
	currentBroadcastIndex,
	cutSongList,
	coverElement,
	isPlay,
	playMusic,
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
		<div class="music-cover">
			<span v-if="!currentPlaySong?.cover">歌曲图片</span>

			<template v-else>
				<img
					ref="coverElement"
					:src="currentPlaySong?.cover"
					:alt="currentPlaySong?.name"
				/>

				<!-- 音乐操作 -->
				<div class="operate">
					<!-- 播放图标 -->
					<icon-pause-circle-fill
						v-if="isPlay"
						@click="isPlay = false"
					/>
					<!-- 暂停图标 -->
					<icon-play-circle-fill v-else @click="isPlay = true" />
					<!-- 下一曲 -->
					<icon-skip-next-fill @click="playMusic" />
				</div>
			</template>
		</div>
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
				<!-- 切歌 and 时间 -->
				<div class="aaa">
					<div class="cut-song">
						切歌 <span>{{ cutSongList.length }}</span> / 3
					</div>
					<div class="music-time">
						{{ currentPlaySong?.currentDuration }} /
						{{ currentPlaySong?.totalDuration }}
					</div>
				</div>

				<!-- 歌词 -->
				<div class="lyric">{{ currentPlaySong?.lyric }}</div>
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

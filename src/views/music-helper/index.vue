<script setup lang="ts">
import { ref, watch } from "vue";
import { penetrateWindow } from "@/utils/electron";
import useMusicInfo from "@/hooks/useMusicInfo";

const {
	currentPlaySong,
	volume,
	songPlayList,
	currentBroadcastIndex,
	cutSongList,
	isPlay,
	coverIsPlay,
	findNewMusicInfo,
	handleProgress,
	onWheel,
} = useMusicInfo();

// 处理音乐时间
const handleMusicTime = (time: number) => {
	const timeArray: string[] = [];

	for (let index = 2; index >= 0; index--) {
		const currentTime = Math.floor(time / 60 ** index).toString();

		timeArray.push(currentTime);

		time -= +currentTime * 60 ** index;
	}

	if (!+timeArray[0]) timeArray.shift();

	return timeArray.map((item) => item.padStart(2, "0")).join(":");
};

// 控制音量变化时显隐的定时器
let timer: NodeJS.Timer | null = null;
// 控制音量变化时 dom 的显隐
const show = ref<boolean>(false);

watch(volume, () => {
	show.value = true;
	timer && clearTimeout(timer);
	timer = setTimeout(() => {
		show.value = false;
	}, 3000);
});
</script>

<template>
	<div class="music-helper" @wheel="onWheel" @dblclick="isPlay = !isPlay">
		<!-- header 顶部是用来让透明的部分可穿透 -->
		<div
			class="header"
			@mouseenter="penetrateWindow(true)"
			@mouseleave="penetrateWindow(false)"
		/>
		<!-- 音乐图片 -->
		<div class="music-cover">
			<span v-if="!currentPlaySong?.cover">歌曲图片</span>

			<template v-else>
				<img
					:style="coverIsPlay"
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
					<icon-skip-next-fill @click="findNewMusicInfo" />
				</div>
			</template>
		</div>
		<!-- 主要内容部分 -->
		<div
			class="content"
			:style="{
				backgroundImage: `url(${currentPlaySong?.cover})`,
			}"
		>
			<div class="inner-content">
				<template v-if="currentPlaySong">
					<div class="volume" :class="{ show }">
						音量：{{ Math.round(volume * 100) }} %
					</div>

					<!-- 音乐信息 -->
					<div class="music-info">
						<!-- 音乐名称 -->
						<div class="name">
							{{ currentPlaySong?.name }}
						</div>
						<!-- 歌手 -->
						<div class="singer">
							{{ currentPlaySong?.singer }}
						</div>
					</div>
					<!-- 切歌 and 时间 -->
					<div class="other-info">
						<div class="cut-song">
							切歌 {{ cutSongList.length }} / 3
						</div>
						<a-slider
							:model-value="currentPlaySong?.currentDuration"
							:max="currentPlaySong?.totalDuration"
							:format-tooltip="(value: number) => handleMusicTime(value)"
							@change="handleProgress"
						/>
						<div class="music-time">
							{{
								handleMusicTime(
									currentPlaySong?.currentDuration
								)
							}}
							/
							{{
								handleMusicTime(currentPlaySong?.totalDuration)
							}}
						</div>
					</div>

					<!-- 歌词 -->
					<div class="lyric">
						<template v-if="!currentPlaySong?.lyric">
							歌词正在加载中...
						</template>
						<template v-else>
							{{ currentPlaySong?.lyric }}
						</template>
					</div>
					<!-- 点歌列表 -->
					<div class="song-list">
						<div class="has-song" v-if="songPlayList.length">
							<a-carousel
								direction="vertical"
								show-arrow="never"
								auto-play
								:current="currentBroadcastIndex"
								@change="
									(value) => (currentBroadcastIndex = value)
								"
							>
								<a-carousel-item
									v-for="item in songPlayList"
									:key="item.uid"
								>
									{{ item.uname }} 点了首 {{ item.musicName }}
								</a-carousel-item>
							</a-carousel>

							<span>
								{{ currentBroadcastIndex }} /
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
	</div>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>

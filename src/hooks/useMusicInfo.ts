import { onMounted, ref, watch } from "vue";
import { ipcRenderer } from "electron";
import Lyric from "lrc-file-parser";
import {
	searchPlaylistInfoApi,
	searchMusicInfoApi,
	searchLyricApi,
} from "@/api";
import type { currentMusicInfo, SongPlayItem } from "@/types";

const useMusicInfo = () => {
	// 创建一个 audio 对象
	const audio = new Audio();
	// 正在播放的音乐信息
	const currentPlaySong = ref<currentMusicInfo>();
	// 音量
	const volume = ref<number>(0.2);
	// 音乐是否播放
	const isPlay = ref<boolean>(false);
	// 随机播放歌单列表
	const randomPlayList = ref<any[]>([]);
	// 点歌的歌单列表
	const songPlayList = ref<SongPlayItem[]>([]);
	// 点歌的歌单列表的播报 id
	const currentBroadcastIndex = ref(1);
	// 切歌列表 记录 uid
	const cutSongList = ref<number[]>([]);
	// 音乐图片元素
	const coverElement = ref<HTMLImageElement>();
	// 处理歌词的对象
	const lyricTools = ref<any>();

	// 获取随机歌单列表
	const getRandomPlayList = async () => {
		// 初始话获取热门榜单列表随机播放
		const result = await searchPlaylistInfoApi(3778678);

		if (!result) return;

		randomPlayList.value = result.playlist.tracks;

		playMusic();
	};

	// 处理歌词
	const handleLyric = (lyric: string) => {
		lyricTools.value = new Lyric({
			onPlay(line, text) {
				currentPlaySong.value!.lyric = text as string;
			},
			offset: 150,
			isRemoveBlankLine: true,
			lyric,
			translationLyric: "",
			onSetLyric(lines) {},
		});

		lyricTools.value.setLyric(lyric);
	};

	// 播放音乐
	const playMusic = async () => {
		isPlay.value = false;

		let info: any = {};

		if (songPlayList.value.length) {
			const { uid, uname, musicName } = songPlayList.value[0];

			// 获取点歌列表第一首的信息
			const getMusicInfo = await searchMusicInfoApi(musicName);

			if (!getMusicInfo) {
				playMusic();

				return;
			}

			// 将用户信息也放进去，播放失败可以发消息让换一首歌曲
			info = { uid, uname, ...getMusicInfo.result.songs[0] };

			// 删除掉列表第一首
			songPlayList.value.shift();
		} else if (randomPlayList.value.length) {
			// 随机获取一首歌曲
			info =
				randomPlayList.value[
					Math.floor(Math.random() * randomPlayList.value.length)
				];

			// 从随机歌单中删除
			const findIndex = randomPlayList.value.findIndex(
				(item) => item.id === info.id
			);
			randomPlayList.value.splice(findIndex, 1);
		} else {
			getRandomPlayList();

			return;
		}

		if (songPlayList.value.length <= 1) {
			currentBroadcastIndex.value = 1;
		}

		const { uid, uname, id, name, al, ar, dt } = info;

		// 获取歌词
		const getLyric = await searchLyricApi(id);

		if (!getLyric) return;

		let hasLyric = false,
			lyric = "纯音乐，请欣赏";

		// needDesc 为 true 无歌词 反之
		if (!getLyric?.needDesc) {
			hasLyric = true;

			lyric = getLyric.lrc.lyric;
		}

		currentPlaySong.value = {
			uid,
			uname,
			id,
			name,
			singer: ar.map((item: any) => item.name).join(" / "),
			cover: al.picUrl,
			currentDuration: 0,
			totalDuration: dt.toString().slice(0, -3),
			hasLyric,
		};

		audio.src = `http://music.163.com/song/media/outer/url?id=${id}.mp3`;
		audio.volume = volume.value;

		// 可以正常播放且无需停顿时播放音乐
		audio.oncanplaythrough = () => {
			isPlay.value = true;
			handleLyric(lyric);
		};

		// 监听音乐时间变化
		audio.ontimeupdate = () => {
			currentPlaySong.value!.currentDuration = audio.currentTime;
		};

		// 播放完后去找下一首音乐
		audio.onended = () => {
			playMusic();
		};
	};

	onMounted(() => {
		// 监听点|切歌消息
		ipcRenderer.on("listen-sone-barrage", (_, barrage) => {
			const { message, uname, uid } = barrage;
			// 点歌操作
			// TODO: 加个歌曲黑名单 lost rivers Early Steps
			if (message.includes("点歌")) {
				const musicName = message.replace("点歌", "").trim();
				// 如果歌曲名为空，无操作
				if (!musicName) return;

				songPlayList.value.push({ uid, uname, musicName });
			} else {
				// 切歌操作
				cutSongList.value = [...new Set([...cutSongList.value, uid])];
				// TODO: 切歌操作设置为置顶人数
				if (cutSongList.value.length >= 3) {
					playMusic();
					cutSongList.value.splice(0);
				}
			}
		});

		getRandomPlayList();
	});

	watch(isPlay, (newValue) => {
		try {
			if (newValue) {
				audio.play();
				lyricTools.value.play(
					currentPlaySong.value!.currentDuration * 1000
				);
				coverElement.value!.style.animationPlayState = "running";
			} else {
				audio.pause();
				lyricTools.value.pause();
				coverElement.value!.style.animationPlayState = "paused";
			}
		} catch (error) {
			console.log("error", error);
			// 播放失败重新换一首播放
			playMusic();
		}
	});

	return {
		currentPlaySong,
		songPlayList,
		currentBroadcastIndex,
		cutSongList,
		coverElement,
		isPlay,
		playMusic,
	};
};

export default useMusicInfo;

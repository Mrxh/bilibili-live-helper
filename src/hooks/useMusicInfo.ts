import { onMounted, ref, watch } from "vue";
import { ipcRenderer } from "electron";
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

	// 获取随机歌单列表
	const getRandomPlayList = async () => {
		// 初始话获取热门榜单列表随机播放
		const result = await searchPlaylistInfoApi(3778678);

		if (!result) return;

		randomPlayList.value = result.playlist.tracks;

		playMusic();
	};

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

	// 播放音乐
	const playMusic = async () => {
		try {
			let info: any = {};

			if (songPlayList.value.length) {
				const { uid, uname, musicName } = songPlayList.value[0];

				// 获取点歌列表第一首的信息
				const getMusicInfo = await searchMusicInfoApi(musicName);

				if (!getMusicInfo) return;

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
				const findIndex = randomPlayList.value.find(
					(item) => item.id === info.id
				);
				randomPlayList.value.splice(findIndex, 1);
			} else {
				getRandomPlayList();

				return;
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
				currentDuration: "00:00",
				totalDuration: handleMusicTime(Math.floor(dt / 1000)),
				hasLyric,
				lyric,
			};

			audio.src = `http://music.163.com/song/media/outer/url?id=${id}.mp3`;
			audio.volume = volume.value;

			// 可以正常播放且无需停顿时播放音乐
			audio.oncanplaythrough = () => {
				audio.play();

				// 监听音乐时间变化
				audio.ontimeupdate = () => {
					currentPlaySong.value!.currentDuration = handleMusicTime(
						audio.currentTime
					);
				};
			};

			// 播放完后去找下一首音乐
			audio.onended = () => {
				playMusic();
			};
		} catch (error) {
			// 播放失败重新换一首播放
			playMusic();
			// TODO: 如果是点歌的 需要版权啥的音乐，给用户发信息提示
		}
	};

	// 改变音乐播放状态
	const changeMusicStatus = async () => {};

	onMounted(() => {
		getRandomPlayList();

		// 监听点|切歌消息
		ipcRenderer.on("listen-sone-barrage", (_, barrage) => {
			const { message, uname, uid } = barrage;
			// 点歌操作
			if (message.includes("点歌")) {
				const musicName = message.replace("点歌", "").trim();
				// 如果歌曲名为空，无操作
				if (!musicName) return;

				songPlayList.value.push({ uid, uname, musicName });
			} else {
				// 切歌操作
				cutSongList.value = [...new Set([...cutSongList.value, uid])];
			}
		});
	});

	watch(cutSongList.value, (newValue) => {
		// TODO: 与设置参数同步起来
		if (newValue.length === 3) playMusic();
	});

	return {
		currentPlaySong,
		songPlayList,
		currentBroadcastIndex,
		cutSongList,
		coverElement,
	};
};

export default useMusicInfo;

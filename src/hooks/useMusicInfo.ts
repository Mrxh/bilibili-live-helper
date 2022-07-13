import { onMounted, ref, watch, computed } from "vue";
import { ipcRenderer } from "electron";
import Lyric from "lrc-file-parser";
import {
  searchPlaylistInfoApi,
  searchMusicInfoApi,
  searchLyricApi,
  getMusicUrl
} from "@/api";
import { Volume } from "@/constants";
import { getStore, setStore } from "@/stores/electron";
import type { currentMusicInfo, SongPlayItem } from "@/types";

const useMusicInfo = () => {
  // 创建一个 audio 对象
  const audio = new Audio();
  // 正在播放的音乐信息
  const currentPlaySong = ref<currentMusicInfo>();
  // 音量
  const volume = ref<number>(getStore(Volume));
  // 音乐是否播放
  const isPlay = ref<boolean>(false);
  // 判断音乐信息是否全部加载完毕
  const isLoaded = ref<boolean>(false);
  // 随机播放歌单列表
  const randomPlayList = ref<any[]>([]);
  // 点歌的歌单列表
  const songPlayList = ref<SongPlayItem[]>([]);
  // 点歌的歌单列表的播报 id
  const currentBroadcastIndex = ref(1);
  // 切歌列表 记录 uid
  const cutSongList = ref<number[]>([]);
  // 处理歌词的对象
  const lyricTools = ref<Record<string, any>>();

  // 音乐图片是否旋转
  const coverIsPlay = computed(() => {
    return {
      animationPlayState: `${isPlay.value ? "running" : "paused"}`
    };
  });

  onMounted(() => {
    audio.volume = volume.value;

    document.addEventListener("keydown", onKeyDown);

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

        if (cutSongList.value.length >= 3) {
          findNewMusicInfo();

          cutSongList.value.splice(0);
        }
      }
    });

    getRandomPlayList();
  });

  watch(isPlay, (newValue) => {
    if (newValue) {
      setTimeout(() => {
        audio.play();
      }, 150);
      lyricTools.value?.play(
				currentPlaySong.value!.currentDuration * 1000
      );
    } else {
      audio.pause();
      lyricTools.value?.pause();
    }
  });

  watch(volume, (newValue) => {
    newValue = Number(newValue.toFixed(2));

    audio.volume = newValue;

    setStore(Volume, newValue);
  });

  // 获取随机歌单列表
  const getRandomPlayList = async () => {
    // 获取热门榜单列表随机播放
    const result = await searchPlaylistInfoApi();

    if (!result) return;

    randomPlayList.value = result.playlist.tracks;

    findNewMusicInfo();
  };

  // 处理歌词
  const handleLyric = (lyric: string) => {
    lyricTools.value = new Lyric({
      onPlay (_, text) {
				currentPlaySong.value!.lyric = text as string;
      },
      offset: 150,
      isRemoveBlankLine: true,
      lyric,
      translationLyric: "",
      onSetLyric () {}
    });

    // lyricTools.value.setLyric(lyric);
  };

  // 查找一首新的音乐信息
  const findNewMusicInfo = async () => {
    isPlay.value = false;
    isLoaded.value = false;

    if (currentPlaySong.value) {
      audio.currentTime = 0;
      currentPlaySong.value.lyric = "";
    }

    let musicInfo: any = {};

    if (songPlayList.value.length) {
      const { uid, uname, musicName } = songPlayList.value[0];

      // 获取点歌列表第一首的信息
      const getMusicInfo = await searchMusicInfoApi(musicName);

      if (!getMusicInfo) {
        findNewMusicInfo();

        return;
      }

      // 将用户信息也放进去，播放失败可以发消息让换一首歌曲
      musicInfo = { uid, uname, ...getMusicInfo.result.songs[0] };

      // 删除掉列表第一首
      songPlayList.value.shift();
    } else if (randomPlayList.value.length) {
      // 随机获取一首歌曲
      musicInfo =
				randomPlayList.value[
				  Math.floor(Math.random() * randomPlayList.value.length)
				];

      // 从随机歌单中删除
      const findIndex = randomPlayList.value.findIndex(
        (item) => item.id === musicInfo.id
      );
      randomPlayList.value.splice(findIndex, 1);
    } else {
      getRandomPlayList();

      return;
    }

    if (songPlayList.value.length <= 1) {
      currentBroadcastIndex.value = 1;
    }

    onPlay(musicInfo);
  };

  // 播放音乐
  const onPlay = async (musicInfo: any) => {
    const { uid, uname, id, name, al, ar, dt } = musicInfo;

    currentPlaySong.value = {
      uid,
      uname,
      id,
      name,
      singer: ar.map((item: any) => item.name).join(" / "),
      cover: al.picUrl,
      currentDuration: 0,
      totalDuration: +dt.toString().slice(0, -3)
    };

    let hasLyric = false;
    let lyric = "纯音乐，请欣赏";

    // 获取歌词
    const getLyric = await searchLyricApi(id);
    // needDesc 为 true 无歌词 反之
    if (!getLyric?.needDesc) {
      hasLyric = true;

      lyric = getLyric.lrc.lyric;
    }
    currentPlaySong.value.hasLyric = hasLyric;

    isLoaded.value = true;

    audio.src = getMusicUrl(id);

    // 可以正常播放时播放音乐
    audio.oncanplaythrough = () => {
      if (!isLoaded.value) return;

      isPlay.value = true;

      if (hasLyric) {
        handleLyric(lyric);
      } else {
				currentPlaySong.value!.lyric = lyric;
				lyricTools.value = undefined;
      }
    };

    // 监听音乐时间变化
    audio.ontimeupdate = () => {
			currentPlaySong.value!.currentDuration = audio.currentTime;
    };

    // 加载错误时播放下一首
    audio.onerror = () => {
      findNewMusicInfo();
    };

    // 播放完后去找下一首音乐
    audio.onended = () => {
      findNewMusicInfo();
    };
  };

  // 处理音乐进度
  const handleProgress = (time: number | number[]) => {
    isPlay.value = false;

    audio.currentTime = time as number;
  };

  // 鼠标滚动，处理音量
  const onWheel = (event: WheelEvent) => {
    if (!isLoaded.value) return;

    const sign = event.deltaY > 0 ? 1 : -1;
    const target = audio.volume + sign * 0.01;

    volume.value = sign > 0 ? Math.min(1, target) : Math.max(0, target);
  };

  // 键盘按下事件增减音量|时间
  const onKeyDown = (event: KeyboardEvent) => {
    if (!isLoaded.value) return;

    switch (event.code) {
      case "ArrowUp":
        const increasedVolume = volume.value + 0.05;
        volume.value = Math.min(1, increasedVolume);
        break;
      case "ArrowDown":
        const reducedVolume = volume.value - 0.05;
        volume.value = Math.max(0, reducedVolume);
        break;
      case "ArrowLeft":
        handleProgress(audio.currentTime - 5);
        break;
      case "ArrowRight":
        handleProgress(audio.currentTime + 5);
        break;
    }
  };

  return {
    currentPlaySong,
    volume,
    songPlayList,
    currentBroadcastIndex,
    cutSongList,
    isPlay,
    coverIsPlay,
    findNewMusicInfo,
    handleProgress,
    onWheel
  };
};

export default useMusicInfo;

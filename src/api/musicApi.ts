import getQueryData from "@/utils/request";

// 网易云请求url
const baseUrl = "https://music-node.vercel.app";
const basePlayUrl = "http://music.163.com/song/media/outer";
// 默认加载的歌单id
const defaultPlaylist = 3778678;

// 查找歌单信息
const searchPlaylistInfoApi = async (id: number = defaultPlaylist) =>
  await getQueryData(`${baseUrl}/playlist/detail`, {
    params: {
      id
    }
  });

// 搜索音乐信息
const searchMusicInfoApi = async (keywords: string) =>
  await getQueryData(`${baseUrl}/cloudsearch`, {
    params: {
      keywords
    }
  });

// 搜索歌词
const searchLyricApi = async (id: number) =>
  await getQueryData(`${baseUrl}/lyric`, {
    params: {
      id
    }
  });

// 歌曲播放url
const getMusicUrl = (id: number) => `${basePlayUrl}/url?id=${id}.mp3`;

export {
  searchPlaylistInfoApi,
  searchMusicInfoApi,
  searchLyricApi,
  getMusicUrl
};

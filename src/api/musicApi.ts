import getQueryData from '@/utils/request'

// 查找歌单信息
const searchPlaylistInfoApi = async (id: number) =>
  await getQueryData('https://music-node.vercel.app/playlist/detail', {
    params: {
      id
    }
  })

// 搜索音乐信息
const searchMusicInfoApi = async (keywords: string) =>
  await getQueryData('https://music-node.vercel.app/cloudsearch', {
    params: {
      keywords
    }
  })

// 搜索歌词
const searchLyricApi = async (id: number) =>
  await getQueryData('https://music-node.vercel.app/lyric', {
    params: {
      id
    }
  })

export {
  searchPlaylistInfoApi,
  searchMusicInfoApi,
  searchLyricApi
}

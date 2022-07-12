import { storeToRefs } from 'pinia'
import { useCommonInfoStore } from '@/stores/pinia/userInfo'
import { useWebsocketStore } from '@/stores/pinia/websocket'

const useCommonInfo = () => {
  const userInfoStore = useCommonInfoStore()
  const { fans, userList, emojiList } = storeToRefs(userInfoStore)
  const { initInfo } = userInfoStore

  const websocketStore = useWebsocketStore()
  const { popularity, rankList, barrageList, welcomeList } = storeToRefs(websocketStore)
  const { openWebsocket } = websocketStore

  return {
    fans,
    userList,
    emojiList,
    popularity,
    rankList,
    barrageList,
    initInfo,
    openWebsocket,
    welcomeList
  }
}

export default useCommonInfo

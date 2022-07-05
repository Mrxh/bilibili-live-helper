import { storeToRefs } from "pinia";
import { useCommonInfoStore } from "@/stores/pinia/userInfo";
import { useWebsocketStore } from "@/stores/pinia/websocket";

const useCommonInfo = () => {
	const userInfoStore = useCommonInfoStore();
	const { fans, userList, emojiList } = storeToRefs(userInfoStore);
	const { initInfo } = userInfoStore;

	const websocketStore = useWebsocketStore();
	const { popularity, rankList, barrageList } = storeToRefs(websocketStore);
	const { openWebsocket } = websocketStore;

	return {
		fans,
		userList,
		emojiList,
		popularity,
		rankList,
		barrageList,
		initInfo,
		openWebsocket,
	};
};

export default useCommonInfo;

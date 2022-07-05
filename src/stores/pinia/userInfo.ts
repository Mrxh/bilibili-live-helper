import { defineStore } from "pinia";
import { Message } from "@arco-design/web-vue";
import { getFansApi, getUserInfoApi, getEmojiApi, getGiftApi } from "@/api";
import { setStore } from "@/stores/electron";
import { UP_INFO } from "@/constants";
import { upIsLogin } from "@/utils/auth";
import type { UserItem } from "@/types";

export const useCommonInfoStore = defineStore({
	id: "userInfo",

	state: () => ({
		// 粉丝数量
		fans: 0,
		// 用户列表
		userList: [] as UserItem[],
		// 表情列表
		emojiList: [] as any,
	}),

	actions: {
		async initInfo() {
			// 获取粉丝数量
			const fansResult = await getFansApi();

			if (!fansResult?.data) return;

			this.fans = fansResult.data.follower;

			// 获取 up 主的信息
			const upInfoResult = await getUserInfoApi();

			if (!upInfoResult) return;

			const {
				data: { mid, face, sex, live_room },
			} = upInfoResult;
			// 判断 up 帐号是否已开通直播功能，有则保存
			const roomId = live_room?.roomid;
			if (!roomId) {
				Message.error("帐号未开通直播功能");

				return;
			}
			setStore(UP_INFO.roomId, roomId);

			// 将 up 自己先加到用户列表
			this.userList.push({
				uid: mid,
				face,
				sex,
			});

			// 如果未登录 就直接返回 true 从而去开启长链接
			// 如果登陆了，就去获取一些数据之后，再去开启长链接
			if (upIsLogin()) {
				// 获取表情列表
				const emojiResult = await getEmojiApi();

				if (emojiResult?.code === 0) {
					this.emojiList = emojiResult.data.data;
				} else {
					this.emojiList = null;
				}

				// 获取礼物列表
				getGiftApi();
			}

			return true;
		},
	},
});

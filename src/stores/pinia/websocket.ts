import { defineStore } from "pinia";
import { nanoid } from "nanoid";
import { encode, decode, colorHexToRgba } from "@/utils/barrage";
import { getStore } from "@/stores/electron";
import { UP_INFO } from "@/constants";
import { getAudioFiles, playAudio, splitAudioSuffix } from "@/utils/nodejs";
import { receiveNewSongBarrage } from "@/utils/electron";
import type { BarrageItem } from "@/types";

let websocket: WebSocket | null = null,
	timer: NodeJS.Timeout | null = null;

const websocketUrl = "ws://broadcastlv.chat.bilibili.com:2244/sub";

export const useWebsocketStore = defineStore({
	id: "websocket",

	state: () => ({
		// 人气
		popularity: 0,
		// 前三名排名列表
		rankList: [] as any[],
		// 弹幕列表
		barrageList: [] as BarrageItem[],
		// 欢迎信息列表
		welcomeList: [] as BarrageItem[]
	}),

	actions: {
		// 开启长链接
		openWebsocket() {
			if (websocket) {
				websocket.close();
				websocket = null;
			}

			if (timer) {
				clearInterval(timer);
				timer = null;
			}

			websocket = new WebSocket(websocketUrl);

			websocket.onopen = () => {
				if (websocket && websocket.readyState === websocket.OPEN) {
					websocket.send(
						encode(
							JSON.stringify({
								protover: 1,
								clientver: "1.4.0",
								roomid: getStore(UP_INFO.roomId!),
							}),
							7
						)
					);

					websocket.send(encode("", 2));

					websocket.onmessage = async (msgEvent) => {
						const result: any = await decode(msgEvent.data);
						switch (result.op) {
							case 3:
								this.popularity = result.body.count;
								break;
							case 5:
								for (const item of result.body) {
									console.log(item.cmd, item);

									const id = nanoid();

									const { cmd } = item;

									if (cmd.includes("ONLINE_RANK_V2")) {
										this.rankList.splice(0);
										// 直播间排行榜列表，只需要得到前三名
										const list = item.data.list;
										list.length > 3 && list.splice(3);

										for (const item of list) {
											this.rankList.push(item);
										}
									} else if (cmd.includes("DANMU_MSG")) {
										// 普通弹幕信息
										const info = item.info;

										// TODO: 房管判断不准确
										const barrageInfo: any = {
											uid: info[2][0],
											uname: info[2][1],
											message: info[1],
											isAnchor:
												info[2][0] ==
												getStore(UP_INFO.uid),
											isManager: info[15] === 91,
											isEmoji:
												typeof info[0][13] ==
													"object" &&
												info[0][13].constructor ==
													Object,
											emoji: info[0][13],
											unameColor: info[2][7],
											medal: info[3],
										};

										const nameColor =
											barrageInfo.unameColor;

										if (nameColor) {
											barrageInfo.backgroundColor =
												colorHexToRgba(nameColor, 0.3);
										}

										this.barrageList.push({
											id,
											barrage: barrageInfo,
											barrageType: "general",
										});

										const message =
											barrageInfo.message.trim();
										// 先判断是否触发音效
										// TODO : 加判断是否开启了音效开关
										const findAudio = getAudioFiles()?.find(
											(item) =>
												splitAudioSuffix(item).includes(
													message
												) ||
												message.includes(
													splitAudioSuffix(item)
												)
										);
										if (findAudio) playAudio(findAudio);

										// 如果点|切歌操作，就通知音乐窗口
										if (/^(点歌|切歌$)/.test(message)) {
											receiveNewSongBarrage(barrageInfo);
										}
									} else if (
										// 礼物信息
										cmd.includes("SEND_GIFT") ||
										cmd.includes("COMBO_SEND")
									) {
										this.barrageList.push({
											id,
											barrage: {
												...item.data,
												isGift: true,
											},
											barrageType: "gift",
										});
									} else if (cmd.includes("INTERACT_WORD")) {
										this.welcomeList.push({
											id,
											barrage: { ...item.data },
											barrageType: "action",
										});
									} else if (cmd.includes("ENTRY_EFFECT")) {
										this.welcomeList.push({
											id,
											barrage: {
												...item.data,
												msg_type: -1,
											},
											barrageType: "action",
										});
									} else if (
										cmd.includes("ONLINE_RANK_TOP3")
									) {
										this.welcomeList.push({
											id,
											barrage: {
												rankInfo: item.data.list[0],
												msg_type: -10,
											},
											barrageType: "action",
										});
									}
								}
								break;
						}
					};
				}
			};

			websocket.onerror = this.openWebsocket;

			websocket.onclose = this.openWebsocket;

			timer = setInterval(() => {
				websocket && websocket.send(encode("", 2));
			}, 30000);
		},
	},
});

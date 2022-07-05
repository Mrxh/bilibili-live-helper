import { getStore } from "@/stores/electron";
import { UP_INFO, ROBOT_INFO } from "@/constants";

// 判断 up 主是否已登录
const upIsLogin = () =>
	getStore(UP_INFO.uid) && getStore(UP_INFO.cookie) && getStore(UP_INFO.csrf);

//  判断 机器人 已登录
const robotIsLogin = () =>
	getStore(ROBOT_INFO.uid) &&
	getStore(ROBOT_INFO.cookie) &&
	getStore(ROBOT_INFO.csrf);

export { upIsLogin, robotIsLogin };

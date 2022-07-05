import { ipcRenderer } from "electron";
import type { Hash } from "@/types";

// 打开新窗口
const openNewWindow = (hash: Hash) => {
	ipcRenderer.send("open-new-window", hash);
};

// 置顶窗口
const topWindow = (value: boolean) => {
	ipcRenderer.send("window-top", value);
};

// 穿透窗口
const penetrateWindow = (value: boolean) => {
	if (value) {
		ipcRenderer.send("window-penetrate", true, { forward: true });
	} else {
		ipcRenderer.send("window-penetrate", false);
	}
};

// 最小化窗口
const minimizeWindow = () => {
	ipcRenderer.send("window-minimize");
};

// 关闭窗口
const closeWindow = () => {
	ipcRenderer.send("window-close");
};

// 发送最新(点|切)歌弹幕给主进程
const receiveNewSongBarrage = (value: Record<string, any>) => {
	ipcRenderer.send("new-sone-barrage", value);
};

// 切换窗口主题
const toggleWindowTheme = (value: "dark" | "light") => {
	ipcRenderer.send("toggle-theme", value);
};

// up 的登录信息发生变化给主进程发送消息
const changeUpInfo = () => {
	ipcRenderer.send("up-info-change");
};

export {
	openNewWindow,
	topWindow,
	penetrateWindow,
	minimizeWindow,
	closeWindow,
	receiveNewSongBarrage,
	toggleWindowTheme,
	changeUpInfo,
};

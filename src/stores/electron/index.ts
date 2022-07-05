import Store from "electron-store";
import { THEME, UP_INFO, IS_TOP, OPACITY } from "@/constants";

const store = new Store();

// 判断是否是需要加密的字段
const isEncrypted = (key: string) => {
	return key.includes("cookie") || key.includes("csrf");
};

const getStore = (key: string, isDecrypt = true) => {
	let defaultValue: any = null;

	if (key === THEME) {
		// 默认主题
		defaultValue = "light";
	} else if (key === UP_INFO.uid) {
		// 默认 up uid
		defaultValue = 478490349;
	} else if (key === IS_TOP) {
		// 默认弹幕助手是否置顶
		defaultValue = true;
	} else if (key === OPACITY) {
		// 直播助手 默认透明度 0 - 100
		defaultValue = 70;
	} else if (key.includes("barrage_show")) {
		// 显示列表样式的默认选择状态
		defaultValue = true;
	}

	const result: any = store.get(key, defaultValue);

	// 判断是否需要返回解密后的数据
	if (isDecrypt && isEncrypted(key) && result) {
		return atob(result);
	} else {
		return result;
	}
};

const setStore = (key: string, value: any) => {
	if (isEncrypted(key)) {
		value = btoa(value);
	}

	store.set(key, value);
};

const deleteStore = (key: string) => {
	store.delete(key);
};

export { store, getStore, setStore, deleteStore };

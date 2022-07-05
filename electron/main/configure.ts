import { BrowserWindow } from "electron";
import type { Hash } from "../../src/types";
import type { BrowserWindowConstructorOptions } from "electron";

type Win = BrowserWindow | null;

let win: Win = null,
	settingsWin: Win = null,
	fansWin: Win = null,
	musicWin: Win = null,
	promptWin: Win = null;

// 各个窗口对应的名称
const windowName: Record<Hash, Win> = {
	"/": win,
	"/settings": settingsWin,
	"/fans": fansWin,
	"/music": musicWin,
	"/prompt": promptWin,
};

// 各个窗口的选项
const windowOptions: Record<Hash, BrowserWindowConstructorOptions> = {
	"/": {
		width: 360,
		height: 420,
		maximizable: false,
		transparent: true,
		resizable: false,
		frame: false,
	},
	"/settings": {
		width: 750,
		height: 500,
		useContentSize: true,
		maximizable: false,
		resizable: false,
		alwaysOnTop: true,
	},
	"/music": {},
	"/fans": {},
	"/prompt": {
		width: 350,
		height: 450,
		useContentSize: true,
		maximizable: false,
		transparent: true,
		resizable: false,
		frame: false,
		alwaysOnTop: true,
	},
};

export { windowName, windowOptions };

import {
	app,
	BrowserWindow,
	shell,
	ipcMain,
	nativeTheme,
	Menu,
} from "electron";
import { release } from "os";
import { join } from "path";
import { windowName, windowOptions, menuTemplate } from "./configure";

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
	app.quit();
	process.exit(0);
}

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

export const ROOT_PATH = {
	// /dist
	dist: join(__dirname, "../.."),
	// /dist or /public
	public: join(__dirname, app.isPackaged ? "../.." : "../../../public"),
};
// TODO：配置一套中文的 menu
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
const url = `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}`;
const indexHtml = join(ROOT_PATH.dist, "index.html");

const createWindow = (hash = "/") => {
	windowName[hash] = new BrowserWindow({
		...windowOptions[hash],
		webPreferences: {
			preload,
			nodeIntegration: true,
			contextIsolation: false,
			// 禁止跨域
			webSecurity: false,
		},
	});

	if (app.isPackaged) {
		windowName[hash].loadFile(indexHtml, { hash });
	} else {
		windowName[hash].loadURL(`${url}/#${hash}`);
		windowName[hash].webContents.openDevTools();
	}

	// Make all links open with the browser, not with the application
	windowName[hash].webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith("https:")) shell.openExternal(url);
		return { action: "deny" };
	});
};

app.whenReady().then(() => {
	createWindow();
	// Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
});

app.on("activate", () => {
	const allWindows = BrowserWindow.getAllWindows();
	if (allWindows.length) {
		allWindows[0].focus();
	} else {
		createWindow();
	}
});

// 重置请求头
app.on("browser-window-created", (_, win) => {
	win.webContents.session.webRequest.onBeforeSendHeaders((detail, cb) => {
		let { requestHeaders } = detail;

		const { baseReferer, baseOrigin, baseCookie } = requestHeaders;

		requestHeaders = Object.assign(requestHeaders, {
			Referer: baseReferer,
			origin: baseOrigin,
			cookie: baseCookie,
		});
		cb({ requestHeaders });
	});
});

// 打开新窗口
ipcMain.on("open-new-window", async (_, hash) => {
	// 如果已经打开就让窗口获得焦点，否则打开新的
	try {
		if (windowName[hash]) {
			windowName[hash].restore();
		} else {
			createWindow(hash);
		}
	} catch (error) {
		createWindow(hash);
	}
});

// 最小化窗口
ipcMain.on("window-minimize", (event) =>
	BrowserWindow.fromWebContents(event.sender)?.minimize()
);

// 关闭窗口
ipcMain.on("window-close", (event) =>
	BrowserWindow.fromWebContents(event.sender)?.destroy()
);

// 窗口置顶
ipcMain.on("window-top", (event, status) =>
	BrowserWindow.fromWebContents(event.sender)?.setAlwaysOnTop(status)
);

// 窗口穿透
ipcMain.on("window-penetrate", (event, ...args) =>
	BrowserWindow.fromWebContents(event.sender)?.setIgnoreMouseEvents(...args)
);

// 给每个渲染进程发送消息
const sendAllWindows = (channel: string, value?: any) => {
	const allWindows = BrowserWindow.getAllWindows();

	for (const win of allWindows) {
		win.webContents.send(channel, value);
	}
};

// 更改窗口透明度
ipcMain.on("change-window-opacity", (_, value) =>
	sendAllWindows("listen-window-opacity", value)
);

// 切换窗口主题
ipcMain.on("toggle-theme", (_, value) => {
	// 先给所有的渲染进程发送修改主题的消息
	sendAllWindows("listen-toggle-theme", value);

	// 然后把所有原生窗口的主题切换一下
	nativeTheme.themeSource = value;
});

// 有点|切歌弹幕时向渲染进程发送消息
ipcMain.on("new-sone-barrage", (_, value) =>
	sendAllWindows("listen-sone-barrage", value)
);

// 接收渲染进程发送的 up 主登录信息发生变化的消息，然后分发给每个渲染进程
ipcMain.on("up-info-change", () => sendAllWindows("listen-up-info"));

// 改变窗口的大小
ipcMain.on("change-window-size", (event, { width, height }) =>
	BrowserWindow.fromWebContents(event.sender)?.setContentSize(width, height)
);

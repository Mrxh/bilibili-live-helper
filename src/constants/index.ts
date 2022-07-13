import type { Hash } from "@/types";

const THEME = "theme";

const OPACITY = "opacity";

const Volume = "volume";

const IS_TOP: Partial<Record<Hash, string>> = {
  "/": "is_top./",
  "/fans": "is_top./fans",
  "/prompt": "is_top./prompt"
};

const IS_PENETRATE: Partial<Record<Hash, string>> = {
  "/": "is_penetrate./",
  "/fans": "is_penetrate./fans",
  "/prompt": "is_penetrate./prompt"
};

const UP_INFO = {
  uid: "up_info.uid",
  cookie: "up_info.cookie",
  csrf: "up_info.csrf",
  roomId: "up_info.roomId"
};

const ROBOT_INFO = {
  uid: "robot_info.uid",
  cookie: "robot_info.cookie",
  csrf: "robot_info.csrf"
};

const TOOLS_OPEN = {
  music: "tools_open.music",
  fans: "tools_open.fans",
  prompt: "tools_open.prompt"
};

const VOICE_BROADCAST = {
  isOpen: "voice_broadcast.isOpen"
};

const BARRAGE_SOUND = {
  isOpen: "barrage_sound.isOpen",
  value: "barrage_sound.volume"
};

export {
  THEME,
  OPACITY,
  Volume,
  IS_TOP,
  IS_PENETRATE,
  UP_INFO,
  ROBOT_INFO,
  TOOLS_OPEN,
  BARRAGE_SOUND,
  VOICE_BROADCAST
};

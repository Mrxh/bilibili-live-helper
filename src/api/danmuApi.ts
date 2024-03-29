import getQueryData from "@/utils/request";
import { getStore } from "@/stores/electron";
import { UP_INFO, ROBOT_INFO } from "@/constants";
import type { SendMessage, NewVideoInfo } from "@/types";

// 公共的请求头
const baseUrl = "https://api.bilibili.com";
const liveBaseUrl = "https://api.live.bilibili.com";
const QRcodeBaseUrl = "https://passport.bilibili.com";

// 获取 up 主的粉丝数量
const getFansApi = async () =>
  await getQueryData(`${baseUrl}/x/relation/stat`, {
    params: {
      vmid: getStore(UP_INFO.uid),
      jsonp: "jsonp"
    }
  });

// 获取 up 最新的一期视频的 bvid
const getUpNewVideoBVidApi = async () =>
  await getQueryData(`${baseUrl}/x/space/arc/search`, {
    params: {
      mid: getStore(UP_INFO.uid),
      pn: 1,
      ps: 1,
      index: 1,
      jsonp: "jsonp"
    },
    returnErrorResult: true
  });

// 获取 up 最新一期视频的信息
const getUpNewVideoInfoApi = async () => {
  // 获取粉丝
  const fansResult = await getFansApi();

  if (!fansResult) return;

  // 获取 bvid
  const bvidResult = await getUpNewVideoBVidApi();

  if (bvidResult?.code) return;

  const result = await getQueryData(`${baseUrl}/x/web-interface/view`, {
    params: { bvid: bvidResult.data.list.vlist[0].bvid }
  });

  if (result?.code) return;

  const {
    title,
    owner: { face, name },
    stat: { view, like, coin, favorite, share, reply, danmaku }
  } = result.data;

  return {
    title,
    face,
    name,
    view,
    like,
    coin,
    favorite,
    share,
    reply,
    danmaku,
    fans: fansResult.data.follower
  } as NewVideoInfo;
};

// 获取小破站用户基本信息
async function getUserInfoApi (mid?: string) {
  return await getQueryData(`${baseUrl}/x/space/acc/info`, {
    params: {
      mid: mid || getStore(UP_INFO.uid)
    }
  });
}

// 获取礼物列表
const getGiftApi = async () => {
  const result = await getQueryData(
    `${liveBaseUrl}/xlive/web-room/v1/giftPanel/giftConfig`,
    {
      params: {
        platform: "pc",
        room_id: getStore(UP_INFO.roomId),
        area_parent_id: 11,
        area_id: 372
      }
    }
  );

  if (result) {
    const styleElement = document.createElement("style");

    const giftList = result.data.list.map(
      ({ id, gif }: any) =>
        `.gift-${id} { background-image: url(${gif}) } `
    );

    const backgroundImageList = result.data.combo_resources.map(
      ({ img_four }: any, index: number) =>
        `.background-image-${index} { background-image: url(${img_four}) } `
    );

    styleElement.innerHTML = [...giftList, ...backgroundImageList].join("");

    document.head.appendChild(styleElement);

    return backgroundImageList.length;
  }
};

// 获取表情列表
const getEmojiApi = async () =>
  await getQueryData(
    `${liveBaseUrl}/xlive/web-ucenter/v2/emoticon/GetEmoticons`,
    {
      params: {
        platform: "pc",
        room_id: getStore(UP_INFO.roomId)
      },
      option: {
        headers: {
          baseCookie: getStore(UP_INFO.cookie)
        }
      },
      returnErrorResult: true
    }
  );

// 获取关系信息
const getRelationApi = async () =>
  await getQueryData(`${baseUrl}/x/space/acc/relation`, {
    params: {
      mid: getStore(UP_INFO.uid)
    },
    option: {
      headers: {
        baseCookie: getStore(UP_INFO.cookie)
      }
    }
  });

// 获取登录url
const getLoginUrlApi = async () =>
  await getQueryData(`${QRcodeBaseUrl}/qrcode/getLoginUrl`, {
    returnErrorResult: true
  });

// 验证二维码是否被扫
const verifyQrCodeApi = async (oauthKey: string) =>
  await getQueryData(`${QRcodeBaseUrl}/qrcode/getLoginInfo`, {
    method: "post",
    params: {
      oauthKey,
      gourl: "https://www.bilibili.com/"
    },
    returnErrorResult: true
  });

// 发送消息
const sendMessageApi = async (message: SendMessage) => {
  let cookie, csrf;

  // 判断是主动发送，还是自动回复
  if (message.isInitiative) {
    csrf = getStore(UP_INFO.csrf);
    cookie = getStore(UP_INFO.cookie);
  } else {
    csrf = getStore(ROBOT_INFO.csrf) || getStore(UP_INFO.csrf);
    cookie = getStore(ROBOT_INFO.cookie) || getStore(UP_INFO.cookie);
  }

  return await getQueryData(`${liveBaseUrl}/msg/send`, {
    method: "post",
    params: {
      ...message,
      bubble: 0,
      color: 16777215,
      mode: 1,
      fontsize: 25,
      rnd: Math.floor(Date.now() / 1000),
      roomid: getStore(UP_INFO.roomId),
      csrf,
      csrf_token: csrf
    },
    option: {
      headers: {
        baseCookie: cookie
      }
    }
  });
};

export {
  getFansApi,
  getUpNewVideoBVidApi,
  getUpNewVideoInfoApi,
  getUserInfoApi,
  getGiftApi,
  getEmojiApi,
  getRelationApi,
  getLoginUrlApi,
  verifyQrCodeApi,
  sendMessageApi
};

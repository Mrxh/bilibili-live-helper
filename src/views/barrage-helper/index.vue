<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { ipcRenderer } from "electron";
import BarrageHeader from "./components/barrage-header/index.vue";
import GeneralMessage from "./components/barrage-message/general-message/index.vue";
import GiftMessage from "./components/barrage-message/gift-message/index.vue";
import ActionMessage from "./components/barrage-message/action-message/index.vue";
import SendMessage from "./components/barrage-message/send-message/index.vue";
import useCommonInfo from "@/hooks/useCommonInfo";
import { getStore } from "@/stores/electron";
import { OPACITY, IS_PENETRATE, TOOLS_OPEN } from "@/constants";
import { penetrateWindow, openNewWindow } from "@/utils/electron";
import type { Hash } from "@/types";

const { barrageList, initInfo, openWebsocket, welcomeList } = useCommonInfo();
// 背景透明度
const opacity = ref(getStore(OPACITY));
// 消息列表元素
const messageListRef = ref();
// 是否在最底部
const isBottom = ref(true);
// 未读消息数量
const unreadCount = ref(0);
// 计算出最新的一条欢迎信息
const upToDateWelcome = computed(() => {
  if (!welcomeList.value.length) {
    return null;
  }
  return welcomeList.value[welcomeList.value.length - 1];
});

onMounted(async () => {
  // 监听透明度的变化
  ipcRenderer.on("listen-window-opacity", (_, value) => {
    opacity.value = value;
  });

  // 监听 up 登录信息的变化，然后重新刷新窗口
  ipcRenderer.on("listen-up-info", () => {
    window.location.reload();
  });

  // 初始化信息
  const result = await initInfo();

  if (!result) return;

  // 初始话成功，开启长链接
  openWebsocket();

  // 初始化开启跟随直播助手一起开启的窗口
  const otherTools: Record<keyof typeof TOOLS_OPEN, Hash> = {
    music: "/music",
    fans: "/fans",
    prompt: "/prompt"
  };

  (Object.keys(otherTools) as (keyof typeof TOOLS_OPEN)[]).forEach((key) => {
    if (getStore(TOOLS_OPEN[key])) {
      openNewWindow(otherTools[key]);
    }
  });
});

// 消息列表滚动事件
const onScroll = () => {
  if (!messageListRef.value) return;

  const { scrollTop, scrollHeight, clientHeight } = messageListRef.value;

  if (scrollTop < scrollHeight - clientHeight - 50) {
    isBottom.value = false;
  } else {
    isBottom.value = true;
    unreadCount.value = 0;
  }
};

// 消息列表滚动到最底部
const scrollToBottom = () => {
  requestAnimationFrame(() => {
    if (!messageListRef.value) return;

    messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
  });
};

// 监听弹幕列表的变化
watch(barrageList.value, () => {
  if (isBottom.value) {
    scrollToBottom();
  } else {
    unreadCount.value++;
  }
});
</script>

<template>
  <div
    class="barrage-helper"
    :style="{ background: `rgba(0, 0, 0, ${opacity / 100} )` }"
  >
    <!-- 头部 -->
    <BarrageHeader />

    <!-- 消息内容 -->
    <ul
      class="message-list"
      ref="messageListRef"
      @mouseenter="penetrateWindow(getStore(IS_PENETRATE['/']!))"
      @mouseleave="penetrateWindow(false)"
      @scroll="onScroll"
    >
      <li
        v-for="item in barrageList"
        class="message-item animate__animated animate__bounceInRight"
        :key="item.id"
      >
        <GeneralMessage
          v-if="item.barrageType === 'general'"
          :barrage="item.barrage"
        />
        <GiftMessage
          v-else-if="item.barrageType === 'gift'"
          :barrage="item.barrage"
        />
      </li>
    </ul>

    <!-- 欢迎信息 -->
    <div
      class="welcome-message"
      v-if="upToDateWelcome"
    >
      <Transition
        name="zoom-fade"
        mode="out-in"
        appear
      >
        <ActionMessage
          :key="upToDateWelcome.id"
          :barrage="upToDateWelcome.barrage"
        />
      </Transition>
    </div>

    <!-- 跳转至底部的按钮 -->
    <a-button
      class="to-bottom"
      type="primary"
      shape="circle"
      @click="scrollToBottom"
      v-if="unreadCount"
    >
      <span>{{ unreadCount > 99 ? "99+" : unreadCount }}</span>
    </a-button>

    <!-- 发送消息 -->
    <SendMessage />
  </div>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>

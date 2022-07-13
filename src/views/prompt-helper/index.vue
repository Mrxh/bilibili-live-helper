<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getAudioFiles, splitAudioSuffix } from "@/utils/nodejs";
import BaseOperate from "@/components/base-operate/index.vue";
import { penetrateWindow } from "@/utils/electron";
import { getStore } from "@/stores/electron";
import { IS_PENETRATE } from "@/constants";

// 内容列表外层元素
const listOuterRef = ref<HTMLDivElement>();
// 内容列表内部元素
const listInnerRef = ref<HTMLUListElement>();
// 音频关键词关键词列表
const audioKeywords = ref<string[]>([]);

// 定时器
let timer: NodeJS.Timer | null = null;

// 列表滚动
const onScroll = () => {
  setTimeout(() => {
    listOuterRef.value?.appendChild(listInnerRef.value?.cloneNode(true)!);

    timer = setInterval(() => {
      if (
				listOuterRef.value?.scrollTop! >=
				listInnerRef.value?.scrollHeight!
      ) {
				listOuterRef.value!.scrollTop = 0;
      } else {
				listOuterRef.value!.scrollTop += 0.5;
      }
    }, 50);
  }, 0);
};

// 停止滚动
const stopScroll = () => {
  timer && clearInterval(timer);
  timer = null;
};

onMounted(() => {
  const files = getAudioFiles();

  if (files?.length) {
    audioKeywords.value = files.map((item) => splitAudioSuffix(item));
  }

  onScroll();
});
</script>

<template>
  <div class="prompt-helper">
    <div class="header">
      <h1>🥳 欢迎各位大佬进入直播间</h1>

      <div class="operate">
        <BaseOperate />
      </div>
    </div>

    <div
      class="body"
      @mouseenter="penetrateWindow(getStore(IS_PENETRATE['/prompt']!))"
      @mouseleave="penetrateWindow(false)"
    >
      <div class="title">
        直播间小彩蛋：(开发ing...)
      </div>

      <div
        class="content-list"
        ref="listOuterRef"
        @mouseenter="stopScroll"
        @mouseleave="onScroll"
      >
        <ul ref="listInnerRef">
          <li>1. 关注up可以触发左下角窗口的动画和音效！</li>
          <li>
            2. 直播间发送常见问题触发自动回复！
            <ol>
              <li>例如：</li>
              <li>
                <span>阿阳热爱前端：阿阳年龄多大了？</span>
                <span>自动回复阿阳热爱前端：18！</span>
              </li>
            </ol>
          </li>
          <li>
            3.
            直播间发送以下指定关键词即可触发音效！(表情包也可以触发)
            <ol>
              <li
                v-for="(item, index) in audioKeywords"
                :key="index"
              >
                {{ index + 1 }}. {{ item }}
              </li>
            </ol>
          </li>
          <li>
            4. 直播间发送：<br>点歌 + 空格 + 歌曲名 + 空格 +
            歌手名(歌手名可忽略) 即可点歌
          </li>
          <li>例如：点歌 嘉宾 or 点歌 嘉宾 路飞文</li>
          <li>
            5. 直播间发送关键字
            "切歌"，达到指定人数，即可切换至下一首歌！
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>

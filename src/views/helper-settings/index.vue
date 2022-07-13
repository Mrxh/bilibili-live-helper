<script setup lang="ts">
import ToggleTheme from "@/components/toggle-theme/index.vue";
import AccountInfo from "./components/account-info/index.vue";
import VoiceBroadcast from "./components/voice-broadcast/index.vue";
import OtherTools from "./components/other-tools/index.vue";
import AboutHelper from "./components/about-helper/index.vue";
import type { HelperSettingsTabItem } from "@/types";

const tabList: HelperSettingsTabItem[] = [
  {
    title: "主播设置",
    subTitle: "主播只设置 UID 仅可使用少部分功能",
    icon: "icon-user",
    isAnchor: true,
    component: AccountInfo
  },
  {
    title: "管理设置",
    subTitle: "设置一个帮你自动回复的机器人，默认是主播自动回复",
    icon: "icon-robot",
    component: AccountInfo
  },
  {
    title: "弹幕助手",
    subTitle: "为确保效率，部分设置更新后只对新的弹幕生效",
    icon: "icon-sort",
    component: AboutHelper
  },
  {
    title: "语音播报",
    icon: "icon-sound",
    component: VoiceBroadcast
  },
  {
    title: "自动回复",
    icon: "icon-message",
    component: AboutHelper
  },
  {
    title: "点歌助手",
    icon: "icon-music",
    component: AboutHelper
  },
  {
    title: "其它工具",
    icon: "icon-tool",
    component: OtherTools
  },
  {
    title: "关于助手",
    icon: "icon-info-circle",
    component: AboutHelper
  }
].map((item, index) => ({
  key: index,
  ...item
}));
</script>

<template>
  <div class="helper-settings">
    <a-tabs
      position="left"
      animation
      :default-active-key="3"
    >
      <a-tab-pane
        v-for="item in tabList"
        :key="item.key"
      >
        <template #title>
          <component :is="item.icon" />
          {{ item.title }}
        </template>

        <div class="title">
          {{ item.title }}
          <div class="sub-title">
            {{ item.subTitle }}
          </div>
        </div>

        <component
          :is="item.component"
          :is-anchor="item.isAnchor"
        />
      </a-tab-pane>
    </a-tabs>

    <ToggleTheme />
  </div>
</template>

<style scoped lang="scss">
.helper-settings {
  height: 100vh;

  background-color: var(--color-bg-1);

  ::v-deep(.arco-tabs) {
    height: 100%;

    .title {
      display: flex;
      align-items: flex-end;

      margin-bottom: 20px;

      font-size: 20px;

      gap: 10px;

      .sub-title {
        color: var(--color-text-3);

        font-size: 14px;
      }
    }

    .arco-tabs-nav-tab {
      padding-top: 12px;
    }

    .arco-tabs-content {
      overflow: auto;
      overflow-x: hidden;

      padding: 12px;
    }
  }
}
</style>

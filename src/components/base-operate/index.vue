<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import IconPenetrate from "@/components/icon-penetrate/index.vue";
import { topWindow, minimizeWindow, closeWindow } from "@/utils/electron";
import { getStore, setStore } from "@/stores/electron";
import { IS_TOP, IS_PENETRATE } from "@/constants";
import type { OperateIconItem, Hash } from "@/types";

// 获取路由对象
const $route = useRoute();

const path = $route.path as Hash;

// 是否置顶
const isTop = ref<boolean>(!!getStore(IS_TOP[path]!));
// 是否穿透
const isPenetrate = ref<boolean>(!!getStore(IS_PENETRATE[path]!));

// 操作图标列表
const operateIconList = computed((): OperateIconItem[] => [
  {
    title: isPenetrate.value ? "关闭穿透" : "开启穿透",
    active: isPenetrate.value,
    component: IconPenetrate,
    clickEvent: () => {
      isPenetrate.value = !isPenetrate.value;

      setStore(IS_PENETRATE[path]!, isPenetrate.value);
    }
  },
  {
    title: isTop.value ? "取消置顶" : "置顶",
    active: isTop.value,
    component: "icon-pushpin",
    clickEvent: () => {
      isTop.value = !isTop.value;

      topWindow(isTop.value);

      setStore(IS_TOP[path]!, isTop.value);
    }
  },
  {
    title: "最小化",
    component: "icon-minus",
    clickEvent: minimizeWindow
  },
  {
    title: "关闭",
    component: "icon-close",
    clickEvent: closeWindow
  }
]);

onMounted(() => topWindow(isTop.value));
</script>

<template>
  <div class="base-operate">
    <a-tooltip
      v-for="(item, index) in operateIconList"
      :content="item.title"
      :key="index"
    >
      <component
        :is="item.component"
        :class="{ active: item.active }"
        @click="item.clickEvent"
      />
    </a-tooltip>
  </div>
</template>

<style scoped lang="scss">
.base-operate {
  display: flex;

  gap: 9px;

  .arco-icon {
    cursor: pointer;
    transition: all 0.3s;

    color: #999;

    font-size: 17px;

    -webkit-app-region: no-drag;

    &.arco-icon-penetrate {
      transform: translateY(0.5px);

      font-size: 15.5px;
    }

    &:hover {
      color: #fff;
    }

    &.active {
      color: rgb(var(--primary-6));
    }

    &.arco-icon-close:hover {
      color: rgb(var(--danger-6));
    }
  }
}
</style>

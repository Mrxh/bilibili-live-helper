import { createRouter, createWebHashHistory } from "vue-router";
import BarrageHelper from "@/views/barrage-helper/index.vue";

export const routes = [
  {
    path: "/",
    name: "barrage",
    meta: {
      title: "弹幕姬"
    },
    component: BarrageHelper
  },
  {
    path: "/settings",
    name: "settings",
    meta: {
      title: "设置"
    },
    component: () => import("@/views/helper-settings/index.vue")
  },
  {
    path: "/fans",
    name: "fans",
    meta: {
      title: "粉丝姬"
    },
    component: () => import("@/views/fans-helper/index.vue")
  },
  {
    path: "/music",
    name: "music",
    meta: {
      title: "点歌姬"
    },
    component: () => import("@/views/music-helper/index.vue")
  },
  {
    path: "/prompt",
    name: "prompt",
    meta: {
      title: "提示姬"
    },
    component: () => import("@/views/prompt-helper/index.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({
    top: 0
  })
});

router.afterEach((to) => {
  document.title = "哔哩哔哩直播助手 - " + to.meta.title;
});

export default router;

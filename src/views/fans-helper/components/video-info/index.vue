<script setup lang="ts">
import { inject } from 'vue'
import type { NewVideoInfo } from '@/types'

// 获取到父组件传的参数
const isExpand: boolean = inject('isExpand')!
const videoInfo: NewVideoInfo = inject('videoInfo')!
</script>

<template>
  <div class="video-info">
    <div class="title">
      <span>{{ videoInfo.title }}</span>
      <i class="fans-helper-view">
        <icon-eye /> {{ videoInfo.view }}
      </i>
    </div>

    <ul
      class="content"
      :class="{ isExpand }"
    >
      <!-- 喜欢 -->
      <li>
        <span class="fans-helper-like">
          <i class="iconfont icon-like" />
          {{ videoInfo.like }}
        </span>
      </li>
      <!-- 投币 -->
      <li>
        <span class="fans-helper-coin">
          <i class="iconfont icon-coin" />
          {{ videoInfo.coin }}
        </span>
      </li>
      <!-- 收藏 -->
      <li>
        <span class="fans-helper-favorite">
          <i class="iconfont icon-favorite" />
          {{ videoInfo.favorite }}
        </span>
      </li>
      <!-- 评论 -->
      <li>
        <span class="fans-helper-reply">
          <i class="iconfont icon-reply" />
          {{ videoInfo.reply }}
        </span>
      </li>
      <!-- 弹幕 -->
      <li>
        <span class="fans-helper-danmaku">
          <i class="iconfont icon-danmaku" />
          {{ videoInfo.danmaku }}
        </span>
      </li>
      <!-- 分享 -->
      <li>
        <span class="fans-helper-share">
          <i class="iconfont icon-share" />
          {{ videoInfo.share }}
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.video-info {
  .title {
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 20px 0;

    font-size: 16px;

    gap: 10px;

    span {
      overflow: hidden;

      max-width: 70%;

      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .content {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    gap: 10px;

    li {
      display: flex;
      align-items: center;
      justify-content: center;

      width: calc(33.3% - 10px);

      gap: 5px;

      span {
        width: 70px;

        ::v-deep(em) {
          right: -20px;
        }
      }
    }

    &.isExpand {
      li {
        width: calc(50% - 10px);
      }
    }
  }
}
</style>

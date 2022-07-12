<script setup lang="ts">
import { provide } from 'vue'
import MessageMedal from '../message-common/Medal.vue'
import MessageRank from '../message-common/Rank.vue'

const { barrage } = defineProps({
  barrage: {
    type: Object,
    required: true
  }
})

const { isEmoji, unameColor, uname, emoji, message } = barrage

provide('barrage', barrage)
</script>

<template>
  <div class="general-message">
    <!-- 头像 -->
    <!-- 消息内容 -->
    <div
      :class="{
        'text-message': !isEmoji,
        'emoji-message': isEmoji,
      }"
    >
      <!-- 排名 -->
      <MessageRank />
      <!-- 勋章 -->
      <MessageMedal />
      <!-- 名称 -->
      <span :style="{ color: unameColor }">{{ uname }}：</span>
      <!-- 普通消息 -->
      <i v-if="!isEmoji">{{ message }}</i>
      <!-- 表情消息 如果是官方图标高度为 20px 反之为 40px -->
      <img
        :src="emoji.url"
        :style="{
          height: emoji.emoticon_unique.includes('official')
            ? '20px'
            : '40px',
        }"
        :alt="message"
        v-else
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.general-message {
  display: flex;
  align-items: center;

  gap: 10px;

  .message-medal,
  .message-rank {
    margin-right: 5px;
  }

  .text-message {
    .message-rank {
      transform: translateY(1px);
    }
  }

  .emoji-message {
    display: flex;
    align-items: center;

    .message-rank {
      transform: translateY(-1px);
    }
  }
}
</style>

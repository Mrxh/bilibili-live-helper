<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import type { BarrageMedal } from '@/types'

const barrage: any = inject('barrage')

// 是否显示勋章
const isShow = ref(false)
// 勋章信息
const medalInfo = ref<BarrageMedal>()

// 转换颜色
const convertColor = (color: any) => `#${color.toString(16).padStart(6, 0)}`

onMounted(() => {
  const { medal, fans_medal } = barrage

  if (medal && medal.length) {
    isShow.value = true

    medalInfo.value = {
      name: medal[1],
      level: medal[0],
      color: convertColor(medal[4]),
      borderColor: convertColor(medal[7]),
      bgStartColor: convertColor(medal[8]),
      bgEndColor: convertColor(medal[9])
    }
  } else if (fans_medal && fans_medal.medal_level) {
    isShow.value = true

    medalInfo.value = {
      name: fans_medal.medal_name,
      level: fans_medal.medal_level,
      color: convertColor(fans_medal.medal_color),
      borderColor: convertColor(fans_medal.medal_color_border),
      bgStartColor: convertColor(fans_medal.medal_color_end),
      bgEndColor: convertColor(fans_medal.medal_color_start)
    }
  }
})
</script>

<template>
  <div
    class="message-medal"
    :style="{ borderColor: medalInfo?.borderColor }"
    v-if="isShow"
  >
    <!-- 名称 -->
    <div
      class="message-medal__name"
      :style="{
        background: `linear-gradient(45deg, ${medalInfo?.bgStartColor}, ${medalInfo?.bgEndColor})`,
      }"
    >
      {{ medalInfo?.name }}
    </div>
    <!-- 等级 -->
    <div
      class="message-medal__level"
      :style="{ color: medalInfo?.color }"
    >
      {{ medalInfo?.level }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.message-medal {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;

  height: 16px;

  transform: translateY(-1px);

  border-width: 1px;
  border-style: solid;
  border-radius: 2px;

  font-family: BlinkMacSystemFont !important;
  font-size: 12px;
  line-height: 1;

  &__name {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 100%;
    padding: 0 4px;

    color: #fff;
  }

  &__level {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 16px;
    height: 100%;

    border-radius: 0 1px 1px 0;
    background-color: #fff;
  }
}
</style>

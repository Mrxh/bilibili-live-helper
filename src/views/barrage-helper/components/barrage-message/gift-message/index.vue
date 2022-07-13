<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { GiftInfo } from "@/types";

const { barrage } = defineProps({
  barrage: {
    type: Object,
    required: true
  }
});
// 礼物信息
const giftInfo = ref<GiftInfo>();

onMounted(() => {
  const {
    batch_combo_send,
    blind_gift,
    uname,
    action,
    giftName,
    gift_name,
    giftId,
    gift_id,
    num,
    combo_num
  } = barrage;

  if (batch_combo_send && blind_gift) {
    // 爆出礼物
    const {
      action,
      gift_name,
      gift_num,
      blind_gift: { gift_action, original_gift_name }
    } = batch_combo_send;

    giftInfo.value = {
      name: uname,
      action1: action,
      action2: gift_action,
      gift1: original_gift_name,
      gift2: gift_name,
      gift2Id: giftId || gift_id,
      number: gift_num
    };
  } else {
    // 投喂礼物
    giftInfo.value = {
      name: uname,
      action1: action,
      gift2: giftName || gift_name,
      gift2Id: giftId || gift_id,
      number: num || combo_num
    };
  }
});
</script>

<template>
  <div class="gift-message">
    <i>感谢</i>

    <span>{{ giftInfo?.name }}</span>

    <i>{{ giftInfo?.action1 }}</i>

    <span v-if="giftInfo?.gift1">{{ giftInfo.gift1 }}</span>

    <i v-if="giftInfo?.action2">{{ giftInfo.action2 }}</i>

    <span>{{ giftInfo?.gift2 }}</span>

    <i :class="`gift-${giftInfo?.gift2Id}`" />

    <span> × {{ giftInfo?.number }}</span>
  </div>
</template>

<style scoped lang="scss">
.gift-message {
	display: flex;
	align-items: center;
	flex-wrap: wrap;

	column-gap: 5px;

	i {
		&[class*="gift"] {
			display: inline-block;

			width: 25px;
			height: 25px;

			background-repeat: no-repeat;
			background-size: cover;
		}
	}

	span {
		color: var(--keyword-color);
	}
}
</style>

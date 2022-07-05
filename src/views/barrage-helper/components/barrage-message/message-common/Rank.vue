<script setup lang="ts">
import { ref, inject, watch } from "vue";
import useCommonInfo from "@/hooks/useCommonInfo";
import rank_1 from "@/assets/img/rank-1.png";
import rank_2 from "@/assets/img/rank-2.png";
import rank_3 from "@/assets/img/rank-3.png";

const { rankList } = useCommonInfo();

const barrage: any = inject("barrage");

// 排名图片
const rankImage = ref<string>();

// 图片列表
const rankImages = [rank_1, rank_2, rank_3];

watch(
	rankList.value,
	(newRankList) => {
		const findRank = newRankList.find((item) => item.uid === barrage.uid);

		if (findRank) {
			rankImage.value = rankImages[findRank.rank - 1];
		} else {
			rankImage.value = undefined;
		}
	},
	{
		immediate: true,
	}
);
</script>

<template>
	<div class="message-rank" v-if="rankImage">
		<img :src="rankImage" :alt="barrage?.uid" />
	</div>
</template>

<style scoped lang="scss">
.message-rank {
	display: inline-block;

	line-height: 0;
	img {
		height: 13px;
	}
}
</style>

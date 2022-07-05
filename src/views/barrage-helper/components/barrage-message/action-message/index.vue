<script setup lang="ts">
import { ref, onMounted, provide } from "vue";
import MessageMedal from "../message-common/Medal.vue";
import MessageRank from "../message-common/Rank.vue";
import type { HighInfo } from "@/types";

const { barrage } = defineProps({
	barrage: {
		type: Object,
		required: true,
	},
});

const {
	msg_type,
	uname,
	basemap_url,
	face,
	uid,
	copy_color,
	highlight_color,
	copy_writing_v2,
	rankInfo,
} = barrage;

// 高能用户信息
const highInfo = ref<HighInfo>();

onMounted(() => {
	// 对高能用户的信息进行切割
	if (msg_type === -1 || msg_type === -10) {
		let value = msg_type === -1 ? copy_writing_v2 : rankInfo.msg;

		value = value.replace("<%", " ").replace("%>", " ").split(/\s+/);

		highInfo.value = {
			prefix: value[0],
			name: value[value.includes("<^icon^>") ? 2 : 1],
			suffix: value[value.length - 1],
		};
	}
});

provide("barrage", barrage);
</script>

<template>
	<div class="action-message">
		<!-- 进入新用户 -->
		<div class="grateful" v-if="msg_type === 1">
			欢迎 <MessageMedal /> <i>{{ uname }}</i> 进入直播间
		</div>
		<!-- 关注 -->
		<div class="grateful" v-else-if="msg_type === 2">
			感谢 <MessageMedal /> <i>{{ uname }}</i> 的关注
		</div>
		<!-- 分享直播间 -->
		<div class="grateful" v-else-if="msg_type === 3">
			感谢 <MessageMedal /> <i>{{ uname }}</i> 分享直播间
		</div>
		<!-- 高能榜进入 -->
		<div
			className="enter"
			:style="{ backgroundImage: `url(${basemap_url})` }"
			v-else-if="msg_type === -1"
		>
			<!-- 头像 -->
			<img :src="face" class="avatar-image" :alt="uid" />

			<!-- 前缀 -->
			<span :style="{ color: copy_color }">
				{{ highInfo?.prefix }}
			</span>

			<!-- 排名 -->
			<MessageRank />

			<!-- 名称 -->
			<span :style="{ color: highlight_color }">
				{{ highInfo?.name }}
			</span>

			<!-- 后缀 -->
			<span :style="{ color: copy_color }">
				{{ highInfo?.suffix }}
			</span>
		</div>

		<!-- 成为高能榜 -->
		<div class="grateful" v-else>
			{{ highInfo?.prefix }} <i>{{ highInfo?.name }}</i>
			{{ highInfo?.suffix }}
		</div>
	</div>
</template>

<style scoped lang="scss">
.action-message {
	.grateful {
		i {
			color: var(--keyword-color);
		}
	}

	.enter {
		display: flex;
		overflow: hidden;
		align-items: center;

		height: 40px;
		padding-left: 5px;

		background-repeat: no-repeat;
		background-position: -7px -25px;
		background-size: 100% auto;

		gap: 5px;
		.avatar-image {
			height: 34px;

			transform: translateY(0.5px);

			border-radius: 50%;
		}
		:not(img) {
			transform: translateY(1px);
		}
	}
}
</style>

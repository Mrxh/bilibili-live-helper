<script setup lang="ts">
import useCommonInfo from "@/hooks/useCommonInfo";
import BaseOperate from "@/components/base-operate/index.vue";
import { openNewWindow } from "@/utils/electron";

// 得到粉丝数量和人气
const { fans, popularity } = useCommonInfo();
</script>

<template>
  <div class="barrage-helper-header">
    <ul class="up-info">
      <li><span>人气：</span>{{ popularity }}</li>
      <li><span>粉丝：</span>{{ fans }}</li>
    </ul>

    <div class="operate">
      <a-tooltip content="设置">
        <icon-settings @click="openNewWindow('/settings')" />
      </a-tooltip>

      <BaseOperate />
    </div>
  </div>
</template>

<style scoped lang="scss">
.barrage-helper-header {
	display: flex;
	align-items: center;
	justify-content: space-between;

	padding: 10px;

	cursor: move;

	border-bottom: 1px solid #828282;

	-webkit-app-region: drag;

	.up-info {
		display: flex;

		gap: 10px;

		li {
			span {
				color: #999;
			}
		}
	}

	.operate {
		display: flex;

		gap: 9px;

		.arco-icon {
			cursor: pointer;
			transition: all 0.3s;

			color: #999;

			font-size: 17px;

			-webkit-app-region: no-drag;

			&:hover {
				color: #fff;
			}
		}
	}
}
</style>

<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
import qrCode from "qrcode";
import QS from "qs";
import { getLoginUrlApi, verifyQrCodeApi } from "@/api";

const handleSubmit: any = inject("handleSubmit");

// 二维码图片
const qrCodeImage = ref<string>();

// 扫码状态 0 未扫码 1 已扫码 2 已过期 3 扫码并登录
const qrCodeStatus = ref<0 | 1 | 2 | 3>(0);

// 获取登录链接
const getLoginUrl = async () => {
  qrCodeStatus.value = 0;

  const result = await getLoginUrlApi();

  if (result) {
    const { oauthKey, url } = result.data;

    // 将 url 转为图片
    qrCodeImage.value = await qrCode.toDataURL(url);

    verifyQrCode(oauthKey);
  }
};

// 验证扫码信息
const verifyQrCode = async (oauthKey: any) => {
  const result = await verifyQrCodeApi(oauthKey);

  switch (result?.data) {
    // 二维码已过期
    case -2:
      qrCodeStatus.value = 2;
      break;

      // 未扫码
    case -4:
      setTimeout(() => {
        verifyQrCode(oauthKey);
      }, 3000);
      break;

      // 已扫码 还要继续判断是否登录，所以不写 break 直接再次开启定时器
    case -5:
      qrCodeStatus.value = 1;

      setTimeout(() => {
        verifyQrCode(oauthKey);
      }, 3000);
      break;

      // 扫码并登录
    default:
      qrCodeStatus.value = 3;

      const { DedeUserID, bili_jct, SESSDATA } = QS.parse(
        result?.data.url.split("?")[1]
      );

      // 提交表单
      handleSubmit({
        uid: Number(DedeUserID),
        cookie: `SESSDATA=${SESSDATA}`,
        csrf: bili_jct
      });

      // 登录成功 5s 后重新获取登录的 url
      setTimeout(() => {
        getLoginUrl();
      }, 5000);
      break;
  }
};

onMounted(() => getLoginUrl());
</script>

<template>
  <a-popover
    content-class="qrcode-popover"
    trigger="click"
  >
    <icon-qrcode />

    <template
      #content
      v-if="qrCodeImage"
    >
      <img
        :src="qrCodeImage"
        alt="二维码"
      >
      <div class="scan-result">
        <a-result
          status="success"
          title="扫码成功"
          v-if="qrCodeStatus === 1"
        />

        <a-result
          status="error"
          title="二维码已过期"
          v-else-if="qrCodeStatus === 2"
        >
          <template #extra>
            <a-button
              type="primary"
              @click="getLoginUrl"
            >
              换一张
            </a-button>
          </template>
        </a-result>

        <a-result
          status="success"
          title="登录成功"
          v-else-if="qrCodeStatus === 3"
        />
      </div>
    </template>
  </a-popover>
</template>

<style lang="scss">
@import "./index.scss";
</style>

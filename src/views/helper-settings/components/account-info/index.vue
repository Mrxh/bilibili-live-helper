<script setup lang="ts">
import { onMounted, reactive, provide } from "vue";
import { Message } from "@arco-design/web-vue";
import QRCode from "./QRCode.vue";
import { getStore, setStore, deleteStore } from "@/stores/electron";
import { UP_INFO, ROBOT_INFO } from "@/constants";
import { changeUpInfo } from "@/utils/electron";
import type { AccountInfoForm, AccountInfoFormItem } from "@/types";

const { isAnchor } = defineProps({
  isAnchor: {
    type: Boolean,
    default: false
  }
});

// 判断是否为主播
const ACCOUNT_INFO = isAnchor ? UP_INFO : ROBOT_INFO;

// label 前缀
const prefixLabel = isAnchor ? "Up" : "Robot";

// form 表单项
const form = reactive<AccountInfoForm>({
  uid: undefined,
  csrf: "",
  cookie: ""
});

// form 表单项
const formItem: AccountInfoFormItem[] = [
  {
    label: "Uid",
    field: "uid",
    required: true,
    component: "a-input-number"
  },
  {
    label: "Cookie",
    field: "cookie",
    required: !isAnchor,
    component: "a-input-password"
  },
  {
    label: "Csrf",
    field: "csrf",
    required: !isAnchor,
    component: "a-input-password"
  }
];

// 获取 form 表单保存下来的值
const getFromValue = () => {
  (Object.keys(form) as (keyof AccountInfoForm)[]).forEach((key) => {
    form[key] = getStore(ACCOUNT_INFO[key], false);
  });
};

// 初始化获取表单内容
onMounted(() => {
  getFromValue();
});

// 清除登录信息
const clearAccountInfo = () => {
  (Object.keys(ACCOUNT_INFO) as (keyof AccountInfoForm)[]).forEach((key) => {
    form[key] = undefined;

    deleteStore(ACCOUNT_INFO[key]);
  });

  Message.error("清除成功，请重新登录");
};

// 提交表单
const handleSubmit = (values: Record<string, any>) => {
  let isChange = false;
  // 判断内容是否有变化
  (Object.keys(form) as (keyof AccountInfoForm)[]).forEach((key) => {
    if (values[key] !== getStore(ACCOUNT_INFO[key], false)) {
      setStore(ACCOUNT_INFO[key], values[key]);

      isChange = true;
    }
  });

  if (isChange) {
    getFromValue();

    isAnchor && changeUpInfo();
  }

  Message.success("保存成功");
};

provide("handleSubmit", handleSubmit);
</script>

<!-- TODO: 清除表单项的值 -->
<template>
  <div class="account-info">
    <a-form
      :model="form"
      layout="vertical"
      size="large"
      @submit-success="handleSubmit"
    >
      <a-form-item
        v-for="item in formItem"
        :field="item.field"
        :required="item.required"
        :key="item.field"
      >
        <template #label>
          <span>{{ prefixLabel }} {{ item.label }}</span>

          <template v-if="item.field === 'uid'">
            <QRCode />
            <i>扫码获取登录信息</i>
          </template>

          <i v-else>数据为加密内容，无法直接使用</i>
        </template>

        <component
          :is="item.component"
          v-model="form[item.field]"
          allow-clear
          :placeholder="`${prefixLabel} ${item.label}`"
        />
      </a-form-item>

      <a-form-item>
        <a-popconfirm
          content="确定直接将登录信息从配置文件中删除吗？"
          type="error"
          position="tr"
          @ok="clearAccountInfo"
        >
          <a-button
            type="dashed"
            status="danger"
          >
            <template #icon>
              <icon-delete />
            </template>
            <template #default>
              清除
            </template>
          </a-button>
        </a-popconfirm>

        <a-button
          type="primary"
          html-type="submit"
        >
          <template #icon>
            <icon-save />
          </template>
          <template #default>
            保存
          </template>
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>

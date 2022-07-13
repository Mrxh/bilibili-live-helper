<script setup lang="ts">
import { ref, computed } from 'vue'
import useCommonInfo from '@/hooks/useCommonInfo'
import { upIsLogin } from '@/utils/auth'
import { sendMessageApi } from '@/api'
import type { SendMessage } from '@/types'
import { Message } from '@arco-design/web-vue'

// 获取表情列表
const { emojiList } = useCommonInfo()
const inputValue = ref('')
// 输入框提示
const placeholder = ref('正在验证登录信息...')
// 是否禁用输入框
const disabled = computed(() => {
  if (upIsLogin()) {
    if (emojiList.value) {
      if (emojiList.value.length) {
        placeholder.value = '发个弹幕呗~'
        return false
      } else {
        placeholder.value = '正在验证登录信息...'
        return true
      }
    } else {
      placeholder.value = '登录信息验证失败，请重新登录'
      return true
    }
  } else {
    placeholder.value = '请先登录'
    return true
  }
})
// 是否显示表情弹出框
const visible = ref(false)
// 设置弹出框显隐
const setVisible = (value?: boolean) => {
  if (disabled.value) return

  visible.value = !!value
}

// 发送信息
const sendMessage = async (value?: string) => {
  let params: SendMessage

  // 判断是否为表情弹幕
  if (value) {
    params = {
      msg: value,
      dm_type: 1
    }
  } else {
    const msg = inputValue.value.trim()

    if (!msg) return

    params = {
      msg
    }
  }

  const result = await sendMessageApi({ ...params, isInitiative: true })

  // 发送完关闭表情弹框
  setVisible()

  if (result) {
    if (result.message) {
      Message.error('含有敏感词，请重新输入！')

      return
    }

    // 不是表情弹幕并且发送成功就清空输入框的内容
    if (!value) {
      inputValue.value = ''
    }
  }
}
</script>

<template>
  <div class="send-message">
    <a-input
      :max-length="20"
      allow-clear
      show-word-limit
      size="mini"
      v-model="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @press-enter="sendMessage()"
    >
      <template #prefix>
        ~
      </template>
    </a-input>

    <a-popover
      :popup-visible="visible"
      trigger="click"
      position="tr"
      popup-container=".send-message"
      @popup-visible-change="setVisible"
    >
      <icon-face-smile-fill @click="setVisible()" />
      <template #content>
        <a-tabs type="rounded">
          <a-tab-pane
            v-for="item in emojiList"
            :title="item.pkg_name"
            :key="item.pkg_id"
          >
            <div
              v-for="emoji in item.emoticons"
              :key="emoji.emoticon_id"
              class="emoji"
            >
              <img
                :src="emoji.url"
                :alt="emoji.emoji"
                @click="sendMessage(emoji.emoticon_unique)"
              >
            </div>
          </a-tab-pane>
        </a-tabs>
      </template>
    </a-popover>
  </div>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>

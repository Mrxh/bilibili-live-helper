<script setup lang="ts">
import { shell } from 'electron'
import type { connectItem } from '@/types'

const connectList: connectItem[] = [
  {
    label: 'qq群',
    value: '1016788384',
    href: 'https://jq.qq.com/?_wv=1027&k=n8dX7wdt'
  },
  {
    label: 'qq',
    value: '473033518',
    href: 'http://wpa.qq.com/msgrd?v=3&uin=473033518&site=qq&menu=yes'
  },
  {
    label: '微信',
    value: 'ayang473033518'
  }
]

const openBrowser = (href?: string) => {
  href && shell.openExternal(href)
}
</script>

<template>
  <div class="about-helper">
    <a-typography>
      <a-typography-paragraph>
        本软件完全免费，代码已开源，开源地址：
        <a-typography-text copyable>
          <a-typography-text
            type="primary"
            @click="
              openBrowser(
                'https://github.com/bilibili-ayang/bilibili-live-helper'
              )
            "
          >
            https://github.com/bilibili-ayang/bilibili-live-helper
          </a-typography-text>
        </a-typography-text>
        ，本软件开发的初衷仅是为了学习新技术与研究。
      </a-typography-paragraph>

      <a-typography-paragraph>
        您在使用本软件的过程中遇到的任何问题，都可以在仓库提 issues
        或者通过以下的联系方式联系到我，我会尽快修复，当然如果您有任何好玩的功能或者想法，也可以联系到我，如果在我能力范围之内的话，我会尽可能帮助实现的！
      </a-typography-paragraph>

      <a-typography-paragraph blockquote>
        <ul>
          <li
            v-for="(item, index) in connectList"
            :key="index"
          >
            {{ item.label }}：
            <a-typography-text copyable>
              <a-typography-text
                :type="item?.href && 'primary'"
                @click="openBrowser(item?.href)"
              >
                {{ item.value }}
              </a-typography-text>
            </a-typography-text>
          </li>
        </ul>
      </a-typography-paragraph>

      <a-typography-paragraph style="text-indent: 0">
        by：
        <a-typography-text
          copyable
          copy-text="https://space.bilibili.com/478490349"
        >
          <a-typography-text
            type="primary"
            @click="
              openBrowser('https://space.bilibili.com/478490349')
            "
          >
            阿阳热爱前端
          </a-typography-text>
        </a-typography-text>
      </a-typography-paragraph>
    </a-typography>
  </div>
</template>

<style scoped lang="scss">
.about-helper {
	.arco-typography {
		text-indent: 2em;

		.arco-typography-primary:hover {
			cursor: pointer;
			text-decoration: underline;
		}
	}

	ul {
		li {
			text-indent: 0;
		}
	}
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getStore, setStore } from '@/stores/electron'
import { THEME } from '@/constants'
import { toggleWindowTheme } from '@/utils/electron'

type Theme = 'light' | 'dark';

const theme = ref<Theme>(getStore(THEME) as Theme)

watch(
  theme,
  (newTheme) => {
    document.body.setAttribute('arco-theme', newTheme)

    toggleWindowTheme(newTheme)

    setStore(THEME, newTheme)
  },
  {
    immediate: true
  }
)
</script>

<template>
  <a-button
    class="toggle-theme"
    shape="circle"
    @click="theme = theme === 'light' ? 'dark' : 'light'"
  >
    <template #icon>
      <icon-sun-fill v-if="theme === 'dark'" />
      <icon-moon-fill v-else />
    </template>
  </a-button>
</template>

<style scoped lang="scss">
.arco-btn.toggle-theme {
  position: fixed;
  right: 20px;
  bottom: 20px;

  border: 1px solid var(--color-fill-3) !important;
  background-color: var(--color-bg-5) !important;
  box-shadow: 0 2px 12px #0000001a;
}
</style>

<template>
  <nav class="tabbar">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      :class="['tab', { active: tab.name === activeName } ]"
      @click="$emit('select', tab.name)"
    >
      <span class="icon">{{ tab.icon }}</span>
      <span class="label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { tabRouteNames } from '@/router';

const props = defineProps<{ activeName?: string }>();

const tabs = computed(() => [
  { name: tabRouteNames.Home, label: '首页', icon: '🏠' },
  { name: tabRouteNames.Discover, label: '发现', icon: '🧭' },
  { name: tabRouteNames.Profile, label: '我的', icon: '👤' }
]);

const activeName = computed(() => props.activeName);
</script>

<style scoped>
.tabbar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #fff;
  border-top: 1px solid rgba(0,0,0,0.08);
}
.tab {
  appearance: none;
  border: none;
  background: transparent;
  padding: 10px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #444;
}
.tab.active {
  color: #0070f3;
}
.icon { font-size: 18px; line-height: 1; }
.label { font-size: 12px; }
</style>

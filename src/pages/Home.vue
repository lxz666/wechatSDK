<template>
  <div class="page">
    <header class="topbar">首页</header>
    <main>
      <p>这是首页，支持缓存，模拟原生切换效果。</p>
      <NativeNavApiDemo />
      <div class="actions">
        <button @click="goDetail(1)">navigateTo 详情 1</button>
        <button @click="goDetail(2)">navigateTo 详情 2</button>
        <button @click="switchDiscover">switchTab 发现</button>
        <button @click="reLaunchHome">reLaunch 首页</button>
        <button @click="replaceProfile">redirectTo 我的(替换)</button>
      </div>
      <div class="state">
        <p>计数：{{ count }}</p>
        <button @click="inc">+1（缓存页面数据应保持）</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NativeNavApiDemo from '@/components/NativeNavApiDemo.vue';

const router = useRouter();
const count = ref(0);

function goDetail(id: number) {
  router.push({ name: 'Detail', params: { id } });
}
function switchDiscover() {
  router.replace({ name: 'Discover' });
}
function reLaunchHome() {
  router.replace({ name: 'Home' });
}
function replaceProfile() {
  router.replace({ name: 'Profile' });
}
function inc() { count.value++; }
</script>

<script lang="ts">
export default { name: 'PageHome' };
</script>

<style scoped>
.page { height: 100%; display: flex; flex-direction: column; }
.topbar { height: 44px; display: flex; align-items: center; padding: 0 12px; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.06); font-weight: 600; }
main { padding: 12px; }
.actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.state { margin-top: 12px; }
button { padding: 10px 12px; }
</style>

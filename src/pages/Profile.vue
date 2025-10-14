<template>
  <div class="page">
    <header class="topbar">我的</header>
    <main>
      <p>这是个人中心 Tab。</p>
      <button @click="goDetail">打开详情 navigateTo</button>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
function goDetail() { router.push({ name: 'Detail', params: { id: 42 } }); }
</script>

<script lang="ts">
export default { name: 'PageProfile' };
</script>

<style scoped>
.page { height: 100%; display: flex; flex-direction: column; }
.topbar { height: 44px; display: flex; align-items: center; padding: 0 12px; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.06); font-weight: 600; }
main { padding: 12px; }
</style>

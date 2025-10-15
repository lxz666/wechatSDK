<template>
  <div class="page">
    <header class="topbar">
      <button class="back" @click="back">〈</button>
      <span class="title">详情 {{ id }}</span>
      <span />
    </header>
    <main>
      <p>这是详情页，支持缓存及数据更新。</p>
      <div class="state">
        <p>本地计数：{{ count }}</p>
        <button @click="inc">+1</button>
      </div>
      <div class="ops">
        <button @click="replaceSub(id + '-r')">redirectTo 替换当前</button>
        <button @click="toAnother">navigateTo 再开一个</button>
        <button @click="pop">navigateBack 返回</button>
        <button @click="relaunchHome">reLaunch 到首页</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const id = ref(String(route.params.id));
const count = ref(0);

watch(() => route.params.id, (nv) => {
  id.value = String(nv);
}, { immediate: true });

function inc() { count.value++; }
function back() { router.go(-1); }
function pop() { router.go(-1); }
function replaceSub(newId: string) {
  router.replace({ name: 'Detail', params: { id: newId }});
}
function toAnother() {
  router.push({ name: 'Detail', params: { id: Date.now() % 10000 }});
}
function relaunchHome() { router.replace({ name: 'Home' }); }
</script>

<script lang="ts">
export default { name: 'PageDetail' };
</script>

<style scoped>
.page { height: 100%; display: flex; flex-direction: column; }
.topbar { height: 44px; display: grid; grid-template-columns: 44px 1fr 44px; align-items: center; padding: 0 6px; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.06); font-weight: 600; }
.back { font-size: 18px; border: none; background: transparent; }
.title { text-align: center; }
main { padding: 12px; }
.ops { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 12px; }
</style>

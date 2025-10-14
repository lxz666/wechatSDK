<template>
  <div class="app-shell">
    <div class="page-stage" :class="transitionClass" @transitionend="onTransitionEnd">
      <KeepAlive :include="includeList">
        <RouterView v-slot="{ Component }">
          <TransitionWrapper>
            <component :is="Component" :key="currentKey" />
          </TransitionWrapper>
        </RouterView>
      </KeepAlive>
    </div>

    <TabBar v-if="hasTabs" :active-name="activeTab" @select="onSelectTab" />

    <GestureBackOverlay v-if="canGestureBack" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useNavigationStore } from '@/stores/navigation';
import TabBar from '@/components/TabBar.vue';
import TransitionWrapper from '@/components/TransitionWrapper.vue';
import GestureBackOverlay from '@/components/GestureBackOverlay.vue';

const nav = useNavigationStore();
const router = useRouter();
const route = useRoute();

const { transitionDirection, includeComponentNames, activeTabName, canGestureBack } = storeToRefs(nav);

const hasTabs = computed(() => route.meta.isTab === true);
const activeTab = computed(() => activeTabName.value as string | undefined);

const includeList = computed(() => Array.from(includeComponentNames.value));

const currentKey = computed(() => {
  // Use keepAlive strategy to calculate key (synced in store)
  const entry = nav.stackTop;
  return entry?.key ?? (route.name ? String(route.name) : route.fullPath);
});

const transitionClass = computed(() => {
  switch (transitionDirection.value) {
    case 'forward': return 'transition-slide-in';
    case 'back': return 'transition-slide-out';
    case 'replace': return 'transition-fade';
    case 'switch': return 'transition-switch';
    case 'relaunch': return 'transition-fade';
    default: return '';
  }
});

function onTransitionEnd() {
  // no-op placeholder to allow CSS to clean states if needed
}

function onSelectTab(name: string) {
  if (route.name === name) return;
  router.replace({ name });
}

onMounted(() => {
  // ensure include list computed initially
});
</script>

<style scoped>
.app-shell {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.page-stage {
  position: relative;
  flex: 1;
  overflow: hidden;
  background: #fff;
}
</style>

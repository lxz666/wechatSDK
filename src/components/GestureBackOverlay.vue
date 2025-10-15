<template>
  <div
    class="gesture-layer"
    :style="layerStyle"
    @touchstart.passive="onStart"
    @touchmove.prevent="onMove"
    @touchend.passive="onEnd"
    @touchcancel.passive="onCancel"
  ></div>
  <div v-if="isSwipingBack" class="swipe-shadow" :style="shadowStyle"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useNavigationStore } from '@/stores/navigation';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const nav = useNavigationStore();
const router = useRouter();
const { canGestureBack, isSwipingBack, swipeProgress } = storeToRefs(nav);

let startX = 0;
let dragging = false;

function onStart(e: TouchEvent) {
  if (!canGestureBack.value) return;
  const touch = e.touches[0];
  startX = touch.clientX;
  // Edge area: 0~24 px
  if (startX <= 24) {
    dragging = true;
    nav.setSwipeState(true, 0);
  }
}

function onMove(e: TouchEvent) {
  if (!dragging) return;
  const x = e.touches[0].clientX;
  const delta = Math.max(0, x - startX);
  const progress = Math.min(1, delta / 120);
  nav.setSwipeState(true, progress);
}

function onEnd() {
  if (!dragging) return;
  dragging = false;
  const threshold = 0.35;
  if (nav.swipeProgress >= threshold) {
    nav.setIntent({ type: 'navigateBack', delta: 1 });
    router.go(-1);
  }
  nav.setSwipeState(false, 0);
}

function onCancel() {
  dragging = false;
  nav.setSwipeState(false, 0);
}

const layerStyle = computed(() => ({
  transform: isSwipingBack.value ? `translateX(${swipeProgress.value * 4}px)` : 'none'
}));

const shadowStyle = computed(() => ({
  opacity: String(Math.min(0.18, swipeProgress.value * 0.22))
}));
</script>

<style scoped>
.gesture-layer {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 28px; /* edge hit area */
  z-index: 20;
  background: transparent; /* could set debug rgba */
}

.swipe-shadow {
  pointer-events: none;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 8px;
  background: linear-gradient(90deg, rgba(0,0,0,.18), rgba(0,0,0,0));
  z-index: 19;
  opacity: 0;
  transition: opacity 120ms ease;
}
</style>

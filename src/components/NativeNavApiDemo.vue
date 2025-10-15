<template>
  <div class="demo">
    <button @click="nav.navigateTo({ name: 'Detail', params: { id: 100 } })">navigateTo</button>
    <button @click="nav.redirectTo({ name: 'Profile' })">redirectTo</button>
    <button @click="nav.switchTab({ name: 'Discover' })">switchTab</button>
    <button @click="nav.reLaunch({ name: 'Home' })">reLaunch</button>
    <button @click="nav.navigateBack(1)">navigateBack</button>
  </div>
</template>

<script setup lang="ts">
import { useNavigator } from '@/composables/useNavigation';
const nav = useNavigator();
</script>

<style scoped>
.demo { display: flex; gap: 8px; flex-wrap: wrap; }
button { padding: 6px 10px; }
</style>

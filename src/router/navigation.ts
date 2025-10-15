import type { Pinia } from 'pinia';
import type { Router, RouteLocationRaw } from 'vue-router';
import { useNavigationStore } from '@/stores/navigation';

export function createNavigator(router: Router, pinia: Pinia) {
  const nav = useNavigationStore(pinia);

  function normalize(target: RouteLocationRaw): RouteLocationRaw {
    return target;
  }

  return {
    async navigateTo(target: RouteLocationRaw) {
      nav.setIntent({ type: 'navigateTo' });
      await router.push(normalize(target));
    },
    async redirectTo(target: RouteLocationRaw) {
      nav.setIntent({ type: 'redirectTo' });
      await router.replace(normalize(target));
    },
    async reLaunch(target: RouteLocationRaw) {
      nav.setIntent({ type: 'reLaunch' });
      await router.replace(normalize(target));
      // Clear history visually by replacing again to ensure position stays minimal
      // (stack is already reset in store's afterEach)
    },
    async switchTab(target: RouteLocationRaw) {
      nav.setIntent({ type: 'switchTab' });
      await router.replace(normalize(target));
    },
    async navigateBack(delta = 1) {
      nav.setIntent({ type: 'navigateBack', delta });
      await router.go(-Math.abs(delta));
    }
  };
}

export type Navigator = ReturnType<typeof createNavigator>;

import type { App } from 'vue';
import { inject } from 'vue';
import { type Navigator } from '@/router/navigation';

export const NavigatorKey: unique symbol = Symbol('Navigator');

export function installNavigator(app: App, navigator: Navigator) {
  app.provide(NavigatorKey, navigator);
}

export function useNavigator(): Navigator {
  const nav = inject<Navigator>(NavigatorKey);
  if (!nav) {
    throw new Error('Navigator not provided');
  }
  return nav;
}

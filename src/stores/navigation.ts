import { defineStore } from 'pinia';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

export type TransitionDirection = 'forward' | 'back' | 'replace' | 'switch' | 'relaunch';
export type KeepAliveKeyStrategy = 'name' | 'fullPath';

export interface StackEntry {
  key: string; // cache/render key used by RouterView
  name?: string | symbol;
  path: string;
  fullPath: string;
  query: Record<string, any>;
  params: Record<string, any>;
  isTab: boolean;
  keepAlive: boolean;
  keepAliveKeyStrategy: KeepAliveKeyStrategy;
  keepAliveComponentName?: string; // must match SFC name for KeepAlive include
}

export type NavIntent =
  | { type: 'navigateTo' }
  | { type: 'redirectTo' }
  | { type: 'switchTab' }
  | { type: 'reLaunch' }
  | { type: 'navigateBack'; delta: number };

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    stack: [] as StackEntry[],
    tabRouteNames: new Set<string | symbol>(),
    activeTabName: undefined as string | symbol | undefined,
    transitionDirection: 'forward' as TransitionDirection,
    lastHistoryPosition: 0,
    includeComponentNames: new Set<string>(), // KeepAlive include
    navIntent: undefined as NavIntent | undefined,
    canGestureBack: false,
    isSwipingBack: false,
    swipeProgress: 0 // 0~1
  }),
  getters: {
    stackTop(state): StackEntry | undefined {
      return state.stack[state.stack.length - 1];
    },
    canGoBack(state): boolean {
      return state.stack.length > 1;
    }
  },
  actions: {
    initTabs(tabNames: Array<string | symbol>) {
      this.tabRouteNames = new Set(tabNames);
    },
    setActiveTab(name: string | symbol | undefined) {
      this.activeTabName = name;
    },
    setTransition(dir: TransitionDirection) {
      this.transitionDirection = dir;
    },
    setIntent(intent: NavIntent | undefined) {
      this.navIntent = intent;
    },
    setHistoryPosition(pos: number) {
      this.lastHistoryPosition = pos;
    },
    setGestureAvailability(can: boolean) {
      this.canGestureBack = can;
    },
    setSwipeState(isSwiping: boolean, progress: number) {
      this.isSwipingBack = isSwiping;
      this.swipeProgress = progress;
    },

    // Helpers to sync stack and cache
    makeEntryFromRoute(to: RouteLocationNormalizedLoaded): StackEntry {
      const isTab = !!to.meta.isTab;
      const keepAlive = !!to.meta.keepAlive;
      const strategy: KeepAliveKeyStrategy = (to.meta.keepAliveKeyStrategy as KeepAliveKeyStrategy) || 'name';
      const key = strategy === 'fullPath' ? to.fullPath : String(to.name || to.path);
      const keepAliveComponentName = (to.meta.keepAliveComponentName as string | undefined);
      return {
        key,
        name: to.name,
        path: to.path,
        fullPath: to.fullPath,
        query: to.query as Record<string, any>,
        params: to.params as Record<string, any>,
        isTab,
        keepAlive,
        keepAliveKeyStrategy: strategy,
        keepAliveComponentName
      };
    },

    ensureIncludeFor(entry: StackEntry) {
      if (entry.keepAlive && entry.keepAliveComponentName) {
        this.includeComponentNames.add(entry.keepAliveComponentName);
      }
    },

    removeIncludeFor(entry: StackEntry) {
      if (entry.keepAlive && entry.keepAliveComponentName) {
        this.includeComponentNames.delete(entry.keepAliveComponentName);
      }
    },

    // Guard hook: call in router.afterEach
    onAfterEach(to: RouteLocationNormalizedLoaded, from: RouteLocationNormalizedLoaded) {
      const toPos = (history.state && (history.state as any).position) || 0;
      const fromPos = this.lastHistoryPosition;

      let direction: TransitionDirection = 'forward';
      let appliedByIntent = false;

      if (this.navIntent) {
        appliedByIntent = true;
        switch (this.navIntent.type) {
          case 'navigateTo': direction = 'forward'; break;
          case 'redirectTo': direction = 'replace'; break;
          case 'switchTab': direction = 'switch'; break;
          case 'reLaunch': direction = 'relaunch'; break;
          case 'navigateBack': direction = 'back'; break;
        }
      } else {
        if (toPos > fromPos) direction = 'forward';
        else if (toPos < fromPos) direction = 'back';
        else direction = 'replace';
      }

      this.setTransition(direction);

      const toEntry = this.makeEntryFromRoute(to);

      if (this.navIntent?.type === 'switchTab') {
        // Clear to only the tab
        this.stack = [toEntry];
        this.setActiveTab(String(to.name || ''));
      } else if (this.navIntent?.type === 'reLaunch') {
        this.stack = [toEntry];
        this.setActiveTab(toEntry.isTab ? String(toEntry.name || '') : undefined);
      } else if (this.navIntent?.type === 'redirectTo' || direction === 'replace') {
        if (this.stack.length > 0) {
          this.stack[this.stack.length - 1] = toEntry;
        } else {
          this.stack.push(toEntry);
        }
      } else if (this.navIntent?.type === 'navigateBack' || direction === 'back') {
        const delta = this.navIntent?.type === 'navigateBack' ? this.navIntent.delta : Math.max(1, fromPos - toPos);
        const newLen = Math.max(1, this.stack.length - delta);
        this.stack = this.stack.slice(0, newLen);
        // Top becomes toEntry (ensure last is synced)
        if (!this.stack.length || this.stack[this.stack.length - 1].fullPath !== toEntry.fullPath) {
          this.stack[this.stack.length - 1] = toEntry;
        }
      } else {
        // navigateTo or forward
        this.stack.push(toEntry);
      }

      // maintain KeepAlive include set
      // Add current
      this.ensureIncludeFor(toEntry);
      // Optionally remove includes not present if their routes are not in stack and are not tabs with keepAlive
      const namesInStack = new Set(
        this.stack.filter(e => e.keepAlive && e.keepAliveComponentName).map(e => e.keepAliveComponentName as string)
      );
      for (const name of Array.from(this.includeComponentNames)) {
        if (!namesInStack.has(name)) {
          this.includeComponentNames.delete(name);
        }
      }

      // gesture availability
      this.setGestureAvailability(this.stack.length > 1);

      // cleanup intent and update position
      this.setIntent(undefined);
      this.setHistoryPosition(toPos);
    }
  }
});

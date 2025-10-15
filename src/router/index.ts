import { createRouter, createWebHistory, type Router, type RouteRecordRaw } from 'vue-router';
import type { Pinia } from 'pinia';
import { useNavigationStore } from '@/stores/navigation';

// Lazy pages
const Home = () => import('@/pages/Home.vue');
const Discover = () => import('@/pages/Discover.vue');
const Profile = () => import('@/pages/Profile.vue');
const Detail = () => import('@/pages/Detail.vue');

export const tabRouteNames = {
  Home: 'Home',
  Discover: 'Discover',
  Profile: 'Profile'
} as const;

export function createAppRouter(): Router {
  const routes: RouteRecordRaw[] = [
    {
      path: '/',
      redirect: { name: tabRouteNames.Home }
    },
    {
      path: '/home',
      name: tabRouteNames.Home,
      component: Home,
      meta: {
        isTab: true,
        keepAlive: true,
        keepAliveKeyStrategy: 'name',
        keepAliveComponentName: 'PageHome',
        transition: 'switch'
      }
    },
    {
      path: '/discover',
      name: tabRouteNames.Discover,
      component: Discover,
      meta: {
        isTab: true,
        keepAlive: true,
        keepAliveKeyStrategy: 'name',
        keepAliveComponentName: 'PageDiscover',
        transition: 'switch'
      }
    },
    {
      path: '/profile',
      name: tabRouteNames.Profile,
      component: Profile,
      meta: {
        isTab: true,
        keepAlive: true,
        keepAliveKeyStrategy: 'name',
        keepAliveComponentName: 'PageProfile',
        transition: 'switch'
      }
    },
    {
      path: '/detail/:id',
      name: 'Detail',
      component: Detail,
      props: true,
      meta: {
        isTab: false,
        keepAlive: true,
        // choose strategy: 'name' for reuse same instance per component, 'fullPath' for multi-instance cache
        keepAliveKeyStrategy: 'name',
        keepAliveComponentName: 'PageDetail'
      }
    }
  ];

  const router = createRouter({
    history: createWebHistory(),
    routes
  });

  return router;
}

export function installNavigationGuards(router: Router, pinia: Pinia) {
  const nav = useNavigationStore(pinia);

  router.afterEach((to, from) => {
    // Ensure tabs initialized
    nav.initTabs([tabRouteNames.Home, tabRouteNames.Discover, tabRouteNames.Profile]);
    nav.onAfterEach(to, from);
  });
}

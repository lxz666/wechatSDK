import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { createAppRouter, installNavigationGuards } from '@/router';
import { createNavigator } from '@/router/navigation';
import { installNavigator } from '@/composables/useNavigation';
import '@/styles/transitions.css';

const app = createApp(App);
const pinia = createPinia();
const router = createAppRouter();

installNavigationGuards(router, pinia);

app.use(pinia);
app.use(router);

// Provide custom navigator globally
const navigator = createNavigator(router, pinia);
installNavigator(app, navigator);

app.mount('#app');

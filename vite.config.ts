import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [VantResolver()],
      dts: 'auto-imports.d.ts',
      eslintrc: {
        enabled: false,
      },
      // 不添加 @ts-nocheck 注释
      vueTemplate: true,
    }),
    Components({
      resolvers: [VantResolver()],
      dts: 'components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: true,
    port: 5173
  }
});

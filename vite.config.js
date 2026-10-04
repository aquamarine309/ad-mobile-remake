import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import path from "path";


export default defineConfig(() => {
  return {
    plugins: [vue()],
    base: './',
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(import.meta.dirname, 'src') }
      ],
      extensions: ['.js', '.vue', '.json']
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    server: {
      port: 5173,
      hmr: { overlay: true }
    }
  }
})
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Determine base path for GitHub Pages deployment
const getBase = () => {
  if (process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
    return `/${repoName}/`;
  }
  if (process.env.NODE_ENV === 'production') {
    return '/Uniq-Ai-studio-mesh/';
  }
  return './';
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: getBase(),
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  // @ts-ignore
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  }
});

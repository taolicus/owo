import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../', 'VITE_');

  return {
    build: {
      outDir: env.VITE_OUTPUT_DIR || 'dist'
    }
  };
});
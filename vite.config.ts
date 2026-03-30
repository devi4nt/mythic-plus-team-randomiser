import { defineConfig } from 'vite-plus';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],

  // Linting (Oxlint — replaces ESLint)
  lint: {
    options: {
      typeAware: true
    }
  },

  // Formatting (Oxfmt — replaces Prettier)
  fmt: {
    singleQuote: true,
    semi: true,
    tabWidth: 2,
    printWidth: 100,
    trailingComma: 'none'
  },

  // Testing (Vitest — replaces vitest.config.ts)
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    exclude: ['e2e/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/**/__tests__/**', 'src/**/__mocks__/**', 'src/types/**']
    }
  }
});

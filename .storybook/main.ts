import { defineMain } from '@storybook/react-vite/node';

const config = defineMain({
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs', import.meta.resolve('./local-preset.ts')],
  framework: '@storybook/react-vite',
  viteFinal: async (config) => ({
    ...config,
    css: {
      ...config.css,
      modules: {
        ...config.css?.modules,
        generateScopedName: 'meta_[hash:base64:6]',
      },
    },
  }),
});

export default config;

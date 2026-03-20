import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/react-vite",
  async viteFinal(config) {
    config.resolve ??= {};
    config.resolve.alias = [
      { find: '@/ui', replacement: path.resolve(dirname, '../src/components/ui') },
      { find: '@', replacement: path.resolve(dirname, '../src') },
      ...(Array.isArray(config.resolve.alias) ? config.resolve.alias : []),
    ];

    return config;
  }
};
export default config;
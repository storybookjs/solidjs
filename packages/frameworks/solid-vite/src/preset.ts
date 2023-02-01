import { hasVitePlugins } from '@storybook/builder-vite';
import type { PresetProperty } from '@storybook/types';
import type { StorybookConfig } from './types';

export const core: PresetProperty<'core', StorybookConfig> = {
  builder: '@storybook/builder-vite',
  renderer: 'storybook-solidjs',
};

export const viteFinal: StorybookConfig['viteFinal'] = async (config) => {
  const { plugins = [] } = config;

  // Add solid plugin if not present
  if (!(await hasVitePlugins(plugins, ['vite-plugin-solid']))) {
    const { default: solidPlugin } = await import('vite-plugin-solid');
    plugins.push(solidPlugin());
  }

  return config;
};

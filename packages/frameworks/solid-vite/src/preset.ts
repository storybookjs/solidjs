import { dirname, join } from 'node:path';

/**
 * A preset is a configuration that enables developers to quickly set up and
 * customize their environment with a specific set of features, functionalities, or integrations.
 *
 * @see https://storybook.js.org/docs/addons/writing-presets
 * @see https://storybook.js.org/docs/api/main-config/main-config
 */

import { hasVitePlugins } from '@storybook/builder-vite';
import type { PresetProperty } from '@storybook/types';
//import { solidDocgen } from './plugins/solid-docgen';
import type { StorybookConfig } from './types';

// Helper for getting the location of dependencies.
const getAbsolutePath = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as I;

/**
 * Configures Storybook's internal features.
 *
 * @see https://storybook.js.org/docs/api/main-config/main-config-core
 */
export const core: PresetProperty<'core', StorybookConfig> = {
  builder: getAbsolutePath('@storybook/builder-vite'),
  renderer: getAbsolutePath('storybook-solidjs'),
};

/**
 * Customize Storybook's Vite setup when using the Vite builder.
 *
 * @see https://storybook.js.org/docs/api/main-config/main-config-vite-final
 */
export const viteFinal: StorybookConfig['viteFinal'] = async (config) => {
  const { plugins = [] } = config;

  // Add solid plugin if not present
  if (!(await hasVitePlugins(plugins, ['vite-plugin-solid']))) {
    const { default: solidPlugin } = await import('vite-plugin-solid');
    plugins.push(solidPlugin());

    // Docgen plugin is prioritized as first pluging to be loaded for having file raw code.
    // plugins.unshift(solidDocgen());
  }

  return config;
};

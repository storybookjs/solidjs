import { join } from 'node:path';

import type { PresetProperty } from '@storybook/types';

export const previewAnnotations: PresetProperty<'previewAnnotations'> = async (
  input = [],
  options,
) => {
  const docsConfig = await options.presets.apply('docs', {}, options);
  const docsEnabled = Object.keys(docsConfig).length > 0;
  const result: string[] = [];

  return result
    .concat(input)
    .concat([join(__dirname, 'entry-preview.mjs')])
    .concat(docsEnabled ? [join(__dirname, 'entry-preview-docs.mjs')] : []);
};

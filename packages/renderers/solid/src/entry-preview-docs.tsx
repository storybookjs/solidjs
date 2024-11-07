/* Configuration for doc-mode renderer (`storybook dev --docs`). */

import {
  enhanceArgTypes,
  extractComponentDescription,
} from '@storybook/docs-tools';
import { sourceDecorator } from './docs/sourceDecorator';
import type { Decorator, SolidRenderer } from './public-types';
import { ArgTypesEnhancer } from '@storybook/types';

export const parameters = {
  docs: {
    story: { inline: true },
    extractComponentDescription, //TODO solid-docgen plugin needs to be created.
  },
};

export const decorators: Decorator[] = [sourceDecorator];

export const argTypesEnhancers: ArgTypesEnhancer<SolidRenderer>[] = [
  enhanceArgTypes,
];

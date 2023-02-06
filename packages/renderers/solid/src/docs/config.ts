import {
  extractComponentDescription,
  enhanceArgTypes,
} from '@storybook/docs-tools';
import { jsxDecorator } from './jsxDecorator';

export const decorators = [jsxDecorator];

export const parameters = {
  docs: {
    story: { inline: true },
    extractComponentDescription, //TODO solid-docgen plugin needs to be created.
  },
};

export const argTypesEnhancers = [enhanceArgTypes];

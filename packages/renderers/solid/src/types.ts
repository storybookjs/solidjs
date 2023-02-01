import type { Component, JSXElement } from 'solid-js';
import type { WebRenderer } from '@storybook/types';

export type { RenderContext } from '@storybook/types';
export type { StoryContext } from '@storybook/types';

/**
 * @deprecated Use `SolidRenderer` instead.
 */
export type SolidFramework = SolidRenderer;
export interface SolidRenderer extends WebRenderer {
  component: Component<this['T']>;
  storyResult: StoryFnSolidReturnType;
}

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export type StoryFnSolidReturnType = JSXElement;

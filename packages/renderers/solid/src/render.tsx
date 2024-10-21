import { ArgsStoryFn } from '@storybook/types';
import { SolidRenderer } from './types';

/**
 * Default render function for a story definition (inside a csf file) without
 * a render function. e.g:
 * ```typescript
 * export const StoryExample = {
 *  args: {
 *    disabled: true,
 *    children: "Hello World",
 *  },
 * };
 * ```
 */
export const render: ArgsStoryFn<SolidRenderer> = (_, context) => {
  const { id, component: Component } = context;

  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`,
    );
  }

  // context.args is a SolidJS proxy thanks to the solidReactivityDecorator.
  return <Component {...context.args} />;
};

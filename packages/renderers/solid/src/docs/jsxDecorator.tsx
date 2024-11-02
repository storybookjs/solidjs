import type { StoryContext, PartialStoryFn } from '@storybook/types';
import { SolidRenderer } from '../types';

export const jsxDecorator = (
  storyFn: PartialStoryFn<SolidRenderer>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: StoryContext<SolidRenderer>,
) => {
  //TODO: needs research about how to generate raw JSX from a solid component
  //due to it lacks of a vdom.
  const story = storyFn();

  return story;
};

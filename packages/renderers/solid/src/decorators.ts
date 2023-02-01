import type { Args, DecoratorFunction, PartialStoryFn, StoryContext } from '@storybook/csf';
import type { SolidRenderer } from './types';
import { decorators as docsDecorators } from './docs/config';
import { solidReactivityDecorator } from './render';

export const allDecorators = [solidReactivityDecorator, ...docsDecorators];

export const applyDecorators = (
  storyFn: PartialStoryFn<SolidRenderer, Args>,
  decorators: DecoratorFunction<SolidRenderer, Args>[]
) => {
  return decorators.reduce(
    (decoratedStoryFn, decorator) => (context: StoryContext<SolidRenderer>) => {
      return decorator(() => decoratedStoryFn(context), context);
    },
    (context: StoryContext<SolidRenderer>) => storyFn(context)
  );
};

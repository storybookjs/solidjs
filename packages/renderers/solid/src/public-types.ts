/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AnnotatedStoryFn,
  Args,
  ArgsFromMeta,
  ArgsStoryFn,
  ComponentAnnotations,
  DecoratorFunction,
  LoaderFunction,
  ProjectAnnotations,
  StoryAnnotations,
  StoryContext as GenericStoryContext,
  StrictArgs,
} from '@storybook/types';
import type { ComponentProps, Component as ComponentType } from 'solid-js';
import type { SetOptional, Simplify } from 'type-fest';
import type { SolidRenderer } from './types';

export type { Args, ArgTypes, Parameters, StrictArgs } from '@storybook/types';
export type { SolidRenderer };

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<TCmpOrArgs = Args> =
  TCmpOrArgs extends ComponentType<any>
    ? ComponentAnnotations<SolidRenderer, ComponentProps<TCmpOrArgs>>
    : ComponentAnnotations<SolidRenderer, TCmpOrArgs>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<TCmpOrArgs = Args> =
  TCmpOrArgs extends ComponentType<any>
    ? AnnotatedStoryFn<SolidRenderer, ComponentProps<TCmpOrArgs>>
    : AnnotatedStoryFn<SolidRenderer, TCmpOrArgs>;

/**
 * Story function that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<TMetaOrCmpOrArgs = Args> = TMetaOrCmpOrArgs extends {
  render?: ArgsStoryFn<SolidRenderer, any>;
  component?: infer Component;
  args?: infer DefaultArgs;
}
  ? Simplify<
      (Component extends ComponentType<any>
        ? ComponentProps<Component>
        : unknown) &
        ArgsFromMeta<SolidRenderer, TMetaOrCmpOrArgs>
    > extends infer TArgs
    ? StoryAnnotations<
        SolidRenderer,
        TArgs,
        SetOptional<
          TArgs,
          keyof TArgs & keyof (DefaultArgs & ActionArgs<TArgs>)
        >
      >
    : never
  : TMetaOrCmpOrArgs extends ComponentType<any>
    ? StoryAnnotations<SolidRenderer, ComponentProps<TMetaOrCmpOrArgs>>
    : StoryAnnotations<SolidRenderer, TMetaOrCmpOrArgs>;

type ActionArgs<TArgs> = {
  // This can be read as: filter TArgs on functions where we can assign a void function to that function.
  // The docs addon argsEnhancers can only safely provide a default value for void functions.
  // Other kind of required functions should be provided by the user.
  [P in keyof TArgs as TArgs[P] extends (...args: any[]) => any
    ? ((...args: any[]) => void) extends TArgs[P]
      ? P
      : never
    : never]: TArgs[P];
};

export type Decorator<TArgs = StrictArgs> = DecoratorFunction<
  SolidRenderer,
  TArgs
>;
export type Loader<TArgs = StrictArgs> = LoaderFunction<SolidRenderer, TArgs>;
export type StoryContext<TArgs = StrictArgs> = GenericStoryContext<
  SolidRenderer,
  TArgs
>;
export type Preview = ProjectAnnotations<SolidRenderer>;

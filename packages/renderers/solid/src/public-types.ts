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
import type { ComponentProps, Component as ComponentType, JSX } from 'solid-js';
import type { SetOptional, Simplify } from 'type-fest';
import type { SolidRenderer } from './types';

export type { Args, ArgTypes, Parameters, StrictArgs } from '@storybook/types';
export type { SolidRenderer };

type JSXElement = keyof JSX.IntrinsicElements;

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<TCmpOrArgs = Args> = TCmpOrArgs extends ComponentType<any>
  ? ComponentAnnotations<SolidRenderer, ComponentProps<TCmpOrArgs>>
  : ComponentAnnotations<SolidRenderer, TCmpOrArgs>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<TCmpOrArgs = Args> = TCmpOrArgs extends ComponentType<any>
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

/**
 * @deprecated Use `Meta` instead, e.g. ComponentMeta<typeof Button> -> Meta<typeof Button>.
 *
 * For the common case where a component's stories are simple components that receives args as props:
 *
 * ```tsx
 * export default { ... } as ComponentMeta<typeof Button>;
 * ```
 */
export type ComponentMeta<T extends JSXElement> = Meta<ComponentProps<T>>;

/**
 * @deprecated Use `StoryFn` instead, e.g. ComponentStoryFn<typeof Button> -> StoryFn<typeof Button>.
 * Use `StoryObj` if you want to migrate to CSF3, which uses objects instead of functions to represent stories.
 * You can read more about the CSF3 format here: https://storybook.js.org/blog/component-story-format-3-0/
 *
 * For the common case where a (CSFv2) story is a simple component that receives args as props:
 *
 * ```tsx
 * const Template: ComponentStoryFn<typeof Button> = (args) => <Button {...args} />
 * ```
 */
export type ComponentStoryFn<T extends JSXElement> = StoryFn<ComponentProps<T>>;

/**
 * @deprecated Use `StoryObj` instead, e.g. ComponentStoryObj<typeof Button> -> StoryObj<typeof Button>.
 *
 * For the common case where a (CSFv3) story is a simple component that receives args as props:
 *
 * ```tsx
 * const MyStory: ComponentStoryObj<typeof Button> = {
 *   args: { buttonArg1: 'val' },
 * }
 * ```
 */
export type ComponentStoryObj<T extends JSXElement> = StoryObj<
  ComponentProps<T>
>;

/**
 * @deprecated Use `StoryFn` instead.
 * Use `StoryObj` if you want to migrate to CSF3, which uses objects instead of functions to represent stories.
 * You can read more about the CSF3 format here: https://storybook.js.org/blog/component-story-format-3-0/
 *
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<TArgs = Args> = StoryFn<TArgs>;

/**
 * @deprecated Use `StoryFn` instead, e.g. ComponentStory<typeof Button> -> StoryFn<typeof Button>.
 * Use `StoryObj` if you want to migrate to CSF3, which uses objects instead of functions to represent stories
 * You can read more about the CSF3 format here: https://storybook.js.org/blog/component-story-format-3-0/.
 *
 * For the common case where a (CSFv3) story is a simple component that receives args as props:
 *
 * ```tsx
 * const MyStory: ComponentStory<typeof Button> = {
 *   args: { buttonArg1: 'val' },
 * }
 * ```
 */
export type ComponentStory<T extends JSXElement> = ComponentStoryFn<T>;

/**
 * @deprecated Use Decorator instead.
 */
export type DecoratorFn = DecoratorFunction<SolidRenderer>;
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
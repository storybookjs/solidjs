import type { Component } from 'solid-js';
import { ErrorBoundary, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import { render as solidRender } from 'solid-js/web';
import type { RenderContext, ArgsStoryFn, Args, StoryFn } from '@storybook/types';
import type { SolidRenderer, StoryContext } from './types';

/**
 * SolidJS store for handling fine grained updates
 * of the story args.
 */
const [store, setStore] = createStore({
  args: {} as Args & StoryContext<SolidRenderer>,
});

let globals: StoryContext<SolidRenderer>['globals'];

/**
 * Checks when the story requires to be remounted.
 * Elements outside the story requires a whole re-render.
 * e.g. dark theme, show grid, etc...
 */
const remount = (force: boolean, context: StoryContext<SolidRenderer>) => {
  let flag = false;

  if (force) {
    flag = true;
  } else if (!Object.is(globals, context.globals)) {
    // Globals refers to storybook visualization options.
    globals = context.globals;
    flag = true;
  }
  return flag;
};

/**
 * Decorator for intercepting context args for converting them into
 * a reactive store for fine grained updates.
 */
export const solidReactivityDecorator = (
  storyFn: StoryFn<SolidRenderer, Args>,
  context: StoryContext<SolidRenderer>
) => {
  context.args = store.args;
  return storyFn(context.args as Args & StoryContext<SolidRenderer>, context);
};

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
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  return <Component {...context.args} />;
};

/**
 * Dispose function for re-rendering the whole SolidJS app
 * when a story (storyId) is changed / remounted.
 */
let disposeStory: (() => void) | undefined;

/**
 * Main renderer function for initializing the SolidJS app
 * with the story content.
 */
export async function renderToCanvas(
  {
    unboundStoryFn,
    storyContext,
    showMain,
    showException,
    forceRemount,
  }: RenderContext<SolidRenderer>,
  canvasElement: SolidRenderer['canvasElement']
) {
  /**
   * Store is updated for fine grained updates.
   */
  setStore('args', storyContext.args);

  /**
   * If remount is required, the whole root node is re-rendered.
   */
  if (remount(forceRemount, storyContext)) {
    disposeStory?.();
  } else {
    // Fine grained updates are passed from the store.
    return;
  }

  const Story = unboundStoryFn as Component<StoryContext<SolidRenderer>>;

  const App: Component = () => {
    onMount(() => {
      showMain();
    });

    return (
      <ErrorBoundary
        fallback={(err) => {
          showException(err);
          return err;
        }}
      >
        <Story {...storyContext} />
      </ErrorBoundary>
    );
  };

  disposeStory = solidRender(() => <App />, canvasElement as HTMLElement);
}

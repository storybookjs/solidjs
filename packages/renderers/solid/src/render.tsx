import type { Component } from 'solid-js';
import { ErrorBoundary, onMount } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { render as solidRender } from 'solid-js/web';
import type {
  RenderContext,
  ArgsStoryFn,
  Args,
  StoryFn,
} from '@storybook/types';
import type { ComponentsData, SolidRenderer, StoryContext } from './types';

/**
 * SolidJS store for handling fine grained updates
 * of the components data as f.e. story args.
 */
const [store, setStore] = createStore({} as ComponentsData);

//Global variables
let globals: StoryContext<SolidRenderer>['globals']; //Storybook view configurations.
let componentId: string; //Unique component story id.
let viewMode: string; //It can be story or docs.

/**
 * Checks when the story requires to be remounted.
 * Elements outside the story requires a whole re-render.
 * e.g. dark theme, show grid, etc...
 */
const remount = (force: boolean, context: StoryContext<SolidRenderer>) => {
  // Story view mode has changed
  if (viewMode !== context.viewMode) {
    viewMode = context.viewMode;
    return true;
  }

  // Force flag is set to true.
  if (force) {
    return true;
  }

  // Globals refers to storybook visualization options.
  if (!Object.is(globals, context.globals)) {
    globals = context.globals;
    return true;
  }

  // Story main url id has changed
  if (componentId !== context.componentId) {
    componentId = context.componentId;
    return true;
  }

  return false;
};

/**
 * Decorator for intercepting context args for converting them into
 * a reactive store for fine grained updates.
 */
export const solidReactivityDecorator = (
  storyFn: StoryFn<SolidRenderer, Args>,
  context: StoryContext<SolidRenderer>
) => {
  let storyId = context.canvasElement.id;
  context.args = store[storyId].args;
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

  //context.args is a SolidJS proxy thanks to the solidReactivityDecorator.
  return <Component {...context.args} />;
};

/**
 * Dispose function for re-rendering the whole SolidJS app
 * when a story (storyId) is changed / remounted.
 */
let disposeFns: Array<() => void> = [];
let disposeAllStories = () => {
  disposeFns.forEach((dispose) => dispose());
  disposeFns = [];
};

/**
 * Resets reactive store
 */
const cleanStore = () => {
  setStore(reconcile({}));
};

/**
 * This function resets the canvas and reactive store.
 */
const cleanCanvas = () => {
  cleanStore();
  disposeAllStories();
};

/**
 * Main renderer function for initializing the SolidJS app
 * with the story content.
 */
export async function renderToCanvas(
  renderContext: RenderContext<SolidRenderer>,
  canvasElement: SolidRenderer['canvasElement']
) {
  const { unboundStoryFn, storyContext, showMain, showException } =
    renderContext;
  let forceRemount = renderContext.forceRemount;
  let storyId = storyContext.canvasElement.id;

  //Initializes global default values for checking remounting.
  if (viewMode === undefined) viewMode = storyContext.viewMode;
  if (globals === undefined) globals = storyContext.globals;
  if (componentId === undefined) componentId = storyContext.componentId;

  // In docs mode, forceRemount is always false because many stories are
  // rendered at same time.
  if (storyContext.viewMode === 'docs') forceRemount = false;

  // Story is remounted given the conditions.
  if (remount(forceRemount, storyContext)) {
    cleanCanvas();
  }

  // Story store data is updated
  if (store[storyId] !== undefined) {
    setStore(storyId, 'args', storyContext.args);
  }

  // Story is rendered and store data is created
  if (store[storyId] === undefined) {
    setStore({ [storyId]: { args: storyContext.args } });

    const App: Component = () => {
      const Story = unboundStoryFn as Component<StoryContext<SolidRenderer>>;

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

    const disposeFn = solidRender(() => <App />, canvasElement as HTMLElement);
    disposeFns.push(disposeFn);
  }
}

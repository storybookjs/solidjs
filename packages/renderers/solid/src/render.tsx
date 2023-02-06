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

// Delay util fn
const delay = async (ms: number = 20) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

// Global variables
let globals: StoryContext<SolidRenderer>['globals']; //Storybook view configurations.
let componentId: string; //Unique component story id.
let viewMode: string; //It can be story or docs.

/**
 * Checks when the story requires to be remounted.
 * Elements outside the story requires a whole re-render.
 * e.g. dark theme, show grid, etc...
 */
const remount = (force: boolean, context: StoryContext<SolidRenderer>) => {
  let flag = false;

  // Story view mode has changed
  if (viewMode !== context.viewMode) flag = true;

  // Force flag is set to true.
  if (force) flag = true;

  // Globals refers to storybook visualization options.
  if (!Object.is(globals, context.globals)) flag = true;

  // Story main url id has changed
  if (componentId !== context.componentId) {
    flag = true;
    unmountAll();
  }

  // Global values are updated when remount is true
  if (flag === true) {
    viewMode = context.viewMode;
    globals = context.globals;
    componentId = context.componentId;
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

  // context.args is a SolidJS proxy thanks to the solidReactivityDecorator.
  return <Component {...context.args} />;
};

/**
 * All stories are disposed.
 */
let disposeAllStories = () => {
  Object.keys(store).forEach((storyId) => {
    store[storyId]?.disposeFn?.();
  });
};

/**
 * Resets reactive store
 */
const cleanStore = () => {
  setStore(reconcile({}));
};

/**
 * Unmounts all the store and rendered solid apps
 */
const unmountAll = () => {
  disposeAllStories();
  cleanStore();
};

/**
 * Resets an specific story store.
 */
const cleanStoryStore = (storeId: string) => {
  setStore({ [storeId]: { args: {}, rendered: false, disposeFn: () => {} } });
};

/**
 * Disposes an specific story.
 */
const disposeStory = (storeId: string) => {
  store[storeId]?.disposeFn?.();
};

/**
 * This function resets the canvas and reactive store for an specific story.
 */
const remountStory = (storyId: string) => {
  disposeStory(storyId);
  cleanStoryStore(storyId);
};

/**
 * Checks if the story store exists
 */
const storyIsRendered = (storyId: string) => Boolean(store[storyId]?.rendered);

/**
 * Checks if the story is in docs mode.
 */
const isDocsMode = (context: StoryContext<SolidRenderer, Args>) =>
  context.viewMode === 'docs';

/**
 * Renders solid App into DOM.
 */
const renderSolidApp = (
  storyId: string,
  renderContext: RenderContext<SolidRenderer>,
  canvasElement: SolidRenderer['canvasElement']
) => {
  const { storyContext, unboundStoryFn, showMain, showException } =
    renderContext;

  setStore(storyId, 'rendered', true);

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

  return solidRender(() => <App />, canvasElement as HTMLElement);
};

/**
 * Main renderer function for initializing the SolidJS app
 * with the story content.
 */
export async function renderToCanvas(
  renderContext: RenderContext<SolidRenderer>,
  canvasElement: SolidRenderer['canvasElement']
) {
  const { storyContext } = renderContext;
  let forceRemount = renderContext.forceRemount;
  let storyId = storyContext.canvasElement.id;

  // Initializes global default values for checking remounting.
  if (viewMode === undefined) viewMode = storyContext.viewMode;
  if (globals === undefined) globals = storyContext.globals;
  if (componentId === undefined) componentId = storyContext.componentId;

  // Story is remounted given the conditions.
  if (remount(forceRemount, storyContext)) {
    remountStory(storyId);
  }

  // Story store data is updated
  setStore(storyId, 'args', storyContext.args);

  // Story is rendered and store data is created
  if (storyIsRendered(storyId) === false) {
    // Delays the first render for waiting dom nodes
    // for rendering all the stories in docs mode when global changes.
    if (isDocsMode(storyContext)) await delay();

    const disposeFn = renderSolidApp(storyId, renderContext, canvasElement);
    setStore(storyId, (prev) => ({ ...prev, disposeFn }));
  }
}

/* eslint-disable prefer-destructuring */
import { start } from '@storybook/preview-api';
import type { Addon_ClientStoryApi, Addon_Loadable } from '@storybook/types';

import { render, renderToCanvas } from './render';
import type { SolidRenderer } from './types';

interface ClientApi extends Addon_ClientStoryApi<SolidRenderer['storyResult']> {
  configure(loader: Addon_Loadable, module: NodeModule): void;
  forceReRender(): void;
  raw: () => any; // todo add type
}
const RENDERER = 'solid';

const api = start<SolidRenderer>(renderToCanvas, { render });

export const storiesOf: ClientApi['storiesOf'] = (kind, m) => {
  return (
    api.clientApi.storiesOf(kind, m) as ReturnType<ClientApi['storiesOf']>
  ).addParameters({
    renderer: RENDERER,
  });
};

export const configure: ClientApi['configure'] = (...args) =>
  api.configure(RENDERER, ...args);
export const forceReRender: ClientApi['forceReRender'] = api.forceReRender;
export const raw: ClientApi['raw'] = api.clientApi.raw;

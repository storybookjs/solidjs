/* Configuration for default renderer. */

import { Decorator } from './public-types';
import { solidReactivityDecorator } from './renderToCanvas';

export const parameters = { renderer: 'solid' };
export { render } from './render';
export { renderToCanvas } from './renderToCanvas';

export const decorators: Decorator[] = [solidReactivityDecorator];

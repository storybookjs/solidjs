import { parameters as docsParams } from './docs/config';

export const parameters = { framework: 'solid', ...docsParams };

export { argTypesEnhancers } from './docs/config';
export { renderToCanvas, render } from './render';
export { allDecorators as decorators, applyDecorators } from './decorators';

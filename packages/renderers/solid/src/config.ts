import { parameters as docsParams } from './docs/config';

export const parameters = { renderer: 'solid', ...docsParams };

export { argTypesEnhancers } from './docs/config';
export { render, renderToCanvas } from './render';
export { allDecorators as decorators, applyDecorators } from './decorators';

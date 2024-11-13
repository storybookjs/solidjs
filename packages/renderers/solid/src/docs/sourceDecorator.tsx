/* eslint-disable @typescript-eslint/no-explicit-any */

// @babel/standalone does not export types,
// so this file is a mess of anys.

import type { StoryContext, PartialStoryFn } from '@storybook/types';
import { SolidRenderer } from '../types';

import { SNIPPET_RENDERED, SourceType } from '@storybook/docs-tools';
import { addons, useEffect } from '@storybook/preview-api';

// @ts-expect-error Types are not up to date
import * as Babel from '@babel/standalone';
const parser = Babel.packages.parser;
const generate = Babel.packages.generator.default;
const t = Babel.packages.types;

function skipSourceRender(context: StoryContext<SolidRenderer>): boolean {
  const sourceParams = context?.parameters.docs?.source;
  const isArgsStory = context?.parameters.__isArgsStory;

  // always render if the user forces it
  if (sourceParams?.type === SourceType.DYNAMIC) {
    return false;
  }

  // never render if the user is forcing the block to render code, or
  // if the user provides code, or if it's not an args story.
  return (
    !isArgsStory || sourceParams?.code || sourceParams?.type === SourceType.CODE
  );
}

/**
 * Generate JSX source code from stories.
 */
export const sourceDecorator = (
  storyFn: PartialStoryFn<SolidRenderer>,
  ctx: StoryContext<SolidRenderer>,
) => {
  // Strategy: Since SolidJS doesn't have a VDOM,
  // it isn't possible to get information directly about inner components.
  // Instead, there needs to be an altered render function
  // that records information about component properties,
  // or source code extraction from files.
  // This decorator uses the latter technique.
  // By using the source code string generated by CSF-tools,
  // we can then parse the properties of the `args` object,
  // and return the source slices.

  // Note: this also means we are limited in how we can
  // get the component name.
  // Since Storybook doesn't do source code extraction for
  // story metas (yet), we can use the title for now.
  const channel = addons.getChannel();
  const story = storyFn();
  const skip = skipSourceRender(ctx);

  let source: string | null = null;

  useEffect(() => {
    if (!skip && source) {
      const { id, unmappedArgs } = ctx;
      channel.emit(SNIPPET_RENDERED, { id, args: unmappedArgs, source });
    }
  });

  if (skip) return story;

  const docs = ctx?.parameters?.docs;
  const src = docs?.source?.originalSource;
  const name = ctx.title.split('/').at(-1)!;

  try {
    source = generateSolidSource(name, src);
  } catch (e) {
    console.error(e);
  }

  return story;
};

/**
 * Generate Solid JSX from story source.
 */
export function generateSolidSource(name: string, src: string): string {
  const ast = parser.parseExpression(src, { plugins: ['jsx', 'typescript'] });
  const { attributes, children, original } = parseArgs(ast);
  const render = parseRender(ast);

  // If there is a render function, display it to the best of our ability.
  if (render) {
    const { body, params } = render;
    let newSrc = '';

    // Add arguments declaration.
    if (params[0]) {
      const args = original ?? {
        type: 'ObjectExpression',
        properties: [],
      };

      const argsStatement = {
        type: 'VariableDeclaration',
        kind: 'const',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: {
              type: 'Identifier',
              name: params[0],
            },
            init: args,
          },
        ],
      };

      newSrc += generate(argsStatement, { compact: false }).code + '\n\n';
    }

    // Add context declaration.
    if (params[1]) {
      const ctxStatement = {
        type: 'VariableDeclaration',
        kind: 'var',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: {
              type: 'Identifier',
              name: params[1],
            },
          },
        ],
      };

      newSrc += generate(ctxStatement, { compact: false }).code + '\n\n';
    }

    newSrc += generate(body, { compact: false }).code;

    return newSrc;
  }

  // Otherwise, render a component with the arguments.

  const selfClosing = children == null || children.length == 0;

  const component = {
    type: 'JSXElement',
    openingElement: {
      type: 'JSXOpeningElement',
      name: {
        type: 'JSXIdentifier',
        name,
      },
      attributes: attributes,
      selfClosing,
    },
    children: children ?? [],
    closingElement: selfClosing
      ? undefined
      : {
          type: 'JSXClosingElement',
          name: {
            type: 'JSXIdentifier',
            name,
          },
        },
  };

  return generate(component, { compact: false }).code;
}

/**
 * Convert any AST node to a JSX child node.
 */
function toJSXChild(node: any): object {
  if (
    t.isJSXElement(node) ||
    t.isJSXText(node) ||
    t.isJSXExpressionContainer(node) ||
    t.isJSXSpreadChild(node) ||
    t.isJSXFragment(node)
  ) {
    return node;
  }

  if (t.isStringLiteral(node)) {
    return {
      type: 'JSXText',
      value: node.value,
    };
  }

  if (t.isExpression(node)) {
    return {
      type: 'JSXExpressionContainer',
      expression: node,
    };
  }

  return {
    type: 'JSXExpressionContainer',
    expression: t.jsxEmptyExpression(),
  };
}
/** Story render function. */
interface SolidRender {
  body: object;
  params: string[];
}

function parseRender(ast: any): SolidRender | null {
  if (ast.type != 'ObjectExpression') throw 'Expected `ObjectExpression` type';
  // Find render property.
  const renderProp = ast.properties.find((v: any) => {
    if (v.type != 'ObjectProperty') return false;
    if (v.key.type != 'Identifier') return false;
    return v.key.name == 'render';
  }) as any | undefined;
  if (!renderProp) return null;

  const renderFn = renderProp.value;
  if (
    renderFn.type != 'ArrowFunctionExpression' &&
    renderFn.type != 'FunctionExpression'
  ) {
    console.warn('`render` property is not a function, skipping...');
    return null;
  }

  return {
    body: renderFn.body,
    params: renderFn.params.map((x: any) => x.name),
  };
}

/** Story arguments. */
interface SolidArgs {
  attributes: object[];
  children: object[] | null;
  original: object | null;
}

/**
 * Parses component arguments from source expression.
 *
 * The source code will be in the form of a `Story` object.
 */
function parseArgs(ast: any): SolidArgs {
  if (ast.type != 'ObjectExpression') throw 'Expected `ObjectExpression` type';
  // Find args property.
  const argsProp = ast.properties.find((v: any) => {
    if (v.type != 'ObjectProperty') return false;
    if (v.key.type != 'Identifier') return false;
    return v.key.name == 'args';
  }) as any | undefined;
  // No args, so there aren't any properties or children.
  if (!argsProp)
    return {
      attributes: [],
      children: null,
      original: null,
    };
  // Get arguments.
  const original = argsProp.value;
  if (original.type != 'ObjectExpression')
    throw 'Expected `ObjectExpression` type';

  // Construct props object, where values are source code slices.
  const attributes: object[] = [];
  let children: object[] | null = null;
  for (const el of original.properties) {
    let attr: object | null = null;

    switch (el.type) {
      case 'ObjectProperty':
        if (el.key.type != 'Identifier') {
          console.warn('Encountered computed key, skipping...');
          continue;
        }
        if (el.key.name == 'children') {
          children = [toJSXChild(el.value)];
          continue;
        }

        attr = parseProperty(el);
        break;
      case 'ObjectMethod':
        attr = parseMethod(el);
        break;
      case 'SpreadElement':
        // Spread elements use external values, should not be used.
        console.warn('Encountered spread element, skipping...');
        continue;
    }

    if (attr) {
      attributes.push(attr);
    }
  }

  return { attributes, children, original };
}

/**
 * Parse an object property.
 *
 * JSX flag attributes are mapped from boolean literals.
 */
function parseProperty(el: any): object | null {
  let value: any = {
    type: 'JSXExpressionContainer',
    expression: el.value,
  };

  if (el.value.type == 'BooleanLiteral' && el.value.value == true) {
    value = undefined;
  }

  return {
    type: 'JSXAttribute',
    name: {
      type: 'JSXIdentifier',
      name: el.key.name,
    },
    value,
  };
}

/**
 * Parse an object method.
 *
 * Note that object methods cannot be generators.
 * This means that methods can be mapped straight to arrow functions.
 */
function parseMethod(el: any): object | null {
  if (el.kind != 'method') {
    console.warn('Encountered getter or setter, skipping...');
    return null;
  }

  if (el.key.type != 'Identifier') {
    console.warn('Encountered computed key, skipping...');
    return null;
  }

  const { params, body, async, returnType, typeParameters } = el;

  return {
    type: 'JSXAttribute',
    name: {
      type: 'JSXIdentifier',
      name: el.key.name,
    },
    value: {
      type: 'JSXExpressionContainer',
      expression: {
        type: 'ArrowFunctionExpression',
        params,
        body,
        async,
        expression: false,
        returnType,
        typeParameters,
      },
    },
  };
}

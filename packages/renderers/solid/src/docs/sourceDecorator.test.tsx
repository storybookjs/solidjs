import { afterAll, describe, expect, test, vi } from 'vitest';
import { generateSolidSource } from './sourceDecorator';

test('plain component', () => {
  const newSrc1 = generateSolidSource('Component', '{ }');

  expect(newSrc1).toMatchInlineSnapshot(`"<Component />"`);

  const newSrc2 = generateSolidSource('Component', '{ args: { } }');

  expect(newSrc2).toMatchInlineSnapshot(`"<Component />"`);
});

test('component with props', () => {
  const newSrc = generateSolidSource(
    'Component',
    '{ args: { foo: 32, bar: "Hello" } }',
  );

  expect(newSrc).toMatchInlineSnapshot(
    `"<Component foo={32} bar={"Hello"} />"`,
  );
});

test('component with children', () => {
  const newSrc = generateSolidSource(
    'Component',
    '{ args: { children: "Hello" } }',
  );

  expect(newSrc).toMatchInlineSnapshot(`"<Component>Hello</Component>"`);
});

test('component with true prop', () => {
  const newSrc = generateSolidSource('Component', '{ args: { foo: true } }');

  expect(newSrc).toMatchInlineSnapshot(`"<Component foo />"`);
});

test('component with props and children', () => {
  const newSrc = generateSolidSource(
    'Component',
    '{ args: { foo: 32, children: "Hello" } }',
  );

  expect(newSrc).toMatchInlineSnapshot(
    `"<Component foo={32}>Hello</Component>"`,
  );
});

test('component with method prop', () => {
  const newSrc = generateSolidSource(
    'Component',
    '{ args: { search() { return 32; } } }',
  );

  expect(newSrc).toMatchInlineSnapshot(`
    "<Component search={() => {
      return 32;
    }} />"
  `);
});

test('component missing story config', () => {
  const newSrc = () => generateSolidSource('Component', '5 + 4');

  expect(newSrc).toThrow('Expected `ObjectExpression` type');
});

test('component has invalid args', () => {
  const newSrc = () => generateSolidSource('Component', '{ args: 5 }');

  expect(newSrc).toThrow('Expected `ObjectExpression` type');
});

describe('catch warnings for skipped props', () => {
  const consoleMock = vi.spyOn(console, 'warn').mockImplementation(() => {});

  afterAll(() => {
    consoleMock.mockReset();
  });

  test('component prop has computed name', () => {
    const newSrc = generateSolidSource(
      'Component',
      '{ args: { ["foo"]: 32 } }',
    );

    expect(newSrc).toMatchInlineSnapshot(`"<Component />"`);
    expect(consoleMock).toHaveBeenCalledWith(
      'Encountered computed key, skipping...',
    );
  });

  test('component method has computed name', () => {
    const newSrc = generateSolidSource(
      'Component',
      '{ args: { ["foo"]() { return 32; } } }',
    );

    expect(newSrc).toMatchInlineSnapshot(`"<Component />"`);
    expect(consoleMock).toHaveBeenCalledWith(
      'Encountered computed key, skipping...',
    );
  });

  test('component method is a getter or setter', () => {
    const newSrc = generateSolidSource(
      'Component',
      '{ args: { get foo() { return 32; } } }',
    );

    expect(newSrc).toMatchInlineSnapshot(`"<Component />"`);
    expect(consoleMock).toHaveBeenCalledWith(
      'Encountered getter or setter, skipping...',
    );
  });

  test('component prop is a spread element', () => {
    const newSrc = generateSolidSource('Component', '{ args: { ...foo } }');

    expect(newSrc).toMatchInlineSnapshot(`"<Component />"`);
    expect(consoleMock).toHaveBeenCalledWith(
      'Encountered spread element, skipping...',
    );
  });
});

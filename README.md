# Storybook SolidJS

This is a framework to allow using [Storybook](https://storybook.js.org/) with [SolidJS](https://www.solidjs.com/).

## Features
- [ ] `JS` and `TS` integration with Storybook CLI
- [x] Fine grained updates in storybook controls
- [x] Compatible with `@storybook/addon-interactions`
- [x] Compatible with `@storybook/test`
- [ ] Automatic story actions
- [ ] Full props table with description in docs view mode
- [ ] Code snippets generation in docs view mode
- [ ] `SolidJS` docs in the official Storybook website

## Notes about pending features ⏳

- **Automatic story actions**: Feature under research. For now actions can be implemented manually by using the `@storybook/addon-actions` API.

- **Full props table with description in docs view mode**: Feature under research. For now, props are rendered partially in the docs view table with a blank description.

- **Code snippets generation in docs view mode**: Feature under research. Because `solid` components lack a virtual dom, a common `jsx-parser` doesn't work for generating a code snippet from the rendered story. For now, it outputs the original story source code. To output a more complex code implementation, you can use the `render` key inside a `csf` story definition.

- **`SolidJS` docs in the official Storybook website**: It's still pending to add documentation about Storybook stories definitions using SolidJS.

## Setup

In an existing Solid project, run `npx storybook@next init` (Storybook 8+ is required)

See the [Storybook Docs](https://storybook.js.org/docs?renderer=solid) for the best documentation on getting started with Storybook.

## License

[MIT License](./LICENSE)

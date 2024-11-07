# Storybook SolidJS

This is a framework to allow using [Storybook](https://storybook.js.org/) with [SolidJS](https://www.solidjs.com/).

## Features

- [x] `JS` and `TS` integration with Storybook CLI
- [x] Fine grained updates in storybook controls
- [x] Compatible with `@storybook/addon-interactions`
- [x] Compatible with `@storybook/test`
- [x] Code snippets generation in docs view mode
- [ ] Automatic story actions
- [ ] Full props table with description in docs view mode
- [ ] `SolidJS` docs in the official Storybook website

## Notes about pending features ⏳

- **Automatic story actions**: Feature under research. For now actions can be implemented manually by using the `@storybook/addon-actions` API.

- **Full props table with description in docs view mode**: Feature under research. For now, props are rendered partially in the docs view table with a blank description.

- **`SolidJS` docs in the official Storybook website**: It's still pending to add documentation about Storybook stories definitions using SolidJS.

## Setup

In an existing Solid project, run `npx storybook@latest init` (Storybook 8+ is required)

See the [Storybook Docs](https://storybook.js.org/docs?renderer=solid) for the best documentation on getting started with Storybook.

## License

[MIT License](./LICENSE)

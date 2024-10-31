# Getting Started

storybook-solidjs is developed against a specific node version which is defined in an `.nvmrc` file. You can use any Node version manager that uses the `.nvmrc` configuration file.

## Ensure you have the required system utilities

You will need to have the following installed:

- git
- Node.js
- Yarn

For Node.js and Yarn, it is recommended to use a Node version manager to install Node, and then use corepack to install Yarn.

## Starting Development

Install dependencies with `yarn`.

To build packages, run `yarn build`, either in the top-level for all or inside a specific package for one.

For formatting and linting, run `yarn check:all` to run checks and `yarn fix:all` to apply fixes where possible.
There is also `*:format` and `*:lint` variants for running them separately (e.g. `yarn check:format` to check formatting).
These checks run during CI, so remember to run `yarn fix:all` before pushing (or create a githook to do it automatically).

<details>
<summary>A warning for developers on Windows</summary>
I don't recommend developing this on Windows due to issues that appear when using yarn.
I've seen yarn not apply the correct version of itself, have issues when installing dependencies, and calculate checksums differently (which becomes a problem with CI checks).
If you don't have an alternative Linux or MacOS development environment, I would recommend using WSL exclusively when developing on Windows.
</details>

## Testing

The example application can be used to test the framework.
It has `yarn storybook` for testing Storybook and `yarn dev` for testing the app.

For testing with external projects that use Yarn, the framework and renderer can be linked locally.

**Note:** The default Yarn Plug n' Play installs WILL NOT work when testing.
This is because Yarn PnP will use virtual paths for dependencies of linked dependencies. The framework does not resolve these virtual paths, so your test app will break.
This can be fixed by specifying the node linker to be "node-modules".

### Example External Testing App

1. Create a SolidJS application using a template: `yarn dlx degit solidjs/templates/ts my-solid-app` and `cd my-solid-app` and `rm pnpm-lock.yaml`.
2. Initialize a linkable Storybook project: `yarn dlx storybook@latest init --linkable`
3. Create a `.yarnrc.yml` file with the following contents to avoid Yarn PnP:

```yml
nodeLinker: node-modules
```

4. Link to the framework and renderer with `yarn link <path>` (call twice with the absolute path to the framework "packages/frameworks/solid-vite" and renderer "packages/renderers/solid")
5. Install dependencies with `yarn`
6. Run Storybook with `yarn storybook`

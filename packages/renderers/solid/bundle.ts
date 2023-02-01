import { build } from 'tsup';
import fs from 'fs';
import { solidPlugin } from 'esbuild-plugin-solid';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const { devDependencies, dependencies } = packageJson;
const external = [...Object.keys({ ...devDependencies, ...dependencies })];
const entry = ['src/config.ts', 'src/index.ts'];

build({
  entry,
  clean: true,
  outDir: 'dist',
  format: ['esm'],
  target: 'chrome100',
  platform: 'browser',
  external,
  esbuildPlugins: [solidPlugin()],
  esbuildOptions: (c) => {
    c.conditions = ['module'];
    c.platform = 'browser';
  },
  dts: true,
  outExtension() {
    return {
      js: '.mjs',
    };
  },
});

build({
  entry,
  clean: true,
  outDir: 'dist',
  format: ['cjs'],
  target: 'node16',
  platform: 'node',
  external,
  esbuildPlugins: [solidPlugin()],
  esbuildOptions: (c) => {
    c.platform = 'node';
  },
  outExtension() {
    return {
      js: '.js',
    };
  },
});

import fs from 'fs';
import { build } from 'tsup';
import { solidPlugin } from 'esbuild-plugin-solid';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const { devDependencies } = packageJson;
const external = [...Object.keys({ ...devDependencies })];
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

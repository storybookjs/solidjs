import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import dts from 'vite-plugin-dts';
import packageJson from './package.json';

const { devDependencies, peerDependencies } = packageJson;
const externals = [...Object.keys({ ...devDependencies, ...peerDependencies })];

export default defineConfig({
  plugins: [dts(), solidPlugin()],
  build: {
    minify: false,
    lib: {
      entry: 'src/index.ts',
      name: 'StorybookSolid',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rollupOptions: {
      external: externals,
      output: { strict: false },
    },
  },
});

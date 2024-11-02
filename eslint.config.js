import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as depend from 'eslint-plugin-depend';

export default [
  { ignores: ['**/dist/'] },
  { files: ['**/*.{ts,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  depend.configs['flat/recommended'],
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];

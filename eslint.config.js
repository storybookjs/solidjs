import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as depend from 'eslint-plugin-depend';

export default [
  {
    rules: {
      'depend/ban-dependencies': [
        'error',
        {
          allowed: ['fs-extra'],
        },
      ],
    },
  },
  { ignores: ['**/dist/'] },
  { files: ['**/*.{ts,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  depend.configs['flat/recommended'],
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];

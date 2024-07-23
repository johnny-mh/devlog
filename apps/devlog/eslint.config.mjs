import pluginJs from '@eslint/js'
import eslintPluginAstro from 'eslint-plugin-astro'
import perfectionist from 'eslint-plugin-perfectionist'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  { files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  ...eslintPluginAstro.configs.recommended,
  {
    ...perfectionist.configs['recommended-alphabetical'],
    rules: {
      ...perfectionist.configs['recommended-alphabetical'].rules,

      'perfectionist/sort-astro-attributes': [
        'error',
        {
          customGroups: {
            'client:only': 'client:only*',
          },
          groups: [
            'multiline',
            'shorthand',
            'astro-shorthand',
            'unknown',
            'client:only',
          ],
          ignoreCase: true,
          order: 'asc',
          type: 'alphabetical',
        },
      ],
    },
  },
]

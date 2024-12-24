import pluginJs from '@eslint/js'
import eslintPluginAstro from 'eslint-plugin-astro'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import perfectionist from 'eslint-plugin-perfectionist'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    ...jsxA11y.flatConfigs.recommended,
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  perfectionist.configs['recommended-alphabetical'],
  {
    rules: {
      'perfectionist/sort-sets': 0,
    },
  },

  ...eslintPluginAstro.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.astro', '**/*.astro/**'],
    rules: {
      'prettier/prettier': 0,
    },
  },
]

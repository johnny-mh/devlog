import pluginJs from '@eslint/js'
// import astroParser from 'astro-eslint-parser'
import eslintPluginAstro from 'eslint-plugin-astro'
import perfectionist from 'eslint-plugin-perfectionist'
// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  // eslintPluginPrettierRecommended,
  perfectionist.configs['recommended-alphabetical'],
  {
    rules: {
      'perfectionist/sort-sets': 0,
    },
  },
]

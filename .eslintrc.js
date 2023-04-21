const { resolve } = require('path');
module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  // https://eslint.vuejs.org/user-guide/#how-to-use-custom-parser
  // Must use parserOptions instead of "parser" to allow vue-eslint-parser to keep working
  // `parser: 'vue-eslint-parser'` is already included with any 'plugin:vue/**' config and should be omitted
  parserOptions: {
    extraFileExtensions: [
      '.vue'
    ],
    parser: '@typescript-eslint/parser',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2020,
    sourceType: 'module'
  },

  env: {
    browser: true,
    node: true,
    'vue/setup-compiler-macros': true
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    // Base ESLint recommended rules
    // 'eslint:recommended',

    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#usage
    // ESLint typescript rules
    'plugin:@typescript-eslint/recommended',
    // consider disabling this class of rules if linting takes too long
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    // Uncomment any of the lines below to choose desired strictness,
    // but leave only one uncommented!
    // See https://eslint.vuejs.org/rules/#available-rules
    'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)
    // 'plugin:vue/vue3-strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)
    // 'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

    'standard'

  ],

  plugins: [
    // required to apply rules which need type information
    '@typescript-eslint',

    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-file
    // required to lint *.vue files
    'vue',

  ],

  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly'
  },

  // add your custom rules here
  rules: {
    'generator-star-spacing': 'off',
    'arrow-parens': 'off',
    'one-var': 'off',
    'no-void': 'off',
    'multiline-ternary': 'off',
    'import/first': 'off',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-promise-reject-errors': 'off',
    quotes: [
      'warn',
      'single',
      {
        avoidEscape: true
      }
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-floating-promises': 2,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-v-model-argument': 'off',
    'vue/no-useless-template-attributes': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"]
  },

  'extends': [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:vue/vue3-essential',
    'standard',
    'plugin:vue/essential',
    '@vue/standard'
  ]
}

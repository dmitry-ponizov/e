module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/interface-name-prefix': [1, {prefixWithI: 'always'}],
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-empty-function': 0,
    'react/prop-types': 0,
    'react/display-name': 0,
    'prefer-rest-params': 0,
    '@typescript-eslint/camelcase': 0,
  },
};

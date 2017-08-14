'use strict';

// Prettier breaks a lot of our preferred eslint rules, but it
// fixes those line extensions that are added by flow-remove-types.
// So we give it its own config to be run separately.

module.exports = {
  plugins: [ 'prettier' ],
  rules: {
    'prettier/prettier': [1, {
      'singleQuote': true,
      'trailingComma': 'all',
      'bracketSpacing': false,
      'jsxBracketSameLine': true,
      'parser': 'flow'
    }]
  }
};

module.exports = {
  'parser': '@typescript-eslint/parser',
  'plugins': ['@typescript-eslint'],
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': 'standard',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'overrides': {
    'files': ['**/*.ts'],
    'parser': '@typescript-eslint/parser',
    'rules': {
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-multi-spaces': [
        'error',
        {
          'ignoreEOLComments': true
        }
      ],
      'generator-star-spacing': 'off',
      'indent': [
        'warn',
        2,
        {
          'FunctionDeclaration': {
            'parameters': 'first'
          },
          'FunctionExpression': {
            'parameters': 'first'
          },
          'SwitchCase': 2
        }
      ]
    }
  }
}

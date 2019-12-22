module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-line-length': [false],
    'comma-dangle': 0,
    "max-len": 0,
    "no-underscore-dangle": 0,
    "global-require": 0,
    "indent": [
      "error",
      2
    ],
    "comma-dangle": 0,
    "no-param-reassign": 0,
    "no-prototype-builtins": 0
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};

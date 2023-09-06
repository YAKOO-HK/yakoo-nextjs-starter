// x-eslint-disable-next-line @typescript-eslint/no-var-requires
// const path = require('path');

/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ['next', 'plugin:tailwindcss/recommended', 'plugin:@tanstack/eslint-plugin-query/recommended', 'prettier'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    'tailwindcss/no-custom-classname': 'off',
  },
  settings: {
    tailwindcss: {
      callees: ['cn', 'clsx'],
      config: './tailwind.config.js',
    },
    next: {
      rootDir: true,
    },
  },
};

module.exports = config;

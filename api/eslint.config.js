import {
  base,
  node,
  perfectionist,
  prettier,
  typescript,
} from 'eslint-config-imperium';

export default [
  base,
  node,
  typescript,
  prettier,
  perfectionist,
  {
    languageOptions: {
      globals: {
        caches: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
];

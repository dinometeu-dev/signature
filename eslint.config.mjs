import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import eslintPluginImport from 'eslint-plugin-import';

const eslintConfig = [
  {
    ignores: [
      '**/src/generated/**',
      '**/.prisma/**',
      '**/output/**',
      '**/playwright-report/**',
    ],
  },
  ...nextCoreWebVitals,
  {
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      'import/order': [
        1,
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'type',
          ],
          pathGroups: [
            { pattern: 'components', group: 'internal' },
            { pattern: 'routes/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['internal'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];

export default eslintConfig;

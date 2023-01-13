const commonConfig = {
    parser: '@typescript-eslint/parser',
    settings: {
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
        'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
        'import/resolver': {
            node: { extendsions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'] },
            typescript: {},
        },
        react: {
            version: 'detect', // Automatically detect the react version
        },
    },
    plugins: ['@typescript-eslint', 'import', 'react-hooks'],
}

const commonExtends = ['prettier', 'plugin:import/recommended']

const commonRules = {
    // Conflict with @typescript-eslint
    'no-shadow': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'no-useless-constructor': 'off',
    'default-case': 'off',

    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/naming-convention': [
        'error',
        {
            selector: ['enum', 'enumMember'],
            format: ['PascalCase'],
        },
    ],
    'import/extensions': [
        'error',
        'ignorePackages',
        {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
        },
    ],

    'react/jsx-filename-extension': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'react/default-props-match-prop-types': ['error', { allowRequiredDefaults: true }],
    'react/no-array-index-key': 'off',
    'react/jsx-sort-props': 'error',

    'tailwind/class-order': 'off',

    'import/prefer-default-export': 'off',
    'no-param-reassign': 'error',
    'import/order': [
        'error',
        {
            groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'object'],
            'newlines-between': 'always',
            pathGroups: [
                {
                    pattern: '@bitkub-moonshot/**',
                    group: 'internal',
                    position: 'before',
                },
            ],
            pathGroupsExcludedImportTypes: ['@bitkub-moonshot'],
        },
    ],

    'no-plusplus': 'off',
    eqeqeq: 'error',

    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',

    // Conflict with @moonshot-team/saga-toolkit
    'react-hooks/exhaustive-deps': 'off',
}

module.exports = {
    commonConfig,
    commonExtends,
    commonRules,
}

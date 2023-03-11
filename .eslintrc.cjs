module.exports = {
    env: {
        browser: true,
        node: true,
        commonjs: true,
        es6: true,
    },
    extends: [
        'eslint:recommended',
        'airbnb-typescript/base', // TS+JS version
        'plugin:chai-expect/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022,
        project: './tsconfig.eslint.json',
        tsconfigRootDir: '.',
    },
    plugins: ['import'],
    overrides: [
        {
            files: ['*.js', '*.cjs'],
            rules: {
                // this option sets a specific tab width for your code
                // https://eslint.org/docs/rules/indent
                indent: [
                    'error',
                    4,
                    {
                        SwitchCase: 1,
                        VariableDeclarator: 1,
                        outerIIFEBody: 1,
                        MemberExpression: 1,
                        FunctionDeclaration: {
                            parameters: 1,
                            body: 1,
                        },
                        FunctionExpression: {
                            parameters: 1,
                            body: 1,
                        },
                        CallExpression: {
                            arguments: 1,
                        },
                        ArrayExpression: 1,
                        ObjectExpression: 1,
                        ImportDeclaration: 1,
                        flatTernaryExpressions: false,
                        // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
                        ignoredNodes: [
                            'JSXElement',
                            'JSXElement > *',
                            'JSXAttribute',
                            'JSXIdentifier',
                            'JSXNamespacedName',
                            'JSXMemberExpression',
                            'JSXSpreadAttribute',
                            'JSXExpressionContainer',
                            'JSXOpeningElement',
                            'JSXClosingElement',
                            'JSXText',
                            'JSXEmptyExpression',
                            'JSXSpreadChild',
                        ],
                        ignoreComments: false,
                    },
                ],
                '@typescript-eslint/indent': 'off',
                '@typescript-eslint/lines-between-class-members': 'off',
                'lines-between-class-members': [
                    'error',
                    'always',
                    {
                        exceptAfterSingleLine: true,
                    },
                ],
            },
        },
        {
            files: ['*.ts'],
            extends: ['plugin:@typescript-eslint/recommended'],
            rules: {
                '@typescript-eslint/no-non-null-assertion': 'off',
                indent: 'off', // we need the TS version
                '@typescript-eslint/indent': [
                    'error',
                    4,
                    {
                        SwitchCase: 1,
                        VariableDeclarator: 1,
                        outerIIFEBody: 1,
                        MemberExpression: 1,
                        FunctionDeclaration: {
                            parameters: 1,
                            body: 1,
                        },
                        FunctionExpression: {
                            parameters: 1,
                            body: 1,
                        },
                        CallExpression: {
                            arguments: 1,
                        },
                        ArrayExpression: 1,
                        ObjectExpression: 1,
                        ImportDeclaration: 1,
                        flatTernaryExpressions: false,
                        // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
                        ignoredNodes: [
                            'JSXElement',
                            'JSXElement > *',
                            'JSXAttribute',
                            'JSXIdentifier',
                            'JSXNamespacedName',
                            'JSXMemberExpression',
                            'JSXSpreadAttribute',
                            'JSXExpressionContainer',
                            'JSXOpeningElement',
                            'JSXClosingElement',
                            'JSXText',
                            'JSXEmptyExpression',
                            'JSXSpreadChild',
                        ],
                        ignoreComments: false,
                    },
                ],
                'lines-between-class-members': 'off',
                '@typescript-eslint/lines-between-class-members': [
                    'error',
                    'always',
                    {
                        exceptAfterSingleLine: true,
                        exceptAfterOverload: true,
                    },
                ],
                // TODO: write custom version of this that allows newline before but not after
                '@typescript-eslint/type-annotation-spacing': ['off', {}],
                camelcase: 'off',
                '@typescript-eslint/naming-convention': [
                    'error',
                    {
                        selector: 'default',
                        format: ['camelCase'],
                    },
                    {
                        selector: 'variable',
                        format: ['camelCase', 'UPPER_CASE'],
                    },
                    {
                        selector: 'parameter',
                        format: ['camelCase'],
                        leadingUnderscore: 'allow',
                    },
                    {
                        selector: 'enumMember',
                        format: ['camelCase', 'UPPER_CASE'],
                        leadingUnderscore: 'allow',
                    },
                    {
                        selector: 'memberLike',
                        modifiers: ['private'],
                        format: ['camelCase'],
                        leadingUnderscore: 'require',
                    },
                    {
                        selector: 'typeLike',
                        format: ['PascalCase'],
                    },
                    {
                        selector: 'property',
                        format: ['camelCase', 'snake_case', 'PascalCase'],
                    },
                ],
                '@typescript-eslint/no-namespace': [
                    'error',
                    { allowDefinitionFiles: true },
                ],
                '@typescript-eslint/no-explicit-any': [
                    'error',
                    {
                        // if true, auto-fixing will convert the "any" type to an "unknown" type
                        fixToUnknown: true,
                        // specify if arrays from the rest operator are considered okay
                        ignoreRestArgs: true,
                    },
                ],
                '@typescript-eslint/ban-ts-comment': [
                    'error',
                    {
                        'ts-expect-error': 'allow-with-description',
                        'ts-ignore': true,
                        'ts-nocheck': true,
                        'ts-check': false,
                        minimumDescriptionLength: 3,
                    },
                ],
            },
        },
    ],
    rules: {
        'spaced-comment': [
            'error',
            'always',
            {
                line: {
                    markers: ['/'],
                    exceptions: ['-', '+'],
                },
                block: {
                    markers: ['!'],
                    exceptions: ['*'],
                    balanced: true,
                },
            },
        ],
        'import/extensions': [
            'off',
            'ignorePackages',
            {
                js: 'true',
                jsx: 'true',
                ts: 'never',
                tsx: 'never',
            },
        ],
        'import/order': ['off'], // handled by vscode extension,
        '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
        'chai-expect/terminating-properties': 'off',
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: ['test/**/*'],
                packageDir: '.',
            },
        ],
        'import/prefer-default-export': ['off'],
        'import/no-default-export': ['error'],
        'object-curly-newline': [
            'error',
            {
                ObjectPattern: { multiline: true },
            },
        ],
        'linebreak-style': ['off'],
        // require semi-colon
        semi: ['error', 'always'],
        curly: ['error', 'all'],
        'brace-style': ['error', '1tbs'],
        // we don't allow single-line if/etc, even with braces on the same line
        'nonblock-statement-body-position': ['off'],
        strict: ['off'],
        // airbnb forbids i++, preferring i+=1, etc
        'no-plusplus': ['off'],
        // specify the maximum length of a line in your program
        // https://eslint.org/docs/rules/max-len
        'max-len': [
            'error',
            {
                code: 125,
                tabWidth: 4,
                ignoreUrls: true,
                ignoreComments: false,
                ignoreRegExpLiterals: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            },
        ],
        'no-param-reassign': ['warn', { props: false }],
        // disallow 'let registerServiceWorker = function () {', etc., unless the RHS function has an implied name
        'func-names': ['error', 'as-needed', { generators: 'as-needed' }],
        // TODO: would be good to turn this on, but couldn't get it working properly
        'import/no-unresolved': [
            'off',
            // 2,
            // { 'commonjs': true }
        ],
        radix: ['error', 'as-needed'],
        // require trailing commas in multiline object literals
        '@typescript-eslint/comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'ignore',
            },
        ],
        'no-restricted-syntax': [
            'error',
            {
                selector: 'ForInStatement',
                message:
                    'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
            },
            {
                selector: 'LabeledStatement',
                message:
                    'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
            },
            {
                selector: 'WithStatement',
                message:
                    '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
            },
        ],
        'no-console': 'off',
        'no-underscore-dangle': ['error', { allowAfterThis: true }],
    },
};

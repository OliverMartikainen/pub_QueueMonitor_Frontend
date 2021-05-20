module.exports = {
    'env': {
        'browser': true,
        'es6': true,
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2020,
        'sourceType': 'module'
    },
    'plugins': [
        'react', 'jest'
    ],
    'rules': {
        'no-unused-vars': [
            'warn'
        ],
        'indent': [
            'error',
            4,
            { 'SwitchCase': 1 }
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
        'eqeqeq': 'error',
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ],
        'no-console': 0,
        'react/prop-types': 0,
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off'
    }
}
module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 1,
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "variableLike",
        "format": [
          "camelCase",
          "UPPER_CASE",
          "PascalCase",
          "snake_case"
        ],
        "leadingUnderscore": "allowSingleOrDouble",
        "trailingUnderscore": "allowSingleOrDouble",
      },
      {
        "selector": "typeLike",
        "format": [
          "camelCase",
          "UPPER_CASE",
          "PascalCase",
          "snake_case"
        ]
      }
    ],
    "@typescript-eslint/consistent-type-imports": "error",
    "no-console": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ]
  },
  ignorePatterns: [
    "packages/client/server/index.js",
    "packages/client/dist",
    "packages/server/dist"
  ]
}

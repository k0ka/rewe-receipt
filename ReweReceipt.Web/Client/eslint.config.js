import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import {defineConfig, globalIgnores} from 'eslint/config'
import * as reactX from "typescript-eslint";
import * as reactDom from "typescript-eslint";

export default defineConfig([
    globalIgnores(['dist']),
    globalIgnores(['src/api']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.strictTypeChecked,
            tseslint.configs.stylisticTypeChecked,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            reactX.configs.recommendedTypeChecked,
            reactDom.configs.recommended,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                project: ['./tsconfig.node.json', './tsconfig.app.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/no-misused-promises": [
                "error",
                {
                    "checksVoidReturn": {
                        "attributes": false
                    }
                }
            ],
            "@typescript-eslint/no-confusing-void-expression": [
                "error",
                {
                    "ignoreArrowShorthand": true
                }
            ]
        }
    },
    {
        files: ['src/components/ui/**/*.tsx'],
        rules: {
            'react-refresh/only-export-components': 'off',
        },
    },
])

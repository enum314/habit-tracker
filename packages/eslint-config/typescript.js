import prettierConfig from "eslint-config-prettier";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { sharedTypeScriptRules } from "./base.js";

const defaultIgnores = [
  "node_modules/**",
  "dist/**",
  "**/generated/**",
  "*.js",
  "*.mjs",
];

/**
 * @param {{ tsconfigPath?: string; ignores?: string[] }} [options]
 */
export function createTypeScriptConfig(options = {}) {
  const { tsconfigPath = "./tsconfig.json", ignores = defaultIgnores } =
    options;

  return [
    { ignores },
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      rules: {
        "no-unused-vars": "off",
      },
    },
    {
      files: ["**/*.{ts,tsx}"],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          project: tsconfigPath,
        },
      },
      plugins: {
        "@typescript-eslint": tseslint,
      },
      rules: {
        ...tseslint.configs.recommended.rules,
        ...sharedTypeScriptRules,
      },
    },
    prettierConfig,
  ];
}

export default createTypeScriptConfig();

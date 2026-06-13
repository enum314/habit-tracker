import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";
import nextTs from "eslint-config-next/typescript";
import {
  sharedReactRules,
  sharedTypeScriptRules,
} from "@acme/eslint-config/base";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    ".next/**",
    ".source/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/server/prisma/**",
  ]),
  {
    settings: {
      react: {
        version: "19.2",
      },
    },
    rules: {
      ...sharedTypeScriptRules,
      ...sharedReactRules,
    },
  },
]);

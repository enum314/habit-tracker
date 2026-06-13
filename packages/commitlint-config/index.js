/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [2, "always", 128],
    "type-enum": [
      2,
      "always",
      [
        "chore",
        "build",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
        "types",
        "wip",
      ],
    ],
    "scope-case": [1, "always", "pascal-case"],
    "body-max-line-length": [0, "always"],
  },
};

import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";

export default [
  {
    ignores: ["node_modules", "dist", "coverage", "src/generated/prisma"],
  },
  {
    files: ["**/*.ts"],
    ignores: ["dist/**", "node_modules/**"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin, // 👈 important
    },

    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",

      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal"],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],
    },
  },
];

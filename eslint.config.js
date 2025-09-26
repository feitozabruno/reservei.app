const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: true,
});

module.exports = [
  ...compat.extends(
    "plugin:jest/recommended",
    "next/core-web-vitals",
    "prettier",
  ),

  {
    ignores: ["node_modules/", ".next/", "out/", "build/", "next-env.d.ts"],
  },
];

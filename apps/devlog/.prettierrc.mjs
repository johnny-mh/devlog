/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: { parser: "astro" },
    },
  ],
  trailingComma: "es5",
  tabWidth: 2,
  semi: false,
  singleQuote: true,
};

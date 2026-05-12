export default {
  "*.{ts,tsx}": ["prettier --write", "eslint --fix"],
  "**/*.ts?(x)": () => "tsc --noEmit",
}

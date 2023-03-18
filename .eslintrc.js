module.exports = {
};
module.exports = {
  parser: "@babel/eslint-parser",
  env: {
    "browser": true,
    "node": true,
  },
  extends: [
    "eslint:recommended"
  ],
  overrides: [
  ],
  parserOptions: {
    "ecmaVersion": 11,
    "sourceType": "module"
  },
  rules: {
    "max-len": ["error", 256]
  }
}

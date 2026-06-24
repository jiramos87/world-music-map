import next from "eslint-config-next";

const eslintConfig = [
  ...next,
  { ignores: ["lib/generated/**", ".next/**", "node_modules/**"] },
];

export default eslintConfig;

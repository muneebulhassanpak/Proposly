import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // Components and pages must be stateless.
  // All state, effects, and data fetching belong in *.hook.ts files.
  {
    files: ["**/*.component.tsx", "**/*.page.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              importNames: [
                "useState",
                "useReducer",
                "useActionState",
                "useEffect",
              ],
              message:
                "State and effects belong in a custom hook (*.hook.ts), not in components or pages.",
            },
            {
              name: "@tanstack/react-query",
              importNames: ["useQuery", "useMutation", "useInfiniteQuery"],
              message:
                "Data fetching belongs in a custom hook (*.hook.ts), not in components or pages.",
            },
            {
              name: "react-hook-form",
              importNames: ["useForm", "useFieldArray", "useWatch"],
              message:
                "Form state belongs in a custom hook (*.hook.ts), not in components or pages.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;

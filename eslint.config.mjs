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
  // No hardcoded role, route, or status strings — always use the constants.
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: [
      "**/constants/**",
      "**/schemas/**",
      "**/*.test.*",
      "**/*.spec.*",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        // Role strings
        {
          selector: "Literal[value='admin']",
          message:
            "Use USER_ROLES.ADMIN instead of the string literal \"admin\".",
        },
        {
          selector: "Literal[value='manager']",
          message:
            "Use USER_ROLES.MANAGER instead of the string literal \"manager\".",
        },
        {
          selector: "Literal[value='rep']",
          message:
            "Use USER_ROLES.REP instead of the string literal \"rep\".",
        },
        // Route strings
        {
          selector: "Literal[value='/dashboard']",
          message:
            "Use ROUTES.DASHBOARD instead of the string literal \"/dashboard\".",
        },
        {
          selector: "Literal[value='/quotes']",
          message:
            "Use ROUTES.QUOTES instead of the string literal \"/quotes\".",
        },
        {
          selector: "Literal[value='/login']",
          message:
            "Use ROUTES.LOGIN instead of the string literal \"/login\".",
        },
        {
          selector: "Literal[value='/forgot-password']",
          message:
            "Use ROUTES.FORGOT_PASSWORD instead of the string literal \"/forgot-password\".",
        },
        {
          selector: "Literal[value='/admin/settings']",
          message:
            "Use ROUTES.ADMIN_SETTINGS instead of the string literal \"/admin/settings\".",
        },
        {
          selector: "Literal[value='/admin/catalog']",
          message:
            "Use ROUTES.ADMIN_CATALOG instead of the string literal \"/admin/catalog\".",
        },
        {
          selector: "Literal[value='/admin/discount-rules']",
          message:
            "Use ROUTES.ADMIN_DISCOUNT_RULES instead of the string literal \"/admin/discount-rules\".",
        },
        {
          selector: "Literal[value='/admin/users']",
          message:
            "Use ROUTES.ADMIN_USERS instead of the string literal \"/admin/users\".",
        },
        {
          selector: "Literal[value='/manager/approvals']",
          message:
            "Use ROUTES.MANAGER_APPROVALS instead of the string literal \"/manager/approvals\".",
        },
        {
          selector: "Literal[value='/manager/analytics']",
          message:
            "Use ROUTES.MANAGER_ANALYTICS instead of the string literal \"/manager/analytics\".",
        },
        // Quote status strings
        {
          selector: "Literal[value='draft']",
          message:
            "Use QUOTE_STATUS.DRAFT instead of the string literal \"draft\".",
        },
        {
          selector: "Literal[value='sent']",
          message:
            "Use QUOTE_STATUS.SENT instead of the string literal \"sent\".",
        },
        {
          selector: "Literal[value='viewed']",
          message:
            "Use QUOTE_STATUS.VIEWED instead of the string literal \"viewed\".",
        },
        {
          selector: "Literal[value='accepted']",
          message:
            "Use QUOTE_STATUS.ACCEPTED instead of the string literal \"accepted\".",
        },
        {
          selector: "Literal[value='declined']",
          message:
            "Use QUOTE_STATUS.DECLINED instead of the string literal \"declined\".",
        },
      ],
    },
  },
]);

export default eslintConfig;

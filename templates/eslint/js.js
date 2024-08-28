import globals from "globals";
import pluginJs from "@eslint/js";

export default [
    {
        files: ["**/*.{js,mjs,cjs}"]
    },
    {
        languageOptions: { globals: { ...globals.browser, ...globals.node } }
    },
    pluginJs.configs.recommended,
];

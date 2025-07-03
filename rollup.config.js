import terser from "@rollup/plugin-terser";
import { version } from "./package.json";

export default {
    input: "dist/core/validator.js",
    output: [
        {
            file: "dist/form-validator.js",
            format: "umd",
            name: "FormValidator",
            footer: `FormValidator.version = '${version}';`,
        },
        {
            file: "dist/form-validator.min.js",
            format: "umd",
            name: "FormValidator",
            footer: `FormValidator.version = '${version}';`,
            plugins: [terser()],
        },
    ],
};
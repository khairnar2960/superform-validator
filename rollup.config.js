import terser from "@rollup/plugin-terser";
import { version } from "./package.json";

export default [
    // Package builds
    {
        input: "dist/core/validator.js",

        output: [
            {
                file: "dist/index.js",
                format: "esm",
            },
            {
                file: "dist/index.cjs",
                format: "cjs",
                exports: "named",
            },
        ],
    },

    // middleware builds
    // express
    {
        input: "dist/middlewares/express.js",

        output: [
            {
                file: "dist/middlewares/express.js",
                format: "esm",
            },
            {
                file: "dist/middlewares/express.cjs",
                format: "cjs",
                exports: "named",
            },
        ],
    },

    // react
    {
        input: "dist/middlewares/react.js",

        output: [
            {
                file: "dist/middlewares/react.js",
                format: "esm",
            },
            {
                file: "dist/middlewares/react.cjs",
                format: "cjs",
                exports: "named",
            },
        ],
    },

    // Browser UMD builds
    {
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
    },
];
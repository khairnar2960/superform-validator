import terser from "@rollup/plugin-terser";

export default {
    input: "dist/index.js",
    output: [
        {
            file: "dist/form-validator.js",
            format: "umd",
            name: "FormValidator",
        },
        {
            file: "dist/form-validator.min.js",
            format: "umd",
            name: "FormValidator",
            plugins: [terser()],
        },
    ],
};
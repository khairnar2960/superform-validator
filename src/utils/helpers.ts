import type { ValidationResponse } from "../core/validator-engine.js";

export function collectErrors(
    results: Record<string, ValidationResponse>,
    parentPath = ''
): Record<string, any> {
    const errors: Record<string, any> = {};

    for (const [field, result] of Object.entries(results)) {
        const path = parentPath ? `${parentPath}.${field}` : field;

        if (!result.valid) {
            if (result.children) {
                Object.assign(errors, collectErrors(result.children, path));
            } else {
                errors[path] = {
                    field: path,
                    rule: `${result.rule}::${result.function}`,
                    error: result.error,
                };
            }
        }
    }

    return errors;
}
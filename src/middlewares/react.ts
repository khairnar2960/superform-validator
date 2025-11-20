import { useState, useCallback } from 'react';
import { validate as validator } from '../core/validator-engine.js';
import { parseSchema, RawSchema } from '../core/schema-parser.js';

export interface ReactValidationResult {
    valid: boolean;
    validated?: Record<string, any>;
    errors?: Record<string, string>;
}

/**
 * Validate a plain values object against the provided raw schema.
 * Returns a simplified result similar to express middleware.
 */
export const validate = async (schema: RawSchema, values: Record<string, any> = {}): Promise<ReactValidationResult> => {
    const parsed = parseSchema(schema);
    const validatedMap = await validator(parsed, values || {});

    const invalid = Object.entries(validatedMap)
        .filter(([_, { valid }]) => valid === false)
        .map(([field, { error }]) => [field, error]);

    if (invalid.length) {
        return { valid: false, errors: Object.fromEntries(invalid) };
    }

    return {
        valid: true,
        validated: Object.fromEntries(
            Object.entries(validatedMap).map(([field, { processedValue }]) => [field, processedValue])
        ),
    };
};

/**
 * React hook to validate values, keep track of errors & validated data,
 * and provide a submit handler helper.
 *
 * Usage:
 * const { errors, validated, validate, handleSubmit, reset } = useValidator(schema);
 */
export const useValidator = (schema: RawSchema) => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [validated, setValidated] = useState<Record<string, any>>({});

    const runValidate = useCallback(async (values: Record<string, any> = {}) => {
        const result = await validate(schema, values);
        if (!result.valid) {
            setErrors(result.errors || {});
            setValidated({});
        } else {
            setErrors({});
            setValidated(result.validated || {});
        }
        return result;
    }, [schema]);

    /**
     * Returns an event handler for form submit.
     * The returned function accepts either a React.FormEvent (to call preventDefault)
     * and/or a plain values object (preferred in controlled components).
     *
     * Example:
     * <form onSubmit={handleSubmit(onValid)}>
     *   // or
     * const submit = handleSubmit(onValid);
     * submit(undefined, values);
     */
    const handleSubmit = useCallback((onValid: (validated: Record<string, any>) => void, onInvalid?: (errors: Record<string, string>) => void) => {
        return async (e?: React.FormEvent, values?: Record<string, any>) => {
            if (e && typeof (e as any).preventDefault === 'function') (e as any).preventDefault();
            const result = await runValidate(values || {});
            if (result.valid) {
                onValid(result.validated || {});
            } else if (onInvalid) {
                onInvalid(result.errors || {});
            }
        };
    }, [runValidate]);

    const reset = useCallback(() => {
        setErrors({});
        setValidated({});
    }, []);

    return { errors, validated, validate: runValidate, handleSubmit, reset };
};

export default {
    validate,
    useValidator,
};

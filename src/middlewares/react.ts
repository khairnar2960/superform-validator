import { useState, useCallback, useMemo } from "react";
import { validate as validator } from "../core/validator-engine.js";
import { parseSchema, RawSchema } from "../core/schema-parser.js";

export interface ReactValidationResult<T> {
    valid: boolean;
    validated?: Record<keyof T, any>;
    errors?: Record<keyof T, string>;
}

/**
 * Validate a plain values object against the provided raw schema.
 * Returns a simplified result similar to express middleware.
 */
export async function validate<T extends RawSchema>(
    schema: T,
    values: Record<keyof T, any> = ({} as Record<keyof T, any>)
): Promise<ReactValidationResult<T>> {
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
            Object.entries(validatedMap).map(([field, { processedValue }]) => [
                field,
                processedValue,
            ])
        ) as Record<keyof T, any>,
    };
};

/**
 * React hook to validate values, keep track of errors & validated data,
 * and provide a submit handler helper.
 *
 * Usage:
 * ```jsx
 * const { errors, validated, validate, handleSubmit, reset } = useValidator(schema);
 * ```
 */
export function useValidator<T extends RawSchema>(schema: T) {
    const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
    const [validated, setValidated] = useState<Record<keyof T, any>>({} as Record<keyof T, any>);

    const parsedSchema = useMemo(() => parseSchema(schema), [schema]);

    const runValidate = useCallback(
        async (values: Record<keyof T, any> = {} as Record<keyof T, any>) => {
            const validatedMap = await validator(parsedSchema, values || {});
            const invalid = Object.entries(validatedMap)
                .filter(([_, { valid }]) => valid === false)
                .map(([field, { error }]) => [field, error]);

            if (invalid.length) {
                const errObj = Object.fromEntries(invalid);
                setErrors(errObj);
                setValidated({} as Record<keyof T, any>);
                return { valid: false, errors: errObj } as ReactValidationResult<T>;
            }

            const validatedObj = Object.fromEntries(
                Object.entries(validatedMap).map(([field, { processedValue }]) => [
                    field,
                    processedValue,
                ])
            ) as Record<keyof T, any>;
            setErrors({} as Record<keyof T, string>);
            setValidated(validatedObj);
            return { valid: true, validated: validatedObj } as ReactValidationResult<T>;
        },
        [parsedSchema]
    );

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
    const handleSubmit = useCallback(
        (
            onValid: (validated: Record<keyof T, any>) => void,
            onInvalid?: (errors: Record<keyof T, string>) => void
        ) => {
            return async (e?: React.FormEvent, values?: Record<keyof T, any>) => {
                if (e && typeof (e as any).preventDefault === "function")
                    (e as any).preventDefault();
                const result = await runValidate(values || {} as Record<keyof T, any>);
                if (result.valid) {
                    onValid(result.validated || {} as Record<keyof T, any>);
                } else if (onInvalid) {
                    onInvalid(result.errors || {} as Record<keyof T, string>);
                }
            };
        },
        [runValidate]
    );

    const reset = useCallback(() => {
        setErrors({} as Record<keyof T, string>);
        setValidated({} as Record<keyof T, any>);
    }, []);

    return { errors, validated, validate: runValidate, handleSubmit, reset };
};

/**
 * useForm hook: manages form values, touched state, errors and provides
 * helpers for controlled inputs (register), change/blur handlers and submit.
 *
 * Basic API:
 * ```js
 * const {
 *     values,
 *     errors,
 *     touched,
 *     register,
 *     setFieldValue,
 *     handleSubmit,
 *     validate,
 *     reset
 * } = useForm(schema, options)
 * ```
 */
export function useForm<T extends RawSchema>(
    schema: T,
    options: {
        initialValues?: Record<keyof T, any>;
        validateOnChange?: boolean;
        validateOnBlur?: boolean;
    } = {}
) {
    const {
        initialValues = {} as Record<keyof T, any>,
        validateOnChange = false,
        validateOnBlur = true,
    } = options;

    const [values, setValues] = useState<Record<keyof T, any>>(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [validated, setValidated] = useState<Record<string, any>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const parsedSchema = useMemo(() => parseSchema(schema), [schema]);

    const runValidate = useCallback(
        async (vals: Record<keyof T, any> = values) => {
            const validatedMap = await validator(parsedSchema, vals as Record<string, any>);
            const invalid = Object.entries(validatedMap)
                .filter(([_, { valid }]) => valid === false)
                .map(([field, { error }]) => [field, error]);

            if (invalid.length) {
                setErrors(Object.fromEntries(invalid));
                setValidated({});
                return { valid: false, errors: Object.fromEntries(invalid) } as ReactValidationResult<T>;
            }

            const validatedObj = Object.fromEntries(
                Object.entries(validatedMap).map(([field, { processedValue }]) => [
                    field,
                    processedValue,
                ])
            );
            setErrors({});
            setValidated(validatedObj);
            return { valid: true, validated: validatedObj } as ReactValidationResult<T>;
        },
        [parsedSchema]
    );

    const setFieldValue = useCallback(
        async (name: string, value: any) => {
            const next = { ...values, [name]: value };
            setValues(next);
            if (validateOnChange) {
                await runValidate(next);
            }
        },
        [validateOnChange, runValidate, values]
    );

    const handleChange = useCallback(
        (eOrName: any, maybeValue?: any) => {
            // can be used as onChange handler (event) or as (name, value)
            if (typeof eOrName === "string") {
                setFieldValue(eOrName, maybeValue);
                return;
            }
            const e = eOrName as React.ChangeEvent<any>;
            const target = e.target;
            const name = target?.name;
            if (!name) return;
            let value: any =
                target.type === "checkbox" ? target.checked : target.value;
            if (target.files) value = target.files;
            setFieldValue(name, value);
        },
        [setFieldValue]
    );

    const handleBlur = useCallback(
        async (eOrName?: any) => {
            let name: string | undefined;
            if (!eOrName) return;
            if (typeof eOrName === "string") name = eOrName;
            else if ((eOrName as React.FocusEvent<any>).target)
                name = (eOrName as React.FocusEvent<any>).target.name;
            if (!name) return;
            setTouched((prev) => ({ ...prev, [name as string]: true }));
            if (validateOnBlur) {
                await runValidate(values);
            }
        },
        [validateOnBlur, runValidate, values]
    );

    const register = useCallback(
        (name: keyof T) => {
            return {
                name,
                value: values[name] ?? "",
                onChange: (e: any) => handleChange(e),
                onBlur: (e: any) => handleBlur(e),
            };
        },
        [values, handleChange, handleBlur]
    );

    const handleSubmit = useCallback(
        (
            onValid: (validated: Record<keyof T, any>) => void,
            onInvalid?: (errors: Record<keyof T, string>) => void
        ) => {
            return async (e?: React.FormEvent) => {
                if (e && typeof (e as any).preventDefault === "function")
                    (e as any).preventDefault();
                const result = await runValidate(values);
                if (result.valid) {
                    onValid((result.validated || {}) as Record<keyof T, any>);
                } else if (onInvalid) {
                    onInvalid((result.errors || {}) as Record<keyof T, string>);
                }
            };
        },
        [runValidate, values]
    );

    const validateForm = useCallback(
        async () => runValidate(values),
        [runValidate, values]
    );

    const reset = useCallback(
        (nextValues: Record<keyof T, any> = {} as Record<keyof T, any>) => {
            setValues(nextValues);
            setErrors({});
            setValidated({});
            setTouched({});
        },
        []
    );

    return {
        values,
        errors,
        validated,
        touched,
        register,
        setFieldValue,
        handleChange,
        handleBlur,
        handleSubmit,
        validate: validateForm,
        reset,
    };
}

export default {
    validate,
    useValidator,
    useForm,
};

import { useState, useCallback, useMemo, useRef } from "react";
import { validate as validator } from "../core/validator-engine.js";
import { parseSchema, type RawSchema } from "../core/schema-parser.js";

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

// Helper utilities for nested (dot-notation) access and simple deep-equal
const getAt = (obj: any, path: string) => {
    if (!path) return undefined;
    const parts = path.split('.');
    let cur = obj;
    for (const p of parts) {
        if (cur == null) return undefined;
        cur = cur[p];
    }
    return cur;
};

const setAt = (obj: any, path: string, value: any) => {
    const parts = path.split('.');
    const last = parts.pop() as string;
    let cur = obj;
    for (const p of parts) {
        if (cur[p] == null || typeof cur[p] !== 'object') cur[p] = {};
        cur = cur[p];
    }
    cur[last] = value;
};

const unsetAt = (obj: any, path: string) => {
    const parts = path.split('.');
    const last = parts.pop() as string;
    let cur = obj;
    const stack = [] as any[];
    for (const p of parts) {
        if (cur == null) return;
        stack.push({ parent: cur, key: p });
        cur = cur[p];
    }
    if (cur && Object.prototype.hasOwnProperty.call(cur, last)) {
        delete cur[last];
    }
    // cleanup empty objects upwards
    for (let i = stack.length - 1; i >= 0; i--) {
        const { parent, key } = stack[i];
        if (Object.keys(parent[key] || {}).length === 0) delete parent[key];
    }
};

const deepEqual = (a: any, b: any) => {
    try {
        return JSON.stringify(a) === JSON.stringify(b);
    } catch (e) {
        return a === b;
    }
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
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [validated, setValidated] = useState<Record<string, any>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [dirty, setDirty] = useState<Record<string, boolean>>({});
    const initialRef = useRef<Record<keyof T, any>>(initialValues);

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
            const next = { ...values } as Record<string, any>;
            setAt(next, name, value);
            setValues(next as Record<keyof T, any>);
            // update dirty flag for this field
            const initialVal = getAt(initialRef.current, name as string);
            const isDirty = !deepEqual(value, initialVal);
            setDirty(prev => ({ ...prev, [name]: isDirty }));
            if (validateOnChange) {
                await runValidate(next as Record<keyof T, any>);
            }
        },
        [validateOnChange, runValidate, values]
    );

    const unregister = useCallback((name: string) => {
        const nextValues = { ...values } as Record<string, any>;
        unsetAt(nextValues, name);
        setValues(nextValues as Record<keyof T, any>);

        const nextErrors = { ...errors } as Partial<Record<keyof T, any>>;
        unsetAt(nextErrors, name);
        setErrors(nextErrors);

        const nextValidated = { ...validated } as Record<string, any>;
        unsetAt(nextValidated, name);
        setValidated(nextValidated);

        const nextTouched = { ...touched } as Record<string, boolean>;
        unsetAt(nextTouched, name);
        setTouched(nextTouched);

        const nextDirty = { ...dirty } as Record<string, boolean>;
        if (nextDirty[name]) delete nextDirty[name];
        setDirty(nextDirty);
    }, [values, errors, validated, touched, dirty]);

    const watch = useCallback((name?: string) => {
        if (!name) return values as Record<string, any>;
        return getAt(values, name as string);
    }, [values]);

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
            // mark dirty based on current vs initial
            const curVal = getAt(values, name as string);
            const initialVal = getAt(initialRef.current, name as string);
            setDirty(prev => ({ ...prev, [name as string]: !deepEqual(curVal, initialVal) }));
            if (validateOnBlur) {
                await runValidate(values);
            }
        },
        [validateOnBlur, runValidate, values]
    );

    const register = useCallback(
        (name: keyof T) => {
            const stringName = name as string;
            return {
                name: stringName,
                value: getAt(values, stringName) ?? "",
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
            setDirty({});
            if (nextValues && Object.keys(nextValues).length) initialRef.current = nextValues;
        },
        []
    );

    const control = useMemo<Control<T>>(() => {
        return {
            register: (n: keyof T) => register(n as keyof T),
            setValue: (n: keyof T | string, v: any) => setFieldValue(n as string, v),
            getValues: () => values as Record<string, any>,
            unregister: (n: keyof T | string) => unregister(n as string),
            watch: (n?: keyof T | string) => watch(n as string | undefined),
            trigger: async (n?: keyof T | string) => {
                const res = await runValidate(values);
                if (n) {
                    const errs = (res as any).errors || {};
                    return !Boolean((errs as Record<string, any>)[n as string]);
                }
                return res.valid;
            },
            formState: {
                values: values as Record<string, any>,
                errors: errors,
                touched: touched,
                dirty: dirty,
            },
        } as Control<T>;
    }, [register, setFieldValue, values, errors, touched, runValidate]);

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
        control,
        unregister,
        watch,
        reset,
    };
}

/**
 * Control interface and useController hook similar to react-hook-form.
 * The `control` returned from `useForm` exposes helpers and formState.
 */
export interface Control<T extends RawSchema> {
    register: (name: keyof T) => any;
    setValue: (name: keyof T | string, value: any) => Promise<void> | void;
    unregister?: (name: keyof T | string) => void;
    watch?: (name?: keyof T | string) => any;
    getValues: () => Record<string, any>;
    trigger: (name?: keyof T | string) => Promise<boolean>;
    formState: {
        values: Record<string, any>;
        errors: Record<string, string>;
        touched: Record<string, boolean>;
        dirty?: Record<string, boolean>;
    };
}

export function useController<T extends RawSchema>(params: { name: keyof T; control: Control<T> }) {
    const { name, control } = params;

    const value = control.formState.values?.[name as string];
    const error = control.formState.errors?.[name as string];
    const touched = control.formState.touched?.[name as string];
    const isDirty = control.formState.dirty?.[name as string] || false;

    const onChange = (eOrValue: any) => {
        if (eOrValue && typeof eOrValue === 'object' && 'target' in eOrValue) {
            const target = eOrValue.target as HTMLInputElement;
            const val = target.type === 'checkbox' ? target.checked : target.value;
            control.setValue(name as string, val);
        } else {
            control.setValue(name as string, eOrValue);
        }
    };

    const onBlur = (e?: any) => {
        if (control && typeof (control as any).handleBlur === 'function') {
            (control as any).handleBlur(name as string);
        } else if (control && typeof control.trigger === 'function') {
            control.trigger(name as string);
        }
    };

    return {
        field: {
            name,
            value,
            onChange,
            onBlur,
        },
        fieldState: {
            error,
            touched,
            isDirty,
        },
    };
}


export default {
    validate,
    useValidator,
    useForm,
};

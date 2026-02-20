export const isString = (value: any): boolean => 'string' === typeof value;

export const isArray = (value: any): boolean => Array.isArray(value);

export const isObject = (value: any): boolean => null !== value && !isArray(value) && 'object' === typeof value;

export const isUndefined = (value: any): boolean => 'undefined' === typeof value;

export const isEmpty = (value: any): boolean => {
    if (isString(value) || isArray(value)) return value.length === 0;
    if (isObject(value)) return Object.keys(value).length === 0;
    return value === null || value === undefined;
}

export const isArrayOrObject = (value: any): boolean => isArray(value) || isObject(value);

export const isJson = (value: string): boolean => {
    try {
        return isArrayOrObject(JSON.parse(value));
    } catch (error) {
        return false;
    }
}

export const isBoolean = (value: any) => 'boolean' === typeof value;

export const isNumber = (value: any): boolean => 
    'number' === typeof value && Number.isFinite(value);

export const isInteger = (value: any): boolean => Number.isInteger(value);

export const isFloat = (value: any): boolean =>
    isNumber(value) && !Number.isInteger(value);

export type TypeOfArray = 'undefined'|'null'|'string'|'number'|'integer'|'float'|'boolean'|'array'|'object';

export const typeChecks: Record<TypeOfArray, (input: any) => boolean> = {
    undefined: (v) => typeof v === 'undefined',
    null: (v) => v === null,
    string: isString,
    number: isNumber,
    boolean: isBoolean,
    integer: isInteger,
    float: isFloat,
    array: isArray,
    object: isObject,
};

export const isTypeOf = (input: any, type: TypeOfArray): boolean => {
    return typeChecks[type]?.(input) ?? false;
}

export const isArrayOf = (input: any, type: TypeOfArray): boolean => {
    if (!isArray(input)) return false;
    for (const el of input) {
        if (!isTypeOf(el, type)) {
            return false;
        }
    }
    return true;
}

export const isLatitude = (input: any) => typeof input === 'number' && input >= -90 && input <= 90;
export const isLongitude = (input: any) => typeof input === 'number' && input >= -180 && input <= 180;

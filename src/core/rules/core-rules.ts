export const isString = (value: any): boolean => 'string' === typeof value;

export const isArray = (value: any): boolean => Array.isArray(value);

export const isObject = (value: any): boolean => null !== value && !isArray(value) && 'object' === typeof value;

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

export type TypeOfArray = 'string'|'number'|'integer'|'float'|'boolean'|'array'|'object';

export const isArrayOf = (input: any, type: TypeOfArray): boolean => {
    if (!isArray(input)) return false;
    for (const el of input) {
        switch (type) {
            case 'string':
                if (!isString(el)) return false;
                break;
            case 'number':
                if (!isNumber(el)) return false;
                break;
            case 'boolean':
                if (!isBoolean(el)) return false;
                break;
            case 'integer':
                if (!isInteger(el)) return false;
                break;
            case 'float':
                if (!isFloat(el)) return false;
                break;
            case 'array':
                if (!isArray(el)) return false;
                break;
            case 'object':
                if (!isObject(el)) return false;
                break;
            default:
                return false;
        }
    }
    return true;
}


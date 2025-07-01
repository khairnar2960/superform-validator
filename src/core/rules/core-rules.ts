export const isString = (value: any): boolean => 'string' === typeof value;

export const isArray = (value: any): boolean => Array.isArray(value);

export const isObject = (value: any): boolean => null !== value && 'object' === typeof value && !isArray(value);

export const isEmpty = (value: any): boolean => {
    if (isString(value) || isArray(value)) return value.length === 0;
    if (isObject(value)) return Object.keys(value).length === 0;
    return value === null || value === undefined;
}

export const isJson = (value: string): boolean => {
    try {
        return isObject(JSON.parse(value));
    } catch (error) {
        return false;
    }
}
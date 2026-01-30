import { describe, it, expect } from 'vitest';
import {
    isString,
    isArray,
    isObject,
    isEmpty,
    isArrayOrObject,
    isJson,
    isNumber,
    isInteger,
    isFloat,
    isBoolean,
    isTypeOf,
    isArrayOf,
    isLatitude,
    isLongitude
} from '../../src/core/rules/core-rules';

describe('core-rules helpers', () => {

    it('isString returns true for strings and false otherwise', () => {
        expect(isString('hello')).toBe(true);
        expect(isString('')).toBe(true);
        expect(isString(123)).toBe(false);
        expect(isString(null)).toBe(false);
        expect(isString(undefined)).toBe(false);
    });

    it('isArray detects arrays correctly', () => {
        expect(isArray([1, 2, 3])).toBe(true);
        expect(isArray([])).toBe(true);
        expect(isArray('not-array')).toBe(false);
        expect(isArray({})).toBe(false);
    });

    it('isObject detects plain objects and excludes arrays/null', () => {
        expect(isObject({ a: 1 })).toBe(true);
        expect(isObject({})).toBe(true);
        expect(isObject([])).toBe(false);
        expect(isObject(null)).toBe(false);
        expect(isObject('string')).toBe(false);
    });

    it('isEmpty handles strings, arrays, objects, null and undefined', () => {
        expect(isEmpty('')).toBe(true);
        expect(isEmpty(' ')).toBe(false); // length > 0
        expect(isEmpty([])).toBe(true);
        expect(isEmpty([1])).toBe(false);
        expect(isEmpty({})).toBe(true);
        expect(isEmpty({ a: 1 })).toBe(false);
        expect(isEmpty(null)).toBe(true);
        expect(isEmpty(undefined)).toBe(true);
        // numbers are not considered empty
        expect(isEmpty(0)).toBe(false);
    });

    it('isArrayOrObject returns true for arrays and objects only', () => {
        expect(isArrayOrObject([1])).toBe(true);
        expect(isArrayOrObject({ a: 1 })).toBe(true);
        expect(isArrayOrObject('string')).toBe(false);
        expect(isArrayOrObject(123)).toBe(false);
        expect(isArrayOrObject(null)).toBe(false);
    });

    it('isJson returns true only for JSON that parses to array or object', () => {
        expect(isJson('{"a":1}')).toBe(true);
        expect(isJson('[1,2,3]')).toBe(true);
        expect(isJson('  {"x": "y"}  ')).toBe(true);

        // primitives parse but are not array/object
        expect(isJson('123')).toBe(false);
        expect(isJson('"a string"')).toBe(false);

        // invalid JSON
        expect(isJson('not json')).toBe(false);
        expect(isJson('{')).toBe(false);
    });

    it('isNumber validates finite numbers only', () => {
        expect(isNumber(10)).toBe(true);
        expect(isNumber(0)).toBe(true);
        expect(isNumber(-5)).toBe(true);
        expect(isNumber(1.5)).toBe(true);

        expect(isNumber(NaN)).toBe(false);
        expect(isNumber(Infinity)).toBe(false);
        expect(isNumber('10')).toBe(false);
        expect(isNumber(null)).toBe(false);
    });

    it('isInteger validates integers only', () => {
        expect(isInteger(10)).toBe(true);
        expect(isInteger(0)).toBe(true);
        expect(isInteger(-5)).toBe(true);

        expect(isInteger(1.5)).toBe(false);
        expect(isInteger('10')).toBe(false);
        expect(isInteger(null)).toBe(false);
    });

    it('isFloat validates non-integer numbers only', () => {
        expect(isFloat(1.5)).toBe(true);
        expect(isFloat(-3.14)).toBe(true);

        expect(isFloat(10)).toBe(false);
        expect(isFloat(0)).toBe(false);
        expect(isFloat('1.5')).toBe(false);
    });

    it('isBoolean validates boolean values only', () => {
        expect(isBoolean(true)).toBe(true);
        expect(isBoolean(false)).toBe(true);

        expect(isBoolean(1)).toBe(false);
        expect(isBoolean('true')).toBe(false);
        expect(isBoolean(null)).toBe(false);
    });

    it('isTypeOf validates value against type correctly', () => {
        expect(isTypeOf('abc', 'string')).toBe(true);
        expect(isTypeOf(10, 'number')).toBe(true);
        expect(isTypeOf(10, 'integer')).toBe(true);
        expect(isTypeOf(1.5, 'float')).toBe(true);
        expect(isTypeOf([], 'array')).toBe(true);
        expect(isTypeOf({}, 'object')).toBe(true);
        expect(isTypeOf(null, 'null')).toBe(true);
        expect(isTypeOf(undefined, 'undefined')).toBe(true);

        expect(isTypeOf(1.5, 'integer')).toBe(false);
        expect(isTypeOf('1', 'number')).toBe(false);
    });

    it('isArrayOf validates array element types correctly', () => {
        expect(isArrayOf([1, 2, 3], 'integer')).toBe(true);
        expect(isArrayOf([1.5, 2.5], 'float')).toBe(true);
        expect(isArrayOf(['a', 'b'], 'string')).toBe(true);

        expect(isArrayOf([1, '2'], 'number')).toBe(false);
        expect(isArrayOf('not-array', 'string')).toBe(false);
        expect(isArrayOf([], 'string')).toBe(true); // empty array is valid
    });
    it('isLatitude validates valid latitude range', () => {
        expect(isLatitude(0)).toBe(true);
        expect(isLatitude(45)).toBe(true);
        expect(isLatitude(-90)).toBe(true);
        expect(isLatitude(90)).toBe(true);

        expect(isLatitude(91)).toBe(false);
        expect(isLatitude(-91)).toBe(false);
        expect(isLatitude('45')).toBe(false);
    });

    it('isLongitude validates valid longitude range', () => {
        expect(isLongitude(0)).toBe(true);
        expect(isLongitude(120)).toBe(true);
        expect(isLongitude(-180)).toBe(true);
        expect(isLongitude(180)).toBe(true);

        expect(isLongitude(181)).toBe(false);
        expect(isLongitude(-181)).toBe(false);
        expect(isLongitude('120')).toBe(false);
    });
});

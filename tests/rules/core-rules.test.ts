import { describe, it, expect } from 'vitest';
import {
    isString,
    isArray,
    isObject,
    isEmpty,
    isArrayOrObject,
    isJson
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

});

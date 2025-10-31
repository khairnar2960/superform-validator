import { describe, it, expect } from 'vitest';
import {
    toCamelCase,
    toKebabCase,
    toPascalCase,
    toSentenceCase,
    toSnakeCase,
    toTitleCase,
    ucFirst,
    toCapitalize
} from '../../src/utils/case';

describe('string case utils', () => {
    it('toCamelCase converts spaced and dashed strings', () => {
        expect(toCamelCase('hello world')).toBe('helloWorld');
        expect(toCamelCase('hello-world_test')).toBe('helloWorldTest');
    });

    it('toKebabCase converts Pascal/camel/space to kebab', () => {
        expect(toKebabCase('HelloWorld')).toBe('hello-world');
        expect(toKebabCase('hello world')).toBe('hello-world');
    });

    it('toPascalCase capitalizes first chars and removes separators', () => {
        expect(toPascalCase('hello world')).toBe('HelloWorld');
        expect(toPascalCase('hello-world_test')).toBe('HelloWorldTest');
    });

    it('toSentenceCase makes proper sentences', () => {
        expect(toSentenceCase('hello. WORLD. how are you')).toBe('Hello. World. How are you.');
    });

    it('toSnakeCase converts to snake_case', () => {
        expect(toSnakeCase('helloWorld')).toBe('hello_world');
        expect(toSnakeCase('Hello World')).toBe('hello_world');
    });

    it('toTitleCase capitalizes words', () => {
        expect(toTitleCase('hello-world_test')).toBe('Hello World Test');
    });

    it('ucFirst uppercases first char and lowercases rest', () => {
        expect(ucFirst('hELLO world')).toBe('Hello world');
        // basic behavior
        expect(ucFirst('john')).toBe('John');
    });

    it('toCapitalize uppercases only first character', () => {
        expect(toCapitalize('john')).toBe('John');
        expect(toCapitalize('John')).toBe('John');
    });
});

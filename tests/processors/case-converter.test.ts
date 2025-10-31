import { describe, it, expect } from 'vitest';
import { CaseConverter } from '../../src/core/processors/case-converter';

describe('CaseConverter', () => {
    it('camel, kebab, pascal, snake, title, sentence, upper/lower, ucFirst, capitalize', () => {
        const c = new CaseConverter();
        expect(c.process('camel', 'hello world')).toBe('helloWorld');
        expect(c.process('kebab', 'HelloWorld')).toBe('hello-world');
        expect(c.process('pascal', 'hello world')).toBe('HelloWorld');
        expect(c.process('snake', 'Hello World')).toBe('hello_world');
        expect(c.process('title', 'hello-world_test')).toBe('Hello World Test');
        expect(c.process('sentence', 'hello. world')).toBe('Hello. World.');
        expect(c.process('lower', 'ABC')).toBe('abc');
        expect(c.process('upper', 'abc')).toBe('ABC');
        expect(c.process('ucFirst', 'john')).toBe('John');
        expect(c.process('capitalize', 'john')).toBe('John');
    });

    it('generateSignatures includes aliases for case converter', () => {
        const c = new CaseConverter();
        const sig = c.generateSignatures();
        expect(sig.type).toBe('case');
        expect(sig.rules.some(r => r.aliases.length > 0)).toBe(true);
    });
});

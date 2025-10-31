import { describe, it, expect } from 'vitest';
import { StringRule } from '../../src/core/rules/string-rule';

describe('StringRule', () => {
    it('validates string type', () => {
        const rule = new StringRule();
        expect(rule.validate('valid', 'hello', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('valid', 123 as any, undefined, {} as any).valid).toBe(false);
    });

    it('minLength, maxLength, length', () => {
        const rule = new StringRule();
        expect(rule.validate('minLength', 'abcd', 3, {} as any).valid).toBe(true);
        expect(rule.validate('minLength', 'ab', 3, {} as any).valid).toBe(false);

        expect(rule.validate('maxLength', 'ab', 3, {} as any).valid).toBe(true);
        expect(rule.validate('maxLength', 'abcd', 3, {} as any).valid).toBe(false);

        expect(rule.validate('length', 'abc', 3, {} as any).valid).toBe(true);
    });

    it('alpha, alphaspace, alphanum, alphanumspace', () => {
        const rule = new StringRule();
        expect(rule.validate('alpha', 'abc', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('alpha', 'a1', undefined, {} as any).valid).toBe(false);

        expect(rule.validate('alphaspace', 'a b', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('alphanum', 'a1', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('alphanumspace', 'a 1', undefined, {} as any).valid).toBe(true);
    });

    it('in and notIn list validators', () => {
        const rule = new StringRule();
        expect(rule.validate('in', 'a', ['a', 'b'], {} as any).valid).toBe(true);
        expect(rule.validate('in', 'c', ['a', 'b'], {} as any).valid).toBe(false);

        expect(rule.validate('notIn', 'c', ['a', 'b'], {} as any).valid).toBe(true);
        expect(rule.validate('notIn', 'a', ['a', 'b'], {} as any).valid).toBe(false);
    });

    it('equals, notEquals, contains, notContains, startsWith, endsWith', () => {
        const rule = new StringRule();
        expect(rule.validate('equals', 'abc', 'abc', {} as any).valid).toBe(true);
        expect(rule.validate('notEquals', 'abc', 'def', {} as any).valid).toBe(true);

        expect(rule.validate('contains', 'hello', 'ell', {} as any).valid).toBe(true);
        expect(rule.validate('notContains', 'hello', 'xyz', {} as any).valid).toBe(true);

        expect(rule.validate('startsWith', 'hello', 'he', {} as any).valid).toBe(true);
        expect(rule.validate('endsWith', 'hello', 'lo', {} as any).valid).toBe(true);
    });

    it('lowercase and uppercase checks', () => {
        const rule = new StringRule();
        expect(rule.validate('lowercase', 'abc', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('uppercase', 'ABC', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('lowercase', 'Abc', undefined, {} as any).valid).toBe(false);
    });

    it('email and mobile basic patterns', () => {
        const rule = new StringRule();
        expect(rule.validate('email', 'a@b.com', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('email', 'not-an-email', undefined, {} as any).valid).toBe(false);

        expect(rule.validate('mobile', '9123456789', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('mobile', '12345', undefined, {} as any).valid).toBe(false);
    });
});

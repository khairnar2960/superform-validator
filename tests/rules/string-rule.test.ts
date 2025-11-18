import { describe, it, expect } from 'vitest';
import { StringRule } from '../../src/core/rules/string-rule';

describe('StringRule', async () => {
    it('validates string type', async () => {
        const rule = new StringRule();
        expect((await rule.validate('valid', 'hello', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('valid', 123 as any, undefined, {} as any)).valid).toBe(false);
    });

    it('minLength, maxLength, length', async () => {
        const rule = new StringRule();
        expect((await rule.validate('minLength', 'abcd', 3, {} as any)).valid).toBe(true);
        expect((await rule.validate('minLength', 'ab', 3, {} as any)).valid).toBe(false);

        expect((await rule.validate('maxLength', 'ab', 3, {} as any)).valid).toBe(true);
        expect((await rule.validate('maxLength', 'abcd', 3, {} as any)).valid).toBe(false);

        expect((await rule.validate('length', 'abc', 3, {} as any)).valid).toBe(true);
    });

    it('alpha, alphaspace, alphanum, alphanumspace', async () => {
        const rule = new StringRule();
        expect((await rule.validate('alpha', 'abc', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('alpha', 'a1', undefined, {} as any)).valid).toBe(false);

        expect((await rule.validate('alphaspace', 'a b', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('alphanum', 'a1', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('alphanumspace', 'a 1', undefined, {} as any)).valid).toBe(true);
    });

    it('in and notIn list validators', async () => {
        const rule = new StringRule();
        expect((await rule.validate('in', 'a', ['a', 'b'], {} as any)).valid).toBe(true);
        expect((await rule.validate('in', 'c', ['a', 'b'], {} as any)).valid).toBe(false);

        expect((await rule.validate('notIn', 'c', ['a', 'b'], {} as any)).valid).toBe(true);
        expect((await rule.validate('notIn', 'a', ['a', 'b'], {} as any)).valid).toBe(false);
    });

    it('equals, notEquals, contains, notContains, startsWith, endsWith', async () => {
        const rule = new StringRule();
        expect((await rule.validate('equals', 'abc', 'abc', {} as any)).valid).toBe(true);
        expect((await rule.validate('notEquals', 'abc', 'def', {} as any)).valid).toBe(true);

        expect((await rule.validate('contains', 'hello', 'ell', {} as any)).valid).toBe(true);
        expect((await rule.validate('notContains', 'hello', 'xyz', {} as any)).valid).toBe(true);

        expect((await rule.validate('startsWith', 'hello', 'he', {} as any)).valid).toBe(true);
        expect((await rule.validate('endsWith', 'hello', 'lo', {} as any)).valid).toBe(true);
    });

    it('lowercase and uppercase checks', async () => {
        const rule = new StringRule();
        expect((await rule.validate('lowercase', 'abc', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('uppercase', 'ABC', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('lowercase', 'Abc', undefined, {} as any)).valid).toBe(false);
    });

    it('email and mobile basic patterns', async () => {
        const rule = new StringRule();
        expect((await rule.validate('email', 'a@b.com', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('email', 'not-an-email', undefined, {} as any)).valid).toBe(false);

        expect((await rule.validate('mobile', '9123456789', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('mobile', '12345', undefined, {} as any)).valid).toBe(false);
    });
});

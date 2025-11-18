import { describe, it, expect } from 'vitest';
import { IntegerRule } from '../../src/core/rules/integer-rule';

describe('IntegerRule', async () => {
    it('validates integer strings', async () => {
        const rule = new IntegerRule();
        expect((await rule.validate('valid', '123', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('valid', '-10', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('valid', '12.3', undefined, {} as any)).valid).toBe(false);
    });

    it('positive and negative validators', async () => {
        const rule = new IntegerRule();
        expect((await rule.validate('positive', '5', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('positive', '-1', undefined, {} as any)).valid).toBe(false);

        expect((await rule.validate('negative', '-2', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('negative', '0', undefined, {} as any)).valid).toBe(false);
    });

    it('min, max, between enforce ranges', async () => {
        const rule = new IntegerRule();
        expect((await rule.validate('min', '5', 3, {} as any)).valid).toBe(true);
        expect((await rule.validate('min', '2', 3, {} as any)).valid).toBe(false);

        expect((await rule.validate('max', '2', 3, {} as any)).valid).toBe(true);
        expect((await rule.validate('max', '4', 3, {} as any)).valid).toBe(false);

        expect((await rule.validate('between', '5', { min: 4, max: 6 }, {} as any)).valid).toBe(true);
        expect((await rule.validate('between', '7', { min: 4, max: 6 }, {} as any)).valid).toBe(false);
    });

    it('even and odd validators', async () => {
        const rule = new IntegerRule();
        expect((await rule.validate('even', '4', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('even', '3', undefined, {} as any)).valid).toBe(false);

        expect((await rule.validate('odd', '3', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('odd', '4', undefined, {} as any)).valid).toBe(false);
    });

    it('equals, notEquals, gt/gte/lt/lte', async () => {
        const rule = new IntegerRule();
        expect((await rule.validate('equals', '5', 5, {} as any)).valid).toBe(true);
        expect((await rule.validate('notEquals', '5', 5, {} as any)).valid).toBe(false);

        expect((await rule.validate('gt', '6', 5, {} as any)).valid).toBe(true);
        expect((await rule.validate('gte', '5', 5, {} as any)).valid).toBe(true);
        expect((await rule.validate('lt', '4', 5, {} as any)).valid).toBe(true);
        expect((await rule.validate('lte', '5', 5, {} as any)).valid).toBe(true);
    });
});

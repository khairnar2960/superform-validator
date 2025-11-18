import { describe, it, expect } from 'vitest';
import { FloatRule } from '../../src/core/rules/float-rule';

describe('FloatRule', async () => {
    it('validates decimal numbers and rejects integers without dot', async () => {
        const rule = new FloatRule();
        expect((await rule.validate('valid', '12.34', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('valid', '12', undefined, {} as any)).valid).toBe(false);
        expect((await rule.validate('valid', '+3.14', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('valid', '-0.5', undefined, {} as any)).valid).toBe(true);
    });

    it('positive and negative validators', async () => {
        const rule = new FloatRule();
        expect((await rule.validate('positive', '2.5', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('positive', '-1.2', undefined, {} as any)).valid).toBe(false);

        expect((await rule.validate('negative', '-1.2', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('negative', '0.0', undefined, {} as any)).valid).toBe(false);
    });

    it('min, max, between enforce numeric ranges', async () => {
        const rule = new FloatRule();
        expect((await rule.validate('min', '2.5', 2, {} as any)).valid).toBe(true);
        expect((await rule.validate('min', '1.5', 2, {} as any)).valid).toBe(false);

        expect((await rule.validate('max', '1.5', 2, {} as any)).valid).toBe(true);
        expect((await rule.validate('max', '2.5', 2, {} as any)).valid).toBe(false);

        expect((await rule.validate('between', '3.5', { min: 3, max: 4 }, {} as any)).valid).toBe(true);
        expect((await rule.validate('between', '5.0', { min: 3, max: 4 }, {} as any)).valid).toBe(false);
    });

    it('equals, notEquals, gt, gte, lt, lte work as expected', async () => {
        const rule = new FloatRule();
        expect((await rule.validate('equals', '2.50', 2.5, {} as any)).valid).toBe(true);
        expect((await rule.validate('notEquals', '2.50', 2.5, {} as any)).valid).toBe(false);

        expect((await rule.validate('gt', '3.1', 3, {} as any)).valid).toBe(true);
        expect((await rule.validate('gte', '3.0', 3, {} as any)).valid).toBe(true);
        expect((await rule.validate('lt', '2.9', 3, {} as any)).valid).toBe(true);
        expect((await rule.validate('lte', '3.0', 3, {} as any)).valid).toBe(true);
    });
});

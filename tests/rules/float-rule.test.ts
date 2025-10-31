import { describe, it, expect } from 'vitest';
import { FloatRule } from '../../src/core/rules/float-rule';

describe('FloatRule', () => {
    it('validates decimal numbers and rejects integers without dot', () => {
        const rule = new FloatRule();
        expect(rule.validate('valid', '12.34', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('valid', '12', undefined, {} as any).valid).toBe(false);
        expect(rule.validate('valid', '+3.14', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('valid', '-0.5', undefined, {} as any).valid).toBe(true);
    });

    it('positive and negative validators', () => {
        const rule = new FloatRule();
        expect(rule.validate('positive', '2.5', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('positive', '-1.2', undefined, {} as any).valid).toBe(false);

        expect(rule.validate('negative', '-1.2', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('negative', '0.0', undefined, {} as any).valid).toBe(false);
    });

    it('min, max, between enforce numeric ranges', () => {
        const rule = new FloatRule();
        expect(rule.validate('min', '2.5', 2, {} as any).valid).toBe(true);
        expect(rule.validate('min', '1.5', 2, {} as any).valid).toBe(false);

        expect(rule.validate('max', '1.5', 2, {} as any).valid).toBe(true);
        expect(rule.validate('max', '2.5', 2, {} as any).valid).toBe(false);

        expect(rule.validate('between', '3.5', { min: 3, max: 4 }, {} as any).valid).toBe(true);
        expect(rule.validate('between', '5.0', { min: 3, max: 4 }, {} as any).valid).toBe(false);
    });

    it('equals, notEquals, gt, gte, lt, lte work as expected', () => {
        const rule = new FloatRule();
        expect(rule.validate('equals', '2.50', 2.5, {} as any).valid).toBe(true);
        expect(rule.validate('notEquals', '2.50', 2.5, {} as any).valid).toBe(false);

        expect(rule.validate('gt', '3.1', 3, {} as any).valid).toBe(true);
        expect(rule.validate('gte', '3.0', 3, {} as any).valid).toBe(true);
        expect(rule.validate('lt', '2.9', 3, {} as any).valid).toBe(true);
        expect(rule.validate('lte', '3.0', 3, {} as any).valid).toBe(true);
    });
});

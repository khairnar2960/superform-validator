import { describe, it, expect } from 'vitest';
import { IntegerRule } from '../../src/core/rules/integer-rule';

describe('IntegerRule', () => {
    it('validates integer strings', () => {
        const rule = new IntegerRule();
        expect(rule.validate('valid', '123', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('valid', '-10', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('valid', '12.3', undefined, {} as any).valid).toBe(false);
    });

    it('positive and negative validators', () => {
        const rule = new IntegerRule();
        expect(rule.validate('positive', '5', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('positive', '-1', undefined, {} as any).valid).toBe(false);

        expect(rule.validate('negative', '-2', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('negative', '0', undefined, {} as any).valid).toBe(false);
    });

    it('min, max, between enforce ranges', () => {
        const rule = new IntegerRule();
        expect(rule.validate('min', '5', 3, {} as any).valid).toBe(true);
        expect(rule.validate('min', '2', 3, {} as any).valid).toBe(false);

        expect(rule.validate('max', '2', 3, {} as any).valid).toBe(true);
        expect(rule.validate('max', '4', 3, {} as any).valid).toBe(false);

        expect(rule.validate('between', '5', { min: 4, max: 6 }, {} as any).valid).toBe(true);
        expect(rule.validate('between', '7', { min: 4, max: 6 }, {} as any).valid).toBe(false);
    });

    it('even and odd validators', () => {
        const rule = new IntegerRule();
        expect(rule.validate('even', '4', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('even', '3', undefined, {} as any).valid).toBe(false);

        expect(rule.validate('odd', '3', undefined, {} as any).valid).toBe(true);
        expect(rule.validate('odd', '4', undefined, {} as any).valid).toBe(false);
    });

    it('equals, notEquals, gt/gte/lt/lte', () => {
        const rule = new IntegerRule();
        expect(rule.validate('equals', '5', 5, {} as any).valid).toBe(true);
        expect(rule.validate('notEquals', '5', 5, {} as any).valid).toBe(false);

        expect(rule.validate('gt', '6', 5, {} as any).valid).toBe(true);
        expect(rule.validate('gte', '5', 5, {} as any).valid).toBe(true);
        expect(rule.validate('lt', '4', 5, {} as any).valid).toBe(true);
        expect(rule.validate('lte', '5', 5, {} as any).valid).toBe(true);
    });
});

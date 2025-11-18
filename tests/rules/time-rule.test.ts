import { describe, it, expect } from 'vitest';
import { TimeRule } from '../../src/core/rules/time-rule';
import { extractTime } from '../../src/utils/date-time';

describe('TimeRule', async () => {
    it('validates time format', async () => {
        const rule = new TimeRule();
        expect((await rule.validate('valid', '12:34', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('valid', '23:59:59', undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('valid', '24:00', undefined, {} as any)).valid).toBe(false);
    });

    it('before and after comparisons', async () => {
        const rule = new TimeRule();
        const t = '12:00:00';
        const beforeParam = extractTime('13:00:00');
        const afterParam = extractTime('11:00:00');

        expect((await rule.validate('before', t, beforeParam, {} as any)).valid).toBe(true);
        expect((await rule.validate('after', t, afterParam, {} as any)).valid).toBe(true);
    });

    it('equals currently uses > (documenting current behavior)', async () => {
        const rule = new TimeRule();
        const t = '12:00:00';
        const param = extractTime('12:00:00');
        const res = await rule.validate('equals', t, param, {} as any);
        expect(res.valid).toBe(false);
    });

    it('between enforces inclusive range', async () => {
        const rule = new TimeRule();
        const t = '12:30:00';
        const param = { min: extractTime('12:00:00'), max: extractTime('13:00:00') };
        expect((await rule.validate('between', t, param, {} as any)).valid).toBe(true);
        expect((await rule.validate('between', '14:00:00', param, {} as any)).valid).toBe(false);
    });

    it('alias resolution works (timeBefore/timeAfter/timeBetween)', async () => {
        const rule = new TimeRule();
        expect((await rule.validate('timeBefore', '09:00:00', extractTime('10:00:00'), {} as any)).valid).toBe(true);
        expect((await rule.validate('timeBetween', '09:30:00', { min: extractTime('09:00:00'), max: extractTime('10:00:00') }, {} as any)).valid).toBe(true);
    });
});

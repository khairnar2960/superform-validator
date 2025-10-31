import { describe, it, expect } from 'vitest';
import { CastingProcessor } from '../../src/core/processors/casting';

describe('CastingProcessor', () => {
    it('integer and float cast correctly', () => {
        const c = new CastingProcessor();
        expect(c.process('integer', '42')).toBe(42);
        expect(c.process('float', '3.14')).toBeCloseTo(3.14);
    });

    it('boolean casts common values', () => {
        const c = new CastingProcessor();
        expect(c.process('boolean', 'false')).toBe(false);
        expect(c.process('boolean', '0')).toBe(false);
        expect(c.process('boolean', 'true')).toBe(true);
        expect(c.process('boolean', '')).toBe(false);
    });

    it('toJson and fromJson roundtrip and handle invalid json', () => {
        const c = new CastingProcessor();
        const obj = { a: 1 };
        const s = c.process('toJson', obj);
        expect(typeof s).toBe('string');

        const parsed = c.process('fromJson', s);
        expect(parsed).toEqual(obj);

        // invalid JSON returns undefined (implementation swallows error)
        const bad = c.process('fromJson', 'not json');
        expect(typeof bad === 'undefined').toBe(true);
    });
});

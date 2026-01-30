import { describe, it, expect } from 'vitest';
import { MathProcessor } from '../../src/core/processors/math';

describe('MathProcessor', () => {
    it('ceil, floor and round behave as expected', () => {
        const m = new MathProcessor();
        expect(m.process('ceil', 1.1)).toBe(2);
        expect(m.process('floor', 1.9)).toBe(1);
        expect(m.process('round', 1.5)).toBe(2);
    });

    it('toFixed uses provided param when passed', () => {
        const m = new MathProcessor();

        const res = m.process('toFixed', 1.2345, 2);
        expect(res).toBe('1.23');

        const res3 = m.process('toFixed', 1.2345, 3);
        expect(res3).toBe('1.234');
    });

    it('toFixed defaults to 0 decimals when param is undefined', () => {
        const m = new MathProcessor();

        const res = m.process('toFixed', 1.2345);
        expect(res).toBe('1');
    });

    it('throws error for unregistered processor function', () => {
        const m = new MathProcessor();

        expect(() => {
            m.process('unknown', 1.23);
        }).toThrow('Function unknown is not registered in math');
    });

    it('uses registered names only (aliases are for documentation)', () => {
        const m = new MathProcessor();

        expect(m.process('ceil', 2.1)).toBe(3);
        expect(m.process('floor', 2.9)).toBe(2);

        // aliases should NOT resolve at runtime
        expect(() => {
            m.process('roundUp', 2.1);
        }).toThrow();
    });
});

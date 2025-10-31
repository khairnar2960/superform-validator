import { describe, it, expect } from 'vitest';
import { MathProcessor } from '../../src/core/processors/math';

describe('MathProcessor', () => {
    it('ceil, floor and round behave as expected', () => {
        const m = new MathProcessor();
        expect(m.process('ceil', 1.1)).toBe(2);
        expect(m.process('floor', 1.9)).toBe(1);
        expect(m.process('round', 1.5)).toBe(2);
    });

    it('toFixed without decimals uses default behavior (processors call with single arg)', () => {
        const m = new MathProcessor();
        const res = m.process('toFixed', 1.2345);
        // ProcessorFunc.process calls callbacks with only the value, so param defaults to 0
        expect(String(res)).toBe('1');
    });

    it('uses registered names (ceil/floor) — aliases are for signatures only', () => {
        const m = new MathProcessor();
        expect(m.process('ceil', 2.1)).toBe(3);
        expect(m.process('floor', 2.9)).toBe(2);
    });
});

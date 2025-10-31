import { describe, it, expect } from 'vitest';
import { pad2, ExtractedDate, ExtractedTime, ExtractedDateTime, extractDate, extractTime, extractDateTime } from '../../src/utils/date-time';

describe('date-time utils', () => {
    it('pad2 pads single digit numbers', () => {
        expect(pad2(5)).toBe('05');
        expect(pad2('9')).toBe('09');
        expect(pad2(12)).toBe('12');
    });

    it('ExtractedDate toString and toDate work', () => {
        const ed = new ExtractedDate(2025, 0, 3); // Jan 3, 2025
        expect(ed.toString()).toBe('2025-01-03');
        const d = ed.toDate();
        expect(d.getFullYear()).toBe(2025);
        expect(d.getMonth()).toBe(0);
        expect(d.getDate()).toBe(3);
    });

    it('ExtractedTime toString and toDate work', () => {
        const et = new ExtractedTime(5, 6, 7);
        expect(et.toString()).toBe('05:06:07');
        const d = et.toDate();
        expect(d.getHours()).toBe(5);
        expect(d.getMinutes()).toBe(6);
        expect(d.getSeconds()).toBe(7);
    });

    it('ExtractedDateTime toString and toDate work', () => {
        const edt = new ExtractedDateTime(2025, 11, 31, 23, 59, 59);
        expect(edt.toString()).toBe('2025-12-31 23:59:59');
        const d = edt.toDate();
        expect(d.getFullYear()).toBe(2025);
        expect(d.getMonth()).toBe(11);
        expect(d.getDate()).toBe(31);
        expect(d.getHours()).toBe(23);
    });

    it('extractDate parses valid date and throws on invalid', () => {
        const ed = extractDate('2025-07-04');
        expect(ed.toString()).toBe('2025-07-04');
        expect(() => extractDate('07-04-2025')).toThrow();
    });

    it('extractTime parses valid time and throws on invalid', () => {
        const et = extractTime('05:06:07');
        expect(et.toString()).toBe('05:06:07');
        expect(() => extractTime('25:00')).toThrow();
    });

    it('extractDateTime parses valid datetime and throws on invalid', () => {
        const edt = extractDateTime('2025-07-04 12:34:56');
        expect(edt.toString()).toBe('2025-07-04 12:34:56');
        expect(() => extractDateTime('invalid')).toThrow();
    });
});

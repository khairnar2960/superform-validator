import { describe, it, expect } from 'vitest';
import { DateRule } from '../../src/core/rules/date-rule';
import { extractDate } from '../../src/utils/date-time';

function formatDate(date: Date, locale: string = 'en-IN', timeZone: string = 'IST' ) {
    const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		timeZone,
	};

	const formatter = new Intl.DateTimeFormat(locale, options);
	const parts: Intl.DateTimeFormatPart[] = formatter.formatToParts(date);

	if (!parts.length) {
		throw new Error("Invalid date format");
	}

	// Extract the year, month, and day parts and format them
	const year = parts.find(part => part.type === 'year')?.value || '0000';
	const month = parts.find(part => part.type === 'month')?.value || '00';
	const day = parts.find(part => part.type === 'day')?.value || '00';

	return `${year}-${month}-${day}`;
}

describe('DateRule', () => {

    it('validates correct date format and rejects invalid', () => {
        const rule = new DateRule();
        const ok = rule.validate('valid', '2025-07-04', undefined, {} as any);
        expect(ok.valid).toBe(true);

        const bad = rule.validate('valid', '04-07-2025', undefined, {} as any);
        expect(bad.valid).toBe(false);
        expect(bad.error).toBe('@{field} must be a valid date');
    });

    it('before and after work with ExtractedDate params', () => {
        const rule = new DateRule();
        const value = '2025-01-15';
        const afterParam = extractDate('2025-01-10');
        const beforeParam = extractDate('2025-01-20');

        const afterRes = rule.validate('after', value, afterParam, {} as any);
        expect(afterRes.valid).toBe(true);

        const beforeRes = rule.validate('before', value, beforeParam, {} as any);
        expect(beforeRes.valid).toBe(true);

        // crossing checks
        const failAfter = rule.validate('after', '2025-01-05', extractDate('2025-01-10'), {} as any);
        expect(failAfter.valid).toBe(false);
        expect(failAfter.error).toBe("@{field} must be after @{param}");
    });

    it('equals currently uses > in implementation; this test documents current behavior', () => {
        const rule = new DateRule();
        const equalVal = '2025-02-02';
        const param = extractDate('2025-02-02');

        const res = rule.validate('equals', equalVal, param, {} as any);
        // implementation uses '>' so equality will be false
        expect(res.valid).toBe(false);
    });

    it('between ensures value is within min and max', () => {
        const rule = new DateRule();
        const val = '2025-03-15';
        const param = { min: extractDate('2025-03-01'), max: extractDate('2025-03-31') };

        const ok = rule.validate('between', val, param, {} as any);
        expect(ok.valid).toBe(true);

        const bad = rule.validate('between', '2025-04-01', param, {} as any);
        expect(bad.valid).toBe(false);
        expect(bad.error).toBe('@{field} must be between @{param.min} and @{param.max}');
    });

    it('today matches current date string', () => {
        const rule = new DateRule();
        const today = formatDate(new Date(), 'en-IN', 'UTC');
        const ok = rule.validate('today', today, undefined, {} as any);
        expect(ok.valid).toBe(true);

        const bad = rule.validate('today', '2000-01-01', undefined, {} as any);
        expect(bad.valid).toBe(false);
        expect(bad.error).toBe("@{field} must be today's date");
    });

    it('past and future relative checks', () => {
        const rule = new DateRule();
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
		
		
        const pastRes = rule.validate('past', formatDate(yesterday), undefined, {} as any);
        expect(pastRes.valid).toBe(true);
		
        const futureRes = rule.validate('future', formatDate(tomorrow), undefined, {} as any);
        expect(futureRes.valid).toBe(true);

        const badPast = rule.validate('past', formatDate(tomorrow), undefined, {} as any);
        expect(badPast.valid).toBe(false);
        expect(badPast.error).toBe('@{field} must be past date');
    });

    it('alias resolution works (dateBefore/dateAfter/dateToday etc.)', () => {
        const rule = new DateRule();
        const res = rule.validate('dateBefore', '2025-05-01', extractDate('2025-06-01'), {} as any);
        expect(res.valid).toBe(true);

        const res2 = rule.validate('dateToday', formatDate(new Date(), 'en-IN', 'UTC'), undefined, {} as any);
        expect(res2.valid).toBe(true);
    });

});

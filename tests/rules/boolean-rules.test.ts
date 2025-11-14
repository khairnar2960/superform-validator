import { describe, it, expect } from 'vitest';
import { BooleanRule } from '../../src/core/rules/boolean-rule';

describe('BoolanRule', () => {

	it('validates boolean type using `valid` function', () => {
		const rule = new BooleanRule();
		const res1 = rule.validate('valid', true, undefined, {} as any);
		expect(res1.valid).toBe(true);

        const res2 = rule.validate('valid', false, undefined, {} as any);
		expect(res2.valid).toBe(true);
	});

	it('fails when value is not an boolean', () => {
		const rule = new BooleanRule();
		const res = rule.validate('valid', 'not-an-boolean', undefined, {} as any);
		expect(res.valid).toBe(false);
		expect(res.error).toBe('@{field} must be a valid boolean');
	});
});


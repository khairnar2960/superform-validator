import { describe, it, expect } from 'vitest';
import { ArrayRule } from '../../src/core/rules/array-rules';

describe('ArrayRule', () => {

	it('validates array type using `valid` function', () => {
		const rule = new ArrayRule();
		const res = rule.validate('valid', [1, 2, 3], undefined, {} as any);
		expect(res.valid).toBe(true);
	});

	it('fails when value is not an array', () => {
		const rule = new ArrayRule();
		const res = rule.validate('valid', 'not-an-array', undefined, {} as any);
		expect(res.valid).toBe(false);
		expect(res.error).toBe('@{field} must be a valid array');
	});

	it('notEmpty passes for non-empty arrays and fails for empty', () => {
		const rule = new ArrayRule();
		const ok = rule.validate('notEmpty', [1], undefined, {} as any);
		expect(ok.valid).toBe(true);

		const bad = rule.validate('notEmpty', [], undefined, {} as any);
		expect(bad.valid).toBe(false);
		expect(bad.error).toBe('@{field} cannot be empty array');
	});

	it('unique passes for unique arrays and fails for duplicates', () => {
		const rule = new ArrayRule();
		const ok = rule.validate('unique', [1, 2, 3], undefined, {} as any);
		expect(ok.valid).toBe(true);

		const bad = rule.validate('unique', [1, 2, 1], undefined, {} as any);
		expect(bad.valid).toBe(false);
		expect(bad.error).toBe('@{field} must have unique items');
	});

	it('minItems and maxItems enforce lengths with param', () => {
		const rule = new ArrayRule();
		const okMin = rule.validate('minItems', [1, 2], 2, {} as any);
		expect(okMin.valid).toBe(true);

		const badMin = rule.validate('minItems', [1], 2, {} as any);
		expect(badMin.valid).toBe(false);
		expect(badMin.error).toBe('@{field} must have at least @{param} items');

		const okMax = rule.validate('maxItems', [1], 2, {} as any);
		expect(okMax.valid).toBe(true);

		const badMax = rule.validate('maxItems', [1, 2, 3], 2, {} as any);
		expect(badMax.valid).toBe(false);
		expect(badMax.error).toBe('@{field} must have maximum @{param} items');
	});

	it('includes and excludes check for presence of an item', () => {
		const rule = new ArrayRule();
		const okInc = rule.validate('includes', ["a", "b"], 'a', {} as any);
		expect(okInc.valid).toBe(true);

		const badInc = rule.validate('includes', ["a"], 'b', {} as any);
		expect(badInc.valid).toBe(false);
		expect(badInc.error).toBe('@{field} must include @{param}');

		const okExc = rule.validate('excludes', ["a"], 'b', {} as any);
		expect(okExc.valid).toBe(true);

		const badExc = rule.validate('excludes', ["a", "b"], 'b', {} as any);
		expect(badExc.valid).toBe(false);
		expect(badExc.error).toBe('@{field} must not include @{param}');
	});

	it('latLong validates two-number coordinate arrays', () => {
		const rule = new ArrayRule();
		const ok = rule.validate('latLong', [12, 77], undefined, {} as any);
		expect(ok.valid).toBe(true);

		const badRange = rule.validate('latLong', [200, 300], undefined, {} as any);
		expect(badRange.valid).toBe(false);
		expect(badRange.error).toBe('@{field} must be a valid [latitude, longitude] coordinate array');

		const badLen = rule.validate('latLong', [12], undefined, {} as any);
		expect(badLen.valid).toBe(false);
	});

	it('resolves and validates via alias names', () => {
		const rule = new ArrayRule();
		// unique has alias 'uniqueArray'
		const res = rule.validate('uniqueArray', [1, 2, 3], undefined, {} as any);
		expect(res.valid).toBe(true);
	});

});


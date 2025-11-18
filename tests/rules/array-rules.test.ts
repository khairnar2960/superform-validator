import { describe, it, expect } from 'vitest';
import { ArrayRule } from '../../src/core/rules/array-rules';

describe('ArrayRule', () => {

	it('validates array type using `valid` function', async () => {
		const rule = new ArrayRule();
		const res = await rule.validate('valid', [1, 2, 3], undefined, {} as any);
		expect(res.valid).toBe(true);
	});

	it('fails when value is not an array', async () => {
		const rule = new ArrayRule();
		const res = await rule.validate('valid', 'not-an-array', undefined, {} as any);
		expect(res.valid).toBe(false);
		expect(res.error).toBe('@{field} must be a valid array');
	});

	it('notEmpty passes for non-empty arrays and fails for empty', async () => {
		const rule = new ArrayRule();
		const ok = await rule.validate('notEmpty', [1], undefined, {} as any);
		expect(ok.valid).toBe(true);

		const bad = await rule.validate('notEmpty', [], undefined, {} as any);
		expect(bad.valid).toBe(false);
		expect(bad.error).toBe('@{field} cannot be empty array');
	});

	it('unique passes for unique arrays and fails for duplicates', async () => {
		const rule = new ArrayRule();
		const ok = await rule.validate('unique', [1, 2, 3], undefined, {} as any);
		expect(ok.valid).toBe(true);

		const bad = await rule.validate('unique', [1, 2, 1], undefined, {} as any);
		expect(bad.valid).toBe(false);
		expect(bad.error).toBe('@{field} must have unique items');
	});

	it('minItems and maxItems enforce lengths with param', async () => {
		const rule = new ArrayRule();
		const okMin = await rule.validate('minItems', [1, 2], 2, {} as any);
		expect(okMin.valid).toBe(true);

		const badMin = await rule.validate('minItems', [1], 2, {} as any);
		expect(badMin.valid).toBe(false);
		expect(badMin.error).toBe('@{field} must have at least @{param} items');

		const okMax = await rule.validate('maxItems', [1], 2, {} as any);
		expect(okMax.valid).toBe(true);

		const badMax = await rule.validate('maxItems', [1, 2, 3], 2, {} as any);
		expect(badMax.valid).toBe(false);
		expect(badMax.error).toBe('@{field} must have maximum @{param} items');
	});

	it('includes and excludes check for presence of an item', async () => {
		const rule = new ArrayRule();
		const okInc = await rule.validate('includes', ["a", "b"], 'a', {} as any);
		expect(okInc.valid).toBe(true);

		const badInc = await rule.validate('includes', ["a"], 'b', {} as any);
		expect(badInc.valid).toBe(false);
		expect(badInc.error).toBe('@{field} must include @{param}');

		const okExc = await rule.validate('excludes', ["a"], 'b', {} as any);
		expect(okExc.valid).toBe(true);

		const badExc = await rule.validate('excludes', ["a", "b"], 'b', {} as any);
		expect(badExc.valid).toBe(false);
		expect(badExc.error).toBe('@{field} must not include @{param}');
	});

	it('latLong validates two-number coordinate arrays', async () => {
		const rule = new ArrayRule();
		const ok = await rule.validate('latLong', [12, 77], undefined, {} as any);
		expect(ok.valid).toBe(true);

		const badRange = await rule.validate('latLong', [200, 300], undefined, {} as any);
		expect(badRange.valid).toBe(false);
		expect(badRange.error).toBe('@{field} must be a valid [latitude, longitude] coordinate array');

		const badLen = await rule.validate('latLong', [12], undefined, {} as any);
		expect(badLen.valid).toBe(false);
	});

	it('longLat validates two-number coordinate arrays', async () => {
		const rule = new ArrayRule();
		const ok = await rule.validate('longLat', [12, 77], undefined, {} as any);
		expect(ok.valid).toBe(true);

		const badRange = await rule.validate('longLat', [200, 300], undefined, {} as any);
		expect(badRange.valid).toBe(false);
		expect(badRange.error).toBe('@{field} must be a valid [longitude, latitude] coordinate array');

		const badLen = await rule.validate('longLat', [12], undefined, {} as any);
		expect(badLen.valid).toBe(false);
	});

	it('resolves and validates arrayOf(string)', async () => {
		const rule = new ArrayRule();
		const res1 = await rule.validate('arrayOf', ['a', 'b', 'c'], 'string', {} as any);
		expect(res1.valid).toBe(true);

		const res2 = await rule.validate('arrayOf', [1, '2', '3'], 'string', {} as any);
		expect(res2.valid).toBe(false);
		expect(res2.error).toBe('@{field} must be a valid array of @{param}');
	});

	it('resolves and validates arrayOf(number)', async () => {
		const rule = new ArrayRule();
		const res1 = await rule.validate('arrayOf', [1, 2, 3], 'number', {} as any);
		expect(res1.valid).toBe(true);

		const res2 = await rule.validate('arrayOf', ['1', 2, 3], 'number', {} as any);
		expect(res2.valid).toBe(false);
		expect(res2.error).toBe('@{field} must be a valid array of @{param}');
	});

	it('resolves and validates arrayOf(boolean)', async () => {
		const rule = new ArrayRule();
		const res1 = await rule.validate('arrayOf', [true, false, true], 'boolean', {} as any);
		expect(res1.valid).toBe(true);

		const res2 = await rule.validate('arrayOf', [1, '2', true], 'boolean', {} as any);
		expect(res2.valid).toBe(false);
		expect(res2.error).toBe('@{field} must be a valid array of @{param}');
	});

	it('resolves and validates arrayOf(integer)', async () => {
		const rule = new ArrayRule();
		const res1 = await rule.validate('arrayOf', [1, 2, 3], 'integer', {} as any);
		expect(res1.valid).toBe(true);

		const res2 = await rule.validate('arrayOf', [1, 2, 3.01], 'integer', {} as any);
		expect(res2.valid).toBe(false);
		expect(res2.error).toBe('@{field} must be a valid array of @{param}');
	});

	it('resolves and validates arrayOf(float)', async () => {
		const rule = new ArrayRule();
		const res1 = await rule.validate('arrayOf', [1.2, 3.4, 5.6], 'float', {} as any);
		expect(res1.valid).toBe(true);

		const res2 = await rule.validate('arrayOf', [1, 2.3, 4.5], 'float', {} as any);
		expect(res2.valid).toBe(false);
		expect(res2.error).toBe('@{field} must be a valid array of @{param}');
	});

	it('resolves and validates arrayOf(array)', async () => {
		const rule = new ArrayRule();
		const res1 = await rule.validate('arrayOf', [[1], [2], [3]], 'array', {} as any);
		expect(res1.valid).toBe(true);

		const res2 = await rule.validate('arrayOf', [1, '2', true, [0]], 'array', {} as any);
		expect(res2.valid).toBe(false);
		expect(res2.error).toBe('@{field} must be a valid array of @{param}');
	});

	it('resolves and validates arrayOf(object)', async () => {
		const rule = new ArrayRule();
		const res1 = await rule.validate('arrayOf', [{a: 1}, {b: 2}, {c: 3}], 'object', {} as any);
		expect(res1.valid).toBe(true);

		const res2 = await rule.validate('arrayOf', [1, '2', true, {a: 1}], 'object', {} as any);
		expect(res2.valid).toBe(false);
		expect(res2.error).toBe('@{field} must be a valid array of @{param}');
	});

	it('resolves and validates via alias names', async () => {
		const rule = new ArrayRule();
		// unique has alias 'uniqueArray'
		const res = await rule.validate('uniqueArray', [1, 2, 3], undefined, {} as any);
		expect(res.valid).toBe(true);
	});

});


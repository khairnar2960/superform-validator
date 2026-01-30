import { describe, it, expect } from 'vitest';
import { ObjectRule } from '../../src/core/rules/object-rules';

describe('ObjectRule', () => {

	it('validates object type using `valid` function', async () => {
		const rule = new ObjectRule();
		const res = await rule.validate('valid', { a: 1 }, undefined, {} as any);
		expect(res.valid).toBe(true);
	});

	it('fails when value is not an object', async () => {
		const rule = new ObjectRule();
		const res = await rule.validate('valid', 'not-an-object', undefined, {} as any);
		expect(res.valid).toBe(false);
		expect(res.error).toBe('@{field} must be a valid object');
	});

	it('notEmpty passes for non-empty objects and fails for empty', async () => {
		const rule = new ObjectRule();
		const ok = await rule.validate('notEmpty', { a: 1 }, undefined, {} as any);
		expect(ok.valid).toBe(true);

		const bad = await rule.validate('notEmpty', {}, undefined, {} as any);
		expect(bad.valid).toBe(false);
		expect(bad.error).toBe('@{field} cannot be empty object');
	});

	it('includes checks for presence of a key', async () => {
		const rule = new ObjectRule();
		const ok = await rule.validate('includes', { a: 1 }, 'a', {} as any);
		expect(ok.valid).toBe(true);

		const bad = await rule.validate('includes', { a: 1 }, 'b', {} as any);
		expect(bad.valid).toBe(false);
		expect(bad.error).toBe('@{field} must include @{param}');
	});

	it('excludes checks for absence of a key', async () => {
		const rule = new ObjectRule();
		const ok = await rule.validate('excludes', { a: 1 }, 'b', {} as any);
		expect(ok.valid).toBe(true);

		const bad = await rule.validate('excludes', { a: 1 }, 'a', {} as any);
		expect(bad.valid).toBe(false);
		expect(bad.error).toBe('@{field} must not include @{param}');
	});

	it('hasKeys requires all specified keys', async () => {
		const rule = new ObjectRule();
		const ok = await rule.validate('hasKeys', { a: 1, b: 2 }, ['a', 'b'], {} as any);
		expect(ok.valid).toBe(true);

		const bad = await rule.validate('hasKeys', { a: 1 }, ['a', 'b'], {} as any);
		expect(bad.valid).toBe(false);
		expect(bad.error).toBe('@{field} must contain keys: @{param}');
	});

	it('hasAnyKey requires at least one specified key', async () => {
		const rule = new ObjectRule();
		const ok = await rule.validate('hasAnyKey', { a: 1 }, ['a', 'b'], {} as any);
		expect(ok.valid).toBe(true);

		const bad = await rule.validate('hasAnyKey', { c: 1 }, ['a', 'b'], {} as any);
		expect(bad.valid).toBe(false);
		expect(bad.error).toBe('@{field} must contain at least one of: @{param}');
	});

	it('onlyKeys fails when extra keys are present', async () => {
		const rule = new ObjectRule();
		const ok = await rule.validate('onlyKeys', { a: 1 }, ['a'], {} as any);
		expect(ok.valid).toBe(true);

		const bad = await rule.validate('onlyKeys', { a: 1, b: 2 }, ['a'], {} as any);
		expect(bad.valid).toBe(false);
		expect(bad.error).toBe('@{field} contains invalid keys');
	});

	it('minKeys and maxKeys enforce key counts', async () => {
		const rule = new ObjectRule();

		const okMin = await rule.validate('minKeys', { a: 1, b: 2 }, 2, {} as any);
		expect(okMin.valid).toBe(true);

		const badMin = await rule.validate('minKeys', { a: 1 }, 2, {} as any);
		expect(badMin.valid).toBe(false);
		expect(badMin.error).toBe('@{field} must have at least @{param} keys');

		const okMax = await rule.validate('maxKeys', { a: 1 }, 2, {} as any);
		expect(okMax.valid).toBe(true);

		const badMax = await rule.validate('maxKeys', { a: 1, b: 2, c: 3 }, 2, {} as any);
		expect(badMax.valid).toBe(false);
		expect(badMax.error).toBe('@{field} must not exceed @{param} keys');
	});

	it('exactKeys enforces exact key count', async () => {
		const rule = new ObjectRule();
		const ok = await rule.validate('exactKeys', { a: 1, b: 2 }, 2, {} as any);
		expect(ok.valid).toBe(true);

		const bad = await rule.validate('exactKeys', { a: 1 }, 2, {} as any);
		expect(bad.valid).toBe(false);
		expect(bad.error).toBe('@{field} must contain exactly @{param} keys');
	});

	it('allValuesType enforces value type', async () => {
		const rule = new ObjectRule();
		const ok = await rule.validate('allValuesType', { a: 1, b: 2 }, 'number', {} as any);
		expect(ok.valid).toBe(true);

		const bad = await rule.validate('allValuesType', { a: 1, b: '2' }, 'number', {} as any);
		expect(bad.valid).toBe(false);
		expect(bad.error).toBe('@{field} values must be of type @{param}');
	});

	it('noNullValues fails when null values exist', async () => {
		const rule = new ObjectRule();
		const ok = await rule.validate('noNullValues', { a: 1 }, undefined, {} as any);
		expect(ok.valid).toBe(true);

		const bad = await rule.validate('noNullValues', { a: null }, undefined, {} as any);
		expect(bad.valid).toBe(false);
		expect(bad.error).toBe('@{field} must not contain null values');
	});

	it('noUndefinedValues fails when undefined values exist', async () => {
		const rule = new ObjectRule();
		const ok = await rule.validate('noUndefinedValues', { a: 1 }, undefined, {} as any);
		expect(ok.valid).toBe(true);

		const bad = await rule.validate('noUndefinedValues', { a: undefined }, undefined, {} as any);
		expect(bad.valid).toBe(false);
		expect(bad.error).toBe('@{field} must not contain undefined values');
	});

	it('deepIncludes validates nested keys', async () => {
		const rule = new ObjectRule();
		const ok = await rule.validate(
			'deepIncludes',
			{ a: { b: { c: 1 } } },
			'a.b.c',
			{} as any
		);
		expect(ok.valid).toBe(true);

		const bad = await rule.validate(
			'deepIncludes',
			{ a: { b: {} } },
			'a.b.c',
			{} as any
		);
		expect(bad.valid).toBe(false);
		expect(bad.error).toBe('@{field} must include nested key @{param}');
	});

	it('isPlain validates plain objects only', async () => {
		const rule = new ObjectRule();
		const ok = await rule.validate('isPlain', { a: 1 }, undefined, {} as any);
		expect(ok.valid).toBe(true);

		const bad = await rule.validate('isPlain', [], undefined, {} as any);
		expect(bad.valid).toBe(false);
		expect(bad.error).toBe('@{field} must be a plain object');
	});

	it('resolves and validates via alias names', async () => {
		const rule = new ObjectRule();
		const res = await rule.validate('plainObject', { a: 1 }, undefined, {} as any);
		expect(res.valid).toBe(true);
	});

});

import { describe, it, expect } from 'vitest';
import { FieldRule } from '../../src/core/rules/field-rules';

describe('FieldRule', async () => {
    it('require passes when value present and fails when undefined', async () => {
        const rule = new FieldRule();
        const ok = await rule.validate('require', 'value', undefined, {} as any);
        expect(ok.valid).toBe(true);

        const bad = await rule.validate('require', undefined, undefined, {} as any);
        expect(bad.valid).toBe(false);
        expect(bad.error).toBe('@{field} is required');
    });

    it('noEmpty fails for empty string and passes for non-empty', async () => {
        const rule = new FieldRule();
        const bad = await rule.validate('noEmpty', '', undefined, {} as any);
        expect(bad.valid).toBe(false);
        expect(bad.error).toBe('@{field} should not be empty');

        const ok = await rule.validate('noEmpty', 'x', undefined, {} as any);
        expect(ok.valid).toBe(true);
    });

    it('noNull fails for null and passes for non-null', async () => {
        const rule = new FieldRule();
        const bad = await rule.validate('noNull', null, undefined, {} as any);
        expect(bad.valid).toBe(false);
        expect(bad.error).toBe('@{field} should not be null');

        const ok = await rule.validate('noNull', 0, undefined, {} as any);
        expect(ok.valid).toBe(true);
    });

    it('requireOrNull passes when value present or null, fails when undefined', async () => {
        const rule = new FieldRule();
        const bad = await rule.validate('requireOrNull', undefined, undefined, {} as any);
        expect(bad.valid).toBe(false);
        expect(bad.error).toBe('@{field} is required or should be null');

        const okNull = await rule.validate('requireOrNull', null, undefined, {} as any);
        expect(okNull.valid).toBe(true);

        const ok = await rule.validate('requireOrNull', 'val', undefined, {} as any);
        expect(ok.valid).toBe(true);
    });

    it('requireIf triggers when target field equals value', async () => {
        const rule = new FieldRule();
        const fields = { other: { name: 'other', value: 'yes' } } as any;
        const param = { field: 'other', value: 'yes' };

        const bad = await rule.validate('requireIf', undefined, param, fields);
        expect(bad.valid).toBe(false);
        expect(bad.error).toBe('@{field} is required because @{param.field} is @{param.value}');

        const ok = await rule.validate('requireIf', 'present', param, fields);
        expect(ok.valid).toBe(true);
    });

    it('requireUnless triggers when target field not equal', async () => {
        const rule = new FieldRule();
        const fields = { other: { name: 'other', value: 'no' } } as any;
        const param = { field: 'other', value: 'yes' };

        const bad = await rule.validate('requireUnless', undefined, param, fields);
        expect(bad.valid).toBe(false);

        const ok = await rule.validate('requireUnless', 'present', param, fields);
        expect(ok.valid).toBe(true);
    });

    it('requireWith requires when any listed field present', async () => {
        const rule = new FieldRule();
        const fields = { a: { name: 'a', value: '' }, b: { name: 'b', value: 'X' } } as any;
        const param = ['a', 'b'];

        const bad = await rule.validate('requireWith', undefined, param, fields);
        expect(bad.valid).toBe(false);

        const ok = await rule.validate('requireWith', 'val', param, fields);
        expect(ok.valid).toBe(true);
    });

    it('requireWithout requires when all listed fields are absent', async () => {
        const rule = new FieldRule();
        const fields = { a: { name: 'a', value: '' }, b: { name: 'b', value: '' } } as any;
        const param = ['a', 'b'];

        const bad = await rule.validate('requireWithout', undefined, param, fields);
        expect(bad.valid).toBe(false);

        const ok = await rule.validate('requireWithout', 'val', param, fields);
        expect(ok.valid).toBe(true);
    });

    it('match checks for existence and equality', async () => {
        const rule = new FieldRule();
        const fieldsMissing = {} as any;

        const notFound = await rule.validate('match', 'x', 'other', fieldsMissing);
        expect(notFound.valid).toBe(false);
        expect(notFound.error).toBe('Matching field @{param} not found');

        const fields = { other: { name: 'other', value: 'y' } } as any;
        const notMatched = await rule.validate('match', 'x', 'other', fields);
        expect(notMatched.valid).toBe(false);
        expect(notMatched.error).toBe('@{field} not matched with @{param}');

        const matched = await rule.validate('match', 'y', 'other', fields);
        expect(matched.valid).toBe(true);
    });

    it('atLeastOne passes when any listed field present and fails when none', async () => {
        const rule = new FieldRule();
        const param = ['a', 'b'];

        const none = { a: { name: 'a', value: '' }, b: { name: 'b', value: '' } } as any;
        const bad = await rule.validate('atLeastOne', '', param, {});
        expect(bad.valid).toBe(false);
        expect(bad.error).toBe('At least one of @{param} is required');

        const one = { a: { name: 'a', value: 'X' }, b: { name: 'b', value: '' } } as any;
        const ok = await rule.validate('atLeastOne', '', param, one);
        expect(ok.valid).toBe(true);

        // ensure fields object not mutated
        const snapshot = JSON.stringify(one);
        await rule.validate('atLeastOne', '', param, one);
        expect(JSON.stringify(one)).toBe(snapshot);
    });

    it('onlyOne passes only when exactly one field present', async () => {
        const rule = new FieldRule();
        const param = ['a', 'b', 'c'];

        const none = { a: { name: 'a', value: '' }, b: { name: 'b', value: '' }, c: { name: 'c', value: '' } } as any;
        const badNone = await rule.validate('onlyOne', '', param, none);
        expect(badNone.valid).toBe(false);

        const one = { a: { name: 'a', value: '1' } } as any;
        const ok = await rule.validate('onlyOne', '', param, one);
        expect(ok.valid).toBe(true);

        const two = { a: { name: 'a', value: '1' }, b: { name: 'b', value: '2' }, c: { name: 'c', value: '' } } as any;
        const badTwo = await rule.validate('onlyOne', '', param, two);
        expect(badTwo.valid).toBe(false);
        expect(badTwo.error).toBe('Exactly one of @{param} must be present');
    });

    it('allOrNone passes when all present or none present, fails when mixed', async () => {
        const rule = new FieldRule();
        const param = ['a', 'b'];

        const all = { a: { name: 'a', value: 'X' }, b: { name: 'b', value: 'Y' } } as any;
        const okAll = await rule.validate('allOrNone', '', param, all);
        expect(okAll.valid).toBe(true);

        const none = { a: { name: 'a', value: '' }, b: { name: 'b', value: '' } } as any;
        const okNone = await rule.validate('allOrNone', '', param, none);
        expect(okNone.valid).toBe(true);

        const mixed = { a: { name: 'a', value: 'X' } } as any;
        const bad = await rule.validate('allOrNone', '', param, mixed);
        expect(bad.valid).toBe(false);
        expect(bad.error).toBe('Either all of @{param} must be present or none');
    });
});

import { describe, it, expect } from 'vitest';
import { FieldRule } from '../../src/core/rules/field-rules';

describe('FieldRule', async () => {
    it('require passes when value present and fails when empty', async () => {
        const rule = new FieldRule();
        const ok = await rule.validate('require', 'value', undefined, {} as any);
        expect(ok.valid).toBe(true);

        const bad = await rule.validate('require', '', undefined, {} as any);
        expect(bad.valid).toBe(false);
        expect(bad.error).toBe('@{field} is required');
    });

    it('requireIf triggers when target field equals value', async () => {
        const rule = new FieldRule();
        const fields = { other: { name: 'other', value: 'yes' } } as any;
        const param = { field: 'other', value: 'yes' };

        const bad = await rule.validate('requireIf', '', param, fields);
        expect(bad.valid).toBe(false);
        expect(bad.error).toBe('@{field} is required because @{param.field} is @{param.value}');

        const ok = await rule.validate('requireIf', 'present', param, fields);
        expect(ok.valid).toBe(true);
    });

    it('requireUnless triggers when target field not equal', async () => {
        const rule = new FieldRule();
        const fields = { other: { name: 'other', value: 'no' } } as any;
        const param = { field: 'other', value: 'yes' };

        const bad = await rule.validate('requireUnless', '', param, fields);
        expect(bad.valid).toBe(false);

        const ok = await rule.validate('requireUnless', 'present', param, fields);
        expect(ok.valid).toBe(true);
    });

    it('requireWith requires when any listed field present', async () => {
        const rule = new FieldRule();
        const fields = { a: { name: 'a', value: '' }, b: { name: 'b', value: 'X' } } as any;
        const param = ['a', 'b'];

        const bad = await rule.validate('requireWith', '', param, fields);
        expect(bad.valid).toBe(false);

        const ok = await rule.validate('requireWith', 'val', param, fields);
        expect(ok.valid).toBe(true);
    });

    it('requireWithout requires when all listed fields are absent', async () => {
        const rule = new FieldRule();
        const fields = { a: { name: 'a', value: '' }, b: { name: 'b', value: '' } } as any;
        const param = ['a', 'b'];

        const bad = await rule.validate('requireWithout', '', param, fields);
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
});

import { describe, it, expect } from 'vitest';
import { FieldRule } from '../../src/core/rules/field-rules';

describe('FieldRule', () => {
    it('require passes when value present and fails when empty', () => {
        const rule = new FieldRule();
        const ok = rule.validate('require', 'value', undefined, {} as any);
        expect(ok.valid).toBe(true);

        const bad = rule.validate('require', '', undefined, {} as any);
        expect(bad.valid).toBe(false);
        expect(bad.error).toBe('@{field} is required');
    });

    it('requireIf triggers when target field equals value', () => {
        const rule = new FieldRule();
        const fields = { other: { name: 'other', value: 'yes' } } as any;
        const param = { field: 'other', value: 'yes' };

        const bad = rule.validate('requireIf', '', param, fields);
        expect(bad.valid).toBe(false);
        expect(bad.error).toBe('@{field} is required because @{param.field} is @{param.value}');

        const ok = rule.validate('requireIf', 'present', param, fields);
        expect(ok.valid).toBe(true);
    });

    it('requireUnless triggers when target field not equal', () => {
        const rule = new FieldRule();
        const fields = { other: { name: 'other', value: 'no' } } as any;
        const param = { field: 'other', value: 'yes' };

        const bad = rule.validate('requireUnless', '', param, fields);
        expect(bad.valid).toBe(false);

        const ok = rule.validate('requireUnless', 'present', param, fields);
        expect(ok.valid).toBe(true);
    });

    it('requireWith requires when any listed field present', () => {
        const rule = new FieldRule();
        const fields = { a: { name: 'a', value: '' }, b: { name: 'b', value: 'X' } } as any;
        const param = ['a', 'b'];

        const bad = rule.validate('requireWith', '', param, fields);
        expect(bad.valid).toBe(false);

        const ok = rule.validate('requireWith', 'val', param, fields);
        expect(ok.valid).toBe(true);
    });

    it('requireWithout requires when all listed fields are absent', () => {
        const rule = new FieldRule();
        const fields = { a: { name: 'a', value: '' }, b: { name: 'b', value: '' } } as any;
        const param = ['a', 'b'];

        const bad = rule.validate('requireWithout', '', param, fields);
        expect(bad.valid).toBe(false);

        const ok = rule.validate('requireWithout', 'val', param, fields);
        expect(ok.valid).toBe(true);
    });

    it('match checks for existence and equality', () => {
        const rule = new FieldRule();
        const fieldsMissing = {} as any;

        const notFound = rule.validate('match', 'x', 'other', fieldsMissing);
        expect(notFound.valid).toBe(false);
        expect(notFound.error).toBe('Matching field @{param} not found');

        const fields = { other: { name: 'other', value: 'y' } } as any;
        const notMatched = rule.validate('match', 'x', 'other', fields);
        expect(notMatched.valid).toBe(false);
        expect(notMatched.error).toBe('@{field} not matched with @{param}');

        const matched = rule.validate('match', 'y', 'other', fields);
        expect(matched.valid).toBe(true);
    });
});

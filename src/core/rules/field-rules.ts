import { BaseRule, type Field } from "./base-rule.js";
import { isEmpty } from "./core-rules.js";

export class FieldRule extends BaseRule {
    constructor() {
        super('field', {
            name: 'require',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['require'],
            validators: [
                {
                    callback: (value: any) => !isEmpty(value),
                    message: '@{field} is required',
                }
            ]
        });
        this.registerFunction({
            name: 'requireIf',
            paramType: 'fieldEquals',
            argumentType: 'any',
            aliases: ['requireIf'],
            validators: [
                {
                    callback: (value, param, fields: Record<string, Field>) => {
                        const target = fields[param.field] || null;
                        return !(target && target.value === param.value && isEmpty(value));
                    },
                    message: '@{field} is required because @{param.field} is @{param.value}'
                }
            ],
        });
        this.registerFunction({
            name: 'requireUnless',
            paramType: 'fieldEquals',
            argumentType: 'any',
            aliases: ['requireUnless'],
            validators: [
                {
                    callback: (value, param, fields: Record<string, Field>) => {
                        const target = fields[param.field] || null;
                        return !(target && target.value !== param.value && isEmpty(value));
                    },
                    message: '@{field} is required unless @{param.field} is @{param.value}'
                }
            ],
        });
        this.registerFunction({
            name: 'requireWith',
            paramType: 'list',
            argumentType: 'fieldName',
            aliases: ['requireWith'],
            validators: [
                {
                    callback: (value, param: string[], fields: Record<string, Field>) => {
                        return !(param.some(field => {
                            const target = fields[field] || null;
                            return target && target.value
                        }) && isEmpty(value));
                    },
                    message: '@{field} is required when @{param} is present'
                }
            ],
        });
        this.registerFunction({
            name: 'requireWithout',
            paramType: 'list',
            argumentType: 'fieldName',
            aliases: ['requireWithout'],
            validators: [
                {
                    callback: (value, param: string[], fields: Record<string, Field>) => {
                        return !(param.every(field => {
                            const target = fields[field] || null;
                            return !target || !target.value
                        }) && isEmpty(value));
                    },
                    message: '@{field} is required when @{param} is absent'
                }
            ],
        });
        this.registerFunction({
            name: 'match',
            paramType: 'fieldReference',
            argumentType: 'fieldName',
            aliases: ['match'],
            validators: [
                {
                    callback: (value, param, fields: Record<string, Field>) => 'undefined' !== typeof fields[param],
                    message: 'Matching field @{param} not found'
                },
                {
                    callback: (value, param, fields: Record<string, Field>) => fields[param].value === value,
                    message: '@{field} not matched with @{param}'
                }
            ],
        });
        this.registerFunction({
            name: 'atLeastOne',
            paramType: 'list',
            argumentType: 'fieldName',
            aliases: ['atLeastOne'],
            validators: [
                {
                    callback: (_value, param: string[], fields: Record<string, Field>) => {
                        // Passes when at least one of the referenced fields has a non-empty value
                        return param.some(field => {
                            const target = fields[field] || null;
                            return target && !isEmpty(target.value);
                        });
                    },
                    message: 'At least one of @{param} is required'
                }
            ],
        });
    }
}
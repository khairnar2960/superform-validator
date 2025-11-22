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
        this.registerFunction({
            name: 'onlyOne',
            paramType: 'list',
            argumentType: 'fieldName',
            aliases: ['onlyOne'],
            validators: [
                {
                    callback: (_value, param: string[], fields: Record<string, Field>) => {
                        // Passes when exactly one of the referenced fields has a non-empty value
                        const count = param.reduce((acc, field) => {
                            const target = fields[field] || null;
                            return acc + (target && !isEmpty(target.value) ? 1 : 0);
                        }, 0);
                        return count === 1;
                    },
                    message: 'Exactly one of @{param} must be present'
                }
            ],
        });
        this.registerFunction({
            name: 'allOrNone',
            paramType: 'list',
            argumentType: 'fieldName',
            aliases: ['allOrNone'],
            validators: [
                {
                    callback: (_value, param: string[], fields: Record<string, Field>) => {
                        // Passes when either all referenced fields are present (non-empty) or all are absent/empty
                        const statuses = param.map(field => {
                            const target = fields[field] || null;
                            return Boolean(target && !isEmpty(target.value));
                        });
                        const any = statuses.some(Boolean);
                        const all = statuses.every(Boolean);
                        return !(any && !all) ; // fail only when some present and some absent
                    },
                    message: 'Either all of @{param} must be present or none'
                }
            ],
        });
    }
}
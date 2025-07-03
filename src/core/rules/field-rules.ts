import { BaseRule, Field } from "./base-rule.js";
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
            name: 'match',
            paramType: 'fieldReference',
            argumentType: 'any',
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
        })
    }
}
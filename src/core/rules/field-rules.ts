import { BaseRule, Field } from "./base-rule.js";

export class FieldRule extends BaseRule {
    constructor() {
        super('field', {
            name: 'require',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['require'],
            validators: [
                {
                    callback: (value: any) => !(value === null || value === undefined || value === ''),
                    message: '@{field} is required',
                }
            ]
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
import { BaseRule } from "./base-rule.js";

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
                    callback: (value, param) => 'undefined' === typeof param.fieldReference,
                    message: 'Matching field @{other} not found'
                },
                {
                    callback: (value, param) => param.fieldReference === value,
                    message: '@{field} not matched with @{other}'
                }
            ],
        })
    }
}
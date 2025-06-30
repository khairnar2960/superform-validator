import { BaseRule } from "./base-rule.js";

export class CoreRule extends BaseRule {
    constructor() {
        super('core', {
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
    }
}

export function isEmpty(value: any): boolean {
    if (Array.isArray(value)) return value.length === 0;
    if ('object' === typeof value) return Object.keys(value).length === 0;
    return value === '' || value === null || value === undefined;
}
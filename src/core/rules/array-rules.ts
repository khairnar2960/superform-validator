import { BaseRule } from "./base-rule.js";
import { isArray, isEmpty } from "./core-rules.js";

export class ArrayRule extends BaseRule {
    constructor() {
        super('array', {
            name: 'valid',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['array'],
            validators: [
                {
                    callback: (value: any) => isArray(value),
                    message: '@{field} must be an valid array',
                }
            ],
        });
        this.registerFunction({
            name: 'notEmpty',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['notEmptyArray'],
            validators: [
                {
                    callback: (value: any) => isArray(value) && !isEmpty(value),
                    message: '@{field} cannot be empty'
                }
            ],
        });
		this.registerFunction({
            name: 'unique',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['uniqueArray'],
            validators: [
                {
                    callback: (value: any) => isArray(value) && new Set(value).size === value.length,
                    message: '@{field} must have unique items'
                }
            ],
        });
        this.registerFunction({
            name: 'minItems',
            paramType: 'single',
            argumentType: 'integer',
            aliases: ['minItems'],
            validators: [
                {
                    callback: (value: any, param) => isArray(value) && value.length >= param,
                    message: '@{field} must have at least @{param} items'
                }
            ],
        });
        this.registerFunction({
            name: 'maxItems',
            paramType: 'single',
            argumentType: 'integer',
            aliases: ['maxItems'],
            validators: [
                {
                    callback: (value: any, param) => isArray(value) && value.length <= param,
                    message: '@{field} must have no more than @{param} items'
                }
            ],
        });
        this.registerFunction({
            name: 'includes',
            paramType: 'single',
            argumentType: 'any',
            aliases: ['arrayIncludes'],
            validators: [
                {
                    callback: (value: any, param) => isArray(value) && value.includes(param),
                    message: '@{field} must include @{param}'
                }
            ],
        });
    }
}
import { BaseRule } from "./base-rule.js";

export class NumberRule extends BaseRule {
    constructor() {
        super('number', {
            name: 'valid',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['number', 'numeric'],
            validators: [
                {
                    callback: (value) =>
                        typeof value !== 'boolean' &&
                        Number.isFinite(Number(value)),
                    message: '@{field} must be a valid number',
                }
            ]
        });

        this.registerFunction({
            name: 'positive',
            paramType: 'none',
            argumentType: 'number',
            aliases: ['positiveNumber'],
            validators: [
                {
                    callback: (value) => Number(value) >= 0,
                    message: '@{field} must be a positive number'
                }
            ]
        });

        this.registerFunction({
            name: 'negative',
            paramType: 'none',
            argumentType: 'number',
            aliases: ['negativeNumber'],
            validators: [
                {
                    callback: (value) => Number(value) < 0,
                    message: '@{field} must be a negative number'
                }
            ]
        });

        this.registerFunction({
            name: 'min',
            paramType: 'single',
            argumentType: 'number',
            aliases: ['minNum'],
            validators: [
                {
                    callback: (value, param) => Number(value) >= param,
                    message: '@{field} must be at least @{param}'
                }
            ]
        });

        this.registerFunction({
            name: 'max',
            paramType: 'single',
            argumentType: 'number',
            aliases: ['maxNum'],
            validators: [
                {
                    callback: (value, param) => Number(value) <= param,
                    message: '@{field} must be at most @{param}'
                }
            ]
        });

        this.registerFunction({
            name: 'between',
            paramType: 'range',
            argumentType: 'number',
            aliases: ['numBetween'],
            validators: [
                {
                    callback: (value, param) =>
                        Number(value) >= param.min &&
                        Number(value) <= param.max,
                    message: '@{field} must be between @{param.min} and @{param.max}'
                }
            ]
        });

        this.registerFunction({
            name: 'multipleOf',
            paramType: 'single',
            argumentType: 'number',
            aliases: ['numMultipleOf'],
            validators: [
                {
                    callback: (value, param) => Number(value) % param === 0,
                    message: '@{field} must be multiple of @{param}'
                }
            ]
        });
    }
}
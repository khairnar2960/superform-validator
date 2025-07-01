import { BaseRule } from "./base-rule.js";

export class IntegerRule extends BaseRule {

    constructor() {
        super('integer', {
            name: 'valid',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['integer', 'int'],
            validators: [
                {
                    callback: (value) => /^[+-]?[0-9]+$/.test(String(value)),
                    message: '@{field} must be an integer',
                }
            ]
        });

        this.registerFunction({
            name: 'positive',
            paramType: 'none',
            argumentType: 'integer',
            aliases: ['positiveInt'],
            validators: [
                {
                    callback: (value) => parseInt(value) >= 0,
                    message: '@{field} must be positive integer'
                }
            ]
        });

        this.registerFunction({
            name: 'negative',
            paramType: 'none',
            argumentType: 'integer',
            aliases: ['negativeInt'],
            validators: [
                {
                    callback: (value) => parseInt(value) < 0,
                    message: '@{field} must be negative integer'
                }
            ]
        });

        // Register functions
        this.registerFunction({
            name: 'min',
            paramType: 'single',
            argumentType: 'integer',
            aliases: ['minInt'],
            validators: [
                {
                    callback: (value, param) => parseInt(value) >= param,
                    message: '@{field} must be at least @{param}'
                }
            ]
        });

        this.registerFunction({
            name: 'max',
            paramType: 'single',
            argumentType: 'integer',
            aliases: ['maxInt'],
            validators: [
                {
                    callback: (value, param) => parseInt(value) <= param,
                    message: '@{field} must be at most @{param}'
                }
            ]
        });

        this.registerFunction({
            name: 'between',
            paramType: 'range',
            argumentType: 'integer',
            aliases: ['intBetween'],
            validators: [
                {
                    callback: (value, param) => parseInt(value) >= param.min && parseInt(value) <= param.max,
                    message: '@{field} must be between @{param.min} and @{param.max}'
                }
            ]
        });

        this.registerFunction({
            name: 'even',
            paramType: 'none',
            argumentType: 'integer',
            aliases: ['evenInt'],
            validators: [
                {
                    callback: (value) => parseInt(value) % 2 === 0,
                    message: '@{field} must be an even number'
                }
            ]
        });

        this.registerFunction({
            name: 'odd',
            paramType: 'none',
            argumentType: 'integer',
            aliases: ['oddInt'],
            validators: [
                {
                    callback: (value) => parseInt(value) % 2 !== 0,
                    message: '@{field} must be an odd number'
                }
            ]
        });

        this.registerFunction({
            name: 'equals',
            paramType: 'none',
            argumentType: 'integer',
            aliases: ['intEquals'],
            validators: [
                {
                    callback: (value, param) => parseInt(value) === param,
                    message: '@{field} must be exactly @{param}'
                }
            ]
        });

        this.registerFunction({
            name: 'notEquals',
            paramType: 'none',
            argumentType: 'integer',
            aliases: ['intNotEquals'],
            validators: [
                {
                    callback: (value, param) => parseInt(value) !== param,
                    message: '@{field} must not be @{param}'
                }
            ]
        });

        this.registerFunction({
            name: 'gt',
            paramType: 'none',
            argumentType: 'integer',
            aliases: ['gt'],
            validators: [
                {
                    callback: (value, param) => parseInt(value) > param,
                    message: '@{field} must be greater than @{param}'
                }
            ]
        });

        this.registerFunction({
            name: 'gte',
            paramType: 'none',
            argumentType: 'integer',
            aliases: ['gte'],
            validators: [
                {
                    callback: (value, param) => parseInt(value) >= param,
                    message: '@{field} must be @{param} or greater'
                }
            ]
        });

        this.registerFunction({
            name: 'lt',
            paramType: 'none',
            argumentType: 'integer',
            aliases: ['lt'],
            validators: [
                {
                    callback: (value, param) => parseInt(value) < param,
                    message: '@{field} must be less than @{param}'
                }
            ]
        });

        this.registerFunction({
            name: 'lte',
            paramType: 'none',
            argumentType: 'integer',
            aliases: ['lte'],
            validators: [
                {
                    callback: (value, param) => parseInt(value) <= param,
                    message: '@{field} must be @{param} or less'
                }
            ]
        });
    }
}

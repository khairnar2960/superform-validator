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
                    message: '@{field} must be positive number'
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
                    message: '@{field} must be negative number'
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
                    message: '@{field} must be at least @{limit}'
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
                    message: '@{field} must be at most @{limit}'
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
                    message: '@{field} must be between @{min} and @{max}'
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
                    message: '@{field} must be exactly @{other}'
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
                    message: '@{field} must not be @{other}'
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
                    message: '@{field} must be greater than @{other}'
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
                    message: '@{field} must be @{other} or greater'
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
                    message: '@{field} must be less than @{other}'
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
                    message: '@{field} must be @{other} or less'
                }
            ]
        });
    }
}

import { BaseRule } from "./base-rule.js";
import { isLatitude, isLongitude } from "./core-rules.js";

// Float: Typically provides around 7 decimal digits of precision.
// Double: Offers higher precision, usually around 15-16 decimal digits.
// Decimal: Provides the highest precision among the three, often with a larger number of decimal places

export class FloatRule extends BaseRule {

    constructor() {
        super('float', {
            name: 'valid',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['float', 'double'],
            validators: [
                {
                    callback: (value) => /^([+-]?([0-9]+[.][0-9]+))$/.test(String(value)) && !isNaN(parseFloat(value)),
                    message: '@{field} must be a valid decimal number',
                }
            ]
        });

        this.registerFunction({
            name: 'positive',
            paramType: 'none',
            argumentType: 'float',
            aliases: ['positiveFloat'],
            validators: [
                {
                    callback: (value) => parseFloat(value) >= 0,
                    message: '@{field} must be a positive decimal number'
                }
            ]
        });

        this.registerFunction({
            name: 'negative',
            paramType: 'none',
            argumentType: 'float',
            aliases: ['negativeFloat'],
            validators: [
                {
                    callback: (value) => parseFloat(value) < 0,
                    message: '@{field} must be a negative decimal number'
                }
            ]
        });

        // Register functions
        this.registerFunction({
            name: 'min',
            paramType: 'single',
            argumentType: 'float',
            aliases: ['minFloat'],
            validators: [
                {
                    callback: (value, param) => parseFloat(value) >= param,
                    message: '@{field} must be at least @{param}'
                }
            ]
        });

        this.registerFunction({
            name: 'max',
            paramType: 'single',
            argumentType: 'float',
            aliases: ['maxFloat'],
            validators: [
                {
                    callback: (value, param) => parseFloat(value) <= param,
                    message: '@{field} must be at most @{param}'
                }
            ]
        });

        this.registerFunction({
            name: 'between',
            paramType: 'range',
            argumentType: 'float',
            aliases: ['floatBetween'],
            validators: [
                {
                    callback: (value, param) => parseFloat(value) >= param.min && parseFloat(value) <= param.max,
                    message: '@{field} must be between @{param.min} and @{param.max}'
                }
            ]
        });

        this.registerFunction({
            name: 'equals',
            paramType: 'single',
            argumentType: 'float',
            aliases: ['floatEquals'],
            validators: [
                {
                    callback: (value, param) => parseFloat(value) === param,
                    message: '@{field} must be equal to @{param}'
                }
            ]
        });

        this.registerFunction({
            name: 'notEquals',
            paramType: 'single',
            argumentType: 'float',
            aliases: ['floatNotEquals'],
            validators: [
                {
                    callback: (value, param) => parseFloat(value) !== param,
                    message: '@{field} must not be equal to @{param}'
                }
            ]
        });

        this.registerFunction({
            name: 'gt',
            paramType: 'single',
            argumentType: 'float',
            aliases: ['floatGt'],
            validators: [
                {
                    callback: (value, param) => parseFloat(value) > param,
                    message: '@{field} must be greater than @{param}'
                }
            ]
        });

        this.registerFunction({
            name: 'gte',
            paramType: 'single',
            argumentType: 'float',
            aliases: ['floatGte'],
            validators: [
                {
                    callback: (value, param) => parseFloat(value) >= param,
                    message: '@{field} must be greater than or equal to @{param}'
                }
            ]
        });

        this.registerFunction({
            name: 'lt',
            paramType: 'single',
            argumentType: 'float',
            aliases: ['floatLt'],
            validators: [
                {
                    callback: (value, param) => parseFloat(value) < param,
                    message: '@{field} must be less than @{param}'
                }
            ]
        });

        this.registerFunction({
            name: 'lte',
            paramType: 'single',
            argumentType: 'float',
            aliases: ['floatLte'],
            validators: [
                {
                    callback: (value, param) => parseFloat(value) <= param,
                    message: '@{field} must be less than or equal to @{param}'
                }
            ]
        });

        this.registerFunction({
            name: 'longitude',
            paramType: 'none',
            argumentType: 'float',
            aliases: ['longitude'],
            validators: [
                {
                    callback: (value) => isLongitude(parseFloat(value)),
                    message: '@{field} must be a valid longitude'
                }
            ]
        });

        this.registerFunction({
            name: 'latitude',
            paramType: 'none',
            argumentType: 'float',
            aliases: ['latitude'],
            validators: [
                {
                    callback: (value) => isLatitude(parseFloat(value)),
                    message: '@{field} must be a valid latitude'
                }
            ]
        });
    }
}

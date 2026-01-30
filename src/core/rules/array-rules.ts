import { BaseRule } from "./base-rule.js";
import { isArray, isArrayOf, isEmpty, isLatitude, isLongitude, type TypeOfArray } from "./core-rules.js";

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
                    message: '@{field} must be a valid array',
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
                    message: '@{field} cannot be empty array'
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
            aliases: ['minItems', 'arrayMinLength'],
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
            aliases: ['maxItems', 'arrayMaxLength'],
            validators: [
                {
                    callback: (value: any, param) => isArray(value) && value.length <= param,
                    message: '@{field} must have maximum @{param} items'
                }
            ],
        });
        this.registerFunction({
            name: 'includes',
            paramType: 'single',
            argumentType: 'any',
            aliases: ['arrayIncludes', 'arrayContains'],
            validators: [
                {
                    callback: (value: any, param) => isArray(value) && value.includes(param),
                    message: '@{field} must include @{param}'
                }
            ],
        });
        this.registerFunction({
            name: 'excludes',
            paramType: 'single',
            argumentType: 'any',
            aliases: ['arrayExcludes', 'arrayNotContains'],
            validators: [
                {
                    callback: (value: any, param) => isArray(value) && !value.includes(param),
                    message: '@{field} must not include @{param}'
                }
            ],
        });
        this.registerFunction({
            name: 'latLong',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['latLongArray'],
            validators: [
                {
                    callback: (value: any) => {
                        if (!isArray(value) || value.length !== 2) return false;
                        const [lat, lng] = value;

                        return isLatitude(lat) && isLongitude(lng);
                    },
                    message: '@{field} must be a valid [latitude, longitude] coordinate array'
                }
            ],
        });
        this.registerFunction({
            name: 'longLat',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['longLatArray'],
            validators: [
                {
                    callback: (value: any) => {
                        if (!isArray(value) || value.length !== 2) return false;
                        const [lng, lat] = value;
                        
                        return isLatitude(lat) && isLongitude(lng);
                    },
                    message: '@{field} must be a valid [longitude, latitude] coordinate array'
                }
            ],
        });
        this.registerFunction({
            name: 'of',
            paramType: 'single',
            argumentType: 'string',
            aliases: ['arrayOf'],
            validators: [
                {
                    callback: (value: any, param: TypeOfArray) => {
                        return isArrayOf(value, param);
                    },
                    message: '@{field} must be a valid array of @{param}'
                }
            ],
        });

        this.registerFunction({
            name: 'notOf',
            paramType: 'single',
            argumentType: 'string',
            aliases: ['arrayNotOf'],
            validators: [
                {
                    callback: (value: any, param: TypeOfArray) => {
                        return !isArrayOf(value, param);
                    },
                    message: '@{field} must not be an array of @{param}'
                }
            ],
        });
    }
}
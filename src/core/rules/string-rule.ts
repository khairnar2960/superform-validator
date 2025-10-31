import { BaseRule } from "./base-rule.js";
import { isJson } from "./core-rules.js";

export class StringRule extends BaseRule {
    constructor() {
        super('string', {
            name: 'valid',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['string'],
            validators: [
                {
                    callback: (value) => typeof value === 'string',
                    message: '@{field} must be a valid string',
                }
            ]
        });
        this.registerFunction({
            name: 'minLength',
            paramType: 'single',
            argumentType: 'integer',
            aliases: ['minLength'],
            validators: [
                {
                    callback: (value, param) => value.length >= param,
                    message: '@{field} must be at least @{param} characters long'
                }
            ],
        });
        this.registerFunction({
            name: 'maxLength',
            paramType: 'single',
            argumentType: 'integer',
            aliases: ['maxLength'],
            validators: [
                {
                    callback: (value, param) => value.length <= param,
                    message: '@{field} must be at most @{param} characters long'
                }
            ],
        });
        this.registerFunction({
            name: 'length',
            paramType: 'single',
            argumentType: 'integer',
            aliases: ['length'],
            validators: [
                {
                    callback: (value, param) => value.length === param,
                    message: '@{field} must be exactly @{param} characters long'
                }
            ],
        });
        this.registerFunction({
            name: 'alpha',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['alpha'],
            validators: [
                {
                    pattern: /^[a-zA-Z]+$/,
                    message: '@{field} must contain only alphabets'
                }
            ],
        });
        this.registerFunction({
            name: 'alphaspace',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['alphaspace'],
            validators: [
                {
                    pattern: /^[a-zA-Z\s]+$/,
                    message: '@{field} must contain only alphabets and spaces'
                }
            ],
        });
        this.registerFunction({
            name: 'alphanum',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['alphanum'],
            validators: [
                {
                    pattern: /^[0-9a-zA-Z]+$/,
                    message: '@{field} must contain only alphabets and numbers'
                }
            ],
        });
        this.registerFunction({
            name: 'alphanumspace',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['alphanumspace'],
            validators: [
                {
                    pattern: /^[0-9a-zA-Z\s]+$/,
                    message: '@{field} must contain only alphabets, numbers, and spaces'
                }
            ],
        });
        this.registerFunction({
            name: 'in',
            paramType: 'list',
            argumentType: 'string',
            aliases: ['inList'],
            validators: [
                {
                    callback: (value, param) => (param as Array<any>).includes(value),
                    message: '@{field} must be one of (@{param})'
                }
            ],
        });
        this.registerFunction({
            name: 'notIn',
            paramType: 'list',
            argumentType: 'string',
            aliases: ['notInList'],
            validators: [
                {
                    callback: (value, param) => !(param as Array<any>).includes(value),
                    message: '@{field} must not be one of (@{param})'
                }
            ],
        });
        this.registerFunction({
            name: 'equals',
            paramType: 'single',
            argumentType: 'string',
            aliases: ['strEquals'],
            validators: [
                {
                    callback: (value, param) => value === param,
                    message: '@{field} must be equal to @{param}'
                }
            ],
        });
        this.registerFunction({
            name: 'notEquals',
            paramType: 'single',
            argumentType: 'string',
            aliases: ['strNotEquals'],
            validators: [
                {
                    callback: (value, param) => value !== param,
                    message: '@{field} must not be equal to @{param}'
                }
            ],
        });
        this.registerFunction({
            name: 'contains',
            paramType: 'single',
            argumentType: 'string',
            aliases: ['strContains'],
            validators: [
                {
                    callback: (value: string, param: string) => value.includes(param),
                    message: '@{field} must contain @{param}'
                }
            ],
        });
        this.registerFunction({
            name: 'notContains',
            paramType: 'single',
            argumentType: 'string',
            aliases: ['strNotContains'],
            validators: [
                {
                    callback: (value: string, param: string) => !value.includes(param),
                    message: '@{field} must not contain @{param}'
                }
            ],
        });
        this.registerFunction({
            name: 'startsWith',
            paramType: 'single',
            argumentType: 'string',
            aliases: ['strStartsWith'],
            validators: [
                {
                    callback: (value: string, param: string) => value.startsWith(param),
                    message: '@{field} must start with @{param}'
                }
            ],
        });
        this.registerFunction({
            name: 'notStartsWith',
            paramType: 'single',
            argumentType: 'string',
            aliases: ['strNotStartsWith'],
            validators: [
                {
                    callback: (value: string, param: string) => !value.startsWith(param),
                    message: '@{field} must not start with @{param}'
                }
            ],
        });
        this.registerFunction({
            name: 'endsWith',
            paramType: 'single',
            argumentType: 'string',
            aliases: ['strEndsWith'],
            validators: [
                {
                    callback: (value: string, param: string) => value.endsWith(param),
                    message: '@{field} must end with @{param}'
                }
            ],
        });
        this.registerFunction({
            name: 'notEndsWith',
            paramType: 'single',
            argumentType: 'string',
            aliases: ['strNotEndsWith'],
            validators: [
                {
                    callback: (value: string, param: string) => !value.endsWith(param),
                    message: '@{field} must not end with @{param}'
                }
            ],
        });
        this.registerFunction({
            name: 'lowercase',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['strLowercase'],
            validators: [
                {
                    pattern: /^[^A-Z]+$/,
                    message: '@{field} must be in lowercase'
                }
            ],
        });
        this.registerFunction({
            name: 'uppercase',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['strUppercase'],
            validators: [
                {
                    pattern: /^[^a-z]+$/,
                    message: '@{field} must be in uppercase'
                }
            ],
        });
        this.registerFunction({
            name: 'strongPassword',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['strongPassword'],
            validators: [
                { callback: value => /[A-Z]/.test(value), message: '@{field} must contain at least one uppercase letter' },
                { callback: value => /[a-z]/.test(value), message: '@{field} must contain at least one lowercase letter' },
                { callback: value => /\d/.test(value), message: '@{field} must contain at least one digit' },
                { callback: value => /[!@#$%^&*]/.test(value), message: '@{field} must contain at least one special character' },
                { callback: value => value.length >= 8, message: '@{field} must be at least 8 characters long' }
            ],
        });
        this.registerFunction({
            name: 'email',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['email'],
            validators: [
                {
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: '@{field} must be a valid email address'
                }
            ],
        });
        this.registerFunction({
            name: 'mobile',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['mobile'],
            validators: [
                {
                    pattern: /^[6-9]{1}[0-9]{9}$/,
                    message: '@{field} must be a valid mobile number'
                }
            ],
        });
        this.registerFunction({
            name: 'pincode',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['pincode'],
            validators: [
                {
                    pattern: /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/,
                    message: '@{field} must be a valid pincode'
                }
            ],
        });
        this.registerFunction({
            name: 'pan',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['pan'],
            validators: [
                {
                    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                    message: '@{field} must be a valid PAN card number'
                }
            ],
        });
        this.registerFunction({
            name: 'ifsc',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['ifsc'],
            validators: [
                {
                    pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                    message: '@{field} must be a valid IFSC code'
                }
            ],
        });
        this.registerFunction({
            name: 'slug',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['slug'],
            validators: [
                {
                    pattern: /^[0-9a-zA-Z-]+$/,
                    message: '@{field} must be a valid slug'
                }
            ],
        });
        this.registerFunction({
            name: 'url',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['url'],
            validators: [
                {
                    pattern: /\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i,
                    message: '@{field} must be a valid URL'
                }
            ],
        });
        this.registerFunction({
            name: 'urlSecure',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['urlSecure'],
            validators: [
                {
                    pattern: /^https:\/\/.+/i,
                    message: '@{field} must start with https://'
                }
            ],
        });
        this.registerFunction({
            name: 'domain',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['domain'],
            validators: [
                {
                    pattern: /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: '@{field} must be a valid domain'
                }
            ],
        });
        this.registerFunction({
            name: 'ip',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['ip'],
            validators: [
                {
                    pattern: /^(\d{1,3}\.){3}\d{1,3}$|^([a-f0-9:]+:+)+[a-f0-9]+$/,
                    message: '@{field} must be a valid IP address'
                }
            ],
        });
        this.registerFunction({
            name: 'ipv4',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['ipv4'],
            validators: [
                {
                    pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
                    message: '@{field} must be a valid IPv4 address'
                }
            ],
        });
        this.registerFunction({
            name: 'ipv6',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['ipv6'],
            validators: [
                {
                    pattern: /^([a-f0-9:]+:+)+[a-f0-9]+$/,
                    message: '@{field} must be a valid IPv6 address'
                }
            ],
        });
        this.registerFunction({
            name: 'uuid',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['uuid'],
            validators: [
                {
                    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
                    message: '@{field} must be a valid UUID'
                }
            ],
        });
        this.registerFunction({
            name: 'noSpace',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['noSpace'],
            validators: [
                {
                    callback: (value: string) => !/\s/.test(value),
                    message: '@{field} must not contain spaces'
                }
            ],
        });
        this.registerFunction({
            name: 'noEmoji',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['noEmoji'],
            validators: [
                {
                    callback: (value: string) => !/[\u{1F600}-\u{1F6FF}]/u.test(value),
                    message: '@{field} must not contain emoji'
                }
            ],
        });
        this.registerFunction({
            name: 'asciiOnly',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['asciiOnly'],
            validators: [
                {
                    callback: (value: string) => /^[\x00-\x7F]*$/.test(value),
                    message: '@{field} must contain only ASCII characters'
                }
            ],
        });
        this.registerFunction({
            name: 'json',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['jsonString'],
            validators: [
                {
                    callback: (value: string) => isJson(value),
                    message: '@{field} must be a valid JSON string'
                }
            ],
        });
        this.registerFunction({
            name: 'wordCount',
            paramType: 'range',
            argumentType: 'integer',
            aliases: ['wordCount'],
            validators: [
                {
                    callback: (value: string, param) => {
                        const words = value.trim().split(/\\s+/).length;
                        return words >= param.min && words <= param.max;
                    },
                    message: '@{field} must have a word count between @{param.min} and @{param.max}'
                }
            ],
        });
        this.registerFunction({
            name: 'latlong',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['latlong'],
            validators: [
                {
                    callback: (value: string) => {
                        if (typeof value !== 'string') return false;
                        const regex = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*-?((1[0-7]\d(\.\d+)?)|(\d{1,2}(\.\d+)?|180(\.0+)?))$/;
                        return regex.test(value.trim());
                    },
                    message: '@{field} must be a valid latitude,longitude pair'
                }
            ],
        });
    }
}

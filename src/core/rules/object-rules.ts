import { BaseRule } from "./base-rule.js";
import { isEmpty, isObject, isTypeOf } from "./core-rules.js";

export class ObjectRule extends BaseRule {
    constructor() {
        super("object", {
            name: "valid",
            paramType: "none",
            argumentType: "any",
            aliases: ["object"],
            validators: [
                {
                    callback: (value: any) => isObject(value),
                    message: "@{field} must be a valid object",
                },
            ],
        });
        this.registerFunction({
            name: "notEmpty",
            paramType: "none",
            argumentType: "any",
            aliases: ["notEmptyObject"],
            validators: [
                {
                    callback: (value: any) => isObject(value) && !isEmpty(value),
                    message: "@{field} cannot be empty object",
                },
            ],
        });
        this.registerFunction({
            name: "includes",
            paramType: "single",
            argumentType: "string",
            aliases: ["objectIncludes", "objectContains"],
            validators: [
                {
                    callback: (value: any, param) =>
                        isObject(value) && Object.prototype.hasOwnProperty.call(value, param),
                    message: "@{field} must include @{param}",
                },
            ],
        });
        this.registerFunction({
            name: "excludes",
            paramType: "single",
            argumentType: "string",
            aliases: ["objectExcludes", "objectNotContains"],
            validators: [
                {
                    callback: (value: any, param) =>
                        isObject(value) && !Object.prototype.hasOwnProperty.call(value, param),
                    message: "@{field} must not include @{param}",
                },
            ],
        });
        this.registerFunction({
            name: "hasKeys",
            paramType: "list",
            argumentType: "string",
            aliases: ["objectHasKeys"],
            validators: [
                {
                    callback: (value: any, param: string[]) =>
                        isObject(value) &&
                        param.every((k) => Object.prototype.hasOwnProperty.call(value, k)),
                    message: "@{field} must contain keys: @{param}",
                },
            ],
        });
        this.registerFunction({
            name: "hasAnyKey",
            paramType: "list",
            argumentType: "string",
            aliases: ["objectHasAnyKey"],
            validators: [
                {
                    callback: (value: any, param: string[]) =>
                        isObject(value) &&
                        param.some((k) => Object.keys(value).includes(k)),
                    message: "@{field} must contain at least one of: @{param}",
                },
            ],
        });
        this.registerFunction({
            name: "onlyKeys",
            paramType: "list",
            argumentType: "string",
            aliases: ["objectOnlyKeys"],
            validators: [
                {
                    callback: (value: any, param: string[]) =>
                        isObject(value) &&
                        Object.keys(value).every((k) => param.includes(k)),
                    message: "@{field} contains invalid keys",
                },
            ],
        });
        this.registerFunction({
            name: "minKeys",
            paramType: "single",
            argumentType: "integer",
            aliases: ["objectMinKeys"],
            validators: [
                {
                    callback: (value: any, param: number) =>
                        isObject(value) && Object.keys(value).length >= param,
                    message: "@{field} must have at least @{param} keys",
                },
            ],
        });
        this.registerFunction({
            name: "maxKeys",
            paramType: "single",
            argumentType: "integer",
            aliases: ["objectMaxKeys"],
            validators: [
                {
                    callback: (value: any, param: number) =>
                        isObject(value) && Object.keys(value).length <= param,
                    message: "@{field} must not exceed @{param} keys",
                },
            ],
        });
        this.registerFunction({
            name: "exactKeys",
            paramType: "single",
            argumentType: "integer",
            aliases: ["objectExactKeys"],
            validators: [
                {
                    callback: (value: any, param: number) =>
                        isObject(value) && Object.keys(value).length === param,
                    message: "@{field} must contain exactly @{param} keys",
                },
            ],
        });
        this.registerFunction({
            name: "allValuesType",
            paramType: "single",
            argumentType: "string",
            aliases: ["objectValuesType"],
            validators: [
                {
                    callback: (value: any, param) =>
                        isObject(value) &&
                        Object.values(value).every((v) => isTypeOf(v, param)),
                    message: "@{field} values must be of type @{param}",
                },
            ],
        });
        this.registerFunction({
            name: "noNullValues",
            paramType: "none",
            argumentType: "any",
            aliases: ["objectNoNull"],
            validators: [
                {
                    callback: (value: any) =>
                        isObject(value) && Object.values(value).every((v) => v !== null),
                    message: "@{field} must not contain null values",
                },
            ],
        });
        this.registerFunction({
            name: "noUndefinedValues",
            paramType: "none",
            argumentType: "any",
            aliases: ["objectNoUndefined"],
            validators: [
                {
                    callback: (value: any) =>
                        isObject(value) &&
                        Object.values(value).every((v) => v !== undefined),
                    message: "@{field} must not contain undefined values",
                },
            ],
        });
        this.registerFunction({
            name: "deepIncludes",
            paramType: "single",
            argumentType: "string",
            aliases: ["objectDeepIncludes"],
            validators: [
                {
                    callback: (value: any, param: string) => {
                        if (!isObject(value)) return false;
                        return (
                            param.split(".").reduce((o, k) => o?.[k], value) !== undefined
                        );
                    },
                    message: "@{field} must include nested key @{param}",
                },
            ],
        });
        this.registerFunction({
            name: "isPlain",
            paramType: "none",
            argumentType: "any",
            aliases: ["plainObject"],
            validators: [
                {
                    callback: (value: any) =>
                        Object.prototype.toString.call(value) === "[object Object]",
                    message: "@{field} must be a plain object",
                },
            ],
        });
    }
}

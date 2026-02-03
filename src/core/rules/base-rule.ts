import { isArray } from "./core-rules.js";

export type ParamType = 'none' | 'single' | 'range' | 'list' | 'fileSize' | 'fieldReference' | 'fieldEquals' | 'function' | 'schema';

export type ArgumentDataType = 'any' | 'string' | 'number' | 'integer' | 'float' | 'date' | 'file' | 'fileSize' | 'fileExtension' | 'fileMimetype' | 'array' | 'boolean' | 'time' | 'datetime' | 'fieldName' | 'object';

export interface Field {
    name: string,
    value: any,
}

export type callback = (value: any, param: any, fields: Record<string, Field>) => Promise<boolean>|boolean;

export interface ValidationStep {
    callback?: callback | undefined;
    pattern?: RegExp | undefined;
    message: string;
}

export interface RuleFunctionSchema {
    name: string;
    paramType: ParamType;
    argumentType: ArgumentDataType|ArgumentDataType[];
    aliases: string[];
    validators: ValidationStep[];
    desc?: string
}

export interface ValidationResponse {
    valid: boolean,
    function: string,
    value: any,
    param?: any,
    error?: string,
}
export interface Signature {
    name: string,
    aliases: string[]
}

export interface SignatureRecord {
    type: string,
    rules: Signature[]
}

export class RuleFunction {

    name: string;
    paramType: ParamType;
    argumentType: ArgumentDataType[];
    aliases: string[];
    validators: ValidationStep[];
    desc?: string

    constructor(schema: RuleFunctionSchema) {
        this.name = schema.name;
        this.paramType = schema.paramType;
        this.argumentType = (isArray(schema.argumentType) ? schema.argumentType : [schema.argumentType]) as ArgumentDataType[];
        this.aliases = schema.aliases;
        this.validators = schema.validators;
        this.desc = schema.desc;
    }

    /**
     * Validate a value.
     * @param {any} value value to be validated
     * @param {any} param extra param for callback
     * @returns {Promise<ValidationResponse>}
     */
    async validate(value: any, param: any, fields: Record<string, Field>): Promise<ValidationResponse> {

        const response: ValidationResponse = { valid: true, function: this.name, value, param };

        for (const validator of this.validators) {

            if (validator.callback) {
                const isValid = await validator.callback(value, param, fields);
                if (!isValid) {
                    response.valid = false;
                    response.error = validator.message;
                    return response;
                }
            } else if (validator.pattern && !validator.pattern.test(value)) {
                response.valid = false;
                response.error = validator.message;
                return response;
            }
        }

        return response;
    }
}

export class BaseRule {
    type: string;
    functions: Map<string, RuleFunction>;

    /**
     * @param {string} type Rule type e.g. string | integer
     * @param {RuleFunctionSchema} typeChecker 
     */
    constructor(type: string, typeChecker?: RuleFunctionSchema) {
        this.type = type;
        this.functions = new Map();
        if (typeChecker) this.registerFunction(typeChecker);
    }

    /**
     * Register a new function for this rule type.
     * @param {RuleFunctionSchema} ruleFunction Rule function definition
     * @returns {this}
     */
    registerFunction(ruleFunction: RuleFunctionSchema): this {
        this.functions.set(ruleFunction.name, new RuleFunction(ruleFunction));
        return this;
    }

    /**
     * Add a validation step to a function.
     * @param {string} functionName Function name in which validation step to be added
     * @param {ValidationStep} step Validation step
     * @returns {this}
     */
    addValidationStep(functionName: string, step: ValidationStep): this {
        const func = this.functions.get(functionName);
        if (!func) throw new Error(`Function ${functionName} is not registered in ${this.type}`);
        func.validators.push(step);
        return this;
    }

    /**
     * Validate a value against a specific function in this rule.
     * @param {string} functionName Function name to be validate with
     * @param {any} value value to be validated
     * @param {any} param extra param for callback
     * @returns {Promise<ValidationResponse>}
     */
    async validate(functionName: string, value: any, param: any, fields: Record<string, Field>): Promise<ValidationResponse> {
        let func = this.functions.get(functionName);

        if (!func) {
            func = this.resolveAlias(functionName);
        }

        if (!func) throw new Error(`Function ${functionName} is not registered in ${this.type}`);

        return await func.validate(value, param, fields);
    }

    /**
     * Get all aliases mapped to their function names.
     * @returns {Record<string, string>}
     */
    getAliasMap(): Record<string, string> {
        const aliasMap: Record<string, string> = {};
        this.functions.forEach((func, funcName) => {
            func.aliases.forEach(alias => {
                aliasMap[alias] = funcName;
            });
        });
        return aliasMap;
    }

    resolveAlias(funcName: string): RuleFunction|undefined {
        const aliases = this.getAliasMap();
        const alias = aliases[funcName];
        return this.functions.get(alias);
    }

    /**
     * Generate function signatures for documentation.
     */
    generateSignatures(): SignatureRecord {
        const signatures: SignatureRecord = {
            type: this.type,
            rules: [],
        };

        this.functions.forEach(func => {
            const baseSignature = `${this.type}::${func.name}${this.getSignaturePattern(func.paramType, func.argumentType)}`;

            const rule: Signature = { name: baseSignature, aliases: [] };

            func.aliases.forEach(alias => {
                const aliasSignature = `${alias}${this.getSignaturePattern(func.paramType, func.argumentType, true)}`;
                rule.aliases.push(aliasSignature);
            });

            signatures.rules.push(rule);
        });

        return signatures;
    }

    /**
     * Helper to build signature pattern based on parameter type.
     */
    private getSignaturePattern(paramType: ParamType, argTypes: ArgumentDataType[], isAlias: boolean = false): string {
        if (paramType === 'none') return '';
        const argExample = this.parameterize(paramType, argTypes, isAlias);
        return `(${argExample})`;
    }

    private parameterize(paramType: ParamType, argTypes: ArgumentDataType[], isAlias: boolean) {
        return argTypes.map(argType => {
            if ('single' === paramType) {
                return argType;
            } else if ('range' === paramType) {
                return [1, 2].map(n => argType + n).join(',');
            } else if ('list' === paramType) {
                return [1, 2, 3, 4].map(n => argType + n).join(',');
            } else if ('fieldReference' === paramType) {
                return 'anotherField';
            } else if ('fieldEquals' === paramType) {
                return 'anotherField=value';
            }
            return paramType;
        }).join('|');
    }
}
